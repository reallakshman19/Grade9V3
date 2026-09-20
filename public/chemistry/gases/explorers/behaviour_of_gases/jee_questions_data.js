/**
 * Behaviour of Gases (Gaseous State & Real Gases)
 * Master Question Registry & Step-by-Step Solutions Database
 * Curated from ExamSIDE IIT-JEE Main Questions (2013-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "GAS-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 4th April Morning Shift",
    "subtab": 4,
    "subtabName": "Compressibility Factor Z vs P",
    "year": "2026",
    "q": "For one mole of a van der Waals gas at low pressure, the compressibility factor Z is expressed as:",
    "options": [
      { "key": "A", "text": "Z = 1 - a / (R T V_m)" },
      { "key": "B", "text": "Z = 1 + P b / (R T)" },
      { "key": "C", "text": "Z = 1 + a / (R T V_m)" },
      { "key": "D", "text": "Z = 1 - P b / (R T)" }
    ],
    "correct": "A",
    "formula": "(P + a/V_m²)(V_m - b) = R T. At low pressure, V_m >> b ⇒ V_m - b ≈ V_m",
    "steps": [
      "Step 1: Start from the van der Waals equation for 1 mole: (P + a/V_m²)(V_m - b) = RT.",
      "Step 2: At low pressure, the molar volume V_m is very large compared to the molecular excluded volume b: (V_m - b) ≈ V_m.",
      "Step 3: The equation reduces to: (P + a/V_m²) V_m = RT ⇒ P V_m + a / V_m = RT.",
      "Step 4: Divide both sides by RT: (P V_m) / (RT) + a / (RT V_m) = 1.",
      "Step 5: Since Z = (P V_m) / (RT), we obtain: Z = 1 - a / (RT V_m).",
      "Step 6: Since a, R, T, V_m > 0, Z < 1 at low to moderate pressures due to predominant attractive forces!"
    ],
    "ans": "Z = 1 - a / (R T V_m) (Option A)",
    "trap": "Option B applies at very HIGH pressure (where repulsive forces dominate and excluded volume b cannot be neglected)!",
    "distractorTraps": {
      "B": "This is the high-pressure approximation where P(V - b) = RT ⇒ Z = 1 + Pb/RT.",
      "C": "Sign error: attractive forces decrease effective pressure, leading to Z < 1, not Z > 1.",
      "D": "Inverted both sign and volume correction."
    },
    "targetTab": "tab-compressibility",
    "simParams": { "pressMode": "low", "constA": 4.17, "constB": 0.037, "tempK": 300 },
    "simSummary": ["Low Pressure Regime", "V_m >> b ⇒ (V_m - b) ≈ V_m", "Z = 1 - a/(RTV_m) < 1", "Attractive Forces Dominant"]
  },
  {
    "id": "GAS-Q02",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 29th January Evening Shift",
    "subtab": 5,
    "subtabName": "Critical Constants & Liquefaction",
    "year": "2025",
    "q": "The van der Waals constant 'a' for four gases are: Gas W = 4.17, Gas X = 0.244, Gas Y = 1.36, and Gas Z = 2.25 (in atm L² mol⁻²). The gas that can be most easily liquefied is:",
    "options": [
      { "key": "A", "text": "Gas W" },
      { "key": "B", "text": "Gas X" },
      { "key": "C", "text": "Gas Y" },
      { "key": "D", "text": "Gas Z" }
    ],
    "correct": "A",
    "formula": "Critical Temperature T_c = 8a / (27 R b). Ease of liquefaction ∝ intermolecular attraction ∝ a",
    "steps": [
      "Step 1: The van der Waals constant 'a' represents the magnitude of attractive intermolecular forces between gas molecules.",
      "Step 2: A higher value of 'a' implies stronger attractive forces, which holds gas molecules together more readily to form a liquid.",
      "Step 3: The critical temperature T_c = 8a / (27 R b). Higher 'a' results in a higher critical temperature, meaning the gas can be liquefied at higher temperatures with less cooling.",
      "Step 4: Comparing values: Gas W (a = 4.17) > Gas Z (2.25) > Gas Y (1.36) > Gas X (0.244).",
      "Step 5: Therefore, Gas W (which corresponds to NH₃) is the most easily liquefied."
    ],
    "ans": "Gas W (Option A)",
    "trap": "Do not confuse constant 'a' (attraction) with constant 'b' (molecular size / repulsion)!",
    "distractorTraps": {
      "B": "Gas X has the lowest 'a' (like He), making it the most DIFFICULT to liquefy.",
      "C": "Intermediate value chosen arbitrarily.",
      "D": "Gas Z has second highest 'a', but W is significantly higher."
    },
    "targetTab": "tab-isotherms",
    "simParams": { "constA": 4.17, "constB": 0.037, "gasName": "Gas W (NH3)" },
    "simSummary": ["Gas W: a = 4.17 atm L²/mol²", "Maximum Critical Temperature T_c", "Most easily liquefied"]
  },
  {
    "id": "GAS-Q03",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 30th January Morning Shift",
    "subtab": 2,
    "subtabName": "Maxwell-Boltzmann Speed Distribution",
    "year": "2024",
    "q": "The ratio of the most probable speed (v_mp), average speed (v_avg), and root mean square speed (v_rms) of gas molecules at temperature T is:",
    "options": [
      { "key": "A", "text": "1 : 1.128 : 1.224" },
      { "key": "B", "text": "1 : 1.224 : 1.128" },
      { "key": "C", "text": "1.224 : 1.128 : 1" },
      { "key": "D", "text": "1 : 1 : 1" }
    ],
    "correct": "A",
    "formula": "v_mp = √(2RT/M),  v_avg = √(8RT/πM),  v_rms = √(3RT/M)",
    "steps": [
      "Step 1: Write explicit formulas for molecular speeds: v_mp = √(2RT/M), v_avg = √(8RT/πM), v_rms = √(3RT/M).",
      "Step 2: Factor out √(RT/M): Ratio v_mp : v_avg : v_rms = √2 : √(8/π) : √3.",
      "Step 3: Evaluate numerical square roots: √2 ≈ 1.414. √(8/π) = √(8/3.1416) = √2.546 ≈ 1.596. √3 ≈ 1.732.",
      "Step 4: Normalize by dividing by √2 (1.414): 1.414/1.414 : 1.596/1.414 : 1.732/1.414 = 1 : 1.128 : 1.224.",
      "Step 5: Note the universal strict inequality: v_mp < v_avg < v_rms (Remember mnemonic: RAM in reverse)."
    ],
    "ans": "1 : 1.128 : 1.224 (Option A)",
    "trap": "Students frequently invert the order of v_avg and v_rms. Remember: v_rms is always the largest!",
    "distractorTraps": {
      "B": "Inverted v_avg and v_rms.",
      "C": "Reversed the ratio from highest to lowest.",
      "D": "Assumed all speed metrics are identical."
    },
    "targetTab": "tab-maxwell",
    "simParams": { "tempK": 300, "molarMass": 28 },
    "simSummary": ["v_mp = √(2RT/M)", "v_avg = √(8RT/πM)", "v_rms = √(3RT/M)", "Ratio: 1 : 1.128 : 1.224"]
  },
  {
    "id": "GAS-Q04",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 27th January Morning Shift",
    "subtab": 3,
    "subtabName": "Real Gas Constants & Excluded Volume",
    "year": "2025",
    "q": "The effective excluded volume 'b' for 1 mole of a gas having spherical molecules of radius 'r' is equal to:",
    "options": [
      { "key": "A", "text": "4 × N_A × (4/3 π r³)" },
      { "key": "B", "text": "N_A × (4/3 π r³)" },
      { "key": "C", "text": "8 × N_A × (4/3 π r³)" },
      { "key": "D", "text": "2 × N_A × (4/3 π r³)" }
    ],
    "correct": "A",
    "formula": "b = 4 × N_A × V_molecule. For a colliding pair, excluded sphere radius is 2r ⇒ volume is 8 × V_m / 2 = 4 V_m",
    "steps": [
      "Step 1: When two spherical molecules of radius r collide, the distance between their centers cannot be less than 2r.",
      "Step 2: Thus, the sphere of exclusion for a pair of molecules has radius R = 2r.",
      "Step 3: Volume of the exclusion sphere for a pair = 4/3 π (2r)³ = 8 × (4/3 π r³).",
      "Step 4: Since this exclusion sphere belongs to TWO molecules, the excluded volume PER MOLECULE = ½ × 8 × (4/3 π r³) = 4 × (4/3 π r³).",
      "Step 5: For 1 mole (N_A molecules), total excluded volume b = 4 × N_A × (4/3 π r³) = 4 × (Actual volume of molecules)."
    ],
    "ans": "4 × N_A × (4/3 π r³) (Option A)",
    "trap": "The #1 trap in Gaseous State: thinking excluded volume b is equal to the actual volume of the molecules (factor of 4 missing)!",
    "distractorTraps": {
      "B": "Assumed excluded volume equals the physical atomic volume without pair-exclusion factor of 4.",
      "C": "Forgot to divide the pair volume by 2.",
      "D": "Arbitrary factor of 2."
    },
    "targetTab": "tab-real-particle",
    "simParams": { "radius": 1.5, "factor": 4 },
    "simSummary": ["Collision Diameter = 2r", "Pair Exclusion Volume = 8 × V_m", "Excluded Volume per Molecule = 4 × V_m", "b = 4 × N_A × V_m"]
  },
  {
    "id": "GAS-Q05",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 1st February Evening Shift",
    "subtab": 6,
    "subtabName": "Graham's Law of Effusion",
    "year": "2024",
    "q": "Under identical conditions of temperature and pressure, 50 mL of gas A effuses through a pinhole in 20 seconds, while 40 mL of O₂ effuses in 40 seconds. The molar mass of gas A is:",
    "options": [
      { "key": "A", "text": "5.12 g/mol" },
      { "key": "B", "text": "12.8 g/mol" },
      { "key": "C", "text": "20.0 g/mol" },
      { "key": "D", "text": "16.0 g/mol" }
    ],
    "correct": "A",
    "formula": "Rate of effusion r = V / t.  r_A / r_O₂ = √(M_O₂ / M_A)",
    "steps": [
      "Step 1: Compute rate of effusion of gas A: r_A = 50 mL / 20 s = 2.50 mL/s.",
      "Step 2: Compute rate of effusion of O₂: r_O₂ = 40 mL / 40 s = 1.00 mL/s.",
      "Step 3: Apply Graham's Law: r_A / r_O₂ = √(M_O₂ / M_A).",
      "Step 4: Substitute values: 2.50 / 1.00 = √(32 / M_A).",
      "Step 5: Square both sides: 6.25 = 32 / M_A ⇒ M_A = 32 / 6.25 = 5.12 g/mol."
    ],
    "ans": "5.12 g/mol (Option A)",
    "trap": "Rate is Volume / Time (mL/s); do not compare times directly without normalizing for different diffused volumes!",
    "distractorTraps": {
      "B": "Inverted time ratio: (20/40) × 32 = 16 or missed squaring.",
      "C": "Compared times directly: (20/40)² × 32 = 8.",
      "D": "Assumed Gas A was methane (16 g/mol)."
    },
    "targetTab": "tab-effusion",
    "simParams": { "volA": 50, "timeA": 20, "volB": 40, "timeB": 40, "molarMassB": 32 },
    "simSummary": ["Rate A = 2.50 mL/s", "Rate O₂ = 1.00 mL/s", "Ratio = 2.50", "M_A = 32 / (2.5)² = 5.12 g/mol"]
  },
  {
    "id": "GAS-Q06",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 5th April Evening Shift",
    "subtab": 4,
    "subtabName": "Compressibility Factor Z vs P",
    "year": "2026",
    "q": "At the Boyle temperature (T_B), a real gas behaves like an ideal gas over an appreciable range of pressure. The mathematical expression for Boyle temperature in terms of van der Waals constants is:",
    "options": [
      { "key": "A", "text": "T_B = a / (R b)" },
      { "key": "B", "text": "T_B = 2a / (R b)" },
      { "key": "C", "text": "T_B = 8a / (27 R b)" },
      { "key": "D", "text": "T_B = a / (27 R b²)" }
    ],
    "correct": "A",
    "formula": "At T_B, initial slope (∂Z/∂P)_{P→0} = 0 ⇒ b - a/(RT) = 0 ⇒ T_B = a / (Rb)",
    "steps": [
      "Step 1: The virial expansion of the van der Waals equation gives: Z = 1 + (b - a/(RT))(1/V_m) + ...",
      "Step 2: For the gas to obey ideal gas behavior as P → 0, the second virial coefficient must vanish: b - a / (RT) = 0.",
      "Step 3: Solving for temperature: RT = a / b ⇒ T_B = a / (Rb).",
      "Step 4: Note related landmarks: Inversion temperature T_i = 2a / (Rb) = 2 T_B. Critical temperature T_c = 8a / (27 Rb)."
    ],
    "ans": "T_B = a / (R b) (Option A)",
    "trap": "Option B is the Inversion Temperature (T_i = 2a/Rb); Option C is the Critical Temperature (T_c = 8a/27Rb)!",
    "distractorTraps": {
      "B": "Confused with Inversion temperature T_i = 2a/(Rb).",
      "C": "Confused with Critical temperature T_c = 8a/(27Rb).",
      "D": "Confused with Critical pressure P_c = a/(27b²)."
    },
    "targetTab": "tab-compressibility",
    "simParams": { "tempRatio": 1.0, "constA": 4.17, "constB": 0.037 },
    "simSummary": ["Boyle Temperature T_B = a / (Rb)", "Second Virial Coefficient B₂ = b - a/(RT) = 0", "(∂Z/∂P)_{P→0} = 0"]
  },
  {
    "id": "GAS-Q07",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 25th January Morning Shift",
    "subtab": 5,
    "subtabName": "Andrews Isotherms & Critical State",
    "year": "2023",
    "q": "The critical constants of a van der Waals gas are P_c = a / (27 b²), V_c = 3 b, and T_c = 8 a / (27 R b). The value of the critical compressibility factor Z_c = (P_c V_c) / (R T_c) for any van der Waals gas is:",
    "options": [
      { "key": "A", "text": "0.375 (or 3/8)" },
      { "key": "B", "text": "0.280" },
      { "key": "C", "text": "1.000" },
      { "key": "D", "text": "0.750" }
    ],
    "correct": "A",
    "formula": "Z_c = (P_c V_c) / (R T_c) = [ (a / 27b²) · (3b) ] / [ R · (8a / 27Rb) ] = 3/8 = 0.375",
    "steps": [
      "Step 1: Write critical parameters in terms of van der Waals constants: P_c = a / (27b²), V_c = 3b, T_c = 8a / (27Rb).",
      "Step 2: Form the critical compressibility ratio: Z_c = (P_c V_c) / (R T_c).",
      "Step 3: Substitute expressions: Z_c = [ (a / 27b²) × 3b ] / [ R × 8a / (27Rb) ] = (3a / 27b) / (8a / 27b) = 3/8.",
      "Step 4: Express in decimals: 3/8 = 0.375. This is a universal invariant for all fluids obeying the van der Waals equation."
    ],
    "ans": "0.375 (or 3/8) (Option A)",
    "trap": "Never assume Z = 1 at the critical point! Intermolecular attractions and co-volume effects are maximized near the liquid-gas coexistence dome, driving Z_c down to 0.375.",
    "distractorTraps": {
      "B": "Confused with Berthelot model compressibility.",
      "C": "Assumed ideal gas equation applies at the critical point.",
      "D": "Inverted the numerator factor 3/8 into 6/8 = 0.75."
    },
    "targetTab": "tab-andrews",
    "simParams": { "Tc": 304.1, "Pc": 73.8, "Vc": 0.095 },
    "simSummary": ["P_c = a/(27b²)", "V_c = 3b", "T_c = 8a/(27Rb)", "Critical Invariant Z_c = 3/8 = 0.375"]
  },
  {
    "id": "GAS-Q08",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 24th January Morning Shift",
    "subtab": 4,
    "subtabName": "Compressibility Factor Z vs P",
    "year": "2025",
    "q": "At very high pressure, the van der Waals equation for 1 mole of a real gas simplifies to which of the following linear forms for compressibility factor Z?",
    "options": [
      { "key": "A", "text": "Z = 1 + (P b) / (R T)" },
      { "key": "B", "text": "Z = 1 - a / (V R T)" },
      { "key": "C", "text": "Z = 1 - (P b) / (R T)" },
      { "key": "D", "text": "Z = 1 + a / (V R T)" }
    ],
    "correct": "A",
    "formula": "P >> a/V² ⇒ P(V_m - b) = RT ⇒ PV_m - Pb = RT ⇒ Z = PV_m / RT = 1 + Pb / (RT)",
    "steps": [
      "Step 1: At extremely high pressure, the attractive internal pressure term a/V² becomes negligible relative to external pressure P (P >> a/V²).",
      "Step 2: The equation reduces to P(V_m - b) = RT.",
      "Step 3: Expand the product: PV_m - Pb = RT ⇒ PV_m = RT + Pb.",
      "Step 4: Divide both sides by RT: Z = PV_m / (RT) = 1 + (Pb) / (RT).",
      "Step 5: Because b > 0 and P > 0, Z is strictly greater than 1, yielding a positive slope with pressure where repulsive forces dominate."
    ],
    "ans": "Z = 1 + (P b) / (R T) (Option A)",
    "trap": "At moderate/low pressure, attraction dominates giving Z = 1 - a/(VRT) < 1. At high pressure, repulsive exclusion volume b dominates giving Z = 1 + Pb/(RT) > 1.",
    "distractorTraps": {
      "B": "Formula for low-to-moderate pressure where attraction dominates.",
      "C": "Incorrect negative sign for repulsive co-volume term.",
      "D": "Inverted algebraic sign on attractive correction."
    },
    "targetTab": "tab-compressibility",
    "simParams": { "tempRatio": 1.5, "constA": 0.0, "constB": 0.04 },
    "simSummary": ["High Pressure Regime: P >> a/V²", "P(V - b) = RT", "Repulsive Excluded Volume Dominates", "Z = 1 + Pb/(RT) > 1"]
  }
];
