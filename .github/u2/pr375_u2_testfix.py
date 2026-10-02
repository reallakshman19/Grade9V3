from pathlib import Path
import re

p = Path('tests/test_pr375_u2_standalone.py')
s = p.read_text(encoding='utf-8')

# Only URL-bearing/navigation attributes belong in this resolver. Generic data-g9-* values
# are application state, not paths.
s = s.replace('(?:href|src|action|poster|data)', '(?:href|src|action|poster)')

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
print('patched generated U2 regression: navigable refs only; concrete duplicate-id assertion')
