from fractions import Fraction
from pathlib import Path
import re
import unittest

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "standalone/stress-test/polynomials"
EXPLORER = ROOT / "concept-explorer.html"
CLINICS = ROOT / "question-clinics.html"


def poly_eval(coeffs, x):
    v = Fraction(0)
    for c in coeffs:
        v = v * x + Fraction(c)
    return v


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
    def test_non_monic_explorer_regression(self):
        P = [3, -5, 7, -2]
        D = [2, -1]
        Q = [Fraction(3, 2), Fraction(-7, 4), Fraction(21, 8)]
        R = [Fraction(5, 8)]
        self.assertEqual(poly_add(poly_mul(D, Q), R), list(map(Fraction, P)))
        self.assertEqual(poly_eval(P, Fraction(1, 2)), Fraction(5, 8))

    def test_hots_prime_values(self):
        def f(x):
            return x**3 - 8*x**2 + 20*x - 13
        self.assertEqual(
            [x for x in range(1, 50) if f(x) > 1 and all(f(x) % d for d in range(2, int(f(x) ** 0.5) + 1))],
            [2, 3, 4],
        )
        for x in range(1, 20):
            self.assertEqual(f(x), (x - 1) * (x*x - 7*x + 13))

    def test_hots_quadratic_divisor_parameters(self):
        a, b = -19, -15
        def p(x):
            return 2*x**4 - x**3 - 7*x**2 + a*x + b
        self.assertEqual(p(3), 0)
        self.assertEqual(p(-1), 0)
        self.assertEqual(a + b, -34)

    def test_cyclic_fraction_identity(self):
        for raw in [(5, 2, -1), (7, -3, 1), (Fraction(3, 2), Fraction(-1, 2), 4)]:
            a, b, c = map(Fraction, raw)
            lhs = ((a-b)**2 / ((b-c)*(c-a))
                   + (b-c)**2 / ((c-a)*(a-b))
                   + (c-a)**2 / ((a-b)*(b-c)))
            self.assertEqual(lhs, Fraction(3))

    def test_hidden_perfect_square(self):
        for x, y, z in [(2, 1, 0), (-5, 2, 3), (7, -1, 4)]:
            lhs = x*x + 4*y*y + 9*z*z - 4*x*y - 12*y*z + 6*x*z
            self.assertEqual(lhs, (x - 2*y + 3*z)**2)


class SurfaceContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.explorer = EXPLORER.read_text(encoding="utf-8")
        cls.clinics = CLINICS.read_text(encoding="utf-8")

    def test_exact_selected_clinic_ids_and_no_routine_archive_q11(self):
        expected = {
            "Q-MAT-09-POL-P05-HOTS-01",
            "Q-MAT-09-POL-P06-HOTS-14",
            "Q-MAT-09-POL-P03-SC-08",
            "Q-MAT-09-POL-P09-ARC-21",
        }
        present = set(re.findall(r"id:'(Q-MAT-09-POL-[^']+)'", self.clinics))
        self.assertEqual(present, expected)
        self.assertNotIn("Q-MAT-09-POL-P08-ARC-11", self.clinics)

    def test_math_truth_path_has_no_float_or_epsilon_correctness(self):
        self.assertNotIn("parseFloat(", self.explorer)
        self.assertNotIn("Math.abs(", self.explorer)
        self.assertNotRegex(self.explorer, r"1e-\d+")
        self.assertIn("BigInt", self.explorer)
        self.assertIn("toNumber()", self.explorer)  # geometry only

    def test_explorer_has_linked_representation_and_explanation_gate(self):
        self.assertIn("Polynomial graph with divisor root and exact remainder height", self.explorer)
        self.assertIn("Formalise the relationship", self.explorer)
        self.assertIn("exact remainder R", self.explorer)
        self.assertIn("factor exactly when the exact remainder is 0", self.explorer)

    def test_clinic_attempt_gate_builds_support_dynamically(self):
        self.assertIn("renderPost(host,item)", self.clinics)
        self.assertIn("Write a genuine first decision before support unlocks", self.clinics)
        self.assertNotIn('style="display:none', self.clinics)
        self.assertIn("Show next support step", self.clinics)
        self.assertIn("Inspect one plausible wrong route", self.clinics)

    def test_touch_navigation_and_offline_contract(self):
        for page in (self.explorer, self.clinics):
            self.assertRegex(page, r"min-height:\s*48px")
            self.assertRegex(page, r"min-width:\s*48px")
            self.assertIn(":focus-visible", page)
            self.assertIn("Back to Core2", page)
            self.assertIn("Stress-test / app home", page)
            self.assertIsNone(re.search(r"(?:src|href)=[\"']https?://", page, re.I))
        self.assertIn("?source_question=", self.clinics)


if __name__ == "__main__":
    unittest.main()
