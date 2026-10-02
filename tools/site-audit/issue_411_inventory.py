#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlsplit, unquote
import html, json, re

ROOT=Path(__file__).resolve().parents[2]
PUBLIC=ROOT/'public'
STANDALONE=ROOT/'standalone'
DOCS=ROOT/'docs'
OUT=ROOT/'audit/issue-411'
OUT.mkdir(parents=True,exist_ok=True)

search_doc=json.loads((ROOT/'Shared/search/site-search-resources.v1.json').read_text())
static_search={r['path'] for r in search_doc.get('resources',[])}

def load_assignment(path):
    if not path.is_file(): return None
    text=path.read_text(encoding='utf-8',errors='replace')
    pos=text.find('=')
    if pos<0:return None
    try:return json.loads(text[pos+1:].strip().rstrip(';'))
    except Exception:return None

qb=load_assignment(PUBLIC/'data/question-bank-data.js') or {}
qb_search={r.get('path') for r in qb.get('destinations',[]) if isinstance(r,dict) and r.get('path')}
search_paths=static_search|qb_search
href_re=re.compile(r'''\bhref\s*=\s*["']([^"'<>]+)["']''',re.I)
title_re=re.compile(r'<title>(.*?)</title>',re.I|re.S)
h1_re=re.compile(r'<h1[^>]*>(.*?)</h1>',re.I|re.S)
tag_re=re.compile(r'<[^>]+>')
public_pages=sorted(PUBLIC.rglob('*.html'))
rels={p:p.relative_to(PUBLIC).as_posix() for p in public_pages}
inbound={r:set() for r in rels.values()}

def skip_url(url):
    return not url or url.startswith(('#','mailto:','tel:','javascript:','data:','//')) or bool(urlsplit(url).scheme)

def resolve(page,url):
    path=unquote(urlsplit(html.unescape(url)).path)
    if not path:return None
    target=(PUBLIC/path.lstrip('/')) if path.startswith('/') else page.parent/path
    try:rel=target.resolve().relative_to(PUBLIC.resolve())
    except Exception:return None
    result=rel.as_posix()
    if (PUBLIC/rel).is_dir() or path.endswith('/'):result=(rel/'index.html').as_posix()
    return result

for page in public_pages:
    text=page.read_text(encoding='utf-8',errors='replace')
    for raw in href_re.findall(text):
        if skip_url(raw):continue
        target=resolve(page,raw)
        if target in inbound and target!=rels[page]:inbound[target].add(rels[page])

owner_prefixes=('raw-intake/','core-prompt-composer/','portable-workbench/','core-learning/','test/','tools/')
learner_entry={'index.html','physics/index.html','chemistry/index.html','mathematics/index.html'}
technical_terms=('topic atlas','data-driven canonical orchestration','core builder','gap table','matrix rung','authoring','owner workflow','portable workbench','prompt composer','raw intake')
rows=[]
for page in public_pages:
    rel=rels[page]
    text=page.read_text(encoding='utf-8',errors='replace')
    tm=title_re.search(text); hm=h1_re.search(text)
    title=tag_re.sub('',tm.group(1) if tm else hm.group(1) if hm else rel).strip()
    lower=(title+' '+text[:16000]).lower()
    subject='Physics' if rel.startswith('physics/') else 'Chemistry' if rel.startswith('chemistry/') else 'Mathematics' if rel.startswith('mathematics/') else ''
    audience='OWNER_LAB_INTERNAL' if rel.startswith(owner_prefixes) or any(t in lower for t in technical_terms) else 'LEARNER'
    linked_home='index.html' in inbound[rel]
    linked_subject=any(x in inbound[rel] for x in ('physics/index.html','chemistry/index.html','mathematics/index.html'))
    searchable=rel in search_paths
    mirror=(DOCS/rel).is_file()
    shell='data-g9-shell' in text or 'site-header.js' in text
    if audience!='LEARNER':status='WRONG_AUDIENCE_EXPOSURE' if linked_home or linked_subject else 'OWNER_LAB_INTERNAL'
    elif rel in learner_entry or rel=='question-bank/index.html':status='WIRED'
    elif not inbound[rel]:status='MISSING_NAV'
    elif not searchable:status='MISSING_SEARCH'
    else:status='WIRED'
    rows.append(dict(scope='PUBLIC',resource=rel,title=title,subject=subject,audience=audience,inbound_count=len(inbound[rel]),linked_from_home=linked_home,linked_from_subject=linked_subject,global_search=searchable,docs_mirror=mirror,shared_shell=shell,status=status))

for page in sorted(STANDALONE.rglob('*.html')):
    rel=page.relative_to(ROOT).as_posix()
    text=page.read_text(encoding='utf-8',errors='replace')
    tm=title_re.search(text); title=tag_re.sub('',tm.group(1)).strip() if tm else rel
    lower=(title+' '+text[:12000]).lower()
    subject='Physics' if 'physics' in lower else 'Chemistry' if 'chemistry' in lower else 'Mathematics' if ('math' in lower or 'geometry' in lower or 'polynomial' in lower) else ''
    rows.append(dict(scope='STANDALONE',resource=rel,title=title,subject=subject,audience='UNCLASSIFIED_CANDIDATE',inbound_count=0,linked_from_home=False,linked_from_subject=False,global_search=False,docs_mirror=False,shared_shell='data-g9-shell' in text,status='HELD'))

counts={}
for r in rows:counts[r['status']]=counts.get(r['status'],0)+1
summary={'basis':'a19bb1657bb7d779252c52cdd472fd446ccd9e97','rows':len(rows),'public_html':sum(r['scope']=='PUBLIC' for r in rows),'standalone_html':sum(r['scope']=='STANDALONE' for r in rows),'static_search_resources':len(static_search),'qb_destination_resources':len(qb_search),'status_counts':counts}
(OUT/'learner-resource-inventory.json').write_text(json.dumps({'summary':summary,'rows':rows},indent=2,sort_keys=True)+'\n')
lines=['# Issue #411 learner-resource machine inventory','',f"Basis: `{summary['basis']}`",'',f"Rows: **{summary['rows']}** = {summary['public_html']} public HTML + {summary['standalone_html']} standalone HTML candidates.",f"Global-search source membership: {len(static_search)} static registry paths + {len(qb_search)} QB destination paths.",'','Machine suggestions are reconnaissance only; final dispositions require repository/source/audience review.','','| Scope | Resource | Subject | Audience | Inbound | Home | Subject | Search | Docs | Suggested |','|---|---|---|---|---:|:---:|:---:|:---:|:---:|---|']
for r in rows:lines.append(f"| {r['scope']} | `{r['resource']}` | {r['subject']} | {r['audience']} | {r['inbound_count']} | {'Y' if r['linked_from_home'] else ''} | {'Y' if r['linked_from_subject'] else ''} | {'Y' if r['global_search'] else ''} | {'Y' if r['docs_mirror'] else ''} | {r['status']} |")
(OUT/'learner-resource-inventory.md').write_text('\n'.join(lines)+'\n')
print(json.dumps(summary,indent=2))
