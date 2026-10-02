"""The site search index: what a learner can find from the header search, and where each result opens.

Four kinds of document, each with a route that exists:

  PAGE      a page file of the site, and each Core learning projection (a sub page: Core 1, 1A, 1B, 2A, 2B of a topic or question)
  TOPIC     a bucket or microtopic, opening its Core page
  QUESTION  a canonical question, opening the page that shows it: the Question Bank for a bank question, a Core 2 projection for a library question
  HINT      one hint of a routed question, opening that question. Its text is searched and never shown (`hidden`): a learner who finds a question by its hint has
            not been given the hint.

A question that no page of the site shows has no route and is not a result; it is named in the manifest as unrouted, so that the distance between the library and
what a learner can open is a number that is checked, not a surprise. Answers, worked steps and keys are not indexed at all.

The index is a pure function of its inputs (the library, the pages, the Core learning data, the Question Bank data, the route table), so the verifier can rebuild it and
say whether the committed one is current, complete and unaltered (Shared/tools/verify_search_index.py).
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit, parse_qs

from Shared.assurance import contract
from Shared.contracts import ContractError

HERE = Path(__file__).resolve().parent
CONFIG = HERE / "site-routes.v1.json"
KINDS = ("PAGE", "TOPIC", "QUESTION", "HINT")
TITLE_CHARS = 90
HEADINGS = 12


def load_config(path: Path = CONFIG) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


# -- reading ------------------------------------------------------------------------------------------------------------------------------------

def read_js_object(path: Path) -> dict:
    """The object a generated data file assigns to a window variable (`window.X = {...};`). A file that is not that is an error: an index of what could be read would
    be missing routes and say nothing."""
    try:
        text = path.read_text(encoding="utf-8")
        start = text.index("{")
        value, _ = json.JSONDecoder().raw_decode(text[start:])
    except (OSError, ValueError) as exc:
        raise ContractError("SEARCH_INDEX_UNREADABLE_INPUT", f"{path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ContractError("SEARCH_INDEX_UNREADABLE_INPUT", f"{path}: not an object")
    return value


MARKUP = re.compile(r"\\[A-Za-z]+|[\\{}^_$]|\\\(|\\\)|\\\[|\\\]")


def clean(text: object) -> str:
    """Plain words from a stem or hint: TeX commands and brackets dropped, white space collapsed."""
    if not isinstance(text, str):
        return ""
    return " ".join(MARKUP.sub(" ", text).split())


def shorten(text: str, n: int = TITLE_CHARS) -> str:
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(" ", 1)[0]
    return (cut or text[:n]) + "…"


def difficulty_of(value: object) -> str | None:
    if isinstance(value, dict):
        value = value.get("band")
    return value if isinstance(value, str) and re.fullmatch(r"D[1-4]", value) else None


class _Page(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.title, self.description, self.headings, self.refresh = "", "", [], False
        self._in = None
        self._buf: list[str] = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        if tag == "title" or tag in ("h1", "h2", "h3"):
            self._in, self._buf = tag, []
        elif tag == "meta":
            if a.get("name", "").lower() == "description":
                self.description = a.get("content", "")
            if a.get("http-equiv", "").lower() == "refresh":
                self.refresh = True

    def handle_data(self, data):
        if self._in:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == self._in:
            text = " ".join("".join(self._buf).split())
            if tag == "title" and not self.title:
                self.title = text
            elif tag != "title" and text and len(self.headings) < HEADINGS and text not in self.headings:
                self.headings.append(text)
            self._in = None


def page_descriptors(site: Path, config: dict) -> list[dict]:
    """One descriptor per page file of the site that a learner can open: path (relative to the site), title, headings, description."""
    out = []
    for path in sorted(site.rglob("*.html")):
        rel = path.relative_to(site).as_posix()
        if any(rel.startswith(prefix) for prefix in config["excluded_prefixes"]):
            continue
        page = _Page(path.read_text(encoding="utf-8", errors="replace"))
        if page.refresh:
            continue
        subject = next((s for prefix, s in config["page_subject_by_prefix"].items() if rel.startswith(prefix)), config["default_subject"])
        title = page.title or (page.headings[0] if page.headings else path.parent.name.replace("-", " ").replace("_", " ").title())
        out.append({"path": rel, "title": title, "headings": page.headings, "description": page.description, "subject": subject})
    return out


def page_subtitle(rel: str) -> str:
    if "/explorers/" in rel:
        return "Explorer"
    if rel.startswith("standalone/"):
        return "Practice page"
    return "Page" if rel.count("/") > 1 else "Portal"


# -- documents ----------------------------------------------------------------------------------------------------------------------------------

def _doc(kind: str, ident: str, title: str, subject: str, url: str, text: str, **extra) -> dict:
    doc = {"schema": "search-document/v2", "id": ident, "kind": kind, "title": title, "subject": subject, "url": url, "text": text}
    doc.update({k: v for k, v in extra.items() if v not in (None, "", [])})
    return doc


def projection_title(p: dict, question_titles: dict[str, str]) -> str:
    pr = p.get("projection", {})
    for part in ("orientation", "concept", "application"):
        title = (pr.get(part) or {}).get("title")
        if isinstance(title, str) and title.strip():
            return title.strip()
    return question_titles.get(p.get("source_ref", ""), p.get("source_ref") or p.get("id", ""))


def core_url(config: dict, projection_id: str) -> str:
    return f"{config['core_learning']['page']}?projection={quote(projection_id, safe=':')}"


def question_url(config: dict, question_id: str) -> str:
    qid = quote(question_id, safe="")
    return f"{config['question_bank']['page']}?q={qid}&mode=study#{qid}"


@dataclass
class Built:
    index: dict
    inputs: dict
    questions: dict = field(default_factory=dict)       # canonical / routed / unrouted / excluded ids


def read_packages(repo: Path, roots: list[Path]) -> list[tuple[str, dict]]:
    """(subject, package) for every library file that holds questions, in a fixed order. A file that does not parse is an error."""
    found = []
    for root in roots:
        for path in sorted(root.rglob("*.json")):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, ValueError) as exc:
                raise ContractError("SEARCH_INDEX_UNREADABLE_LIBRARY", f"{path}: {exc}") from exc
            if isinstance(data, dict) and isinstance(data.get("questions"), list):
                found.append((data.get("subject") or _subject_of(repo, path), data))
    return found


def _subject_of(repo: Path, path: Path) -> str:
    try:
        return path.resolve().relative_to(repo.resolve()).parts[0]
    except (ValueError, IndexError):
        return "Unknown"


def hints_of(q: dict) -> list[str]:
    """The hint texts of a question, in order: its hints, then its scaffolds. Whatever the hint ladder only points at is not text."""
    out: list[str] = []
    for row in list(q.get("hints") or []) + list(q.get("scaffolds") or []):
        text = clean(row.get("text") if isinstance(row, dict) else row)
        if text and text not in out:
            out.append(text)
    return out


def build(repo: Path, library_dirs: list[Path], config: dict | None = None) -> Built:
    config = config or load_config()
    site = repo / config["site_root"]
    core = read_js_object(site / config["core_learning"]["data"])
    bank = read_js_object(site / config["question_bank"]["data"])
    packages = read_packages(repo, library_dirs)

    canonical: dict[str, tuple[str, dict, dict]] = {}          # question id -> (subject, question, its package)
    excluded: list[str] = []
    for subject, package in packages:
        for q in package["questions"]:
            if (q.get("extensions") or {}).get("search_visibility") == "EXCLUDED":
                excluded.append(q["id"])
            else:
                canonical[q["id"]] = (subject, q, package)

    topic_of_capability: dict[str, str] = {}
    for _, package in packages:
        for m in package.get("microtopics", []):
            topic_of_capability.setdefault(m.get("primary_capability_ref", ""), m.get("title", ""))

    question_titles = {qid: shorten(clean(q.get("stem", ""))) for qid, (_, q, _) in canonical.items()}
    projections = core.get("core_projections", [])
    labels = config["core_labels"]
    docs: list[dict] = []

    # PAGE: the page files, and every Core projection as a sub page
    descriptors = page_descriptors(site, config)
    for d in descriptors:
        text = clean(" ".join([d["title"], *d["headings"], d["description"]]))
        docs.append(_doc("PAGE", f"page:{d['path']}", d["title"], d["subject"], d["path"], text, subtitle=page_subtitle(d["path"])))
    # a topic opens its Core 1 (a bucket) or Core 1A (a microtopic) page, and a question opens its own Core 2 page; the other Core pages are sub pages of their own
    opened = set(config["topic_cores"])
    for p in projections:
        level = p["projection"]["core"]
        if level in opened or p["source_ref"] in canonical:
            continue
        title = projection_title(p, question_titles)
        docs.append(_doc("PAGE", f"core:{p['id']}", f"{title} · {labels.get(level, level)}", p["subject"], core_url(config, p["id"]), clean(title),
                         subtitle=f"{p['subject']} · {labels.get(level, level)}", level=level))

    # TOPIC: a bucket or microtopic, opening its first Core page
    seen_topics: set[str] = set()
    for core_level in config["topic_cores"]:
        for p in projections:
            if p["projection"]["core"] != core_level or p["source_ref"] in seen_topics:
                continue
            seen_topics.add(p["source_ref"])
            title = projection_title(p, question_titles)
            docs.append(_doc("TOPIC", f"topic:{p['source_ref']}", title, p["subject"], core_url(config, p["id"]), clean(title),
                             subtitle=f"{p['subject']} · {'Unit' if core_level == 'CORE1' else 'Topic'} · opens {labels.get(core_level, core_level)}", level=core_level))

    # QUESTION and HINT: the questions a learner can open
    bank_by_id = {q["id"]: q for q in bank.get("questions", [])}
    by_source: dict[str, dict[str, dict]] = defaultdict(dict)
    for p in projections:
        by_source[p["source_ref"]][p["projection"]["core"]] = p
    routed: list[str] = []
    for qid, (subject, q, package) in sorted(canonical.items()):
        url, level, meta = None, None, {}
        if qid in bank_by_id:
            b = bank_by_id[qid]
            url = question_url(config, qid)
            subject = b.get("subject") or subject
            meta = {"topic": b.get("topic"), "exam": b.get("exam"), "year": b.get("year"), "difficulty": difficulty_of(b.get("difficulty"))}
        else:
            for core_level in config["question_core_preference"]:
                if core_level in by_source.get(qid, {}):
                    url, level = core_url(config, by_source[qid][core_level]["id"]), core_level
                    break
            if url is None:
                continue
            meta = {"topic": topic_of_capability.get(q.get("primary_capability_ref", "")), "difficulty": difficulty_of(q.get("difficulty"))}
        routed.append(qid)
        stem = clean(q.get("stem", ""))
        options = [clean(o.get("text") if isinstance(o, dict) else o) for o in (q.get("options") or [])]
        text = " ".join(part for part in [stem, *[clean(c) for c in q.get("conditions") or []], *options, qid] if part)
        where = " · ".join(str(x) for x in (meta.get("exam"), meta.get("year")) if x) or subject
        subtitle = " · ".join(x for x in (where, meta.get("topic")) if x)
        title = shorten(stem) or qid
        docs.append(_doc("QUESTION", f"question:{qid}", title, subject, url, text, subtitle=subtitle, level=level,
                         **{k: v for k, v in meta.items() if k != "topic"}, topic=meta.get("topic")))
        for n, hint in enumerate(hints_of(q), start=1):
            docs.append(_doc("HINT", f"hint:{qid}:{n}", f"Hint {n}", subject, url, hint, subtitle=title, parent=f"question:{qid}",
                             position=n, hidden=True, topic=meta.get("topic"), difficulty=meta.get("difficulty")))

    order = {k: i for i, k in enumerate(KINDS)}
    docs.sort(key=lambda d: (order[d["kind"]], d["subject"], d["title"].lower(), d["id"]))
    facets = {
        "subject": sorted({d["subject"] for d in docs}),
        "difficulty": sorted({d["difficulty"] for d in docs if d.get("difficulty")}),
        "level": sorted({d["level"] for d in docs if d.get("level")}),
    }
    index = {"schema": "search-index/v2", "counts": {k: sum(1 for d in docs if d["kind"] == k) for k in KINDS}, "facets": facets, "documents": docs}
    inputs = {
        "library_digest": contract.digest_roots(library_dirs),
        "pages_digest": contract.digest(descriptors),
        "core_learning_digest": contract.digest(core),
        "question_bank_digest": contract.digest(bank),
        "routes_digest": contract.digest(config),
    }
    questions = {"canonical": sorted(canonical), "routed": sorted(routed), "unrouted": sorted(set(canonical) - set(routed)), "excluded": sorted(excluded)}
    return Built(index, inputs, questions)


# -- routes, checked independently of the builder ----------------------------------------------------------------------------------------------

def resolve_url(repo: Path, url: str, config: dict, core_ids: set[str], bank_ids: set[str]) -> str | None:
    """None if `url` opens something that exists; otherwise why not."""
    parts = urlsplit(url)
    target = repo / config["site_root"] / unquote(parts.path)
    if not target.is_file():
        return f"{parts.path} is not a file of the site"
    query = parse_qs(parts.query)
    if parts.path == config["core_learning"]["page"] and query.get("projection") and query["projection"][0] not in core_ids:
        return f"no Core learning projection {query['projection'][0]!r}"
    if parts.path == config["question_bank"]["page"] and query.get("q") and query["q"][0] not in bank_ids:
        return f"no Question Bank question {query['q'][0]!r}"
    return None


def wrapper(index: dict) -> str:
    """The index as a script, for pages that cannot fetch (a page opened from a file): `window.GRADE9_SEARCH_INDEX = {...};`."""
    return "// Generated by Shared/tools/build_search_index.py -- do not edit by hand.\nwindow.GRADE9_SEARCH_INDEX = " + json.dumps(index, sort_keys=True, separators=(",", ":")) + ";\n"
