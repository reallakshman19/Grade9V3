# Site search

The search icon in the header (or Ctrl/⌘ K) opens one dialog that searches the whole learner site: pages and sub pages, topics, questions and hints. This describes what it finds, how results are categorised, and the rules that keep it honest.

## What a result is

| Kind | What it is | Opens |
|---|---|---|
| **Topic** | a unit (bucket) or a topic (microtopic) | its Core 1 / Core 1A page |
| **Page** | a page file of the site (portal, subject hubs, unit hubs, explorers, practice pages), and the sub pages of a topic that no topic result opens (Core 1B) | the page |
| **Question** | a canonical question that a page of the site shows | the Question Bank; or the published product page that shows it (at the question's own element); or its Core 2A/2B page |
| **Hint** | one hint of such a question | the question |

Every result opens a route that exists. The routes come from `Shared/search/site-routes.v1.json` (where the site keeps things) and are checked, one by one, by `Shared/tools/verify_search_index.py`.

## How results are categorised

Two layers. **Kind** (above) is a chip row with live counts: All, Topics, Pages, Questions, Hints. **Filters** (behind the Filters button, with the number set) narrow whatever the chips show: Subject (Physics, Chemistry, Mathematics, General for portal pages), Difficulty (D1–D4, which only questions and hints carry), Level (Core 1, 1A, 1B, 2A, 2B). In the All view the best four of each kind are shown with "Show all N".

Ranking: every word of the query must be found. A word counts most in the title, then the topic, the subtitle, the text; at the start of a word more than inside one. A question id typed whole finds that question first.

## Hints are findable and never shown

A hint is searched, so a learner can find a question by what its hint says. The result says "A hint of this question matches. Its text is hidden: open the question and try first", and shows the question's own words, never the hint's. Answers, worked steps and keys are not in the index at all. (The index file is public, like the Question Bank data it is built from; the rule is about what the dialog displays.)

## What is not a result, and why

A canonical question that no page of the site shows has no route, so it is not a result. It is named in the index manifest (`questions.unrouted`) and reported by the verifier as an advisory (`UNROUTED_QUESTIONS`). Today that is 138 of 246: the 77 bank questions and 31 library questions are shown (the Question Bank, Core 2A/2B pages); the rest appear only in product pages that have not been accepted and published. Publishing a product's pages is what makes its questions findable. Pages under `test/` and `vendor/` are not indexed.

## When a page is added

The blueprint ensures it (`shell.search_policy` in `Shared/web/interactive-page-blueprints.v1.json`, registry 1.9.0; the generated spec is `docs/specs/PAGE-BLUEPRINT-COMPONENTS.md`, section "Search: every page is found"). Nothing has to be remembered:

- **A page file under `public/`** (outside `vendor/`, `test/` and `node_modules/`): run `python3 Shared/tools/build_search_index.py`, then `python3 Shared/tools/build_pages_site.py`, and commit the regenerated files. If that is forgotten, CI's `verify_search_index.py --enforce` fails the pull request (`PAGE_INDEXED`: `MISSING_FROM_INDEX`, `STALE_INDEX`). The page needs a `<title>` (`PAGE_TITLED`); a question element needs its id (`QUESTION_ANCHORED`; the renderer writes `<article id="QUESTION-ID" data-g9-kind="QUESTION">`).
- **A product accepted** (`accept_product.py`): the index is rebuilt in the same step, after the pages are published and before the Pages mirror is written (`PUBLICATION_REINDEXES`). The product's pages become results, and the questions they show are found at their own element on the page. Measured on a scratch copy of the site: publishing the three products that render without gaps today would make 36 of the 138 unrouted questions findable. The others cannot be published until their gaps are authored (for example `phy-kin-1d-motion` has 106).
- **A TEST page** is not indexed: the sandbox's pages are drafts.

Every rule has a finding code, and each code's severity is the blueprint's: a rule that only says (`UNROUTED_REPORTED`) does not fail a run.

## Where it comes from

`Shared/tools/build_search_index.py` builds `public/data/search-index.v2.json` (the contract, validated against `Shared/search/*.schema.json`), `search-index.v2.js` (the same index as a script, so a page opened from a file can load it) and the manifest. It reads the library, the page files, `core-learning/data.js` and `data/question-bank-data.js`. Rebuild it, after those, whenever they change (the command reads the route table, `Shared/search/site-routes.v1.json`, for where things are):

```
python3 Shared/tools/build_core_learning_data.py
python3 Shared/tools/build_search_index.py
python3 Shared/tools/build_pages_site.py
```

`verify_search_index.py` rebuilds the index in memory and compares: a stale index, a missing, extra or edited document, a result that opens nothing, a script that is not the index. It writes `SEARCH_MEMBERSHIP` and `SEARCH_RETRIEVABILITY` evidence, and CI runs it with `--enforce`.

The dialog loads on first use: `js/site-search-core.js` (matching, testable in Node) and `js/site-search.js` (the dialog). Its text is 14 px or more and its controls 48 px or more; a browser test holds that on a tablet and a phone.

## Not built yet

- Searching worked steps or answers, behind an "include worked solutions" switch.
- Capabilities and sources as results.
- Typo tolerance, synonyms, and search inside a page's body text (pages are found by title, headings and description).
