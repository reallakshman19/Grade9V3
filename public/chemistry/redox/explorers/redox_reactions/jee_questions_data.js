/**
 * Redox Reactions (Oxidation Numbers, Balancing, n-factor & Titrations)
 * Master Question Registry & Step-by-Step Solutions Database
 * Curated from ExamSIDE IIT-JEE Main Questions (2013-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "REDOX-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 6th April Evening Shift",
    "subtab": 1,
    "subtabName": "Structural Oxidation States",
    "year": "2026",
    "q": "The oxidation state of Chromium in chromium pentoxide (CrO₅, blue butterfly peroxo compound) is:",
    "options": [
      { "key": "A", "text": "+6" },
      { "key": "B", "text": "+10" },
      { "key": "C", "text": "+5" },
      { "key": "D", "text": "+4" }
    ],
    "correct": "A",
    "formula": "CrO₅ has a butterfly structure: one oxo oxygen (=O, O.S. = -2) and two peroxo bridges (-O-O-, four oxygens each with O.S. = -1)",
    "steps": [
      "Step 1: Cr belongs to Group 6 (valence electronic configuration 3d⁵ 4s¹), so its maximum possible oxidation state is +6. Any state above +6 is physically impossible!",
      "Step 2: If we naively apply standard algebraic formula: x + 5(-2) = 0 ⇒ x = +10. This is the classic algebraic trap.",
      "Step 3: Draw the physical molecular structure of CrO₅ (butterfly structure):",
      "        O",
      "       //",
      "      Cr",
      "     /  \\",
      "  O-O    O-O",
      "Step 4: Count oxidation contributions by heterolytic cleavage:",
      "        One double-bonded oxo oxygen (=O) contributes -2.",
      "        Four peroxo oxygens (-O-O-) each contribute -1: 4 × (-1) = -4.",
      "Step 5: Charge balance on neutral CrO₅: x + (-2) + 4(-1) = 0 ⇒ x - 6 = 0 ⇒ x = +6."
    ],
    "ans": "+6 (Option A)",
    "trap": "The #1 trap in inorganic chemistry: blindly solving x + 5(-2) = 0 to get +10! Chromium cannot lose 10 electrons because it only has 6 valence electrons.",
    "distractorTraps": {
      "B": "Fell into the algebraic trap assuming all five oxygens are oxide ions (O²⁻).",
      "C": "Confused with valence d-electron count.",
      "D": "Confused with chromyl chloride or lower oxide."
    },
    "targetTab": "tab-structural-ox",
    "simParams": { "compound": "CrO5", "oxState": 6, "peroxoCount": 4 },
    "simSummary": ["CrO₅ Butterfly Structure", "1 Oxo Oxygen (=O) at -2", "4 Peroxo Oxygens (-O-O-) at -1", "Net Cr Oxidation State = +6"]
  },
  {
    "id": "REDOX-Q02",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 29th January Morning Shift",
    "subtab": 4,
    "subtabName": "The n-Factor Matrix",
    "year": "2025",
    "q": "The n-factor (valency factor) of potassium permanganate (KMnO₄) when it acts as an oxidizing agent in acidic, neutral/weakly alkaline, and strongly basic mediums respectively is:",
    "options": [
      { "key": "A", "text": "5, 3, 1" },
      { "key": "B", "text": "5, 1, 3" },
      { "key": "C", "text": "3, 5, 1" },
      { "key": "D", "text": "1, 3, 5" }
    ],
    "correct": "A",
    "formula": "n-factor = |Δ(Oxidation State)|. Acidic: Mn⁷⁺ → Mn²⁺ (Δ=5). Neutral: Mn⁷⁺ → MnO₂ (Mn⁴⁺, Δ=3). Basic: Mn⁷⁺ → MnO₄²⁻ (Mn⁶⁺, Δ=1)",
    "steps": [
      "Step 1: Initial oxidation state of Mn in KMnO₄: +1 + x + 4(-2) = 0 ⇒ x = +7.",
      "Step 2: In acidic medium: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. Change in O.S. = 7 - 2 = 5. Therefore, n = 5.",
      "Step 3: In neutral or weakly alkaline medium: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻. Final O.S. of Mn in MnO₂ is +4. Change in O.S. = 7 - 4 = 3. Therefore, n = 3.",
      "Step 4: In strongly basic medium: MnO₄⁻ + e⁻ → MnO₄²⁻ (manganate ion). Final O.S. of Mn is +6. Change in O.S. = 7 - 6 = 1. Therefore, n = 1.",
      "Step 5: Sequence: 5, 3, 1 (Remember mnemonic: BAN = 1, 3, 5 for Basic, Alkaline/neutral, aNacidic)."
    ],
    "ans": "5, 3, 1 (Option A)",
    "trap": "Students frequently swap neutral (n = 3) and strongly basic (n = 1). In strongly basic medium, it reduces only to manganate (Mn⁶⁺, green)!",
    "distractorTraps": {
      "B": "Inverted neutral and strongly basic mediums.",
      "C": "Put neutral first before acidic.",
      "D": "Completely reversed order."
    },
    "targetTab": "tab-nfactor",
    "simParams": { "agent": "KMnO4", "medium": "acidic", "nFactor": 5 },
    "simSummary": ["KMnO₄: Mn⁷⁺ Initial", "Acidic: Mn²⁺ (n = 5)", "Neutral: MnO₂ (n = 3)", "Strongly Basic: MnO₄²⁻ (n = 1)"]
  },
  {
    "id": "REDOX-Q03",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 31st January Morning Shift",
    "subtab": 4,
    "subtabName": "The n-Factor Matrix",
    "year": "2024",
    "q": "In the disproportionation reaction of white phosphorus in basic solution: P₄ + 3OH⁻ + 3H₂O → PH₃ + 3H₂PO₂⁻, the equivalent weight of P₄ (Molar mass M) is:",
    "options": [
      { "key": "A", "text": "M / 3" },
      { "key": "B", "text": "M / 4" },
      { "key": "C", "text": "M / 12" },
      { "key": "D", "text": "3 M / 4" }
    ],
    "correct": "A",
    "formula": "In disproportionation: 1/n_net = 1/n_ox + 1/n_red, or n = Total electrons transferred per mole of reactant",
    "steps": [
      "Step 1: Oxidation states: P in P₄ is 0. In PH₃: x + 3(+1) = 0 ⇒ x = -3 (Reduction). In H₂PO₂⁻: 2(+1) + x + 2(-2) = -1 ⇒ x = +1 (Oxidation).",
      "Step 2: Balance half-reactions per mole of P₄:",
      "        Reduction: P₄ + 12e⁻ → 4 PH₃  (Change = 12 electrons)",
      "        Oxidation: P₄ → 4 H₂PO₂⁻ + 4e⁻ (Change = 4 electrons)",
      "Step 3: But look at the stoichiometry of the combined equation: 1 mole of P₄ produces 1 mole of PH₃ and 3 moles of H₂PO₂⁻.",
      "Step 4: Number of P atoms reduced = 1 atom (from 0 to -3 ⇒ 3 electrons gained). Number of P atoms oxidized = 3 atoms (from 0 to +1 ⇒ 3 electrons lost).",
      "Step 5: Total electrons transferred PER MOLE of P₄ = 3. Therefore, n-factor of P₄ = 3.",
      "Step 6: Equivalent weight E = M / n = M / 3."
    ],
    "ans": "M / 3 (Option A)",
    "trap": "Students often calculate 12 electrons transferred for 4 moles of P, forgetting that 1 mole of P₄ only transfers 3 electrons!",
    "distractorTraps": {
      "B": "Divided by 4 (number of atoms in P₄).",
      "C": "Used total electrons (12) without dividing by stoichiometric moles.",
      "D": "Inverted the n-factor."
    },
    "targetTab": "tab-nfactor",
    "simParams": { "reaction": "P4", "nFactor": 3 },
    "simSummary": ["White Phosphorus Disproportionation", "1 atom P reduced (0 → -3, 3 e⁻)", "3 atoms P oxidized (0 → +1, 3 e⁻)", "n-factor = 3 ⇒ E = M/3"]
  },
  {
    "id": "REDOX-Q04",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 28th January Evening Shift",
    "subtab": 1,
    "subtabName": "Structural Oxidation States",
    "year": "2025",
    "q": "In the tetrathionate ion (S₄O₆²⁻), the oxidation states of the four sulfur atoms are respectively:",
    "options": [
      { "key": "A", "text": "+5, 0, 0, +5" },
      { "key": "B", "text": "+2.5, +2.5, +2.5, +2.5" },
      { "key": "C", "text": "+6, 0, 0, +6" },
      { "key": "D", "text": "+4, +1, +1, +4" }
    ],
    "correct": "A",
    "formula": "S₄O₆²⁻ structure: [O₃S - S - S - SO₃]²⁻. Homonuclear S-S bonds have Δ(O.S.) = 0",
    "steps": [
      "Step 1: The average oxidation state of sulfur from algebraic formula: 4x + 6(-2) = -2 ⇒ 4x = 10 ⇒ x = +2.5.",
      "Step 2: But fractional oxidation states are physically impossible for individual atoms! They are merely statistical averages.",
      "Step 3: Draw the structural formula of tetrathionate: ⁻O₃S - S - S - SO₃⁻.",
      "Step 4: The two central sulfur atoms are bonded only to each other and adjacent sulfurs (S - S). Because both atoms have identical electronegativity, the homonuclear S-S covalent bonds contribute 0 to the oxidation state: central sulfurs = 0.",
      "Step 5: Each of the two terminal sulfur atoms is bonded to three oxygen atoms (one -O⁻ and two =O) and one sulfur: x + 3(-2) + 1 = -1 ⇒ x = +5.",
      "Step 6: Therefore, the individual oxidation states are +5, 0, 0, +5."
    ],
    "ans": "+5, 0, 0, +5 (Option A)",
    "trap": "Do not pick the fractional algebraic average (+2.5); individual atoms have discrete integer oxidation states: +5, 0, 0, +5!",
    "distractorTraps": {
      "B": "Picked the algebraic average (+2.5) instead of structural localized states.",
      "C": "Assumed terminal sulfur was +6 like in sulfate.",
      "D": "Distributed charge evenly across adjacent pairs."
    },
    "targetTab": "tab-structural-ox",
    "simParams": { "compound": "S4O6", "terminalO.S.": 5, "centralO.S.": 0 },
    "simSummary": ["Tetrathionate S₄O₆²⁻", "Two Terminal S: +5 each", "Two Central S: 0 each", "Average = (5 + 0 + 0 + 5)/4 = +2.5"]
  },
  {
    "id": "REDOX-Q05",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 7th April Morning Shift",
    "subtab": 5,
    "subtabName": "Redox Titrations & Burette Equivalence",
    "year": "2026",
    "q": "How many moles of acidified K₂Cr₂O₇ are required to completely oxidize 1 mole of ferrous oxalate (FeC₂O₄)?",
    "options": [
      { "key": "A", "text": "0.50 mol" },
      { "key": "B", "text": "0.33 mol" },
      { "key": "C", "text": "0.60 mol" },
      { "key": "D", "text": "1.00 mol" }
    ],
    "correct": "A",
    "formula": "Equivalents of K₂Cr₂O₇ = Equivalents of FeC₂O₄. n₁ × (n-factor₁) = n₂ × (n-factor₂)",
    "steps": [
      "Step 1: Calculate the n-factor of K₂Cr₂O₇ in acidic medium: Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O. 2 Cr atoms go from +6 to +3 ⇒ n-factor = 2 × 3 = 6.",
      "Step 2: Calculate the n-factor of ferrous oxalate (FeC₂O₄):",
      "        Both the cation AND the anion get oxidized!",
      "        Fe²⁺ → Fe³⁺ + e⁻  (1 electron lost by iron)",
      "        C₂O₄²⁻ → 2CO₂ + 2e⁻ (2 electrons lost by oxalate carbon: 2 × (+4 - +3) = 2)",
      "        Total electrons lost per mole of FeC₂O₄ = 1 + 2 = 3. Therefore, n-factor of FeC₂O₄ = 3!",
      "Step 3: Apply Law of Chemical Equivalence: Equivalents of K₂Cr₂O₇ = Equivalents of FeC₂O₄.",
      "        moles(K₂Cr₂O₇) × 6 = moles(FeC₂O₄) × 3.",
      "Step 4: For 1 mole of FeC₂O₄: moles(K₂Cr₂O₇) × 6 = 1 × 3 ⇒ moles(K₂Cr₂O₇) = 3 / 6 = 0.50 mol."
    ],
    "ans": "0.50 mol (Option A)",
    "trap": "The colossal trap: forgetting that BOTH Fe²⁺ and C₂O₄²⁻ oxidize! FeC₂O₄ has n-factor = 1 + 2 = 3, not 1 or 2.",
    "distractorTraps": {
      "B": "Only oxidized oxalate (n = 2 ⇒ 2/6 = 0.33 mol).",
      "C": "Used wrong Cr oxidation change.",
      "D": "Assumed 1:1 molar equivalence."
    },
    "targetTab": "tab-titration",
    "simParams": { "analyte": "FeC2O4", "nFactorAnalyte": 3, "titrant": "K2Cr2O7", "nFactorTitrant": 6 },
    "simSummary": ["K₂Cr₂O₇ n-factor = 6", "FeC₂O₄ n-factor = 1 (Fe) + 2 (Oxalate) = 3", "Molar Ratio = 3/6 = 0.50 mol"]
  },
  {
    "id": "REDOX-Q06",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 29th January Evening Shift",
    "subtab": 1,
    "subtabName": "Structural Oxidation States",
    "year": "2024",
    "q": "In magnetic iron oxide (Fe₃O₄, magnetite), the oxidation state of iron is best described as:",
    "options": [
      { "key": "A", "text": "A mixture of Fe(II) and Fe(III) in 1 : 2 ratio" },
      { "key": "B", "text": "+8/3 on each iron atom" },
      { "key": "C", "text": "All Fe(II)" },
      { "key": "D", "text": "All Fe(III)" }
    ],
    "correct": "A",
    "formula": "Fe₃O₄ is a stoichiometric mixed oxide: FeO · Fe₂O₃",
    "steps": [
      "Step 1: In Fe₃O₄, algebraic formula gives 3x + 4(-2) = 0 ⇒ x = +8/3.",
      "Step 2: A fractional oxidation state indicates a mixed-valence compound containing iron in different discrete integer oxidation states.",
      "Step 3: Fe₃O₄ crystallizes in an inverse spinel lattice where: one Fe atom is divalent (Fe²⁺ in FeO, O.S. = +2), and two Fe atoms are trivalent (Fe³⁺ in Fe₂O₃, O.S. = +3).",
      "Step 4: Ratio of Fe²⁺ : Fe³⁺ = 1 : 2. Average = (2 + 2 × 3) / 3 = 8/3.",
      "Step 5: Therefore, Fe₃O₄ is a mixture of Fe(II) and Fe(III) in 1:2 ratio."
    ],
    "ans": "A mixture of Fe(II) and Fe(III) in 1 : 2 ratio (Option A)",
    "trap": "Do not select +8/3 as an actual physical state; oxidation states represent real localized charges in crystal lattices!",
    "distractorTraps": {
      "B": "Picked the statistical average without recognizing mixed oxide reality.",
      "C": "Assumed all divalent.",
      "D": "Assumed all trivalent."
    },
    "targetTab": "tab-structural-ox",
    "simParams": { "compound": "Fe3O4", "fe2Count": 1, "fe3Count": 2 },
    "simSummary": ["Magnetite Fe₃O₄ = FeO &middot; Fe₂O₃", "1 &times; Fe²⁺ (+2)", "2 &times; Fe³⁺ (+3)", "Ratio Fe(II) : Fe(III) = 1 : 2"]
  },
  {
    "id": "REDOX-Q07",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 24th January Evening Shift",
    "subtab": 4,
    "subtabName": "n-Factor Matrix & Medium Dependency",
    "year": "2023",
    "q": "When potassium permanganate (KMnO₄, molar mass M) acts as an oxidizing agent in neutral or faintly alkaline medium (such as Baeyer's reagent), its oxidation state changes from +7 to +4 (MnO₂). The equivalent mass of KMnO₄ in this medium is:",
    "options": [
      { "key": "A", "text": "M / 3" },
      { "key": "B", "text": "M / 5" },
      { "key": "C", "text": "M / 1" },
      { "key": "D", "text": "M / 2" }
    ],
    "correct": "A",
    "formula": "Equivalent Mass = Molar Mass / n-factor. Half-reaction: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻ ⇒ n = 3",
    "steps": [
      "Step 1: Write the reduction half-reaction in neutral or faintly alkaline aqueous medium: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂(s) + 4OH⁻.",
      "Step 2: Determine oxidation states: Manganese changes from +7 in KMnO₄ to +4 in MnO₂.",
      "Step 3: Total electrons gained per mole of KMnO₄ is |+7 - +4| = 3. Therefore, n-factor = 3.",
      "Step 4: Compute equivalent mass: Equivalent mass = Molar mass (M) / n-factor = M / 3.",
      "Step 5: Contrast across media: Acidic medium gives Mn²⁺ (n=5 ⇒ M/5); strongly basic gives MnO₄²⁻ (n=1 ⇒ M/1); neutral gives MnO₂ (n=3 ⇒ M/3)."
    ],
    "ans": "M / 3 (Option A)",
    "trap": "In acidic medium, n-factor = 5 (M/5). In strongly basic medium, n-factor = 1 (M/1). In neutral/faintly alkaline medium, n-factor = 3 (M/3)!",
    "distractorTraps": {
      "B": "Used acidic medium n-factor = 5.",
      "C": "Used strongly basic medium n-factor = 1.",
      "D": "Arbitrary factor 2."
    },
    "targetTab": "tab-nfactor",
    "simParams": { "medium": "neutral" },
    "simSummary": ["Neutral / Weak Alkaline Medium", "MnO₄⁻ (+7) → MnO₂ (+4)", "n-factor = 3", "Equivalent Mass = M / 3"]
  },
  {
    "id": "REDOX-Q08",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 23rd January Morning Shift",
    "subtab": 5,
    "subtabName": "Redox Titrations & Galvanic Cells",
    "year": "2025",
    "q": "For the standard galvanic cell Zn(s) | Zn²⁺(aq, 1M) || Cu²⁺(aq, 1M) | Cu(s), given standard reduction potentials E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V, the standard Gibbs free energy change ΔG° for the cell reaction at 298 K is (Faraday constant F ≈ 96500 C/mol):",
    "options": [
      { "key": "A", "text": "-212.3 kJ/mol" },
      { "key": "B", "text": "+212.3 kJ/mol" },
      { "key": "C", "text": "-106.1 kJ/mol" },
      { "key": "D", "text": "-424.6 kJ/mol" }
    ],
    "correct": "A",
    "formula": "E°_cell = E°_cathode - E°_anode = 0.34 - (-0.76) = 1.10 V. ΔG° = -n F E°_cell (with n = 2)",
    "steps": [
      "Step 1: Calculate standard EMF: E°_cell = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 V - (-0.76 V) = +1.10 V.",
      "Step 2: Identify moles of electrons transferred: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) ⇒ n = 2 mol of electrons.",
      "Step 3: Relate EMF to Gibbs energy: ΔG° = -n F E°_cell.",
      "Step 4: Calculate numerical value: ΔG° = -2 × 96500 C/mol × 1.10 J/C = -212300 J/mol = -212.3 kJ/mol.",
      "Step 5: Negative ΔG° confirms the spontaneity of the galvanic cell under standard conditions."
    ],
    "ans": "-212.3 kJ/mol (Option A)",
    "trap": "Always remember the negative sign in ΔG° = -nFE°! A spontaneous cell with E° > 0 must always have ΔG° < 0.",
    "distractorTraps": {
      "B": "Missed the minus sign in ΔG° = -nFE°.",
      "C": "Used n = 1 instead of n = 2.",
      "D": "Multiplied by 4 instead of 2."
    },
    "targetTab": "tab-galvanic",
    "simParams": { "E_cell": 1.10, "n_electrons": 2 },
    "simSummary": ["E°_cell = 0.34 - (-0.76) = +1.10 V", "n = 2 moles electrons", "ΔG° = -2 × 96500 × 1.10 = -212.3 kJ/mol", "Spontaneous Cell"]
  }
];
