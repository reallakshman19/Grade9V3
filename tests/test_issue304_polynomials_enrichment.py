from fractions import Fraction
from pathlib import Path
import re
import unittest

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "standalone/stress-test/polynomials"
EXPLORER = ROOT / "remainder-factor-structure-lab.html"
CLINICS = ROOT / "question-clinic-prototype.html"


def poly_eval(coeffs, x):
    value = Fraction(0)
    for coefficient in coeffs:
        value = value * x + Fraction(coefficient)
    return value


def poly_mul(a, b):
    out = [Fraction(0)] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            out[i + j] += Fraction(x) * Fraction(y)
    return out


def poly_add(a, b):
    n = max(len(a), len(b))
    a = [Fraction(0)] * (n - len(a)) + list(map(Fraction, a))
    b = [Fraction(0)] * (n - len(b)) + list(map(Fraction, b))
    return [x + y for x, y in zip(a, b)]


class ExactMathWitnesses(unittest.TestCase):
    def test_non_monic_divisor_regression(self):
        # P = (2x-1)Q + R exactly. This is the prior-art case whose synthetic
        # quotient was not scaled from x-1/2 to the actual divisor 2x-1.
        P = [3, -5, 7, -2]
        D = [2, -1]
        Q = [Fraction(3, 2), Fraction(-7, 4), Fraction(21, 8)]
        R = [Fraction(5, 8)]
        self.assertEqual(poly_add(poly_mul(D, Q), R), list(map(Fraction, P)))
        self.assertEqual(poly_eval(P, Fraction(1, 2)), Fraction(5, 8))

    def test_quadratic_divisor_remainder_conditions(self):
        # R(x)=mx+n is fixed by the two root conditions.
        m = Fraction(3)
        n = Fraction(2)
        self.assertEqual(m * 1 + n, 5)
        self.assertEqual(m * -2 + n, -4)

    def test_zero_sum_cube_identity_fixture(self):
        a, b, c = -12, 7, 5
        self.assertEqual(a + b + c, 0)
        self.assertEqual(a**3 + b**3 + c**3, 3 * a * b * c)
        self.assertEqual(3 * a * b * c, -1260)


class SurfaceContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.explorer = EXPLORER.read_text(encoding="utf-8")
        cls.clinics = CLINICS.read_text(encoding="utf-8")

    def test_expected_files_and_source_lock_labels_exist(self):
        for path in (EXPLORER, CLINICS):
            self.assertTrue(path.exists(), path)
        self.assertIn("source-independent prototype", self.explorer)
        self.assertIn("AUTHORED VALIDATION FIXTURE — NOT SOURCE", self.clinics)
        self.assertIn("Do not promote these stems into Core2", self.clinics)

    def test_math_truth_path_has_no_float_or_epsilon_comparison(self):
        joined = self.explorer
        self.assertNotIn("parseFloat(", joined)
        self.assertNotIn("Math.abs(", joined)
        self.assertNotRegex(joined, r"1e-\d+")
        self.assertIn("BigInt", self.explorer)

    def test_standalone_navigation_is_present(self):
        for page in (self.explorer, self.clinics):
            self.assertIn("Back to Core2", page)
            self.assertIn("Stress-test / app home", page)
            self.assertIn('../../../public/core-learning/index.html', page)
            self.assertIn('../../../public/index.html', page)

    def test_primary_target_floor_is_declared(self):
        for page in (self.explorer, self.clinics):
            self.assertRegex(page, r"min-height:\s*48px")
            self.assertRegex(page, r"min-width:\s*48px")
            self.assertIn(":focus-visible", page)

    def test_clinic_attempt_gate_builds_post_attempt_dom_dynamically(self):
        self.assertIn("renderPostAttempt(post,item)", self.clinics)
        self.assertIn("Write a genuine first decision before support unlocks", self.clinics)
        self.assertNotIn('style="display:none', self.clinics)

    def test_no_external_runtime_urls(self):
        url_pattern = re.compile(r"(?:src|href)=[\"']https?://", re.I)
        self.assertIsNone(url_pattern.search(self.explorer))
        self.assertIsNone(url_pattern.search(self.clinics))


if __name__ == "__main__":
    unittest.main()
