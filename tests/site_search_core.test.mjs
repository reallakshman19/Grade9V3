// The matching and ranking of the header search, with no page in sight: node --test tests/site_search_core.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const core = createRequire(import.meta.url)('../public/js/site-search-core.js');

const doc = (kind, id, title, extra = {}) => ({ kind, id, title, subject: 'Physics', url: 'x.html', text: title, subtitle: '', ...extra });
const index = {
  documents: [
    doc('TOPIC', 'topic:MIC-1', 'Friction opposes sliding', { level: 'CORE1A' }),
    doc('PAGE', 'page:physics/nlm/index.html', 'Newton laws of motion explorer', { text: 'Newton laws of motion explorer friction on an incline' }),
    doc('QUESTION', 'question:PYQ-PHY-2011-P2-Q33', 'A boy throws a ball inside a train', { text: 'A boy throws a ball inside a train accelerating uniformly. Find the friction. 4.0 m/s PYQ-PHY-2011-P2-Q33', difficulty: 'D3', level: 'CORE2A' }),
    doc('QUESTION', 'question:Q-CHEM-1', 'Classify the redox pattern', { subject: 'Chemistry', text: 'Classify the redox pattern of phosphorus', difficulty: 'D1' }),
    doc('HINT', 'hint:Q-CHEM-1:1', 'Hint 1', { subject: 'Chemistry', text: 'Assign oxidation states first', subtitle: 'Classify the redox pattern', hidden: true, difficulty: 'D1' }),
    doc('HINT', 'hint:PYQ-PHY-2011-P2-Q33:1', 'Hint 1', { text: 'Think about friction as seen from the train', subtitle: 'A boy throws a ball inside a train', hidden: true, difficulty: 'D3' }),
  ],
};
const prepared = core.prepare(index);
const ids = (res) => res.results.map((r) => r.doc.id);

test('words: letters and digits, a decimal point kept inside a number, accents folded, TeX gone', () => {
  assert.deepEqual(core.words('Find 4.0 m/s, café!'), ['find', '4.0', 'm', 's', 'cafe']);
  assert.deepEqual(core.words(''), []);
  assert.deepEqual(core.words(null), []);
});

test('every word of the query has to be found, in any field', () => {
  assert.deepEqual(ids(core.search(prepared, 'friction train')).sort(), ['hint:PYQ-PHY-2011-P2-Q33:1', 'question:PYQ-PHY-2011-P2-Q33']);
  assert.deepEqual(ids(core.search(prepared, 'friction zebra')), []);
  assert.deepEqual(ids(core.search(prepared, '   ')), []);
});

test('a word counts at the start of a word and inside one, less', () => {
  assert.ok(ids(core.search(prepared, 'fric')).includes('topic:MIC-1'), 'a prefix finds');
  const inside = core.search(prepared, 'iction');
  assert.ok(ids(inside).includes('topic:MIC-1'), 'inside a word finds too');
  const prefix = core.search(prepared, 'friction').results.find((r) => r.doc.id === 'topic:MIC-1');
  assert.ok(prefix.score > inside.results.find((r) => r.doc.id === 'topic:MIC-1').score);
  assert.deepEqual(ids(core.search(prepared, 'x')), [], 'one letter is a prefix only');
});

test('the title outranks the text, and a topic outranks a page for the same words', () => {
  const res = core.search(prepared, 'friction');
  assert.equal(res.results[0].doc.id, 'topic:MIC-1');
  assert.ok(ids(res).indexOf('page:physics/nlm/index.html') < ids(res).indexOf('hint:PYQ-PHY-2011-P2-Q33:1'), 'a page that says friction before a hint that does');
});

test('a question id, copied whole, finds that question first', () => {
  const res = core.search(prepared, 'PYQ-PHY-2011-P2-Q33');
  assert.equal(res.results[0].doc.id, 'question:PYQ-PHY-2011-P2-Q33');
});

test('kinds narrow the results and not the counts of the other kinds', () => {
  const res = core.search(prepared, 'friction', { kinds: ['HINT'] });
  assert.deepEqual(ids(res), ['hint:PYQ-PHY-2011-P2-Q33:1']);
  assert.deepEqual(res.counts, { PAGE: 1, TOPIC: 1, QUESTION: 1, HINT: 1 });
});

test('subject, difficulty and level filter, and a difficulty leaves out what has none', () => {
  assert.deepEqual(ids(core.search(prepared, 'redox', { subject: 'Chemistry' })).sort(), ['hint:Q-CHEM-1:1', 'question:Q-CHEM-1']);
  assert.deepEqual(ids(core.search(prepared, 'friction', { subject: 'Chemistry' })), []);
  assert.deepEqual(ids(core.search(prepared, 'friction', { difficulty: 'D3' })).sort(), ['hint:PYQ-PHY-2011-P2-Q33:1', 'question:PYQ-PHY-2011-P2-Q33']);
  assert.deepEqual(ids(core.search(prepared, 'friction', { level: 'CORE1A' })), ['topic:MIC-1']);
});

test('the same query gives the same order every time', () => {
  assert.deepEqual(ids(core.search(prepared, 'a')), ids(core.search(prepared, 'a')));
});

test('segments mark every query word, in any case, and nothing when there is none', () => {
  assert.deepEqual(core.segments('Friction on a FRICTION-less plane', ['friction']).filter((s) => s.mark).map((s) => s.text), ['Friction', 'FRICTION']);
  assert.deepEqual(core.segments('plain', ['x']), [{ text: 'plain', mark: false }]);
  assert.deepEqual(core.segments('a.b', ['a.b']).filter((s) => s.mark).map((s) => s.text), ['a.b'], 'a dot in a word is not a pattern');
  assert.deepEqual(core.segments('text', []), [{ text: 'text', mark: false }]);
});

test('an excerpt is about the width asked, around the first match, with ellipses where it was cut', () => {
  const text = 'word '.repeat(60) + 'needle ' + 'word '.repeat(60);
  const piece = core.excerpt(text, ['needle'], 80);
  assert.ok(piece.includes('needle'));
  assert.ok(piece.length <= 90, `${piece.length}`);
  assert.ok(piece.startsWith('…') && piece.endsWith('…'));
  assert.equal(core.excerpt('short text', ['short'], 80), 'short text');
});

test('a word in the title is worth more than the same word in the text', () => {
  const small = core.prepare({ documents: [
    doc('TOPIC', 'topic:B', 'Overview of motion', { text: 'friction and a ball' }),
    doc('QUESTION', 'question:A', 'Friction on a slope', { text: 'Friction on a slope with a ball' }),
  ] });
  assert.deepEqual(ids(core.search(small, 'friction ball')), ['question:A', 'topic:B'], 'friction in the title, ball in the text beats both in the text, though a topic is favoured');
});

test('an id typed whole outranks pages that merely have its parts in their titles', () => {
  const small = core.prepare({ documents: [
    doc('TOPIC', 'topic:OVERVIEW', 'Q 1 overview'),
    doc('QUESTION', 'question:Q-1', 'A long stem that says nothing of its id', { text: 'A long stem that says nothing of its id Q-1' }),
  ] });
  assert.equal(core.search(small, 'Q-1').results[0].doc.id, 'question:Q-1');
});
