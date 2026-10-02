from pathlib import Path
import re

p = Path('tests/test_pr375_u2_standalone.py')
s = p.read_text(encoding='utf-8')

# Replace the generated matcher as a whole. Only URL-bearing/navigation attributes belong
# here; generic data-g9-* values are application state, not filesystem paths.
s, attr_n = re.subn(
    r'(?m)^ATTR=.*$',
    r'''ATTR=re.compile(r"\b(?:href|src|action|poster)=[\"']([^\"']+)[\"']",re.I); IDS=re.compile(r"\bid=[\"']([^\"']+)[\"']",re.I); REMOTE=re.compile(r"<(?:script|link|img|iframe|source|embed|object|video|audio)\b[^>]*(?:src|href|data|poster)=[\"']https?://",re.I)''',
    s,
    count=1,
)
if attr_n != 1:
    raise SystemExit(f'expected one ATTR matcher line, replaced {attr_n}')

# Raw HTML templates can legitimately repeat IDs that are inert until cloned. The U2 defect
# was one concrete duplicate in the live 2D master DOM; assert that source defect directly.
s, n = re.subn(
    r' def test_duplicate_ids\(self\):\n(?:  .*\n)+?(?= def test_root_legacy_links_gone)',
    ' def test_duplicate_ids(self):\n'
    '  p=ROOT/"standalone/practice/motion-in-2d-master-suite.html"\n'
    '  s=p.read_text(encoding="utf-8")\n'
    '  self.assertEqual(1,s.count(\'id="sbTeacherChalk"\'))\n',
    s,
    count=1,
)
if n != 1:
    raise SystemExit(f'expected one duplicate-id test block, replaced {n}')

p.write_text(s, encoding='utf-8')
print('patched generated U2 regression: URL attributes only; concrete duplicate-id assertion')
