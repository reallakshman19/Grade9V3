/**
 * Chemical Bonding and Molecular Structure
 * Master Question Registry & Step-by-Step Solutions Database
 * Curated from ExamSIDE IIT-JEE Main Questions (2013-2026)
 */
window.JEE_QUESTIONS_DATA = [
  {
    "id": "BOND-Q01",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 8th April Morning Shift",
    "subtab": 5,
    "subtabName": "Molecular Orbital Theory (MOT)",
    "year": "2026",
    "q": "According to Molecular Orbital Theory (MOT), which of the following oxygen species is diamagnetic and has the shortest bond length?",
    "options": [
      { "key": "A", "text": "O₂²⁺" },
      { "key": "B", "text": "O₂" },
      { "key": "C", "text": "O₂⁻" },
      { "key": "D", "text": "O₂²⁻" }
    ],
    "correct": "A",
    "formula": "Bond Order BO = ½ (N_b - N_a). Bond Length ∝ 1 / (Bond Order). Species is diamagnetic if all electrons are paired.",
    "steps": [
      "Step 1: Write electronic configuration of neutral O₂ (16 electrons, > 14 e⁻, NO 2s-2p mixing):",
      "        σ₁ₛ² σ*₁ₛ² σ₂ₛ² σ*₂ₛ² σ₂ₚ_z² (π₂ₚ_x² = π₂ₚ_y²) (π*₂ₚ_x¹ = π*₂ₚ_y¹).",
      "        For neutral O₂: N_b = 10, N_a = 6 ⇒ BO = ½ (10 - 6) = 2.0. Paramagnetic (2 unpaired electrons).",
      "Step 2: For O₂²⁺ (14 electrons, like N₂):",
      "        Remove 2 electrons from the antibonding π* orbitals: N_b = 10, N_a = 4.",
      "        BO = ½ (10 - 4) = 3.0. All electrons are paired ⇒ Diamagnetic!",
      "Step 3: For O₂⁻ (17 electrons): BO = ½ (10 - 7) = 1.5. Paramagnetic (1 unpaired electron).",
      "Step 4: For O₂²⁻ (18 electrons, peroxide): BO = ½ (10 - 8) = 1.0. Diamagnetic.",
      "Step 5: Comparing Bond Orders: O₂²⁺ (3.0) > O₂ (2.0) > O₂⁻ (1.5) > O₂²⁻ (1.0).",
      "Step 6: Since Bond Length ∝ 1 / (Bond Order), O₂²⁺ has the highest bond order (3.0) and therefore the SHORTEST bond length, while being completely diamagnetic."
    ],
    "ans": "O₂²⁺ (Option A)",
    "trap": "Both O₂²⁺ and O₂²⁻ are diamagnetic! But O₂²⁻ has a single bond (BO = 1.0, longest bond length), whereas O₂²⁺ has a triple bond (BO = 3.0, shortest bond length).",
    "distractorTraps": {
      "B": "O₂ is paramagnetic with 2 unpaired electrons (famous experiment with liquid O₂ sticking to magnets).",
      "C": "O₂⁻ (superoxide) is paramagnetic with 1 unpaired electron.",
      "D": "O₂²⁻ is diamagnetic, but has the LONGEST bond length (BO = 1.0 vs 3.0)."
    },
    "targetTab": "tab-mot",
    "simParams": { "species": "O2_2plus", "electrons": 14, "bo": 3.0, "magnetic": "Diamagnetic" },
    "simSummary": ["O₂²⁺ (14 electrons)", "Bond Order = 3.0 (Triple Bond)", "Shortest Bond Length", "Diamagnetic (0 Unpaired)"]
  },
  {
    "id": "BOND-Q02",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 24th January Morning Shift",
    "subtab": 2,
    "subtabName": "3D VSEPR & Bent's Rule",
    "year": "2025",
    "q": "The geometry and net dipole moment of XeF₄ and SF₄ respectively are:",
    "options": [
      { "key": "A", "text": "XeF₄: Square planar, μ = 0; SF₄: See-saw, μ ≠ 0" },
      { "key": "B", "text": "XeF₄: Tetrahedral, μ = 0; SF₄: Square planar, μ = 0" },
      { "key": "C", "text": "XeF₄: See-saw, μ ≠ 0; SF₄: Square planar, μ = 0" },
      { "key": "D", "text": "XeF₄: Square planar, μ ≠ 0; SF₄: See-saw, μ = 0" }
    ],
    "correct": "A",
    "formula": "Steric Number = Bond Pairs + Lone Pairs. XeF₄ = 4 + 2 = 6 (sp³d²). SF₄ = 4 + 1 = 5 (sp³d)",
    "steps": [
      "Step 1: Calculate Steric Number for XeF₄: Xe has 8 valence electrons. 4 bond pairs to F + 2 lone pairs = 6 electron domains ⇒ Octahedral electronic geometry.",
      "Step 2: VSEPR minimization puts the 2 lone pairs opposite to each other (axial positions, 180° apart) to minimize 90° lp-bp repulsions.",
      "Step 3: The 4 fluorine atoms lie in a single plane at 90° angles ⇒ Square Planar molecular geometry.",
      "Step 4: Vectorial Dipole Sum for XeF₄: The four Xe-F bond dipoles cancel out in pairs in the plane, and the two axial lone pair moments cancel each other ⇒ Net Dipole Moment μ = 0.",
      "Step 5: Calculate Steric Number for SF₄: S has 6 valence electrons. 4 bond pairs to F + 1 lone pair = 5 electron domains ⇒ Trigonal Bipyramidal electronic geometry.",
      "Step 6: Bent's Rule / VSEPR: Lone pair occupies an equatorial position (experiencing only two 90° repulsions instead of three) ⇒ See-saw molecular geometry.",
      "Step 7: In See-saw SF₄, the axial F-S-F bond angle is ~173° (bent by lone pair) and equatorial F-S-F angle is ~102°. The dipoles do NOT cancel ⇒ Net Dipole Moment μ ≠ 0."
    ],
    "ans": "XeF₄: Square planar, μ = 0; SF₄: See-saw, μ ≠ 0 (Option A)",
    "trap": "Do not treat XeF₄ as tetrahedral! The two lone pairs force it into an octahedral family with square planar geometry.",
    "distractorTraps": {
      "B": "Assumed 4 substituents always mean tetrahedral.",
      "C": "Swapped geometries of XeF₄ and SF₄.",
      "D": "Inverted dipole moments."
    },
    "targetTab": "tab-vsepr",
    "simParams": { "molecule": "XeF4", "shape": "Square Planar", "dipole": 0 },
    "simSummary": ["XeF₄: Steric 6 (sp³d²), 2 Axial Lone Pairs, Square Planar, μ = 0", "SF₄: Steric 5 (sp³d), 1 Equatorial Lone Pair, See-saw, μ ≠ 0"]
  },
  {
    "id": "BOND-Q03",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 27th January Evening Shift",
    "subtab": 3,
    "subtabName": "Vectorial Dipole Moments",
    "year": "2024",
    "q": "Although Nitrogen and Fluorine are both highly electronegative, the dipole moment of NH₃ (1.47 D) is significantly greater than that of NF₃ (0.24 D). The correct explanation is:",
    "options": [
      { "key": "A", "text": "In NH₃, the orbital dipole of the lone pair reinforces the resultant N-H bond dipoles, whereas in NF₃ it opposes the N-F bond dipoles." },
      { "key": "B", "text": "The N-H bond is more polar than the N-F bond." },
      { "key": "C", "text": "NF₃ is planar while NH₃ is pyramidal." },
      { "key": "D", "text": "NH₃ has atomic number smaller than NF₃." }
    ],
    "correct": "A",
    "formula": "μ_net = Σ μ_bond + μ_lonepair (Vector sum in 3D)",
    "steps": [
      "Step 1: Both NH₃ and NF₃ have trigonal pyramidal geometries (Steric number 4, 3 bond pairs + 1 lone pair, sp³ hybridization).",
      "Step 2: In NH₃, Nitrogen is more electronegative than Hydrogen (EN: N = 3.04, H = 2.20). Therefore, the three N-H bond dipoles point UPWARD toward Nitrogen.",
      "Step 3: The lone pair dipole also points UPWARD away from the Nitrogen nucleus. Thus, all four vector dipoles reinforce in the same direction ⇒ High dipole moment (μ = 1.47 D).",
      "Step 4: In NF₃, Fluorine is more electronegative than Nitrogen (EN: F = 3.98, N = 3.04). Therefore, the three N-F bond dipoles point DOWNWARD toward the Fluorines.",
      "Step 5: The lone pair dipole points UPWARD, directly OPPOSING the downward resultant of the three N-F bonds ⇒ Drastic cancellation ⇒ Small net dipole moment (μ = 0.24 D)."
    ],
    "ans": "In NH₃, lone pair reinforces N-H bonds; in NF₃, lone pair opposes N-F bonds (Option A)",
    "trap": "Do not argue that N-F bond is less polar; F is the most electronegative element! The cancellation is purely VECTORIAL in 3D.",
    "distractorTraps": {
      "B": "False: N-F electronegativity difference (0.94) is greater than N-H (0.84).",
      "C": "Both molecules are pyramidal; neither is planar.",
      "D": "Atomic number does not determine dipole moment."
    },
    "targetTab": "tab-dipole",
    "simParams": { "molA": "NH3", "muA": 1.47, "molB": "NF3", "muB": 0.24 },
    "simSummary": ["NH₃: 3 N-H (↑) + Lone Pair (↑) = Reinforcing (μ = 1.47 D)", "NF₃: 3 N-F (↓) + Lone Pair (↑) = Opposing (μ = 0.24 D)"]
  },
  {
    "id": "BOND-Q04",
    "num": "JEE Main 2026",
    "source": "JEE Main 2026 (Online) 5th April Morning Shift",
    "subtab": 4,
    "subtabName": "Hybridization & Axial Elongation",
    "year": "2026",
    "q": "In gaseous phosphorus pentachloride (PCl₅), the axial P-Cl bonds are longer and weaker than the equatorial P-Cl bonds because:",
    "options": [
      { "key": "A", "text": "Axial bond pairs experience three 90° repulsions from equatorial bond pairs, whereas equatorial pairs experience only two 90° repulsions." },
      { "key": "B", "text": "Axial bonds are formed by pure p-orbitals while equatorial bonds are sp²." },
      { "key": "C", "text": "Chlorine atoms in axial positions are more electronegative." },
      { "key": "D", "text": "PCl₅ is unstable and immediately dissociates." }
    ],
    "correct": "A",
    "formula": "In sp³d trigonal bipyramidal: Axial pairs suffer 3 × 90° bp-bp repulsions; Equatorial pairs suffer 2 × 90° bp-bp repulsions.",
    "steps": [
      "Step 1: PCl₅ has sp³d hybridization (Steric number = 5, trigonal bipyramidal geometry).",
      "Step 2: An axial P-Cl bond lies at 90° to all three equatorial P-Cl bonds. Hence, each axial bond pair suffers THREE 90° electron-pair repulsions.",
      "Step 3: An equatorial P-Cl bond lies at 120° to the other two equatorial bonds and 90° to the two axial bonds. Hence, each equatorial bond pair suffers only TWO 90° repulsions (120° repulsions are negligible).",
      "Step 4: Due to greater repulsive force (3 vs 2), the axial bond pairs are pushed further away from the central Phosphorus nucleus to minimize repulsion.",
      "Step 5: Consequently, axial bonds are longer (240 pm) and weaker than equatorial bonds (202 pm), explaining why PCl₅ easily dissociates into PCl₃ + Cl₂ upon heating!"
    ],
    "ans": "Axial bond pairs suffer three 90° repulsions vs two for equatorial pairs (Option A)",
    "trap": "All 5 attached atoms are identical chlorine atoms! The bond asymmetry arises purely from the non-equivalent 3D spatial geometry.",
    "distractorTraps": {
      "B": "sp³d is often conceptualized as sp² + pd_z², but the physical cause of elongation is 90° repulsion balance.",
      "C": "All five chlorines have identical electronegativity.",
      "D": "PCl₅ exists stably in the gas phase at moderate temperatures."
    },
    "targetTab": "tab-hybridization",
    "simParams": { "axialLength": 240, "equatorialLength": 202, "repulsionAxial": 3, "repulsionEquat": 2 },
    "simSummary": ["PCl₅ (sp³d Trigonal Bipyramidal)", "3 Equatorial P-Cl: 202 pm (Shorter, Stronger)", "2 Axial P-Cl: 240 pm (Longer, Weaker)", "Dissociation: PCl₅ → PCl₃ + Cl₂"]
  },
  {
    "id": "BOND-Q05",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 30th January Morning Shift",
    "subtab": 6,
    "subtabName": "Hydrogen Bonding & Physical Properties",
    "year": "2025",
    "q": "ortho-Nitrophenol is steam volatile and has a lower boiling point than para-nitrophenol because:",
    "options": [
      { "key": "A", "text": "o-Nitrophenol exhibits intramolecular H-bonding (chelation), while p-nitrophenol exhibits intermolecular H-bonding." },
      { "key": "B", "text": "o-Nitrophenol has a higher molecular weight." },
      { "key": "C", "text": "p-Nitrophenol has intramolecular H-bonding." },
      { "key": "D", "text": "o-Nitrophenol is non-polar." }
    ],
    "correct": "A",
    "formula": "Intramolecular H-bonding prevents association with neighboring molecules; Intermolecular H-bonding causes molecular association.",
    "steps": [
      "Step 1: In ortho-nitrophenol, the -OH and -NO₂ groups are adjacent (1,2-positions on benzene ring).",
      "Step 2: The phenolic hydrogen forms a 6-membered planar ring with the oxygen of the adjacent nitro group: INTRAMOLECULAR Hydrogen Bonding (chelation).",
      "Step 3: This internal bonding prevents the molecule from associating with neighboring molecules, keeping it as discrete, non-associated units with low boiling point and high steam volatility.",
      "Step 4: In para-nitrophenol, the -OH and -NO₂ groups are far apart (1,4-positions). Intramolecular H-bonding is geometrically impossible!",
      "Step 5: Instead, p-nitrophenol forms strong INTERMOLECULAR Hydrogen Bonds between adjacent molecules, creating extensive molecular associations that require much higher thermal energy to vaporize."
    ],
    "ans": "o-Nitrophenol exhibits intramolecular H-bonding; p-nitrophenol exhibits intermolecular H-bonding (Option A)",
    "trap": "Do not swap the two! ortho = internal chelation (steam volatile); para = intermolecular association (high boiling point).",
    "distractorTraps": {
      "B": "Both are constitutional isomers with identical molecular weight (139.11 g/mol).",
      "C": "Inverted the positions: para groups are too far apart for internal bonding.",
      "D": "Both isomers have polar bonds."
    },
    "targetTab": "tab-hbonding",
    "simParams": { "isomer": "ortho", "hBondType": "Intramolecular", "bp": "Lower (Volatile)" },
    "simSummary": ["o-Nitrophenol: Intramolecular H-Bond (Cheled 6-Ring) → Steam Volatile", "p-Nitrophenol: Intermolecular H-Bond (Linear Chains) → High BP"]
  },
  {
    "id": "BOND-Q06",
    "num": "JEE Main 2024",
    "source": "JEE Main 2024 (Online) 27th January Morning Shift",
    "subtab": 5,
    "subtabName": "Molecular Orbital Theory (MOT)",
    "year": "2024",
    "q": "According to Molecular Orbital Theory (MOT), which of the following homonuclear diatomic species is paramagnetic with two unpaired electrons in degenerate π orbitals despite having an even total number of electrons?",
    "options": [
      { "key": "A", "text": "B₂ and O₂" },
      { "key": "B", "text": "C₂ and N₂" },
      { "key": "C", "text": "Li₂ and Be₂" },
      { "key": "D", "text": "N₂ and O₂²⁻" }
    ],
    "correct": "A",
    "formula": "B₂ (10e⁻): π_2p_x¹ = π_2p_y¹ (2 unpaired e⁻). O₂ (16e⁻): π*_2p_x¹ = π*_2p_y¹ (2 unpaired e⁻)",
    "steps": [
      "Step 1: Write MOT configuration for B₂ (10 electrons, ≤ 14e⁻ regime with 2s-2p mixing crossover): σ_1s² σ*_1s² σ_2s² σ*_2s² (π_2p_x¹ = π_2p_y¹). The last two electrons singly occupy the degenerate bonding π_2p orbitals with parallel spins ⇒ Paramagnetic (2 unpaired electrons).",
      "Step 2: Write MOT configuration for C₂ (12 electrons): σ_1s² σ*_1s² σ_2s² σ*_2s² (π_2p_x² = π_2p_y²). All electrons are paired ⇒ Diamagnetic.",
      "Step 3: Write MOT configuration for O₂ (16 electrons, > 14e⁻ regime without crossover): σ_1s² σ*_1s² σ_2s² σ*_2s² σ_2p_z² (π_2p_x² = π_2p_y²) (π*_2p_x¹ = π*_2p_y¹). The last two electrons singly occupy the degenerate antibonding π* orbitals ⇒ Paramagnetic (2 unpaired electrons).",
      "Step 4: Therefore, both B₂ and O₂ have two unpaired electrons in degenerate π orbitals and are paramagnetic."
    ],
    "ans": "B₂ and O₂ (Option A)",
    "trap": "Lewis electron-dot structures erroneously predict both B₂ and O₂ to have only paired electrons (diamagnetic). MOT's successful prediction of paramagnetism was historical proof of molecular orbital theory!",
    "distractorTraps": {
      "B": "C₂ and N₂ have all paired electrons and are diamagnetic.",
      "C": "Li₂ is diamagnetic; Be₂ has bond order 0 and does not exist.",
      "D": "N₂ and O₂²⁻ have all paired electrons."
    },
    "targetTab": "tab-mot",
    "simParams": { "electrons": 16, "species": "O2" },
    "simSummary": ["B₂ (10 e⁻): π_2p_x¹ = π_2p_y¹ (2 unpaired e⁻, Paramagnetic)", "O₂ (16 e⁻): π*_2p_x¹ = π*_2p_y¹ (2 unpaired e⁻, Paramagnetic)"]
  },
  {
    "id": "BOND-Q07",
    "num": "JEE Main 2023",
    "source": "JEE Main 2023 (Online) 25th January Evening Shift",
    "subtab": 3,
    "subtabName": "Vectorial Dipole Moments",
    "year": "2023",
    "q": "Both ammonia (NH₃) and nitrogen trifluoride (NF₃) have trigonal pyramidal geometries with one lone pair on nitrogen. However, the dipole moment of NH₃ (1.47 D) is substantially greater than that of NF₃ (0.24 D) because:",
    "options": [
      { "key": "A", "text": "In NH₃, the lone-pair orbital dipole and N-H bond dipoles reinforce each other; in NF₃, the lone-pair dipole opposes the N-F bond dipoles." },
      { "key": "B", "text": "Nitrogen is more electronegative than fluorine." },
      { "key": "C", "text": "NF₃ is a planar molecule while NH₃ is pyramidal." },
      { "key": "D", "text": "The N-H bond length is greater than the N-F bond length." }
    ],
    "correct": "A",
    "formula": "μ_net = μ_lone-pair + ∑ μ_bond (Vector addition)",
    "steps": [
      "Step 1: Both NH₃ and NF₃ have sp³ hybridized nitrogen with 3 bond pairs and 1 lone pair (trigonal pyramidal geometry).",
      "Step 2: In NH₃, EN(N) = 3.0 > EN(H) = 2.1. The three N-H bond dipoles point toward nitrogen (upward toward the apex), in the same direction as the upward orbital dipole of the lone pair. The vectors reinforce constructively ⇒ μ_net = 1.47 D.",
      "Step 3: In NF₃, EN(F) = 4.0 > EN(N) = 3.0. The three N-F bond dipoles point downward away from nitrogen toward fluorine, OPPOSING the upward lone-pair dipole. The vectors cancel destructively ⇒ μ_net = 0.24 D.",
      "Step 4: Vectorial cancellation explains why NF₃ has a remarkably small dipole moment despite having highly polar N-F bonds."
    ],
    "ans": "In NH₃, lone pair and bond dipoles reinforce; in NF₃, they oppose (Option A)",
    "trap": "Never judge net dipole by bond polarity alone! Fluorine is far more electronegative than hydrogen, but vectorial direction causes nearly complete cancellation in NF₃.",
    "distractorTraps": {
      "B": "Factually incorrect: EN(F) = 4.0 is much higher than EN(N) = 3.0.",
      "C": "Both molecules are trigonal pyramidal.",
      "D": "Bond length difference does not account for vector opposition."
    },
    "targetTab": "tab-dipole",
    "simParams": { "molecule": "NH3_vs_NF3", "mu_NH3": 1.47, "mu_NF3": 0.24 },
    "simSummary": ["NH₃: N-H dipoles add to lone pair vector (μ = 1.47 D)", "NF₃: N-F dipoles oppose lone pair vector (μ = 0.24 D)"]
  },
  {
    "id": "BOND-Q08",
    "num": "JEE Main 2025",
    "source": "JEE Main 2025 (Online) 29th January Evening Shift",
    "subtab": 1,
    "subtabName": "Lewis Structures & Formal Charge",
    "year": "2025",
    "q": "In the resonance contributor of the ozone molecule (O₃: O_a - O_b = O_c), the formal charges on the single-bonded terminal oxygen (O_a), the central oxygen (O_b), and the double-bonded terminal oxygen (O_c) are respectively:",
    "options": [
      { "key": "A", "text": "-1, +1, 0" },
      { "key": "B", "text": "0, +1, -1" },
      { "key": "C", "text": "+1, -1, 0" },
      { "key": "D", "text": "0, 0, 0" }
    ],
    "correct": "A",
    "formula": "Formal Charge = Valence e⁻ - Non-bonding e⁻ - ½(Bonding e⁻)",
    "steps": [
      "Step 1: Apply the universal formal charge formula: FC = V - L - ½ B.",
      "Step 2: For central oxygen O_b: V = 6, 1 lone pair (L = 2), 1 single bond + 1 double bond (B = 6). FC(O_b) = 6 - 2 - ½(6) = 6 - 2 - 3 = +1.",
      "Step 3: For terminal single-bonded oxygen O_a: V = 6, 3 lone pairs (L = 6), 1 single bond (B = 2). FC(O_a) = 6 - 6 - ½(2) = 6 - 6 - 1 = -1.",
      "Step 4: For terminal double-bonded oxygen O_c: V = 6, 2 lone pairs (L = 4), 1 double bond (B = 4). FC(O_c) = 6 - 4 - ½(4) = 6 - 4 - 2 = 0.",
      "Step 5: Check sum of formal charges: (-1) + (+1) + 0 = 0 (neutral molecule). Hence the charges are -1, +1, 0."
    ],
    "ans": "-1, +1, 0 (Option A)",
    "trap": "Always count individual non-bonding electrons L, not electron pairs! In O_a, 3 lone pairs = 6 non-bonding electrons.",
    "distractorTraps": {
      "B": "Inverted the terminal oxygen positions.",
      "C": "Assigned positive charge to the terminal oxygen.",
      "D": "Assumed all atoms in a neutral molecule have zero formal charge."
    },
    "targetTab": "tab-lewis",
    "simParams": { "molecule": "O3", "fc_central": 1, "fc_single": -1, "fc_double": 0 },
    "simSummary": ["O₃ Lewis Structure", "Central O: FC = 6 - 2 - 3 = +1", "Single-bonded O: FC = 6 - 6 - 1 = -1", "Double-bonded O: FC = 6 - 4 - 2 = 0"]
  }
];
