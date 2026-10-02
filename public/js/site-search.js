/* Grade9V3 header search: the dialog. Matching and ranking are in site-search-core.js; the index is data/search-index.v2.js (generated, verified).
 *
 * What it searches: pages (and the sub pages of a topic: Core 1, 1A, 1B, 2A, 2B), topics, questions and hints. A result opens a route that exists.
 * A hint is searched and never shown: the result says that a hint of that question matches, and not what the hint says, so that a learner who finds a question by
 * its hint has not been given it. Answers and worked steps are not in the index at all.
 */
(function () {
  'use strict';
  var core = window.Grade9SearchCore;
  if (!core) return;

  var KIND_ORDER = ['TOPIC', 'PAGE', 'QUESTION', 'HINT'];
  var CHIPS = [['ALL', 'All'], ['TOPIC', 'Topics'], ['PAGE', 'Pages'], ['QUESTION', 'Questions'], ['HINT', 'Hints']];
  var KIND_NAME = { TOPIC: 'Topic', PAGE: 'Page', QUESTION: 'Question', HINT: 'Hint' };
  var GROUP_NAME = { TOPIC: 'Topics', PAGE: 'Pages', QUESTION: 'Questions', HINT: 'Hints' };
  var LEVEL_NAME = { CORE1: 'Core 1', CORE1A: 'Core 1A', CORE1B: 'Core 1B', CORE2: 'Core 2', CORE2A: 'Core 2A', CORE2B: 'Core 2B' };
  var EXAMPLES = ['projectile', 'friction', 'linear equations', 'redox', 'vectors'];
  var GROUP_LIMIT = 4;
  var PAGE_SIZE = 40;

  var state = { root: '', prepared: null, status: 'idle', query: '', kind: 'ALL', subject: '', difficulty: '', level: '', shown: PAGE_SIZE };
  var dom = null;
  var timer = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function marked(parent, text, tokens) {
    core.segments(text, tokens).forEach(function (part) {
      parent.appendChild(part.mark ? el('mark', '', part.text) : document.createTextNode(part.text));
    });
    return parent;
  }

  function load(root) {
    if (window.GRADE9_SEARCH_INDEX) return Promise.resolve(window.GRADE9_SEARCH_INDEX);
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = root + 'data/search-index.v2.js';
      script.onload = function () { window.GRADE9_SEARCH_INDEX ? resolve(window.GRADE9_SEARCH_INDEX) : reject(new Error('empty')); };
      script.onerror = function () { reject(new Error('load')); };
      document.head.appendChild(script);
    });
  }

  function select(label, name, options) {
    var wrap = el('label', 'g9-search-filter');
    wrap.appendChild(el('span', 'g9-search-filter-label', label));
    var control = document.createElement('select');
    control.setAttribute('data-g9-site-search-filter', name);
    options.forEach(function (o) {
      var option = document.createElement('option');
      option.value = o[0];
      option.textContent = o[1];
      control.appendChild(option);
    });
    control.addEventListener('change', function () { state[name] = control.value; state.shown = PAGE_SIZE; render(); });
    wrap.appendChild(control);
    return { wrap: wrap, control: control };
  }

  function build() {
    var dialog = document.createElement('dialog');
    dialog.className = 'g9-search-dialog';
    dialog.setAttribute('aria-labelledby', 'g9SearchTitle');
    dialog.setAttribute('data-g9-site-search', '');
    var wrap = el('div', 'g9-search-wrap');
    var head = el('div', 'g9-search-top');
    var title = el('strong', '', 'Search Grade9V3');
    title.id = 'g9SearchTitle';
    var close = el('button', 'site-icon-btn', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close search');
    close.addEventListener('click', function () { dialog.close(); });
    head.append(title, close);

    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Topics, pages, questions, hints…';
    input.autocomplete = 'off';
    input.setAttribute('aria-label', 'Search Grade9V3');
    input.setAttribute('data-g9-site-search-input', '');
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.query = input.value; state.shown = PAGE_SIZE; render(); }, 80);
    });

    var chips = el('div', 'g9-search-chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'What to search');
    var chipNodes = {};
    CHIPS.forEach(function (c) {
      var chip = el('button', 'g9-search-chip');
      chip.type = 'button';
      chip.setAttribute('data-g9-site-search-kind', c[0]);
      chip.addEventListener('click', function () { state.kind = c[0]; state.shown = PAGE_SIZE; render(); });
      chipNodes[c[0]] = chip;
      chips.appendChild(chip);
    });

    var box = document.createElement('details');
    box.className = 'g9-search-filters-box';
    var boxSummary = el('summary', 'g9-search-filters-summary', 'Filters');
    box.appendChild(boxSummary);
    var filters = el('div', 'g9-search-filters');
    box.appendChild(filters);
    var subject = select('Subject', 'subject', [['', 'All subjects']]);
    var difficulty = select('Difficulty', 'difficulty', [['', 'Any difficulty']]);
    var level = select('Level', 'level', [['', 'Any level']]);
    var clear = el('button', 'g9-search-clear', 'Clear filters');
    clear.type = 'button';
    clear.addEventListener('click', function () {
      state.kind = 'ALL'; state.subject = state.difficulty = state.level = ''; state.shown = PAGE_SIZE;
      render();
      input.focus();
    });
    filters.append(subject.wrap, difficulty.wrap, level.wrap, clear);

    var summary = el('div', 'g9-search-summary');
    summary.setAttribute('aria-live', 'polite');
    var results = el('div', 'g9-search-results');
    results.setAttribute('data-g9-site-search-results', '');
    var foot = el('div', 'g9-search-foot', 'Hints are searched but never shown: open the question and try it first.');

    wrap.append(head, input, chips, box, summary, results, foot);
    dialog.appendChild(wrap);
    document.body.appendChild(dialog);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { var first = results.querySelector('a.g9-search-result'); if (first) { e.preventDefault(); first.focus(); } }
      if (e.key === 'Enter') { var open = results.querySelector('a.g9-search-result'); if (open) { e.preventDefault(); location.href = open.href; } }
    });
    results.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var links = Array.prototype.slice.call(results.querySelectorAll('a.g9-search-result'));
      var at = links.indexOf(document.activeElement);
      if (at === -1) return;
      e.preventDefault();
      if (e.key === 'ArrowDown') (links[at + 1] || links[at]).focus();
      else if (at === 0) input.focus();
      else links[at - 1].focus();
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

    dom = { dialog: dialog, input: input, chips: chipNodes, filtersSummary: boxSummary, subject: subject.control, difficulty: difficulty.control, level: level.control, clear: clear, summary: summary, results: results };
  }

  function fillFilters(index) {
    function set(control, values, first, label) {
      control.replaceChildren();
      [['', first]].concat(values.map(function (v) { return [v, label ? label(v) : v]; })).forEach(function (o) {
        var option = document.createElement('option');
        option.value = o[0];
        option.textContent = o[1];
        control.appendChild(option);
      });
    }
    set(dom.subject, index.facets.subject, 'All subjects');
    set(dom.difficulty, index.facets.difficulty, 'Any difficulty');
    set(dom.level, index.facets.level, 'Any level', function (v) { return LEVEL_NAME[v] || v; });
  }

  function message(text, extra) {
    dom.results.replaceChildren();
    var box = el('div', 'g9-search-empty');
    box.appendChild(el('p', '', text));
    if (extra) box.appendChild(extra);
    dom.results.appendChild(box);
  }

  function resultNode(item, tokens) {
    var doc = item.doc;
    var link = el('a', 'g9-search-result');
    link.href = state.root + doc.url;
    link.setAttribute('data-kind', doc.kind);
    var kind = el('span', 'g9-search-result-kind', KIND_NAME[doc.kind]);
    var main = el('span', 'g9-search-result-main');
    if (doc.kind === 'HINT') {
      main.textContent = doc.title;                                   // the hint's own words are never printed
    } else {
      marked(main, doc.title, tokens);
    }
    var meta = [doc.subtitle || doc.subject];
    var line = el('span', 'g9-search-result-sub');
    if (doc.kind === 'HINT') {
      line.textContent = 'Question: ' + doc.subtitle;
      var note = el('span', 'g9-search-result-note', 'A hint of this question matches. Its text is hidden: open the question and try first.');
      link.append(kind, main, line, note);
      return link;
    }
    marked(line, meta.filter(Boolean).join(' · '), tokens);
    link.append(kind, main, line);
    if (doc.kind === 'QUESTION' || doc.kind === 'PAGE') {
      var shown = (doc.title || '').toLowerCase();
      var inTitle = tokens.every(function (t) { return shown.indexOf(t) !== -1; });
      if (!inTitle && doc.text) {
        var snippet = el('span', 'g9-search-result-snippet');
        marked(snippet, core.excerpt(doc.text, tokens, 150), tokens);
        link.appendChild(snippet);
      }
    }
    return link;
  }

  function render() {
    if (!dom) return;
    var filters = { subject: state.subject, difficulty: state.difficulty, level: state.level, kinds: state.kind === 'ALL' ? [] : [state.kind] };
    var narrowed = state.subject || state.difficulty || state.level || state.kind !== 'ALL';
    dom.clear.hidden = !narrowed;
    var active = [state.subject, state.difficulty, state.level].filter(Boolean).length;
    dom.filtersSummary.textContent = active ? 'Filters (' + active + ')' : 'Filters';
    dom.subject.value = state.subject;
    dom.difficulty.value = state.difficulty;
    dom.level.value = state.level;
    if (state.status === 'loading') { message('Loading search…'); dom.summary.textContent = ''; return; }
    if (state.status === 'error') {
      var retry = el('button', 'g9-search-more', 'Try again');
      retry.type = 'button';
      retry.addEventListener('click', function () { start(); });
      message('Search could not load its index.', retry);
      return;
    }
    if (!state.prepared) return;
    var counts = { PAGE: 0, TOPIC: 0, QUESTION: 0, HINT: 0 };
    var res = core.search(state.prepared, state.query, filters);
    if (res.tokens.length) counts = res.counts;
    var all = counts.PAGE + counts.TOPIC + counts.QUESTION + counts.HINT;
    CHIPS.forEach(function (c) {
      var chip = dom.chips[c[0]];
      var n = c[0] === 'ALL' ? all : counts[c[0]];
      chip.textContent = res.tokens.length ? c[1] + ' (' + n + ')' : c[1];
      chip.setAttribute('aria-pressed', String(state.kind === c[0]));
    });
    dom.results.replaceChildren();
    if (!res.tokens.length) {
      var c = state.prepared.index.counts;
      dom.summary.textContent = '';
      var box = el('div', 'g9-search-empty');
      box.appendChild(el('p', '', 'Search ' + (c.PAGE + c.TOPIC + c.QUESTION + c.HINT) + ' things: ' + c.TOPIC + ' topics, ' + c.PAGE + ' pages, ' + c.QUESTION + ' questions and ' + c.HINT + ' hints.'));
      var tries = el('div', 'g9-search-examples');
      EXAMPLES.forEach(function (word) {
        var b = el('button', 'g9-search-chip', word);
        b.type = 'button';
        b.addEventListener('click', function () { dom.input.value = word; state.query = word; render(); dom.input.focus(); });
        tries.appendChild(b);
      });
      box.appendChild(tries);
      dom.results.appendChild(box);
      return;
    }
    var total = res.results.length;
    dom.summary.textContent = total ? total + (total === 1 ? ' result' : ' results') + ' for “' + state.query.trim() + '”' : '';
    if (!total) {
      var none = el('div', 'g9-search-empty');
      none.appendChild(el('p', '', narrowed ? 'Nothing matches with these filters.' : 'Nothing matches “' + state.query.trim() + '”.'));
      if (narrowed) {
        var again = el('button', 'g9-search-more', 'Clear filters');
        again.type = 'button';
        again.addEventListener('click', function () { dom.clear.click(); });
        none.appendChild(again);
      }
      dom.results.appendChild(none);
      return;
    }
    if (state.kind === 'ALL') {
      KIND_ORDER.forEach(function (kind) {
        var group = res.results.filter(function (r) { return r.doc.kind === kind; });
        if (!group.length) return;
        var title = el('h3', 'g9-search-group-title', GROUP_NAME[kind] + ' (' + group.length + ')');
        dom.results.appendChild(title);
        group.slice(0, GROUP_LIMIT).forEach(function (item) { dom.results.appendChild(resultNode(item, res.tokens)); });
        if (group.length > GROUP_LIMIT) {
          var more = el('button', 'g9-search-more', 'Show all ' + group.length + ' ' + GROUP_NAME[kind].toLowerCase());
          more.type = 'button';
          more.addEventListener('click', function () { state.kind = kind; state.shown = PAGE_SIZE; render(); });
          dom.results.appendChild(more);
        }
      });
    } else {
      res.results.slice(0, state.shown).forEach(function (item) { dom.results.appendChild(resultNode(item, res.tokens)); });
      if (res.results.length > state.shown) {
        var next = el('button', 'g9-search-more', 'Show more (' + (res.results.length - state.shown) + ' left)');
        next.type = 'button';
        next.addEventListener('click', function () { state.shown += PAGE_SIZE; render(); });
        dom.results.appendChild(next);
      }
    }
  }

  function start() {
    state.status = 'loading';
    render();
    return load(state.root).then(function (index) {
      state.prepared = core.prepare(index);
      state.status = 'ready';
      fillFilters(index);
      render();
    }).catch(function () {
      state.status = 'error';
      render();
    });
  }

  function open(options) {
    state.root = (options && options.root) || '';
    if (!dom) build();
    if (typeof dom.dialog.showModal === 'function' && !dom.dialog.open) dom.dialog.showModal();
    else dom.dialog.setAttribute('open', '');
    dom.input.focus();
    dom.input.select();
    if (state.status === 'ready') render();
    else if (state.status !== 'loading') start();
  }

  window.Grade9SiteSearch = { open: open };
})();
