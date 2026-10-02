/* Grade9V3 site search: matching and ranking, with no page in sight so that it can be tested on its own.
 *
 * A document (Shared/search/search-document.schema.json) is a PAGE, TOPIC, QUESTION or HINT with a title, a subtitle, a subject, a topic and the text that is searched.
 * Every word of the query must be found, in the title, the topic, the subtitle or the text; a word counts for more at the start of a word than inside one; the title
 * counts for most. A HINT is searched on its text and is never shown (`hidden`): the interface prints where a hint matched, not what it says.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Grade9SearchCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var KINDS = ['TOPIC', 'PAGE', 'QUESTION', 'HINT'];
  var KIND_BONUS = { TOPIC: 2, PAGE: 1.5, QUESTION: 1, HINT: 0 };
  var WEIGHT = { title: 10, topic: 5, subtitle: 3, text: 2 };

  function fold(value) {
    return String(value == null ? '' : value).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  }

  /* words: letters and digits, with a decimal point kept inside a number (4.0, 0.5) */
  function words(value) {
    return fold(value).match(/[a-z0-9]+(?:\.[0-9]+)?/g) || [];
  }

  function field(value) {
    var list = words(value);
    return { joined: ' ' + list.join(' ') + ' ', words: list };
  }

  /* 2 when a word of the field starts with the token, 1 when the token is inside a word, 0 when it is not there */
  function hits(f, token) {
    if (f.joined.indexOf(' ' + token) !== -1) return 2;
    if (token.length > 1 && f.joined.indexOf(token) !== -1) return 1;
    return 0;
  }

  function prepare(index) {
    var docs = (index && index.documents) || [];
    return {
      index: index,
      entries: docs.map(function (doc) {
        return {
          doc: doc,
          title: field(doc.title),
          topic: field(doc.topic),
          subtitle: field(doc.subtitle),
          text: field(doc.text),
          ident: words(String(doc.id).replace(/^[a-z]+:/, '')).join(' ')
        };
      })
    };
  }

  function passes(doc, filters) {
    if (filters.subject && doc.subject !== filters.subject) return false;
    if (filters.difficulty && doc.difficulty !== filters.difficulty) return false;
    if (filters.level && doc.level !== filters.level) return false;
    return true;
  }

  function score(entry, tokens, phrase) {
    var total = 0;
    var inTitle = 0;
    for (var i = 0; i < tokens.length; i++) {
      var best = 0;
      var names = ['title', 'topic', 'subtitle', 'text'];
      for (var j = 0; j < names.length; j++) {
        var h = hits(entry[names[j]], tokens[i]);
        if (h) {
          if (names[j] === 'title') inTitle++;
          best = Math.max(best, WEIGHT[names[j]] * (h === 2 ? 1 : 0.5));
        }
      }
      if (!best) return 0;
      total += best;
    }
    if (inTitle === tokens.length) total += 8;
    if (phrase && entry.title.joined.indexOf(' ' + phrase) !== -1) total += 6;
    if (phrase && entry.ident === phrase) total += 100;
    return total + KIND_BONUS[entry.doc.kind];
  }

  /* search(prepared, 'projectile range', {kinds: ['QUESTION'], subject: 'Physics', difficulty: 'D2', level: 'CORE2A'})
   * -> {tokens, counts: {KIND: n}, results: [{doc, score}]}. `counts` ignores the kind filter, so that each kind chip can say how many it would show. */
  function search(prepared, query, filters) {
    filters = filters || {};
    var tokens = words(query);
    var counts = { PAGE: 0, TOPIC: 0, QUESTION: 0, HINT: 0 };
    var results = [];
    if (!tokens.length) return { tokens: tokens, counts: counts, results: results };
    var phrase = tokens.join(' ');
    var kinds = filters.kinds && filters.kinds.length ? filters.kinds : null;
    for (var i = 0; i < prepared.entries.length; i++) {
      var entry = prepared.entries[i];
      if (!passes(entry.doc, filters)) continue;
      var s = score(entry, tokens, phrase);
      if (!s) continue;
      counts[entry.doc.kind]++;
      if (kinds && kinds.indexOf(entry.doc.kind) === -1) continue;
      results.push({ doc: entry.doc, score: s });
    }
    results.sort(function (a, b) {
      return b.score - a.score || a.doc.title.localeCompare(b.doc.title) || (a.doc.id < b.doc.id ? -1 : 1);
    });
    return { tokens: tokens, counts: counts, results: results };
  }

  /* [{text, mark}] segments of `text` with the query words marked; nothing is marked when none is found */
  function segments(text, tokens) {
    var source = String(text == null ? '' : text);
    if (!tokens.length) return [{ text: source, mark: false }];
    var escaped = tokens.slice().sort(function (a, b) { return b.length - a.length; }).map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    var pattern = new RegExp('(' + escaped.join('|') + ')', 'ig');
    var out = [];
    var last = 0;
    var m;
    while ((m = pattern.exec(source)) !== null) {
      if (m.index > last) out.push({ text: source.slice(last, m.index), mark: false });
      out.push({ text: m[0], mark: true });
      last = m.index + m[0].length;
      if (m[0].length === 0) pattern.lastIndex++;
    }
    if (last < source.length) out.push({ text: source.slice(last), mark: false });
    return out.length ? out : [{ text: source, mark: false }];
  }

  /* about `width` characters of `text` around the first query word, with an ellipsis where it was cut */
  function excerpt(text, tokens, width) {
    var source = String(text == null ? '' : text).replace(/\s+/g, ' ');
    if (source.length <= width) return source;
    var lower = fold(source);
    var at = -1;
    for (var i = 0; i < tokens.length; i++) {
      var found = lower.indexOf(tokens[i]);
      if (found !== -1 && (at === -1 || found < at)) at = found;
    }
    if (at === -1) return source.slice(0, width).replace(/\s+\S*$/, '') + '…';
    var start = Math.max(0, at - Math.floor(width / 3));
    var end = Math.min(source.length, start + width);
    var piece = source.slice(start, end);
    if (start > 0) piece = '…' + piece.replace(/^\S*\s+/, '');
    if (end < source.length) piece = piece.replace(/\s+\S*$/, '') + '…';
    return piece;
  }

  return { KINDS: KINDS, words: words, prepare: prepare, search: search, segments: segments, excerpt: excerpt };
});
