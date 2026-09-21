import os
import shutil
import subprocess
import unittest
from pathlib import Path

from Shared.tools import build_core_learning_data, build_core_learning_runtime, build_manifest

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

    def test_core_learning_page_contract(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node is required by the Core learner page contract tests")
        result = subprocess.run(
            [node, "--test", str(REPO / "tests/core_learning_page.test.mjs")],
            cwd=REPO,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_core_learning_host_contract(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node is required by the Core learner host contract tests")
        result = subprocess.run(
            [node, "--test", str(REPO / "tests/core_learning_host.test.mjs")],
            cwd=REPO,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_real_browser_contract(self):
        node = shutil.which("node")
        self.assertIsNotNone(node, "Node is required by the workbench browser contract test")
        configured = os.environ.get("CHROMEWEBDRIVER")
        driver = None
        if configured:
            candidate = Path(configured)
            if candidate.is_file():
                driver = candidate
            elif (candidate / "chromedriver").is_file():
                driver = candidate / "chromedriver"
        if driver is None:
            executable = shutil.which("chromedriver")
            driver = Path(executable) if executable else None
        if driver is None:
            if os.environ.get("GITHUB_ACTIONS") == "true":
                self.fail("GitHub Actions browser proof requires the runner ChromeDriver")
            self.skipTest("ChromeDriver is not available in this local environment")

        result = subprocess.run(
            [node, "--test", str(REPO / "tests/workbench_browser.test.mjs")],
            cwd=REPO,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_public_core_learning_data_is_bounded_and_generated(self):
        payload = build_core_learning_data.build()
        rows = payload["core_projections"]
        self.assertEqual(
            [row["id"] for row in rows],
            [
                "Physics:CORE1A:MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
                "Physics:CORE1B:MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
            ],
        )
        self.assertEqual(
            rows[1]["projection"]["concept"]["elicitation"]["prompt"],
            "If x and y components are independent, does that mean the object has two different clocks?",
        )
        self.assertEqual(
            (REPO / "public/core-learning/data.js").read_bytes(),
            build_core_learning_data.rendered_file()["public/core-learning/data.js"],
        )

    def test_core_learning_selection_is_subject_owned(self):
        self.assertFalse(
            (REPO / "Shared/workbench/core-learning-public-selection.json").exists()
        )
        selections = [
            path.relative_to(REPO).as_posix()
            for path in build_core_learning_data.selection_paths()
        ]
        self.assertEqual(selections, ["Physics/content/core-learning-proof.json"])

    def test_public_core_learning_runtime_is_generated_from_shared(self):
        rendered = build_core_learning_runtime.render()
        self.assertEqual(
            set(rendered),
            {
                "public/js/core-learning/runtime.mjs",
                "public/js/core-learning/semantic-workbench.mjs",
                "public/js/core-learning/core-learning-page.mjs",
                "public/js/core-learning/core-learning-host.mjs",
            },
        )
        for relative, expected in rendered.items():
            with self.subTest(path=relative):
                self.assertEqual((REPO / relative).read_bytes(), expected)

    def test_manifest_classifies_workbench_es_modules(self):
        runtime = REPO / "Shared/workbench/runtime.mjs"
        role = build_manifest.classify(runtime)
        self.assertIsNotNone(role)
        self.assertEqual(role[0], "WEB_RUNTIME")
        self.assertIn("Shared/workbench/runtime.mjs", {row["path"] for row in build_manifest.collect()["components"]})


if __name__ == "__main__":
    unittest.main()
