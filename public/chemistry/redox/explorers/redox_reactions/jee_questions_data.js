/**
 * Redox Reactions & Electrochemistry Fundamentals
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
      {
        "key": "A",
        "text": "+6"
      },
      {
        "key": "B",
        "text": "+10"
      },
      {
        "key": "C",
        "text": "+5"
      },
      {
        "key": "D",
        "text": "+4"
      }
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
    "simParams": {
      "compound": "CrO5",
      "oxState": 6,
      "peroxoCount": 4
    },
    "simSummary": [
      "CrO₅ Butterfly Structure",
      "1 Oxo Oxygen (=O) at -2",
      "4 Peroxo Oxygens (-O-O-) at -1",
      "Net Cr Oxidation State = +6"
    ]
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
      {
        "key": "A",
        "text": "5, 3, 1"
      },
      {
        "key": "B",
        "text": "5, 1, 3"
      },
      {
        "key": "C",
        "text": "3, 5, 1"
      },
      {
        "key": "D",
        "text": "1, 3, 5"
      }
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
    "simParams": {
      "agent": "KMnO4",
      "medium": "acidic",
      "nFactor": 5
    },
    "simSummary": [
      "KMnO₄: Mn⁷⁺ Initial",
      "Acidic: Mn²⁺ (n = 5)",
      "Neutral: MnO₂ (n = 3)",
      "Strongly Basic: MnO₄²⁻ (n = 1)"
    ]
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
      {
        "key": "A",
        "text": "M / 3"
      },
      {
        "key": "B",
        "text": "M / 4"
      },
      {
        "key": "C",
        "text": "M / 12"
      },
      {
        "key": "D",
        "text": "3 M / 4"
      }
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
    "simParams": {
      "reaction": "P4",
      "nFactor": 3
    },
    "simSummary": [
      "White Phosphorus Disproportionation",
      "1 atom P reduced (0 → -3, 3 e⁻)",
      "3 atoms P oxidized (0 → +1, 3 e⁻)",
      "n-factor = 3 ⇒ E = M/3"
    ]
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
      {
        "key": "A",
        "text": "+5, 0, 0, +5"
      },
      {
        "key": "B",
        "text": "+2.5, +2.5, +2.5, +2.5"
      },
      {
        "key": "C",
        "text": "+6, 0, 0, +6"
      },
      {
        "key": "D",
        "text": "+4, +1, +1, +4"
      }
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
    "simParams": {
      "compound": "S4O6",
      "terminalO.S.": 5,
      "centralO.S.": 0
    },
    "simSummary": [
      "Tetrathionate S₄O₆²⁻",
      "Two Terminal S: +5 each",
      "Two Central S: 0 each",
      "Average = (5 + 0 + 0 + 5)/4 = +2.5"
    ]
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
      {
        "key": "A",
        "text": "0.50 mol"
      },
      {
        "key": "B",
        "text": "0.33 mol"
      },
      {
        "key": "C",
        "text": "0.60 mol"
      },
      {
        "key": "D",
        "text": "1.00 mol"
      }
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
    "simParams": {
      "analyte": "FeC2O4",
      "nFactorAnalyte": 3,
      "titrant": "K2Cr2O7",
      "nFactorTitrant": 6
    },
    "simSummary": [
      "K₂Cr₂O₇ n-factor = 6",
      "FeC₂O₄ n-factor = 1 (Fe) + 2 (Oxalate) = 3",
      "Molar Ratio = 3/6 = 0.50 mol"
    ]
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
      {
        "key": "A",
        "text": "A mixture of Fe(II) and Fe(III) in 1 : 2 ratio"
      },
      {
        "key": "B",
        "text": "+8/3 on each iron atom"
      },
      {
        "key": "C",
        "text": "All Fe(II)"
      },
      {
        "key": "D",
        "text": "All Fe(III)"
      }
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
    "simParams": {
      "compound": "Fe3O4",
      "fe2Count": 1,
      "fe3Count": 2
    },
    "simSummary": [
      "Magnetite Fe₃O₄ = FeO &middot; Fe₂O₃",
      "1 &times; Fe²⁺ (+2)",
      "2 &times; Fe³⁺ (+3)",
      "Ratio Fe(II) : Fe(III) = 1 : 2"
    ]
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
      {
        "key": "A",
        "text": "M / 3"
      },
      {
        "key": "B",
        "text": "M / 5"
      },
      {
        "key": "C",
        "text": "M / 1"
      },
      {
        "key": "D",
        "text": "M / 2"
      }
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
    "simParams": {
      "medium": "neutral"
    },
    "simSummary": [
      "Neutral / Weak Alkaline Medium",
      "MnO₄⁻ (+7) → MnO₂ (+4)",
      "n-factor = 3",
      "Equivalent Mass = M / 3"
    ]
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
      {
        "key": "A",
        "text": "-212.3 kJ/mol"
      },
      {
        "key": "B",
        "text": "+212.3 kJ/mol"
      },
      {
        "key": "C",
        "text": "-106.1 kJ/mol"
      },
      {
        "key": "D",
        "text": "-424.6 kJ/mol"
      }
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
    "simParams": {
      "E_cell": 1.1,
      "n_electrons": 2
    },
    "simSummary": [
      "E°_cell = 0.34 - (-0.76) = +1.10 V",
      "n = 2 moles electrons",
      "ΔG° = -2 × 96500 × 1.10 = -212.3 kJ/mol",
      "Spontaneous Cell"
    ]
  },
  {
    "id": "REDOX-Q09",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 1st February Morning Shift",
    "subtab": 1,
    "subtabName": "Structural Bond Cleavage Tool",
    "year": "2024",
    "q": "The oxidation states of sulfur in Caro's acid (H₂SO₅) and Marshall's acid (H₂S₂O₈) respectively are:",
    "options": [
      {
        "key": "A",
        "text": "+6 and +6"
      },
      {
        "key": "B",
        "text": "+8 and +7"
      },
      {
        "key": "C",
        "text": "+6 and +7"
      },
      {
        "key": "D",
        "text": "+4 and +6"
      }
    ],
    "correct": "A",
    "formula": "H₂SO₅ has 1 peroxo linkage (-O-O-, O.S. = -1 each); H₂S₂O₈ has 1 peroxo bridge linking two -SO₃H groups.",
    "steps": [
      "Step 1: Algebraic trap in H₂SO₅: 2(+1) + x + 5(-2) = 0 ⇒ x = +8. But sulfur has only 6 valence electrons, so its maximum possible oxidation state is +6!",
      "Step 2: Structural cleavage of H₂SO₅: Structure is H-O-SO₂-O-O-H. It contains three oxide oxygens (-2 each), one peroxo group (-1 each), and two hydrogens (+1 each).",
      "Step 3: Correct equation: 2(+1) + x + 3(-2) + 2(-1) = 0 ⇒ x - 6 = 0 ⇒ x = +6.",
      "Step 4: Algebraic trap in H₂S₂O₈: 2(+1) + 2x + 8(-2) = 0 ⇒ 2x = 14 ⇒ x = +7 (violates octet ceiling +6).",
      "Step 5: Structural cleavage of H₂S₂O₈: Structure is HO₃S-O-O-SO₃H. Two peroxo oxygens (-1 each) and six oxide oxygens (-2 each): 2(+1) + 2x + 6(-2) + 2(-1) = 0 ⇒ 2x = 12 ⇒ x = +6 on each sulfur atom."
    ],
    "ans": "+6 and +6 (Option A)",
    "trap": "Never allow sulfur's oxidation state to exceed its group valence (+6)! Whenever algebra yields +8 or +7, suspect peroxo linkages (-O-O-).",
    "distractorTraps": {
      "B": "BLIND ALGEBRA TRAP: Calculated +8 for H₂SO₅ and +7 for H₂S₂O₈ assuming all oxygens are -2 oxide.",
      "C": "Calculated Caro's acid correctly (+6) but fell into algebraic trap for Marshall's acid (+7).",
      "D": "Confused with sulfurous acid derivatives."
    },
    "targetTab": "tab-structural",
    "simParams": {
      "molecule": "H2SO5"
    },
    "simSummary": [
      "H₂SO₅: S = +6 (1 peroxo -O-O-)",
      "H₂S₂O₈: S = +6 each (1 peroxo bridge)",
      "Octet ceiling = +6"
    ]
  },
  {
    "id": "REDOX-Q10",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 29th January Evening Shift",
    "subtab": 1,
    "subtabName": "Structural Bond Cleavage Tool",
    "year": "2024",
    "q": "In the brown ring complex [Fe(H₂O)₅(NO)]SO₄ formed during the nitrate ring test, the oxidation state of Iron and the magnetic moment (μ) are:",
    "options": [
      {
        "key": "A",
        "text": "+1 and 3.87 BM (3 unpaired electrons)"
      },
      {
        "key": "B",
        "text": "+2 and 4.90 BM (4 unpaired electrons)"
      },
      {
        "key": "C",
        "text": "+3 and 5.92 BM (5 unpaired electrons)"
      },
      {
        "key": "D",
        "text": "+1 and 1.73 BM (1 unpaired electron)"
      }
    ],
    "correct": "A",
    "formula": "NO acts as nitrosonium cation (NO⁺). Fe has O.S. = +1 (d⁷ high spin, 3 unpaired e⁻ ⇒ μ = √[3(5)] = √15 ≈ 3.87 BM).",
    "steps": [
      "Step 1: In the brown ring complex, nitric oxide transfers an electron to Fe²⁺, converting into the nitrosonium cation (NO⁺).",
      "Step 2: Iron is reduced from Fe²⁺ to Fe⁺: [Fe⁺ (H₂O)₅ (NO⁺)]²⁺ SO₄²⁻.",
      "Step 3: Charge balance on complex cation: x + 5(0) + (+1) = +2 ⇒ x = +1.",
      "Step 4: Electronic configuration of Fe⁺ (Z = 26): [Ar] 3d⁷ 4s⁰. High spin configuration: t_2g⁵ e_g².",
      "Step 5: Number of unpaired electrons n = 3. Spin-only magnetic moment: μ = √[n(n+2)] = √[3 × 5] = √15 ≈ 3.87 BM."
    ],
    "ans": "+1 and 3.87 BM (3 unpaired electrons) (Option A)",
    "trap": "Do not treat NO as neutral! Here NO is NO⁺ (nitrosonium), making Fe = +1, which is proved by magnetic moment 3.87 BM (3 unpaired e⁻).",
    "distractorTraps": {
      "B": "Treated NO as neutral ligand, concluding Fe = +2 with 4 unpaired electrons (μ = 4.90 BM).",
      "C": "Assumed Fe³⁺ high-spin state with 5 unpaired electrons.",
      "D": "Assumed low-spin pairing leaving only 1 unpaired electron."
    },
    "targetTab": "tab-structural",
    "simParams": {
      "molecule": "CrO5"
    },
    "simSummary": [
      "[Fe(H₂O)₅(NO⁺)]²⁺: Fe is +1",
      "3d⁷ high spin ⇒ n = 3 unpaired e⁻",
      "μ = √15 ≈ 3.87 BM"
    ]
  },
  {
    "id": "REDOX-Q11",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 13th April Morning Shift",
    "subtab": 4,
    "subtabName": "The n-Factor Matrix & Disproportionation",
    "year": "2023",
    "q": "When ferrous oxalate (FeC₂O₄) is oxidized completely by acidic KMnO₄ to Fe³⁺ and CO₂, the n-factor of FeC₂O₄ is:",
    "options": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "2"
      },
      {
        "key": "C",
        "text": "1"
      },
      {
        "key": "D",
        "text": "5"
      }
    ],
    "correct": "A",
    "formula": "n-factor = ∑ (Moles of e⁻ lost by each oxidized atom per mole of salt) = n(Fe²⁺ → Fe³⁺) + n(C₂O₄²⁻ → 2 CO₂)",
    "steps": [
      "Step 1: In FeC₂O₄, BOTH the cation (Fe²⁺) and the anion (C₂O₄²⁻) undergo oxidation!",
      "Step 2: Oxidation of iron: Fe²⁺ → Fe³⁺ + 1 e⁻ (Change in O.S. = 3 - 2 = 1, e⁻ lost = 1).",
      "Step 3: Oxidation of oxalate: C₂O₄²⁻ → 2 CO₂ + 2 e⁻ (Carbon goes from +3 to +4, 2 atoms × 1 = 2 e⁻ lost).",
      "Step 4: Total electrons lost per formula unit of FeC₂O₄ = 1 + 2 = 3 electrons.",
      "Step 5: Therefore, n-factor of FeC₂O₄ = 3. (1 mole of FeC₂O₄ reacts with 3/5 mole of KMnO₄ in acid)."
    ],
    "ans": "3 (Option A)",
    "trap": "DUAL OXIDATION TRAP: Students count only the oxalate ion (n=2) or only the iron ion (n=1); because BOTH are oxidized, their n-factors ADD together (1 + 2 = 3)!",
    "distractorTraps": {
      "B": "Counted only oxalate oxidation: C₂O₄²⁻ → 2 CO₂ (n = 2).",
      "C": "Counted only iron oxidation: Fe²⁺ → Fe³⁺ (n = 1).",
      "D": "Reported the n-factor of KMnO₄ in acid (n = 5)."
    },
    "targetTab": "tab-nfactor",
    "simParams": {
      "reagent": "FeC2O4",
      "medium": "acidic"
    },
    "simSummary": [
      "Fe²⁺ → Fe³⁺ (1 e⁻)",
      "C₂O₄²⁻ → 2 CO₂ (2 e⁻)",
      "Total n-factor = 1 + 2 = 3"
    ]
  },
  {
    "id": "REDOX-Q12",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 25th January Morning Shift",
    "subtab": 1,
    "subtabName": "Structural Bond Cleavage Tool",
    "year": "2023",
    "q": "Bleaching powder (CaOCl₂) contains two chlorine atoms. Their individual oxidation states are:",
    "options": [
      {
        "key": "A",
        "text": "-1 and +1"
      },
      {
        "key": "B",
        "text": "0 and 0"
      },
      {
        "key": "C",
        "text": "-1 and -1"
      },
      {
        "key": "D",
        "text": "+1 and +1"
      }
    ],
    "correct": "A",
    "formula": "CaOCl₂ exists as a mixed salt Ca²⁺ (Cl⁻) (OCl⁻). Average O.S. is 0, but individual O.S. are -1 and +1.",
    "steps": [
      "Step 1: Bleaching powder is chemically calcium hypochlorite-chloride: Ca(OCl)Cl.",
      "Step 2: It ionizes into Ca²⁺, chloride ion (Cl⁻), and hypochlorite ion (OCl⁻).",
      "Step 3: In the chloride ion (Cl⁻), the oxidation state of chlorine is -1.",
      "Step 4: In the hypochlorite ion (OCl⁻): O is -2, net charge is -1 ⇒ x + (-2) = -1 ⇒ x = +1.",
      "Step 5: Average oxidation state is (-1 + 1)/2 = 0, but the two chlorines are chemically and structurally distinct with oxidation states -1 and +1."
    ],
    "ans": "-1 and +1 (Option A)",
    "trap": "AVERAGE VS REAL O.S. TRAP: Algebra gives 2 + (-2) + 2x = 0 ⇒ x = 0. Reporting zero ignores the two completely different chemical species (Cl⁻ and OCl⁻)!",
    "distractorTraps": {
      "B": "Reported average oxidation state (0) for both atoms.",
      "C": "Assumed both chlorines are simple chloride ions (-1).",
      "D": "Assumed both chlorines are hypochlorite (+1)."
    },
    "targetTab": "tab-structural",
    "simParams": {
      "molecule": "CrO5"
    },
    "simSummary": [
      "Bleaching powder: Ca(OCl)Cl",
      "Chloride Cl⁻ ⇒ O.S. = -1",
      "Hypochlorite OCl⁻ ⇒ O.S. = +1"
    ]
  },
  {
    "id": "REDOX-Q13",
    "num": "JEE Main 2022",
    "source": "JEE Main 2022 (Online) 27th July Evening Shift",
    "subtab": 4,
    "subtabName": "The n-Factor Matrix & Disproportionation",
    "year": "2022",
    "q": "The equivalent weight of potassium permanganate (KMnO₄, molecular mass M) in acidic, neutral/faintly alkaline, and strongly basic media respectively is:",
    "options": [
      {
        "key": "A",
        "text": "M/5,  M/3,  M/1"
      },
      {
        "key": "B",
        "text": "M/5,  M/1,  M/3"
      },
      {
        "key": "C",
        "text": "M/3,  M/5,  M/1"
      },
      {
        "key": "D",
        "text": "M/5,  M/5,  M/5"
      }
    ],
    "correct": "A",
    "formula": "Equivalent Weight = M / (n-factor). In Acid: Mn⁷⁺ → Mn²⁺ (n=5). In Neutral: Mn⁷⁺ → MnO₂ (n=3). In Strong Base: Mn⁷⁺ → MnO₄²⁻ (n=1).",
    "steps": [
      "Step 1: Acidic Medium: MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O. Mn(+7 → +2), Δ(O.S.) = 5 ⇒ n = 5 ⇒ Eq Wt = M/5.",
      "Step 2: Neutral / Faintly Alkaline (Bayer's reagent): MnO₄⁻ + 2 H₂O + 3 e⁻ → MnO₂ + 4 OH⁻. Mn(+7 → +4), Δ(O.S.) = 3 ⇒ n = 3 ⇒ Eq Wt = M/3.",
      "Step 3: Strongly Basic Medium: MnO₄⁻ + e⁻ → MnO₄²⁻ (manganate ion). Mn(+7 → +6), Δ(O.S.) = 1 ⇒ n = 1 ⇒ Eq Wt = M/1.",
      "Step 4: Compiling equivalent weights: Acidic = M/5, Neutral = M/3, Strongly basic = M/1."
    ],
    "ans": "M/5,  M/3,  M/1 (Option A)",
    "trap": "Remember the mnemonic 'BAN 153': Basic n=1, Acidic n=5, Neutral n=3!",
    "distractorTraps": {
      "B": "Swapped neutral (n=3) and strongly basic (n=1) n-factors.",
      "C": "Swapped acidic and neutral media.",
      "D": "Assumed n-factor is invariant (always 5)."
    },
    "targetTab": "tab-nfactor",
    "simParams": {
      "reagent": "KMnO4",
      "medium": "acidic"
    },
    "simSummary": [
      "Acidic: n = 5 ⇒ M/5",
      "Neutral: n = 3 ⇒ M/3",
      "Strongly Basic: n = 1 ⇒ M/1"
    ]
  },
  {
    "id": "REDOX-Q14",
    "num": "JEE Main 2022",
    "source": "JEE Main 2022 (Online) 26th June Evening Shift",
    "subtab": 4,
    "subtabName": "The n-Factor Matrix & Disproportionation",
    "year": "2022",
    "q": "In the disproportionation reaction of white phosphorus with alkali: P₄ + 3 OH⁻ + 3 H₂O → PH₃ + 3 H₂PO₂⁻, the n-factor of P₄ is:",
    "options": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "4"
      },
      {
        "key": "C",
        "text": "12"
      },
      {
        "key": "D",
        "text": "6"
      }
    ],
    "correct": "A",
    "formula": "For disproportionation: n-factor = Total moles of electrons transferred per mole of substance.",
    "steps": [
      "Step 1: Determine oxidation state changes from P₄ (O.S. = 0):",
      "        Reduction: P₄ → PH₃ (P is -3). Change per P atom = 3.",
      "        Oxidation: P₄ → H₂PO₂⁻ (P is +1). Change per P atom = 1.",
      "Step 2: In the balanced equation: 1 mole of P₄ produces 1 mole of PH₃ and 3 moles of H₂PO₂⁻.",
      "Step 3: Reduction half-reaction: 1 P atom gains 3 electrons ⇒ Total electrons gained = 3 e⁻.",
      "Step 4: Oxidation half-reaction: 3 P atoms each lose 1 electron ⇒ Total electrons lost = 3 e⁻.",
      "Step 5: The total number of electrons transferred per formula unit of P₄ is exactly 3.",
      "Step 6: Therefore, the n-factor of P₄ = 3 (Equivalent weight = M / 3)."
    ],
    "ans": "3 (Option A)",
    "trap": "Do not multiply 4 atoms × 3 = 12! Only 1 of the 4 phosphorus atoms is reduced (gaining 3 e⁻), while the other 3 are oxidized (each losing 1 e⁻, total 3 e⁻). The net exchange per P₄ is 3 electrons!",
    "distractorTraps": {
      "B": "Assumed all 4 atoms undergo oxidation or reduction.",
      "C": "Multiplied 4 × 3 = 12 without accounting for disproportionation fraction.",
      "D": "Added reduction (3) + oxidation (3) = 6 electrons (double counting transfer)."
    },
    "targetTab": "tab-nfactor",
    "simParams": {
      "reagent": "KMnO4",
      "medium": "neutral"
    },
    "simSummary": [
      "P₄ (0) → 1 PH₃ (-3) [gains 3 e⁻]",
      "P₄ (0) → 3 H₂PO₂⁻ (+1) [loses 3 e⁻]",
      "Net transfer = 3 e⁻ ⇒ n-factor = 3"
    ]
  },
  {
    "id": "REDOX-Q15",
    "num": "JEE Main 2021",
    "source": "JEE Main 2021 (Online) 24th February Evening Shift",
    "subtab": 3,
    "subtabName": "Ion-Electron Balancing Rig",
    "year": "2021",
    "q": "When iodide (I⁻) is oxidized by permanganate (MnO₄⁻) in faint alkaline medium, it forms iodate (IO₃⁻) and manganese dioxide (MnO₂). The stoichiometric ratio of MnO₄⁻ to I⁻ in the balanced equation is:",
    "options": [
      {
        "key": "A",
        "text": "2 : 1"
      },
      {
        "key": "B",
        "text": "1 : 2"
      },
      {
        "key": "C",
        "text": "5 : 1"
      },
      {
        "key": "D",
        "text": "2 : 5"
      }
    ],
    "correct": "A",
    "formula": "2 MnO₄⁻ + I⁻ + H₂O → 2 MnO₂ + IO₃⁻ + 2 OH⁻",
    "steps": [
      "Step 1: Reduction half-reaction in alkaline medium: MnO₄⁻ (+7) + 2 H₂O + 3 e⁻ → MnO₂ (+4) + 4 OH⁻ (gains 3 e⁻).",
      "Step 2: Oxidation half-reaction: I⁻ (-1) + 6 OH⁻ → IO₃⁻ (+5) + 3 H₂O + 6 e⁻ (loses 6 e⁻).",
      "Step 3: Equalize electron transfer: Multiply reduction half by 2 so it consumes 2 × 3 = 6 e⁻.",
      "Step 4: Balanced net ionic equation:",
      "        2 MnO₄⁻ + I⁻ + H₂O → 2 MnO₂ + IO₃⁻ + 2 OH⁻.",
      "Step 5: The stoichiometric ratio of MnO₄⁻ to I⁻ is 2 : 1."
    ],
    "ans": "2 : 1 (Option A)",
    "trap": "MEDIUM TRAP: In ACIDIC medium, I⁻ oxidizes to I₂ (ratio 2:10 = 1:5). But in FAINTLY ALKALINE medium, I⁻ oxidizes all the way to IO₃⁻ (ratio 2:1)!",
    "distractorTraps": {
      "B": "Inverted the ratio (I⁻ to MnO₄⁻).",
      "C": "Used acidic medium reduction of permanganate (n=5) without checking medium.",
      "D": "Acidic medium ratio for oxidation to I₂ (2 MnO₄⁻ : 10 I⁻)."
    },
    "targetTab": "tab-balance",
    "simParams": {
      "reaction": "MnO4_I_basic"
    },
    "simSummary": [
      "Alkaline medium: I⁻ → IO₃⁻ (6 e⁻ lost)",
      "MnO₄⁻ → MnO₂ (3 e⁻ gained)",
      "Ratio = 2 MnO₄⁻ : 1 I⁻"
    ]
  },
  {
    "id": "REDOX-Q16",
    "num": "JEE Main 2021",
    "source": "JEE Main 2021 (Online) 25th July Morning Shift",
    "subtab": 6,
    "subtabName": "Galvanic Cell & Nernst Potential",
    "year": "2021",
    "q": "Given standard reduction potentials: E°(Zn²⁺/Zn) = -0.76 V and E°(Fe²⁺/Fe) = -0.44 V. The standard EMF of the galvanic cell Zn | Zn²⁺ || Fe²⁺ | Fe and the spontaneity of the forward reaction are:",
    "options": [
      {
        "key": "A",
        "text": "+0.32 V and Spontaneous"
      },
      {
        "key": "B",
        "text": "-0.32 V and Non-spontaneous"
      },
      {
        "key": "C",
        "text": "+1.20 V and Spontaneous"
      },
      {
        "key": "D",
        "text": "-1.20 V and Non-spontaneous"
      }
    ],
    "correct": "A",
    "formula": "E°_cell = E°_cathode - E°_anode. Reaction is spontaneous if E°_cell > 0 (ΔG° < 0).",
    "steps": [
      "Step 1: Identify cathode and anode from cell notation Zn | Zn²⁺ || Fe²⁺ | Fe:",
      "        Anode (oxidation, left): Zn → Zn²⁺ + 2e⁻.",
      "        Cathode (reduction, right): Fe²⁺ + 2e⁻ → Fe.",
      "Step 2: Calculate standard EMF: E°_cell = E°_cathode - E°_anode = E°(Fe²⁺/Fe) - E°(Zn²⁺/Zn).",
      "Step 3: Substitute values: E°_cell = (-0.44 V) - (-0.76 V) = -0.44 + 0.76 = +0.32 V.",
      "Step 4: Since E°_cell > 0, ΔG° = -nFE° < 0, meaning the cell reaction Zn + Fe²⁺ → Zn²⁺ + Fe is thermodynamically spontaneous."
    ],
    "ans": "+0.32 V and Spontaneous (Option A)",
    "trap": "SIGN TRAP: Always subtract the anode potential: E°_cathode - E°_anode = (-0.44) - (-0.76) = +0.32 V, not -1.20 V!",
    "distractorTraps": {
      "B": "Reversed cathode and anode, obtaining -0.32 V.",
      "C": "Subtracted with double negative error: -0.44 - 0.76.",
      "D": "Added negative potentials: -0.44 + (-0.76) = -1.20 V."
    },
    "targetTab": "tab-galvanic",
    "simParams": {
      "concAnode": 1.0,
      "concCathode": 1.0
    },
    "simSummary": [
      "Cathode: Fe²⁺ (-0.44 V)",
      "Anode: Zn (-0.76 V)",
      "E°_cell = +0.32 V (Spontaneous)"
    ]
  },
  {
    "id": "REDOX-Q17",
    "num": "JEE Main 2020",
    "source": "JEE Main 2020 (Online) 6th September Evening Shift",
    "subtab": 1,
    "subtabName": "Structural Bond Cleavage Tool",
    "year": "2020",
    "q": "The individual oxidation states of the two nitrogen atoms in ammonium nitrate (NH₄NO₃) are:",
    "options": [
      {
        "key": "A",
        "text": "-3 and +5"
      },
      {
        "key": "B",
        "text": "+1 and +1"
      },
      {
        "key": "C",
        "text": "-3 and +3"
      },
      {
        "key": "D",
        "text": "0 and +2"
      }
    ],
    "correct": "A",
    "formula": "NH₄NO₃ ionizes into NH₄⁺ and NO₃⁻. In NH₄⁺: x + 4(+1) = +1 ⇒ x = -3. In NO₃⁻: y + 3(-2) = -1 ⇒ y = +5.",
    "steps": [
      "Step 1: NH₄NO₃ is an ionic compound composed of the polyatomic cation NH₄⁺ and the polyatomic anion NO₃⁻.",
      "Step 2: Calculate oxidation state of N in ammonium ion (NH₄⁺):",
      "        x + 4(+1) = +1 ⇒ x + 4 = 1 ⇒ x = -3.",
      "Step 3: Calculate oxidation state of N in nitrate ion (NO₃⁻):",
      "        y + 3(-2) = -1 ⇒ y - 6 = -1 ⇒ y = +5.",
      "Step 4: Average oxidation state from blind molecular formula N₂H₄O₃ is: 2N + 4 - 6 = 0 ⇒ 2N = +2 ⇒ N = +1. But the two nitrogen atoms have real oxidation states of -3 and +5!"
    ],
    "ans": "-3 and +5 (Option A)",
    "trap": "Reporting +1 is the classic average oxidation state trap! The nitrogen in ammonium is in its lowest oxidation state (-3) while in nitrate it is in its highest (+5).",
    "distractorTraps": {
      "B": "Reported the blind algebraic average (+1) for both nitrogen atoms.",
      "C": "Confused nitrate NO₃⁻ with nitrite NO₂⁻ (+3).",
      "D": "Calculated oxidation states incorrectly."
    },
    "targetTab": "tab-structural",
    "simParams": {
      "molecule": "CrO5"
    },
    "simSummary": [
      "NH₄⁺: N is -3 (sp³ tetrahedral)",
      "NO₃⁻: N is +5 (sp² planar)",
      "Average = +1, Real = -3 and +5"
    ]
  },
  {
    "id": "REDOX-Q18",
    "num": "JEE Main 2020",
    "source": "JEE Main 2020 (Online) 3rd September Morning Shift",
    "subtab": 5,
    "subtabName": "Redox Titration Bench",
    "year": "2020",
    "q": "The volume of 0.1 M Na₂S₂O₃ (hypo) required to titrate the iodine liberated by adding excess KI to 25.0 mL of 0.02 M K₂Cr₂O₇ in acidic solution is:",
    "options": [
      {
        "key": "A",
        "text": "30.0 mL"
      },
      {
        "key": "B",
        "text": "15.0 mL"
      },
      {
        "key": "C",
        "text": "10.0 mL"
      },
      {
        "key": "D",
        "text": "5.0 mL"
      }
    ],
    "correct": "A",
    "formula": "Equivalents of K₂Cr₂O₇ = Equivalents of I₂ liberated = Equivalents of Na₂S₂O₃. N₁ V₁ = N₂ V₂.",
    "steps": [
      "Step 1: In acidic medium, K₂Cr₂O₇ has n-factor = 6 (Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O).",
      "        Normality of K₂Cr₂O₇ = Molarity × n = 0.02 M × 6 = 0.12 N.",
      "Step 2: Number of milliequivalents of K₂Cr₂O₇ = N × V = 0.12 N × 25.0 mL = 3.0 meq.",
      "Step 3: In iodometric titration with hypo: 2 S₂O₃²⁻ + I₂ → S₄O₆²⁻ + 2 I⁻.",
      "        Here S₂O₃²⁻ has n-factor = 1 (2S(+2) → 2S(+2.5) + 1e⁻).",
      "        Normality of Na₂S₂O₃ = 0.1 M × 1 = 0.1 N.",
      "Step 4: Law of Equivalence: meq of hypo = meq of K₂Cr₂O₇ ⇒ 0.1 N × V = 3.0 ⇒ V = 30.0 mL."
    ],
    "ans": "30.0 mL (Option A)",
    "trap": "Do not forget that K₂Cr₂O₇ has n-factor = 6 in acid! Using n=1 or n=3 leads to 5 mL or 15 mL traps.",
    "distractorTraps": {
      "B": "Used n-factor = 3 for dichromate (15.0 mL).",
      "C": "Equated molarities directly without n-factor (0.02 × 25 / 0.1 = 5 mL) or calculated 10 mL.",
      "D": "Calculated 5.0 mL using n = 1 for both."
    },
    "targetTab": "tab-titration",
    "simParams": {
      "volume": 30
    },
    "simSummary": [
      "K₂Cr₂O₇: n = 6 ⇒ 3.0 meq",
      "Hypo: n = 1 ⇒ N = 0.1 N",
      "V_hypo = 3.0 / 0.1 = 30.0 mL"
    ]
  },
  {
    "id": "REDOX-Q19",
    "num": "JEE Main 2019",
    "source": "JEE Main 2019 (Online) 10th January Evening Shift",
    "subtab": 6,
    "subtabName": "Galvanic Cell & Nernst Potential",
    "year": "2019",
    "q": "For the Daniell cell Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s), if the concentration of Zn²⁺ is increased by a factor of 10 while keeping [Cu²⁺] constant at 298 K, the cell potential E_cell will:",
    "options": [
      {
        "key": "A",
        "text": "Decrease by 0.0295 V"
      },
      {
        "key": "B",
        "text": "Increase by 0.0295 V"
      },
      {
        "key": "C",
        "text": "Decrease by 0.0591 V"
      },
      {
        "key": "D",
        "text": "Increase by 0.0591 V"
      }
    ],
    "correct": "A",
    "formula": "E_cell = E° - (0.0591 / n) log([Zn²⁺] / [Cu²⁺]), with n = 2",
    "steps": [
      "Step 1: Write overall cell reaction: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), where n = 2 electrons transferred.",
      "Step 2: Nernst equation at 298 K: E_cell = E°_cell - (0.0591 / 2) log Q = E°_cell - 0.02955 log([Zn²⁺] / [Cu²⁺]).",
      "Step 3: When [Zn²⁺] increases by 10 times: Δ(log Q) = log(10) = 1.",
      "Step 4: Change in EMF: ΔE = -0.02955 × 1 = -0.02955 V ≈ -0.0295 V.",
      "Step 5: Therefore, the cell potential decreases by 0.0295 V."
    ],
    "ans": "Decrease by 0.0295 V (Option A)",
    "trap": "Notice that Zn²⁺ is the OXIDIZED product on the right side of the reaction! Increasing product concentration shifts equilibrium backward (Le Chatelier) and reduces EMF by 0.0591 / n = 0.0295 V.",
    "distractorTraps": {
      "B": "Assumed increasing ion concentration increases cell potential.",
      "C": "Forgot n = 2 in the Nernst denominator, obtaining -0.0591 V.",
      "D": "Forgot n = 2 and inverted sign."
    },
    "targetTab": "tab-galvanic",
    "simParams": {
      "concAnode": 10.0,
      "concCathode": 1.0
    },
    "simSummary": [
      "n = 2 electrons",
      "log([Zn²⁺]/[Cu²⁺]) increases by 1",
      "ΔE = -(0.0591/2) × 1 = -0.0295 V"
    ]
  },
  {
    "id": "REDOX-Q20",
    "num": "JEE Main 2018",
    "source": "JEE Main 2018 (Offline) 8th April Shift",
    "subtab": 1,
    "subtabName": "Structural Bond Cleavage Tool",
    "year": "2018",
    "q": "Red lead (minium, Pb₃O₄) is a mixed oxide. The individual oxidation states of lead and their stoichiometric ratio are:",
    "options": [
      {
        "key": "A",
        "text": "Two Pb in +2 and one Pb in +4 (Ratio 2:1)"
      },
      {
        "key": "B",
        "text": "All three Pb in +8/3"
      },
      {
        "key": "C",
        "text": "One Pb in +2 and two Pb in +3 (Ratio 1:2)"
      },
      {
        "key": "D",
        "text": "Two Pb in +3 and one Pb in +2 (Ratio 2:1)"
      }
    ],
    "correct": "A",
    "formula": "Pb₃O₄ = 2 PbO · PbO₂. Reaction with HNO₃ yields 2 Pb(NO₃)₂ + PbO₂ + 2 H₂O.",
    "steps": [
      "Step 1: Red lead has formula Pb₃O₄. Blind algebra gives 3x - 8 = 0 ⇒ x = +8/3 (fractional average).",
      "Step 2: In reality, Pb₃O₄ is a stoichiometric mixed crystal oxide: 2 PbO · PbO₂ (dilead(II) lead(IV) oxide).",
      "Step 3: Two lead atoms are in +2 oxidation state (basic PbO component).",
      "Step 4: One lead atom is in +4 oxidation state (acidic/amphoteric PbO₂ component).",
      "Step 5: Chemical proof: When treated with dilute HNO₃, only the basic PbO dissolves to form Pb(NO₃)₂, leaving insoluble brown PbO₂ precipitate:",
      "        Pb₃O₄ + 4 HNO₃ → 2 Pb(NO₃)₂ [Pb²⁺] + PbO₂↓ [Pb⁴⁺] + 2 H₂O."
    ],
    "ans": "Two Pb in +2 and one Pb in +4 (Ratio 2:1) (Option A)",
    "trap": "FRACTIONAL OXIDATION STATE TRAP: Fractional oxidation states like +8/3 are merely mathematical averages; individual atoms always carry integer oxidation states!",
    "distractorTraps": {
      "B": "Reported fractional mathematical average +8/3.",
      "C": "Pb does not exhibit stable +3 oxidation state due to inert pair effect.",
      "D": "Incorrect stoichiometric ratio."
    },
    "targetTab": "tab-structural",
    "simParams": {
      "molecule": "CrO5"
    },
    "simSummary": [
      "Pb₃O₄ = 2 PbO · PbO₂",
      "Two Pb(+2) : One Pb(+4)",
      "PbO dissolves in HNO₃, PbO₂ remains insoluble"
    ]
  }
];
