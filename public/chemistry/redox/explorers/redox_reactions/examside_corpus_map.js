/* Redox content map against the live ExamSIDE JEE Main topic index (snapshot 2026-09-20). */
window.REDOX_CONTENT_TRACKS = [
  {
    "id": "OS",
    "order": 1,
    "title": "Oxidation-state model & structural exceptions",
    "mode": "HARD CONCEPT",
    "pivot": "Default oxidation-state rules are conditional; structure or ion identity can change the valid assignment.",
    "visual": "formula → ion/structure → atom-specific charge ledger",
    "implementation": "Assign formal oxidation states, distinguish averages from mixed values, and close the total charge.",
    "targetTab": "tab-structural-ox",
    "priority50": true,
    "core": true
  },
  {
    "id": "ROLE",
    "order": 2,
    "title": "Oxidising/reducing roles & redox classification",
    "mode": "HARD CONCEPT",
    "pivot": "Roles come from electron transfer, not from a memorised reagent label.",
    "visual": "donor ↔ electrons ↔ acceptor; classify the same reaction by electron flow and reaction type",
    "implementation": "Identify oxidant/reductant and distinguish redox, displacement, combination and decomposition.",
    "targetTab": "tab-electron-flow",
    "priority50": false,
    "core": true
  },
  {
    "id": "DISP",
    "order": 3,
    "title": "Disproportionation",
    "mode": "HARD CONCEPT",
    "pivot": "One starting oxidation state can split into simultaneous oxidation and reduction products.",
    "visual": "one oxidation-state node → upward branch + downward branch → matched electron ledger",
    "implementation": "Recognise disproportionation and determine product ratios / n-factor from matched electron transfer.",
    "targetTab": "tab-nfactor",
    "priority50": true,
    "core": true
  },
  {
    "id": "BAL",
    "order": 4,
    "title": "Half-reaction balancing & reaction medium",
    "mode": "IMPLEMENTATION",
    "pivot": "Redox equations are atom conservation plus charge conservation; electrons are the balancing currency.",
    "visual": "atom ledger → H/O balance → charge ledger → electrons → acidic/basic conversion",
    "implementation": "Balance half-reactions and read stoichiometric coefficients in the stated medium.",
    "targetTab": "tab-ion-electron",
    "priority50": false,
    "core": true
  },
  {
    "id": "NFACTOR",
    "order": 5,
    "title": "Reaction-dependent n-factor",
    "mode": "HARD CONCEPT + IMPLEMENTATION",
    "pivot": "n-factor belongs to the actual reaction pathway; the product fixes the oxidation-state change.",
    "visual": "medium / product → final oxidation state → ΔO.S. → electron count → n",
    "implementation": "Compute n-factor and equivalent mass only after identifying the actual product.",
    "targetTab": "tab-nfactor",
    "priority50": true,
    "core": true
  },
  {
    "id": "EQUIV",
    "order": 6,
    "title": "Electron-equivalence stoichiometry",
    "mode": "IMPLEMENTATION",
    "pivot": "Stoichiometric ratios come from matching total electrons lost and gained.",
    "visual": "donor electron inventory ↔ acceptor electron capacity",
    "implementation": "Count every redox-active part of a formula unit and convert electron balance into mole/volume ratios.",
    "targetTab": "tab-titration",
    "priority50": true,
    "core": true
  },
  {
    "id": "TITR",
    "order": 7,
    "title": "Redox titration & practical chemistry",
    "mode": "IMPLEMENTATION",
    "pivot": "Titration is electron-equivalence applied to measured quantities, with reaction-specific practical constraints.",
    "visual": "burette/flask quantities → equivalents → endpoint / iodometric chain",
    "implementation": "Solve KMnO₄, dichromate, thiosulfate and practical redox-titration questions.",
    "targetTab": "tab-titration",
    "priority50": false,
    "core": true
  },
  {
    "id": "RELATED",
    "order": 8,
    "title": "Adjacent equivalents / acid-base items on the ExamSIDE page",
    "mode": "ADJACENT IMPLEMENTATION",
    "pivot": "These use equivalent/normality arithmetic but do not exercise the central redox mechanism.",
    "visual": "equivalent-count bookkeeping only",
    "implementation": "Handle normality, neutralisation and related equivalent-weight calculations without mislabelling them as redox conceptual evidence.",
    "targetTab": "tab-titration",
    "priority50": false,
    "core": false
  },
  {
    "id": "OFFCORP",
    "order": 9,
    "title": "Electrochemistry extension in the local suite",
    "mode": "OFF-CORPUS EXTENSION",
    "pivot": "Galvanic-cell and Nernst reasoning is useful extension material, but ExamSIDE lists Electrochemistry as a separate topic from Redox.",
    "visual": "anode/cathode → electron flow → E° / Nernst",
    "implementation": "Use reduction potentials and reaction quotient only as a separate extension.",
    "targetTab": "tab-galvanic",
    "priority50": false,
    "core": false
  }
];
window.EXAMSIDE_REDOX_CORPUS_META = {
  "provider": "ExamSIDE",
  "topic": "JEE Main Chemistry · Redox Reactions",
  "topicUrl": "https://questions.examside.com/past-years/jee/jee-main/chemistry/redox-reactions",
  "snapshotDate": "2026-09-20",
  "liveCount": 74,
  "numericalCount": 29,
  "mcqCount": 45,
  "embeddedAuditedCount": 20,
  "mappingStatus": "CORPUS_INDEX_MAPPED_LOCAL_SOURCES_PENDING",
  "note": "All 74 live corpus positions are mapped to one primary learning track. The 20 local items are mapped pedagogically but their one-to-one ExamSIDE source provenance remains pending."
};
window.EXAMSIDE_REDOX_CORPUS_MAP = [
  {
    "ref": "N01",
    "kind": "Numerical",
    "ordinal": 1,
    "year": 2026,
    "track": "TITR"
  },
  {
    "ref": "N02",
    "kind": "Numerical",
    "ordinal": 2,
    "year": 2026,
    "track": "TITR"
  },
  {
    "ref": "N03",
    "kind": "Numerical",
    "ordinal": 3,
    "year": 2026,
    "track": "NFACTOR"
  },
  {
    "ref": "N04",
    "kind": "Numerical",
    "ordinal": 4,
    "year": 2026,
    "track": "EQUIV"
  },
  {
    "ref": "N05",
    "kind": "Numerical",
    "ordinal": 5,
    "year": 2025,
    "track": "NFACTOR"
  },
  {
    "ref": "N06",
    "kind": "Numerical",
    "ordinal": 6,
    "year": 2025,
    "track": "RELATED"
  },
  {
    "ref": "N07",
    "kind": "Numerical",
    "ordinal": 7,
    "year": 2024,
    "track": "TITR"
  },
  {
    "ref": "N08",
    "kind": "Numerical",
    "ordinal": 8,
    "year": 2024,
    "track": "OS"
  },
  {
    "ref": "N09",
    "kind": "Numerical",
    "ordinal": 9,
    "year": 2024,
    "track": "EQUIV"
  },
  {
    "ref": "N10",
    "kind": "Numerical",
    "ordinal": 10,
    "year": 2024,
    "track": "DISP"
  },
  {
    "ref": "N11",
    "kind": "Numerical",
    "ordinal": 11,
    "year": 2024,
    "track": "BAL"
  },
  {
    "ref": "N12",
    "kind": "Numerical",
    "ordinal": 12,
    "year": 2024,
    "track": "OS"
  },
  {
    "ref": "N13",
    "kind": "Numerical",
    "ordinal": 13,
    "year": 2023,
    "track": "BAL"
  },
  {
    "ref": "N14",
    "kind": "Numerical",
    "ordinal": 14,
    "year": 2023,
    "track": "NFACTOR"
  },
  {
    "ref": "N15",
    "kind": "Numerical",
    "ordinal": 15,
    "year": 2023,
    "track": "OS"
  },
  {
    "ref": "N16",
    "kind": "Numerical",
    "ordinal": 16,
    "year": 2023,
    "track": "OS"
  },
  {
    "ref": "N17",
    "kind": "Numerical",
    "ordinal": 17,
    "year": 2023,
    "track": "OS"
  },
  {
    "ref": "N18",
    "kind": "Numerical",
    "ordinal": 18,
    "year": 2023,
    "track": "OS"
  },
  {
    "ref": "N19",
    "kind": "Numerical",
    "ordinal": 19,
    "year": 2023,
    "track": "RELATED"
  },
  {
    "ref": "N20",
    "kind": "Numerical",
    "ordinal": 20,
    "year": 2022,
    "track": "RELATED"
  },
  {
    "ref": "N21",
    "kind": "Numerical",
    "ordinal": 21,
    "year": 2022,
    "track": "TITR"
  },
  {
    "ref": "N22",
    "kind": "Numerical",
    "ordinal": 22,
    "year": 2022,
    "track": "TITR"
  },
  {
    "ref": "N23",
    "kind": "Numerical",
    "ordinal": 23,
    "year": 2022,
    "track": "RELATED"
  },
  {
    "ref": "N24",
    "kind": "Numerical",
    "ordinal": 24,
    "year": 2021,
    "track": "TITR"
  },
  {
    "ref": "N25",
    "kind": "Numerical",
    "ordinal": 25,
    "year": 2021,
    "track": "OS"
  },
  {
    "ref": "N26",
    "kind": "Numerical",
    "ordinal": 26,
    "year": 2021,
    "track": "RELATED"
  },
  {
    "ref": "N27",
    "kind": "Numerical",
    "ordinal": 27,
    "year": 2020,
    "track": "EQUIV"
  },
  {
    "ref": "N28",
    "kind": "Numerical",
    "ordinal": 28,
    "year": 2020,
    "track": "RELATED"
  },
  {
    "ref": "N29",
    "kind": "Numerical",
    "ordinal": 29,
    "year": 2020,
    "track": "OS"
  },
  {
    "ref": "M01",
    "kind": "MCQ",
    "ordinal": 1,
    "year": 2026,
    "track": "EQUIV"
  },
  {
    "ref": "M02",
    "kind": "MCQ",
    "ordinal": 2,
    "year": 2026,
    "track": "ROLE"
  },
  {
    "ref": "M03",
    "kind": "MCQ",
    "ordinal": 3,
    "year": 2026,
    "track": "DISP"
  },
  {
    "ref": "M04",
    "kind": "MCQ",
    "ordinal": 4,
    "year": 2026,
    "track": "OS"
  },
  {
    "ref": "M05",
    "kind": "MCQ",
    "ordinal": 5,
    "year": 2025,
    "track": "EQUIV"
  },
  {
    "ref": "M06",
    "kind": "MCQ",
    "ordinal": 6,
    "year": 2025,
    "track": "TITR"
  },
  {
    "ref": "M07",
    "kind": "MCQ",
    "ordinal": 7,
    "year": 2025,
    "track": "ROLE"
  },
  {
    "ref": "M08",
    "kind": "MCQ",
    "ordinal": 8,
    "year": 2025,
    "track": "ROLE"
  },
  {
    "ref": "M09",
    "kind": "MCQ",
    "ordinal": 9,
    "year": 2025,
    "track": "DISP"
  },
  {
    "ref": "M10",
    "kind": "MCQ",
    "ordinal": 10,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M11",
    "kind": "MCQ",
    "ordinal": 11,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M12",
    "kind": "MCQ",
    "ordinal": 12,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M13",
    "kind": "MCQ",
    "ordinal": 13,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M14",
    "kind": "MCQ",
    "ordinal": 14,
    "year": 2024,
    "track": "DISP"
  },
  {
    "ref": "M15",
    "kind": "MCQ",
    "ordinal": 15,
    "year": 2024,
    "track": "BAL"
  },
  {
    "ref": "M16",
    "kind": "MCQ",
    "ordinal": 16,
    "year": 2024,
    "track": "DISP"
  },
  {
    "ref": "M17",
    "kind": "MCQ",
    "ordinal": 17,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M18",
    "kind": "MCQ",
    "ordinal": 18,
    "year": 2024,
    "track": "ROLE"
  },
  {
    "ref": "M19",
    "kind": "MCQ",
    "ordinal": 19,
    "year": 2023,
    "track": "TITR"
  },
  {
    "ref": "M20",
    "kind": "MCQ",
    "ordinal": 20,
    "year": 2023,
    "track": "DISP"
  },
  {
    "ref": "M21",
    "kind": "MCQ",
    "ordinal": 21,
    "year": 2023,
    "track": "ROLE"
  },
  {
    "ref": "M22",
    "kind": "MCQ",
    "ordinal": 22,
    "year": 2022,
    "track": "RELATED"
  },
  {
    "ref": "M23",
    "kind": "MCQ",
    "ordinal": 23,
    "year": 2022,
    "track": "RELATED"
  },
  {
    "ref": "M24",
    "kind": "MCQ",
    "ordinal": 24,
    "year": 2022,
    "track": "DISP"
  },
  {
    "ref": "M25",
    "kind": "MCQ",
    "ordinal": 25,
    "year": 2022,
    "track": "DISP"
  },
  {
    "ref": "M26",
    "kind": "MCQ",
    "ordinal": 26,
    "year": 2021,
    "track": "OS"
  },
  {
    "ref": "M27",
    "kind": "MCQ",
    "ordinal": 27,
    "year": 2021,
    "track": "NFACTOR"
  },
  {
    "ref": "M28",
    "kind": "MCQ",
    "ordinal": 28,
    "year": 2021,
    "track": "OS"
  },
  {
    "ref": "M29",
    "kind": "MCQ",
    "ordinal": 29,
    "year": 2021,
    "track": "OS"
  },
  {
    "ref": "M30",
    "kind": "MCQ",
    "ordinal": 30,
    "year": 2020,
    "track": "RELATED"
  },
  {
    "ref": "M31",
    "kind": "MCQ",
    "ordinal": 31,
    "year": 2020,
    "track": "ROLE"
  },
  {
    "ref": "M32",
    "kind": "MCQ",
    "ordinal": 32,
    "year": 2020,
    "track": "ROLE"
  },
  {
    "ref": "M33",
    "kind": "MCQ",
    "ordinal": 33,
    "year": 2020,
    "track": "OS"
  },
  {
    "ref": "M34",
    "kind": "MCQ",
    "ordinal": 34,
    "year": 2019,
    "track": "DISP"
  },
  {
    "ref": "M35",
    "kind": "MCQ",
    "ordinal": 35,
    "year": 2019,
    "track": "OS"
  },
  {
    "ref": "M36",
    "kind": "MCQ",
    "ordinal": 36,
    "year": 2019,
    "track": "EQUIV"
  },
  {
    "ref": "M37",
    "kind": "MCQ",
    "ordinal": 37,
    "year": 2019,
    "track": "RELATED"
  },
  {
    "ref": "M38",
    "kind": "MCQ",
    "ordinal": 38,
    "year": 2019,
    "track": "RELATED"
  },
  {
    "ref": "M39",
    "kind": "MCQ",
    "ordinal": 39,
    "year": 2019,
    "track": "NFACTOR"
  },
  {
    "ref": "M40",
    "kind": "MCQ",
    "ordinal": 40,
    "year": 2017,
    "track": "ROLE"
  },
  {
    "ref": "M41",
    "kind": "MCQ",
    "ordinal": 41,
    "year": 2016,
    "track": "RELATED"
  },
  {
    "ref": "M42",
    "kind": "MCQ",
    "ordinal": 42,
    "year": 2014,
    "track": "ROLE"
  },
  {
    "ref": "M43",
    "kind": "MCQ",
    "ordinal": 43,
    "year": 2013,
    "track": "BAL"
  },
  {
    "ref": "M44",
    "kind": "MCQ",
    "ordinal": 44,
    "year": 2006,
    "track": "ROLE"
  },
  {
    "ref": "M45",
    "kind": "MCQ",
    "ordinal": 45,
    "year": 2002,
    "track": "ROLE"
  }
];
window.REDOX_LOCAL_ITEM_TRACKS = [
  {
    "id": "REDOX-Q01",
    "track": "OS"
  },
  {
    "id": "REDOX-Q02",
    "track": "NFACTOR"
  },
  {
    "id": "REDOX-Q03",
    "track": "DISP"
  },
  {
    "id": "REDOX-Q04",
    "track": "OS"
  },
  {
    "id": "REDOX-Q05",
    "track": "EQUIV"
  },
  {
    "id": "REDOX-Q06",
    "track": "OS"
  },
  {
    "id": "REDOX-Q07",
    "track": "NFACTOR"
  },
  {
    "id": "REDOX-Q08",
    "track": "OFFCORP"
  },
  {
    "id": "REDOX-Q09",
    "track": "OS"
  },
  {
    "id": "REDOX-Q10",
    "track": "OS"
  },
  {
    "id": "REDOX-Q11",
    "track": "EQUIV"
  },
  {
    "id": "REDOX-Q12",
    "track": "OS"
  },
  {
    "id": "REDOX-Q13",
    "track": "NFACTOR"
  },
  {
    "id": "REDOX-Q14",
    "track": "DISP"
  },
  {
    "id": "REDOX-Q15",
    "track": "BAL"
  },
  {
    "id": "REDOX-Q16",
    "track": "OFFCORP"
  },
  {
    "id": "REDOX-Q17",
    "track": "OS"
  },
  {
    "id": "REDOX-Q18",
    "track": "TITR"
  },
  {
    "id": "REDOX-Q19",
    "track": "OFFCORP"
  },
  {
    "id": "REDOX-Q20",
    "track": "OS"
  }
];
