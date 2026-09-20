import shutil
import subprocess
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]


class WorkbenchRuntimeNodeTests(unittest.TestCase):
    def test_node_runtime_contract(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node is required by existing browser-runtime CI and the workbench contract tests")
        result = subprocess.run(
            [node, "--test", str(REPO / "tests/workbench_runtime.test.mjs")],
            cwd=REPO,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout)


if __name__ == "__main__":
    unittest.main()
