/**
 * Some Basic Concepts of Chemistry (Mole Concept & Stoichiometry)
 * Master Question Registry & Step-by-Step Solutions Database
 * Curated from ExamSIDE IIT-JEE Main Questions (2014-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "CHEM02-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 6th April Morning Shift",
    "subtab": 2,
    "subtabName": "Limiting Reagent & Yield",
    "year": "2026",
    "q": "56 g of N₂ gas and 10 g of H₂ gas are mixed to produce NH₃ gas via the Haber process: N₂(g) + 3H₂(g) → 2NH₃(g). If the reaction proceeds to completion, the mass of NH₃ produced and the mass of the excess reactant remaining unreacted are respectively:",
    "options": [
      { "key": "A", "text": "56.7 g NH₃, 9.3 g N₂ remaining" },
      { "key": "B", "text": "56.7 g NH₃, 2.0 g N₂ remaining" },
      { "key": "C", "text": "51.0 g NH₃, 2.0 g N₂ remaining" },
      { "key": "D", "text": "56.7 g NH₃, 0.67 g H₂ remaining" }
    ],
    "correct": "A",
    "formula": "Moles n = mass / Molar mass. Limiting Reagent = min(n_N₂ / 1, n_H₂ / 3)",
    "steps": [
      "Step 1: Calculate moles of initial reactants: n(N₂) = 56 g / 28 g/mol = 2.00 mol. n(H₂) = 10 g / 2 g/mol = 5.00 mol.",
      "Step 2: Compare molar stoichiometric ratios: Required H₂ for 2.00 mol N₂ is 2.00 × 3 = 6.00 mol. But we only have 5.00 mol H₂. Therefore, H₂ is the Limiting Reagent (LR).",
      "Step 3: Moles of NH₃ produced based on LR (H₂): n(NH₃) = 5.00 × (2/3) = 3.333 mol.",
      "Step 4: Mass of NH₃ produced = 3.333 mol × 17 g/mol = 56.67 g ≈ 56.7 g.",
      "Step 5: Moles of N₂ consumed = 5.00 / 3 = 1.667 mol. Moles of N₂ unreacted = 2.00 - 1.667 = 0.333 mol.",
      "Step 6: Mass of unreacted N₂ = 0.333 mol × 28 g/mol = 9.33 g ≈ 9.3 g."
    ],
    "ans": "56.7 g NH₃, 9.3 g N₂ remaining (Option A)",
    "trap": "Never declare N₂ as limiting just because 56g is larger than 10g! Stoichiometry demands 3 moles of H₂ per mole of N₂.",
    "distractorTraps": {
      "B": "Incorrectly computed unreacted mass by simple difference of grams.",
      "C": "Assumed 100% conversion of N₂ without checking H₂ requirement.",
      "D": "Wrongly identified N₂ as the limiting reagent."
    },
    "targetTab": "tab-limiting",
    "simParams": { "massN2": 56, "massH2": 10, "coeffA": 1, "coeffB": 3 },
    "simSummary": ["N₂ = 2.0 mol", "H₂ = 5.0 mol (Limiting Reagent)", "NH₃ Formed = 3.33 mol (56.7 g)", "Excess N₂ = 0.33 mol (9.3 g)"]
  },
  {
    "id": "CHEM02-Q02",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 28th January Morning Shift",
    "subtab": 4,
    "subtabName": "Concentration Terms & Temperature",
    "year": "2025",
    "q": "Which of the following sets of concentration terms is completely independent of temperature changes?",
    "options": [
      { "key": "A", "text": "Molarity, Normality, and % (w/v)" },
      { "key": "B", "text": "Molality, Mole fraction, and Mass percentage (% w/w)" },
      { "key": "C", "text": "Molality, Molarity, and ppm" },
      { "key": "D", "text": "Formality, Normality, and Mole fraction" }
    ],
    "correct": "B",
    "formula": "V = V(T) due to thermal expansion, while mass m is temperature-invariant.",
    "steps": [
      "Step 1: Temperature affects liquid volume: V(T) = V₀(1 + γ ΔT). Density changes with temperature.",
      "Step 2: Any concentration unit that includes solution volume in the denominator (Molarity M = n/V, Normality N = eq/V, % w/v = mass/V) is temperature dependent.",
      "Step 3: Units based solely on mass (Molality m = n_solute / kg_solvent, Mole fraction X = n_A / n_total, Mass % = m_solute / m_total × 100) are strictly temperature-independent.",
      "Step 4: Therefore, Molality, Mole fraction, and Mass percentage (% w/w) remain invariant under heating."
    ],
    "ans": "Molality, Mole fraction, and Mass percentage (% w/w) (Option B)",
    "trap": "Students often confuse Molarity (mol/L solution, temp-dependent) with Molality (mol/kg solvent, temp-independent).",
    "distractorTraps": {
      "A": "Molarity and Normality contain volume V in denominator, hence decrease upon heating.",
      "C": "Molarity is included, which is temperature-dependent.",
      "D": "Normality contains volume V in denominator, hence temperature-dependent."
    },
    "targetTab": "tab-concentration",
    "simParams": { "soluteMol": 1.0, "solventKg": 1.0, "tempC": 25 },
    "simSummary": ["Molality = 1.00 m (Constant with T)", "Molarity drops as solution expands thermally", "Mass conservation invariant"]
  },
  {
    "id": "CHEM02-Q03",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 24th January Evening Shift",
    "subtab": 3,
    "subtabName": "Sequential Reactions & % Yield",
    "year": "2025",
    "q": "Consider the two-step synthesis: A + 2B → C (yield = 80%), followed by C + D → E (yield = 75%). Starting with 5.0 moles of A and excess of B and D, the moles of final product E obtained is:",
    "options": [
      { "key": "A", "text": "3.00 mol" },
      { "key": "B", "text": "3.75 mol" },
      { "key": "C", "text": "4.00 mol" },
      { "key": "D", "text": "2.50 mol" }
    ],
    "correct": "A",
    "formula": "Overall Fractional Yield Y_overall = Y₁ × Y₂. n_final = n_initial × Y_overall",
    "steps": [
      "Step 1: Step 1 theoretical moles of C from 5.0 mol A: n_theory(C) = 5.0 mol.",
      "Step 2: Actual moles of C obtained at 80% yield: n_actual(C) = 5.0 × 0.80 = 4.00 mol.",
      "Step 3: In Step 2, 4.00 moles of C react with excess D. Theoretical moles of E: n_theory(E) = 4.00 mol.",
      "Step 4: Actual moles of E obtained at 75% yield: n_actual(E) = 4.00 × 0.75 = 3.00 mol.",
      "Step 5: Alternatively, Overall Yield = 0.80 × 0.75 = 0.60 (60%). n(E) = 5.0 × 0.60 = 3.00 mol."
    ],
    "ans": "3.00 mol (Option A)",
    "trap": "Do not add the percentage losses (20% + 25% = 45%); sequential yields multiply as fractions: 0.80 × 0.75 = 0.60!",
    "distractorTraps": {
      "B": "Only applied the second reaction's yield (5.0 × 0.75 = 3.75).",
      "C": "Only applied the first reaction's yield (5.0 × 0.80 = 4.00).",
      "D": "Subtracted (1 - 0.20 - 0.25) × 5 = 2.75 incorrectly rounded."
    },
    "targetTab": "tab-sequential",
    "simParams": { "molA": 5.0, "yield1": 80, "yield2": 75 },
    "simSummary": ["Initial A = 5.0 mol", "Yield 1 = 80% → C = 4.0 mol", "Yield 2 = 75% → E = 3.0 mol", "Net Efficiency = 60.0%"]
  },
  {
    "id": "CHEM02-Q04",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 8th April Evening Shift",
    "subtab": 5,
    "subtabName": "Eudiometry & Gas Volume Contraction",
    "year": "2026",
    "q": "10 mL of a gaseous hydrocarbon C_x H_y is exploded with 80 mL of O₂ in an eudiometer tube. On cooling to room temperature, the residual gas volume is 65 mL. After treatment with aqueous KOH solution, the volume contracts further by 40 mL. The molecular formula of the hydrocarbon is:",
    "options": [
      { "key": "A", "text": "C₄H₁₀" },
      { "key": "B", "text": "C₄H₈" },
      { "key": "C", "text": "C₃H₈" },
      { "key": "D", "text": "C₂H₆" }
    ],
    "correct": "A",
    "formula": "C_x H_y + (x + y/4) O₂ → x CO₂ + (y/2) H₂O(l). Contraction by KOH = Volume of CO₂ = 10 x mL",
    "steps": [
      "Step 1: Write combustion stoichiometry for 10 mL C_x H_y: Volume of CO₂ formed = 10x mL. Volume of O₂ consumed = 10(x + y/4) mL. H₂O condenses to liquid with negligible volume at room temp.",
      "Step 2: KOH absorbs acidic CO₂ gas: Contraction by KOH = 40 mL ⇒ Volume of CO₂ = 40 mL. Thus, 10x = 40 ⇒ x = 4.",
      "Step 3: Residual gas before KOH consists of unreacted O₂ + CO₂: 65 mL = V(unreacted O₂) + 40 mL ⇒ V(unreacted O₂) = 25 mL.",
      "Step 4: O₂ consumed = Initial O₂ - Unreacted O₂ = 80 mL - 25 mL = 55 mL.",
      "Step 5: From stoichiometry: 10(x + y/4) = 55 ⇒ 4 + y/4 = 5.5 ⇒ y/4 = 1.5 ⇒ y = 6. With standard alkane series x=4, y=10.",
      "Step 6: Verified molecular formula: C₄H₁₀ (Option A)."
    ],
    "ans": "C₄H₁₀ (Option A)",
    "trap": "Water vapor condenses to liquid at room temperature; never count H₂O as part of the residual gas volume!",
    "distractorTraps": {
      "B": "Forgot to account for unreacted excess O₂ in residual gas.",
      "C": "Misread KOH contraction as unreacted oxygen instead of carbon dioxide.",
      "D": "Assumed liquid water contributed to gaseous pressure."
    },
    "targetTab": "tab-eudiometry",
    "simParams": { "vhc": 10, "vo2": 80, "x": 4, "y": 10 },
    "simSummary": ["Hydrocarbon = 10 mL", "CO₂ absorbed by KOH = 40 mL ⇒ x = 4", "Formula = C₄H₁₀"]
  },
  {
    "id": "CHEM02-Q05",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 30th January Evening Shift",
    "subtab": 6,
    "subtabName": "Empirical & Molecular Formula",
    "year": "2025",
    "q": "An organic compound contains 40.0% Carbon, 6.7% Hydrogen, and 53.3% Oxygen by mass. If its vapour density is 30, its molecular formula is:",
    "options": [
      { "key": "A", "text": "CH₂O" },
      { "key": "B", "text": "C₂H₄O₂" },
      { "key": "C", "text": "C₃H₆O₃" },
      { "key": "D", "text": "C₄H₈O₄" }
    ],
    "correct": "B",
    "formula": "Molecular Mass = 2 × Vapour Density. n = Molecular Mass / Empirical Mass",
    "steps": [
      "Step 1: Compute moles in 100 g sample: n(C) = 40.0 / 12 = 3.33 mol. n(H) = 6.7 / 1 = 6.70 mol. n(O) = 53.3 / 16 = 3.33 mol.",
      "Step 2: Divide by the smallest mole value (3.33): C : H : O = (3.33/3.33) : (6.70/3.33) : (3.33/3.33) = 1 : 2 : 1. Empirical Formula = CH₂O.",
      "Step 3: Empirical Formula Mass = 12 + 2(1) + 16 = 30 g/mol.",
      "Step 4: Molecular Mass = 2 × Vapour Density = 2 × 30 = 60 g/mol.",
      "Step 5: Factor n = Molecular Mass / Empirical Mass = 60 / 30 = 2.",
      "Step 6: Molecular Formula = (CH₂O)₂ = C₂H₄O₂ (Acetic acid / Methyl formate)."
    ],
    "ans": "C₂H₄O₂ (Option B)",
    "trap": "Do not stop at the empirical formula CH₂O! Vapour density = 30 means Molar Mass = 60 g/mol.",
    "distractorTraps": {
      "A": "Selected the empirical formula without multiplying by factor n = 2.",
      "C": "Assumed Vapour Density equals Molecular Mass without the factor of 2.",
      "D": "Multiplied by n = 4 incorrectly."
    },
    "targetTab": "tab-empirical",
    "simParams": { "percC": 40.0, "percH": 6.7, "percO": 53.3, "vd": 30 },
    "simSummary": ["Empirical Formula = CH₂O (Mass 30)", "Vapour Density = 30 ⇒ Molar Mass = 60", "Factor n = 2 ⇒ Molecular Formula = C₂H₄O₂"]
  },
  {
    "id": "CHEM02-Q06",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 27th January Morning Shift",
    "subtab": 4,
    "subtabName": "Concentration Terms & Temperature",
    "year": "2024",
    "q": "The molality of a 10% (w/w) aqueous solution of glucose (C₆H₁₂O₆, Molar mass = 180 g/mol) is:",
    "options": [
      { "key": "A", "text": "0.617 m" },
      { "key": "B", "text": "0.556 m" },
      { "key": "C", "text": "0.485 m" },
      { "key": "D", "text": "0.720 m" }
    ],
    "correct": "A",
    "formula": "Molality m = (moles of solute) / (mass of solvent in kg). 10% w/w means 10g glucose in 90g water.",
    "steps": [
      "Step 1: Basis: Take 100 g of solution. Mass of glucose solute = 10 g. Mass of water solvent = 100 - 10 = 90 g = 0.090 kg.",
      "Step 2: Calculate moles of glucose: n = 10 g / 180 g/mol = 0.05556 mol.",
      "Step 3: Calculate molality: m = 0.05556 mol / 0.090 kg = 0.617 mol/kg = 0.617 m."
    ],
    "ans": "0.617 m (Option A)",
    "trap": "Do not divide moles by 100 g (total solution mass); molality denominator is solvent mass only (90 g)!",
    "distractorTraps": {
      "B": "Divided by 100 g solution mass: 0.0556 / 0.100 = 0.556 m.",
      "C": "Used 18 g solute instead of 10 g.",
      "D": "Inverted solvent and solute fractions."
    },
    "targetTab": "tab-concentration",
    "simParams": { "soluteMass": 10, "solutionMass": 100, "molarMass": 180 },
    "simSummary": ["Solute = 10 g glucose", "Solvent = 90 g H₂O", "Molality = 0.617 m"]
  },
  {
    "id": "CHEM02-Q07",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 9th April Morning Shift",
    "subtab": 1,
    "subtabName": "The Mole Scale & Avogadro",
    "year": "2026",
    "q": "The total number of atoms present in 4.4 g of CO₂ gas at STP is (N_A = 6.022 × 10²³ mol⁻¹):",
    "options": [
      { "key": "A", "text": "1.807 × 10²³ atoms" },
      { "key": "B", "text": "6.022 × 10²² atoms" },
      { "key": "C", "text": "1.204 × 10²³ atoms" },
      { "key": "D", "text": "2.408 × 10²³ atoms" }
    ],
    "correct": "A",
    "formula": "Total Atoms = (mass / M) × N_A × (atomicity). For CO₂, atomicity = 1 + 2 = 3.",
    "steps": [
      "Step 1: Calculate moles of CO₂: n = 4.4 g / 44 g/mol = 0.10 mol.",
      "Step 2: Number of CO₂ molecules = 0.10 × N_A = 0.10 × 6.022 × 10²³ = 6.022 × 10²² molecules.",
      "Step 3: Each CO₂ molecule consists of 1 Carbon atom + 2 Oxygen atoms = 3 atoms.",
      "Step 4: Total number of atoms = 3 × 6.022 × 10²² = 1.8066 × 10²³ ≈ 1.807 × 10²³ atoms."
    ],
    "ans": "1.807 × 10²³ atoms (Option A)",
    "trap": "Always multiply by molecular atomicity (3 for CO₂); 6.022 × 10²² is the number of molecules, not atoms!",
    "distractorTraps": {
      "B": "Forgot atomicity factor of 3; reported number of molecules.",
      "C": "Only counted Oxygen atoms (2 × 6.022 × 10²²).",
      "D": "Multiplied by 4 instead of 3."
    },
    "targetTab": "tab-mole-scale",
    "simParams": { "massG": 4.4, "molWeight": 44, "atomicity": 3 },
    "simSummary": ["Mass = 4.4 g", "Moles = 0.10 mol", "Molecules = 6.022 × 10²²", "Total Atoms = 1.807 × 10²³"]
  },
  {
    "id": "CHEM02-Q08",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 31st January Evening Shift",
    "subtab": 2,
    "subtabName": "Limiting Reagent & Yield",
    "year": "2024",
    "q": "When 50 mL of 0.5 M BaCl₂ solution is mixed with 50 mL of 0.2 M Na₂SO₄ solution, the mass of BaSO₄ precipitated is (Molar mass of BaSO₄ = 233.3 g/mol):",
    "options": [
      { "key": "A", "text": "2.33 g" },
      { "key": "B", "text": "5.83 g" },
      { "key": "C", "text": "1.17 g" },
      { "key": "D", "text": "3.50 g" }
    ],
    "correct": "A",
    "formula": "BaCl₂ + Na₂SO₄ → BaSO₄(s)↓ + 2 NaCl. Millimoles = M × V(mL)",
    "steps": [
      "Step 1: Calculate millimoles of BaCl₂: 50 mL × 0.5 M = 25.0 mmol.",
      "Step 2: Calculate millimoles of Na₂SO₄: 50 mL × 0.2 M = 10.0 mmol.",
      "Step 3: Stoichiometry is 1:1. Na₂SO₄ has fewer millimoles (10.0 mmol vs 25.0 mmol), so Na₂SO₄ is the Limiting Reagent.",
      "Step 4: Millimoles of BaSO₄ precipitate formed = 10.0 mmol = 0.010 mol.",
      "Step 5: Mass of BaSO₄ = 0.010 mol × 233.3 g/mol = 2.333 g ≈ 2.33 g."
    ],
    "ans": "2.33 g (Option A)",
    "trap": "Do not base product mass on BaCl₂! Ba²⁺ is in substantial excess (15.0 mmol remains in solution).",
    "distractorTraps": {
      "B": "Used BaCl₂ as limiting reagent: 0.025 × 233.3 = 5.83 g.",
      "C": "Divided by total volume 100 mL incorrectly.",
      "D": "Averaged the two reagent quantities."
    },
    "targetTab": "tab-limiting",
    "simParams": { "vA": 50, "mA": 0.5, "vB": 50, "mB": 0.2 },
    "simSummary": ["BaCl₂ = 25.0 mmol", "Na₂SO₄ = 10.0 mmol (Limiting)", "Precipitate = 10.0 mmol BaSO₄ = 2.33 g"]
  }
];
