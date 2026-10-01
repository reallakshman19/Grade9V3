import unittest
from pathlib import Path
try:
    from Shared.tools.authoring_quality_gate import load_validator, check_library_file
    HAS_JSONSCHEMA = True
except ImportError:
    HAS_JSONSCHEMA = False

REPO = Path(__file__).resolve().parent.parent

class TestAuthoringQualityGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not HAS_JSONSCHEMA:
            raise unittest.SkipTest("jsonschema not installed in runtime environment")
        cls.validator = load_validator()
        cls.target_libraries = [
            REPO / "Physics/library/phy-kin-2d-motion.v1.json",
            REPO / "Physics/library/phy-kin-1d-motion.v1.json",
            REPO / "Physics/library/phy-vec-add-sub.v1.json",
            REPO / "Physics/library/phy-nlm-first-law.v1.json",
        ]

    def test_registered_physics_libraries_pass_authoring_quality_gate(self):
        for lib in self.target_libraries:
            self.assertTrue(lib.exists(), f"Library file missing: {lib}")
            q_count, issues = check_library_file(lib, self.validator)
            self.assertGreater(q_count, 0, f"Library has no questions: {lib}")
            self.assertEqual(issues, [], f"Authoring quality issues found in {lib.name}: {issues[:5]}")

if __name__ == "__main__":
    unittest.main()
