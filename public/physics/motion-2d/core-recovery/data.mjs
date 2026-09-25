export const projections = [
  {
    "id": "CORE1-KIN-2D-ORIENTATION",
    "core": "CORE1",
    "contract_version": "1.0",
    "orientation": {
      "bucket_ref": "BUCKET-PHY-KIN-2D-MOTION",
      "title": "Two-dimensional kinematics and projectile model",
      "blocks": [
        {
          "id": "scope",
          "kind": "TEXT",
          "text": "Independent perpendicular component motion in one frame, constant-acceleration component equations with common time, and the ideal near-Earth projectile specialization for horizontal and oblique launch questions."
        },
        {
          "id": "CONV-KIN-2D-AXES",
          "kind": "TEXT",
          "text": "Use one declared non-rotating x-y frame for the whole event; both component equations use the same elapsed time."
        },
        {
          "id": "CONV-PROJ-UP-POSITIVE",
          "kind": "TEXT",
          "text": "When +y is chosen upward, the ideal projectile model uses a_x=0 and a_y=-g after release."
        },
        {
          "id": "REL-PROJECTILE-COMPONENT-MODEL",
          "kind": "TEXT",
          "text": "With +y upward, air resistance neglected and near-Earth constant g, projectile motion is 2D constant acceleration specialized to zero horizontal and downward vertical acceleration. Conditions: Near-Earth region with approximately constant g. Air resistance neglected. +y is declared upward for the displayed signs. The object is in free flight after release."
        },
        {
          "id": "limits",
          "kind": "TEXT",
          "text": "Outside this packet: Calculus-based differentiation of a time-dependent position vector. Derivation or memorization of a large catalogue of range/height/time-of-flight formulas as separate capabilities. Trajectory-equation derivation as a first-slice requirement. Air drag, Coriolis effects, variable gravity, target-on-incline projectile geometry and other advanced variants."
        }
      ]
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "concept": null,
    "application": null
  },
  {
    "id": "CORE1A-MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
    "core": "CORE1A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
      "title": "Split one plane-motion event into independent x/y components with one clock",
      "inferential_jump": "Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.",
      "entry_assumptions": [
        "Can read signed vector components in a declared x-y frame."
      ],
      "teaching_path": [
        {
          "id": "K2D1-1",
          "role": "DECLARE",
          "action": "Choose one fixed x-y frame, one origin and one time origin for the whole plane-motion event.",
          "why_valid": "A component value is meaningful only after its frame and sign convention are fixed.",
          "inputs": [],
          "output": "one declared frame, origin, axis orientation and t=0"
        },
        {
          "id": "K2D1-2",
          "role": "TRANSFORM",
          "action": "Represent position, velocity and acceleration as signed x and y components in that same frame.",
          "why_valid": "A plane vector is completely represented by its perpendicular Cartesian components once the frame is declared.",
          "inputs": [
            "CAP-VECTOR-SIGNED-COMPONENT"
          ],
          "output": "signed component state (x,y), (v_x,v_y), (a_x,a_y)"
        },
        {
          "id": "K2D1-3",
          "role": "TRANSFORM",
          "action": "Keep x-quantities in the x description and y-quantities in the y description while using one shared elapsed time.",
          "why_valid": "The perpendicular component equations are independent in Cartesian kinematics, but both describe the same object during the same physical interval.",
          "inputs": [],
          "output": "two axis histories coupled by one clock"
        },
        {
          "id": "K2D1-4",
          "role": "VERIFY",
          "action": "Recombine only component values that refer to the same frame and the same instant.",
          "why_valid": "Mixing x at one time with y at another does not describe any single physical state of the object.",
          "inputs": [],
          "output": "one physically valid plane state reconstructed from simultaneous components"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If x and y components are independent, does that mean the object has two different clocks?",
          "defensible_answer": "No. The component equations are separate, but the event uses one common elapsed time."
        },
        "attempt": {
          "produces": "A two-column x/y setup with one shared t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Axes are kept separate while time/frame remain shared.",
              "evidence_of": "Correct component independence model."
            }
          ],
          "accepted": [
            "Separate x and y equations; same t for both."
          ],
          "rejected": [
            "Use x acceleration in the y equation or assign unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What must be declared before any component can have a sign?",
              "why_this_ask": "Recovers the common frame and axis convention.",
              "from_step_ref": "K2D1-1"
            },
            {
              "ask": "What separates between axes, and what must stay common because both descriptions belong to one event?",
              "why_this_ask": "Distinguishes component independence from the shared-clock invariant.",
              "from_step_ref": "K2D1-3"
            },
            {
              "ask": "Which x and y values may be recombined into one state?",
              "why_this_ask": "Makes simultaneity observable rather than implicit.",
              "from_step_ref": "K2D1-4"
            }
          ],
          "differs_from_teaching_path": "Teaching states the independence/common-time rule; reconstruction makes the learner distinguish what separates from what stays shared."
        },
        "boundary_test": {
          "prompt": "If a_x=0 but a_y is nonzero, may v_x stay constant while v_y changes?",
          "answer": "Yes. That is exactly what independent component evolution permits.",
          "confirms": "One component can change while the other does not."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "Independent x and y motions may use different elapsed times.",
          "diagnostic_prompt": "At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?",
          "repair": "No. Independence separates the axis equations; it does not give the same object two clocks."
        },
        {
          "wrong_idea": "The x-motion and y-motion are two different objects that can be paired arbitrarily later.",
          "diagnostic_prompt": "May x(2 s) be combined with y(3 s) to describe the particle's position?",
          "repair": "No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        }
      ],
      "relation_checks": [],
      "exit_task": {
        "prompt": "A particle has x-velocity 6 m/s and y-velocity -8 m/s at t=3 s. Explain what 'independent components' means and what must remain shared between the x and y descriptions.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "The x and y component equations are solved separately in the same frame, but both describe the same particle at the same t=3 s.",
          "reasoning": [
            "Keep x quantities in the x equation and y quantities in the y equation.",
            "Use one common elapsed time for the same physical instant.",
            "Recombine components only after each axis is handled consistently."
          ],
          "check": "Both component values must refer to the same frame and same instant.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "No new numerical computation is required."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": true,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE1B-MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
    "core": "CORE1B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
      "title": "Split one plane-motion event into independent x/y components with one clock",
      "inferential_jump": "Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.",
      "entry_assumptions": [
        "Can read signed vector components in a declared x-y frame."
      ],
      "teaching_path": [
        {
          "id": "K2D1-1",
          "role": "DECLARE",
          "action": "Choose one fixed x-y frame, one origin and one time origin for the whole plane-motion event.",
          "why_valid": "A component value is meaningful only after its frame and sign convention are fixed.",
          "inputs": [],
          "output": "one declared frame, origin, axis orientation and t=0"
        },
        {
          "id": "K2D1-2",
          "role": "TRANSFORM",
          "action": "Represent position, velocity and acceleration as signed x and y components in that same frame.",
          "why_valid": "A plane vector is completely represented by its perpendicular Cartesian components once the frame is declared.",
          "inputs": [
            "CAP-VECTOR-SIGNED-COMPONENT"
          ],
          "output": "signed component state (x,y), (v_x,v_y), (a_x,a_y)"
        },
        {
          "id": "K2D1-3",
          "role": "TRANSFORM",
          "action": "Keep x-quantities in the x description and y-quantities in the y description while using one shared elapsed time.",
          "why_valid": "The perpendicular component equations are independent in Cartesian kinematics, but both describe the same object during the same physical interval.",
          "inputs": [],
          "output": "two axis histories coupled by one clock"
        },
        {
          "id": "K2D1-4",
          "role": "VERIFY",
          "action": "Recombine only component values that refer to the same frame and the same instant.",
          "why_valid": "Mixing x at one time with y at another does not describe any single physical state of the object.",
          "inputs": [],
          "output": "one physically valid plane state reconstructed from simultaneous components"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If x and y components are independent, does that mean the object has two different clocks?",
          "defensible_answer": "No. The component equations are separate, but the event uses one common elapsed time."
        },
        "attempt": {
          "produces": "A two-column x/y setup with one shared t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Axes are kept separate while time/frame remain shared.",
              "evidence_of": "Correct component independence model."
            }
          ],
          "accepted": [
            "Separate x and y equations; same t for both."
          ],
          "rejected": [
            "Use x acceleration in the y equation or assign unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What must be declared before any component can have a sign?",
              "why_this_ask": "Recovers the common frame and axis convention.",
              "from_step_ref": "K2D1-1"
            },
            {
              "ask": "What separates between axes, and what must stay common because both descriptions belong to one event?",
              "why_this_ask": "Distinguishes component independence from the shared-clock invariant.",
              "from_step_ref": "K2D1-3"
            },
            {
              "ask": "Which x and y values may be recombined into one state?",
              "why_this_ask": "Makes simultaneity observable rather than implicit.",
              "from_step_ref": "K2D1-4"
            }
          ],
          "differs_from_teaching_path": "Teaching states the independence/common-time rule; reconstruction makes the learner distinguish what separates from what stays shared."
        },
        "boundary_test": {
          "prompt": "If a_x=0 but a_y is nonzero, may v_x stay constant while v_y changes?",
          "answer": "Yes. That is exactly what independent component evolution permits.",
          "confirms": "One component can change while the other does not."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "Independent x and y motions may use different elapsed times.",
          "diagnostic_prompt": "At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?",
          "repair": "No. Independence separates the axis equations; it does not give the same object two clocks."
        },
        {
          "wrong_idea": "The x-motion and y-motion are two different objects that can be paired arbitrarily later.",
          "diagnostic_prompt": "May x(2 s) be combined with y(3 s) to describe the particle's position?",
          "repair": "No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        }
      ],
      "relation_checks": [],
      "exit_task": {
        "prompt": "A particle has x-velocity 6 m/s and y-velocity -8 m/s at t=3 s. Explain what 'independent components' means and what must remain shared between the x and y descriptions.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "The x and y component equations are solved separately in the same frame, but both describe the same particle at the same t=3 s.",
          "reasoning": [
            "Keep x quantities in the x equation and y quantities in the y equation.",
            "Use one common elapsed time for the same physical instant.",
            "Recombine components only after each axis is handled consistently."
          ],
          "check": "Both component values must refer to the same frame and same instant.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "No new numerical computation is required."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE1A-MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
    "core": "CORE1A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
      "title": "Apply constant-acceleration kinematics component by component",
      "inferential_jump": "The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.",
      "entry_assumptions": [
        "Can use the existing one-dimensional constant-acceleration model.",
        "Can keep x/y components separate with one common time."
      ],
      "teaching_path": [
        {
          "id": "K2D2-1",
          "role": "DECLARE",
          "action": "Check separately whether a_x and a_y are constant over the interval before choosing constant-acceleration equations on either axis.",
          "why_valid": "The familiar one-dimensional kinematic relations are exact only on an axis whose acceleration component is constant over the interval.",
          "inputs": [
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "per-axis model-validity decision"
        },
        {
          "id": "K2D2-2",
          "role": "TRANSFORM",
          "action": "Apply the one-dimensional constant-acceleration relations independently to x and y using only that axis's signed values and the same t.",
          "why_valid": "Each Cartesian component obeys the same one-dimensional relation when its acceleration component is constant.",
          "inputs": [
            "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x+a_x t; v_y=u_y+a_y t; Delta x=u_x t+0.5a_x t^2; Delta y=u_y t+0.5a_y t^2"
        },
        {
          "id": "K2D2-3",
          "role": "VERIFY",
          "action": "If one axis determines an event time, reuse that same time on the other axis before recombining and checking the plane state.",
          "why_valid": "The event occurs once for the object; a time obtained from one component is the clock value for every component at that same event.",
          "inputs": [],
          "output": "event time transferred across axes, then one checked plane state"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If a_x is nonzero and a_y is zero, which velocity component changes with time?",
          "defensible_answer": "Only v_x changes; v_y remains constant."
        },
        "attempt": {
          "produces": "Two correct component constant-acceleration equations using one t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Each axis uses only its own signed initial values and acceleration while sharing the same time.",
              "evidence_of": "2D component model use rather than a scalar-magnitude shortcut."
            }
          ],
          "accepted": [
            "v_x=u_x+a_x t and v_y=u_y+a_y t with one t."
          ],
          "rejected": [
            "Use |a| in both equations or use separate unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "Before using a constant-acceleration formula, what must be true about that axis's acceleration component?",
              "why_this_ask": "Makes model validity explicit rather than formula-driven.",
              "from_step_ref": "K2D2-1"
            },
            {
              "ask": "What does the 1D relation become when written only along x, and what changes for y?",
              "why_this_ask": "Transfers an existing model one axis at a time.",
              "from_step_ref": "K2D2-2"
            },
            {
              "ask": "If one component equation finds the event time, what time must the other component use?",
              "why_this_ask": "Recovers the shared-clock coupling at an event.",
              "from_step_ref": "K2D2-3"
            }
          ],
          "differs_from_teaching_path": "Teaching supplies component forms; reconstruction derives them by applying the existing 1D model separately to each axis."
        },
        "boundary_test": {
          "prompt": "If a_y changes with time while a_x stays constant, may the constant-acceleration equations still be exact on both axes for the whole interval?",
          "answer": "No. The x relation may remain exact, but the y constant-acceleration relation is not exact over that interval.",
          "confirms": "Model validity is checked per component."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "The magnitude of acceleration should be inserted unchanged into both x and y equations.",
          "diagnostic_prompt": "If a=(10 i + 4 j) m/s², should both component equations use a=√116?",
          "repair": "No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component."
        },
        {
          "wrong_idea": "If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.",
          "diagnostic_prompt": "If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?",
          "repair": "No. Model validity is checked per axis. A constant a_x does not make a_y constant."
        },
        {
          "wrong_idea": "A time found from the x equation may be replaced by a different convenient time in the y equation.",
          "diagnostic_prompt": "If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?",
          "repair": "Use t=3 s. Both components describe the same event and therefore share one clock."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        }
      ],
      "relation_checks": [
        "Units match velocity on both equations.",
        "If a_x=0 then v_x stays constant; likewise for y.",
        "Every term has length units.",
        "Setting one acceleration component to zero reduces that axis to uniform motion."
      ],
      "exit_task": {
        "prompt": "A particle starts with u=(0,5) m/s and constant a=(10,4) m/s². Set up the x and y position equations at common time t without solving a particular numerical t.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "Use Delta x=0*t+0.5(10)t² and Delta y=5t+0.5(4)t² with the same t.",
          "reasoning": [
            "Read signed component initial velocities and accelerations.",
            "Apply the 1D constant-acceleration displacement relation separately.",
            "Keep one common elapsed time."
          ],
          "check": "Units are metres on both displacements and no x quantity appears in the y equation or vice versa.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The task asks for exact symbolic setup, not a new numerical claim."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": true,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE1B-MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
    "core": "CORE1B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
      "title": "Apply constant-acceleration kinematics component by component",
      "inferential_jump": "The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.",
      "entry_assumptions": [
        "Can use the existing one-dimensional constant-acceleration model.",
        "Can keep x/y components separate with one common time."
      ],
      "teaching_path": [
        {
          "id": "K2D2-1",
          "role": "DECLARE",
          "action": "Check separately whether a_x and a_y are constant over the interval before choosing constant-acceleration equations on either axis.",
          "why_valid": "The familiar one-dimensional kinematic relations are exact only on an axis whose acceleration component is constant over the interval.",
          "inputs": [
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "per-axis model-validity decision"
        },
        {
          "id": "K2D2-2",
          "role": "TRANSFORM",
          "action": "Apply the one-dimensional constant-acceleration relations independently to x and y using only that axis's signed values and the same t.",
          "why_valid": "Each Cartesian component obeys the same one-dimensional relation when its acceleration component is constant.",
          "inputs": [
            "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x+a_x t; v_y=u_y+a_y t; Delta x=u_x t+0.5a_x t^2; Delta y=u_y t+0.5a_y t^2"
        },
        {
          "id": "K2D2-3",
          "role": "VERIFY",
          "action": "If one axis determines an event time, reuse that same time on the other axis before recombining and checking the plane state.",
          "why_valid": "The event occurs once for the object; a time obtained from one component is the clock value for every component at that same event.",
          "inputs": [],
          "output": "event time transferred across axes, then one checked plane state"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If a_x is nonzero and a_y is zero, which velocity component changes with time?",
          "defensible_answer": "Only v_x changes; v_y remains constant."
        },
        "attempt": {
          "produces": "Two correct component constant-acceleration equations using one t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Each axis uses only its own signed initial values and acceleration while sharing the same time.",
              "evidence_of": "2D component model use rather than a scalar-magnitude shortcut."
            }
          ],
          "accepted": [
            "v_x=u_x+a_x t and v_y=u_y+a_y t with one t."
          ],
          "rejected": [
            "Use |a| in both equations or use separate unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "Before using a constant-acceleration formula, what must be true about that axis's acceleration component?",
              "why_this_ask": "Makes model validity explicit rather than formula-driven.",
              "from_step_ref": "K2D2-1"
            },
            {
              "ask": "What does the 1D relation become when written only along x, and what changes for y?",
              "why_this_ask": "Transfers an existing model one axis at a time.",
              "from_step_ref": "K2D2-2"
            },
            {
              "ask": "If one component equation finds the event time, what time must the other component use?",
              "why_this_ask": "Recovers the shared-clock coupling at an event.",
              "from_step_ref": "K2D2-3"
            }
          ],
          "differs_from_teaching_path": "Teaching supplies component forms; reconstruction derives them by applying the existing 1D model separately to each axis."
        },
        "boundary_test": {
          "prompt": "If a_y changes with time while a_x stays constant, may the constant-acceleration equations still be exact on both axes for the whole interval?",
          "answer": "No. The x relation may remain exact, but the y constant-acceleration relation is not exact over that interval.",
          "confirms": "Model validity is checked per component."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "The magnitude of acceleration should be inserted unchanged into both x and y equations.",
          "diagnostic_prompt": "If a=(10 i + 4 j) m/s², should both component equations use a=√116?",
          "repair": "No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component."
        },
        {
          "wrong_idea": "If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.",
          "diagnostic_prompt": "If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?",
          "repair": "No. Model validity is checked per axis. A constant a_x does not make a_y constant."
        },
        {
          "wrong_idea": "A time found from the x equation may be replaced by a different convenient time in the y equation.",
          "diagnostic_prompt": "If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?",
          "repair": "Use t=3 s. Both components describe the same event and therefore share one clock."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        }
      ],
      "relation_checks": [
        "Units match velocity on both equations.",
        "If a_x=0 then v_x stays constant; likewise for y.",
        "Every term has length units.",
        "Setting one acceleration component to zero reduces that axis to uniform motion."
      ],
      "exit_task": {
        "prompt": "A particle starts with u=(0,5) m/s and constant a=(10,4) m/s². Set up the x and y position equations at common time t without solving a particular numerical t.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "Use Delta x=0*t+0.5(10)t² and Delta y=5t+0.5(4)t² with the same t.",
          "reasoning": [
            "Read signed component initial velocities and accelerations.",
            "Apply the 1D constant-acceleration displacement relation separately.",
            "Keep one common elapsed time."
          ],
          "check": "Units are metres on both displacements and no x quantity appears in the y equation or vice versa.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The task asks for exact symbolic setup, not a new numerical claim."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE1A-MIC-PHY-KIN-PROJECTILE-MODEL",
    "core": "CORE1A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-PROJECTILE-MODEL",
      "title": "Select the gravity-only projectile model before using projectile consequences",
      "inferential_jump": "After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).",
      "entry_assumptions": [
        "Can solve 2D constant-acceleration component equations.",
        "If an oblique launch angle is given, angle-based vector decomposition is available as a separate prerequisite for that question."
      ],
      "teaching_path": [
        {
          "id": "K2D3-1",
          "role": "DECLARE",
          "action": "Decide whether the object is in ideal near-Earth free flight after release; neglect air resistance, declare +y, then set a_x=0 and a_y=-g.",
          "why_valid": "The standard projectile equations are a conditional specialization of 2D constant acceleration, not an automatic label for every launched object.",
          "inputs": [],
          "output": "gravity-only projectile acceleration state"
        },
        {
          "id": "K2D3-2",
          "role": "TRANSFORM",
          "action": "Use supplied or separately resolved u_x and u_y with one common t in the horizontal and vertical component equations.",
          "why_valid": "Horizontal, oblique and downward/upward initial components change the initial state, not the gravity-only model.",
          "inputs": [
            "CAP-KIN-2D-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x; v_y=u_y-g t; Delta x=u_x t; Delta y=u_y t-0.5g t^2"
        },
        {
          "id": "K2D3-3",
          "role": "DECLARE",
          "action": "Translate the requested event into the component condition that defines it before solving for time.",
          "why_valid": "Apex, same-height return, ground impact and a specified later instant are different events; each is identified by a different component condition.",
          "inputs": [],
          "output": "event condition chosen before calculation"
        },
        {
          "id": "K2D3-4",
          "role": "TRANSFORM",
          "action": "For an apex event, set v_y=0 while keeping v_x=u_x and a_y=-g.",
          "why_valid": "At the highest point only the vertical velocity component is momentarily zero; gravity still accelerates downward and horizontal motion continues.",
          "inputs": [],
          "output": "apex condition v_y=0 with nonzero horizontal velocity and nonzero downward acceleration"
        },
        {
          "id": "K2D3-5",
          "role": "TRANSFORM",
          "action": "For a return to the launch height, set Delta y=0 and treat any same-height flight-time/range shortcut as conditional on that equality.",
          "why_valid": "The shortcut follows from the vertical displacement returning to its initial value; it is not valid when the landing height differs.",
          "inputs": [],
          "output": "same-height event condition and its validity boundary"
        },
        {
          "id": "K2D3-6",
          "role": "TRANSFORM",
          "action": "For any unequal-height landing, use the actual Delta y=y_f-y_i in the vertical position equation and retain the actual u_y; for a horizontal launch specifically, set u_y=0, then obtain the event time vertically and share it with x.",
          "why_valid": "Initial vertical velocity and landing displacement describe different facts. The landing event is fixed by the actual vertical geometry, while u_y=0 is only the horizontal-launch initial condition.",
          "inputs": [],
          "output": "Delta y=y_f-y_i=u_y t_event-0.5g t_event^2; for horizontal launch u_y=0; reuse the solved t_event on x"
        },
        {
          "id": "K2D3-7",
          "role": "VERIFY",
          "action": "At the selected event time, reconstruct the requested velocity, speed, direction, displacement or range from simultaneous components and check qualitative limits.",
          "why_valid": "The reported projectile result is a consequence of one component model and one event, so its components must refer to the same instant and satisfy a_x=0, a_y=-g.",
          "inputs": [],
          "output": "checked projectile consequence at one physical event"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "Immediately after a horizontal launch, which acceleration component is zero in the ideal model?",
          "defensible_answer": "a_x is zero; a_y is -g if +y is upward."
        },
        "attempt": {
          "produces": "A model declaration and component-equation setup for a horizontal or oblique projectile.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "The learner selects gravity-only free flight, uses a_x=0/a_y=-g and one common time before calculating any named projectile quantity.",
              "evidence_of": "Projectile model selection rather than formula recall."
            }
          ],
          "accepted": [
            "State assumptions, set component accelerations, then solve x/y with one t."
          ],
          "rejected": [
            "Start from a memorized range/height formula without establishing the free-flight component model."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What forces remain after release in the idealized problem?",
              "why_this_ask": "Elicits the gravity-only model.",
              "from_step_ref": "K2D3-1"
            },
            {
              "ask": "What are the horizontal and vertical component equations, and what clock do they share?",
              "why_this_ask": "Rebuilds the projectile specialization from 2D constant acceleration.",
              "from_step_ref": "K2D3-2"
            },
            {
              "ask": "What exact component condition identifies the event the question asks about?",
              "why_this_ask": "Separates model selection from event selection.",
              "from_step_ref": "K2D3-3"
            },
            {
              "ask": "If the event is the apex, what becomes zero and what definitely does not?",
              "why_this_ask": "Protects against the common full-velocity/full-acceleration zero shortcut.",
              "from_step_ref": "K2D3-4"
            },
            {
              "ask": "Does launch height equal landing height? If not, which shortcut becomes invalid?",
              "why_this_ask": "Makes the same-height boundary explicit.",
              "from_step_ref": "K2D3-5"
            }
          ],
          "differs_from_teaching_path": "Teaching states the projectile specialization; reconstruction derives it from the post-release interaction model and coordinate choice."
        },
        "boundary_test": {
          "prompt": "A launched object continues under significant horizontal thrust after release. May the standard a_x=0 projectile specialization be used?",
          "answer": "No. The object is not in gravity-only free flight; its horizontal acceleration is not zero under that model.",
          "confirms": "Projectile equations are conditional consequences of a declared force/model state."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "A projectile needs a horizontal force to keep moving horizontally.",
          "diagnostic_prompt": "If a_x=0 after release, can v_x still be nonzero?",
          "repair": "Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero."
        },
        {
          "wrong_idea": "A horizontal launch has no vertical velocity throughout the flight.",
          "diagnostic_prompt": "One second after a horizontal launch, is v_y still zero under gravity?",
          "repair": "No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward."
        },
        {
          "wrong_idea": "At the highest point the whole velocity and the acceleration are both zero.",
          "diagnostic_prompt": "At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?",
          "repair": "Only v_y is zero at that instant. v_x remains u_x and a_y remains -g."
        },
        {
          "wrong_idea": "Same-height flight formulas may be used whenever the question is about a projectile range or flight time.",
          "diagnostic_prompt": "A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?",
          "repair": "No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition."
        },
        {
          "wrong_idea": "At two points of the same height on an ideal trajectory, the velocity vectors are identical.",
          "diagnostic_prompt": "On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?",
          "repair": "v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not."
        },
        {
          "wrong_idea": "Horizontal speed determines how long a horizontally launched object takes to fall.",
          "diagnostic_prompt": "If the horizontal launch speed doubles from the same height, does the ideal fall time change?",
          "repair": "No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK",
        "REP-KIN-2D-PROJECTILE-MODEL"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        },
        {
          "id": "REP-KIN-2D-PROJECTILE-MODEL",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Make the ideal projectile specialization conditional on the interactions that remain after release: gravity-only free flight licenses a_x=0 and a_y=-g; retained thrust, significant drag or contact requires a more general model.",
          "required_elements": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "relation_refs": [
            "REL-PROJECTILE-COMPONENT-MODEL"
          ],
          "read_order": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "instance_constraints": [
            "Model eligibility is determined from post-release interactions rather than trajectory shape.",
            "With +y upward, the ideal projectile specialization requires a_x=0 and a_y=-g.",
            "If horizontal thrust, significant drag or continuing contact is retained, the ideal projectile specialization is rejected even when the path is curved."
          ],
          "accessibility": [
            "Active post-release interactions are named in text; arrows or colours are not the only cue.",
            "The acceleration components and model status are readable as text or symbols.",
            "Invalid-model status states the violated assumption explicitly."
          ],
          "misleading_alternatives": [
            "Calling every launched or curved-path object an ideal projectile.",
            "Keeping a_x=0 while also showing an active horizontal rocket thrust."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "gravity-only status",
              "symbol": "g",
              "in_words": "The retained gravitational acceleration magnitude in the ideal projectile specialization."
            },
            {
              "element": "horizontal acceleration readout",
              "symbol": "v_x",
              "in_words": "The horizontal component whose constancy is a consequence of zero horizontal acceleration in the ideal specialization."
            },
            {
              "element": "vertical acceleration readout",
              "symbol": "v_y",
              "in_words": "The vertical velocity component that changes under the retained gravitational acceleration."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-PROJECTILE-MODEL-GATE"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-PROJ-V0",
              "label": "Launch story",
              "purpose": "Show the launched-object scenario without naming the model.",
              "visible_elements": [
                "launched-object scene"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V1",
              "label": "Interaction audit",
              "purpose": "Expose post-release interactions while leaving the model decision to the learner.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V2",
              "label": "Acceleration consequences",
              "purpose": "Show the acceleration components implied by the interaction audit without declaring final model eligibility.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V3",
              "label": "Model decision",
              "purpose": "Reveal the model-status gate after the interaction and acceleration evidence is visible.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout",
                "model-status gate"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL"
        }
      ],
      "relation_checks": [
        "v_x is constant.",
        "At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.",
        "Both component equations use the same t."
      ],
      "exit_task": {
        "prompt": "A stone is launched horizontally from a cliff with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one common t is used.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "a_x=0, a_y=-g; v_x=u, v_y=-gt; Delta x=ut, Delta y=-0.5gt², all at the same elapsed time t.",
          "reasoning": [
            "After release only gravity acts in the ideal model.",
            "Gravity has no horizontal component in the chosen frame.",
            "Both component coordinates describe the same stone at the same instant."
          ],
          "check": "Horizontal velocity remains constant while downward speed magnitude grows with time.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The exit task is symbolic and model-based; no cliff height or numerical g is required."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": true,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE1B-MIC-PHY-KIN-PROJECTILE-MODEL",
    "core": "CORE1B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-PROJECTILE-MODEL",
      "title": "Select the gravity-only projectile model before using projectile consequences",
      "inferential_jump": "After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).",
      "entry_assumptions": [
        "Can solve 2D constant-acceleration component equations.",
        "If an oblique launch angle is given, angle-based vector decomposition is available as a separate prerequisite for that question."
      ],
      "teaching_path": [
        {
          "id": "K2D3-1",
          "role": "DECLARE",
          "action": "Decide whether the object is in ideal near-Earth free flight after release; neglect air resistance, declare +y, then set a_x=0 and a_y=-g.",
          "why_valid": "The standard projectile equations are a conditional specialization of 2D constant acceleration, not an automatic label for every launched object.",
          "inputs": [],
          "output": "gravity-only projectile acceleration state"
        },
        {
          "id": "K2D3-2",
          "role": "TRANSFORM",
          "action": "Use supplied or separately resolved u_x and u_y with one common t in the horizontal and vertical component equations.",
          "why_valid": "Horizontal, oblique and downward/upward initial components change the initial state, not the gravity-only model.",
          "inputs": [
            "CAP-KIN-2D-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x; v_y=u_y-g t; Delta x=u_x t; Delta y=u_y t-0.5g t^2"
        },
        {
          "id": "K2D3-3",
          "role": "DECLARE",
          "action": "Translate the requested event into the component condition that defines it before solving for time.",
          "why_valid": "Apex, same-height return, ground impact and a specified later instant are different events; each is identified by a different component condition.",
          "inputs": [],
          "output": "event condition chosen before calculation"
        },
        {
          "id": "K2D3-4",
          "role": "TRANSFORM",
          "action": "For an apex event, set v_y=0 while keeping v_x=u_x and a_y=-g.",
          "why_valid": "At the highest point only the vertical velocity component is momentarily zero; gravity still accelerates downward and horizontal motion continues.",
          "inputs": [],
          "output": "apex condition v_y=0 with nonzero horizontal velocity and nonzero downward acceleration"
        },
        {
          "id": "K2D3-5",
          "role": "TRANSFORM",
          "action": "For a return to the launch height, set Delta y=0 and treat any same-height flight-time/range shortcut as conditional on that equality.",
          "why_valid": "The shortcut follows from the vertical displacement returning to its initial value; it is not valid when the landing height differs.",
          "inputs": [],
          "output": "same-height event condition and its validity boundary"
        },
        {
          "id": "K2D3-6",
          "role": "TRANSFORM",
          "action": "For any unequal-height landing, use the actual Delta y=y_f-y_i in the vertical position equation and retain the actual u_y; for a horizontal launch specifically, set u_y=0, then obtain the event time vertically and share it with x.",
          "why_valid": "Initial vertical velocity and landing displacement describe different facts. The landing event is fixed by the actual vertical geometry, while u_y=0 is only the horizontal-launch initial condition.",
          "inputs": [],
          "output": "Delta y=y_f-y_i=u_y t_event-0.5g t_event^2; for horizontal launch u_y=0; reuse the solved t_event on x"
        },
        {
          "id": "K2D3-7",
          "role": "VERIFY",
          "action": "At the selected event time, reconstruct the requested velocity, speed, direction, displacement or range from simultaneous components and check qualitative limits.",
          "why_valid": "The reported projectile result is a consequence of one component model and one event, so its components must refer to the same instant and satisfy a_x=0, a_y=-g.",
          "inputs": [],
          "output": "checked projectile consequence at one physical event"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "Immediately after a horizontal launch, which acceleration component is zero in the ideal model?",
          "defensible_answer": "a_x is zero; a_y is -g if +y is upward."
        },
        "attempt": {
          "produces": "A model declaration and component-equation setup for a horizontal or oblique projectile.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "The learner selects gravity-only free flight, uses a_x=0/a_y=-g and one common time before calculating any named projectile quantity.",
              "evidence_of": "Projectile model selection rather than formula recall."
            }
          ],
          "accepted": [
            "State assumptions, set component accelerations, then solve x/y with one t."
          ],
          "rejected": [
            "Start from a memorized range/height formula without establishing the free-flight component model."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What forces remain after release in the idealized problem?",
              "why_this_ask": "Elicits the gravity-only model.",
              "from_step_ref": "K2D3-1"
            },
            {
              "ask": "What are the horizontal and vertical component equations, and what clock do they share?",
              "why_this_ask": "Rebuilds the projectile specialization from 2D constant acceleration.",
              "from_step_ref": "K2D3-2"
            },
            {
              "ask": "What exact component condition identifies the event the question asks about?",
              "why_this_ask": "Separates model selection from event selection.",
              "from_step_ref": "K2D3-3"
            },
            {
              "ask": "If the event is the apex, what becomes zero and what definitely does not?",
              "why_this_ask": "Protects against the common full-velocity/full-acceleration zero shortcut.",
              "from_step_ref": "K2D3-4"
            },
            {
              "ask": "Does launch height equal landing height? If not, which shortcut becomes invalid?",
              "why_this_ask": "Makes the same-height boundary explicit.",
              "from_step_ref": "K2D3-5"
            }
          ],
          "differs_from_teaching_path": "Teaching states the projectile specialization; reconstruction derives it from the post-release interaction model and coordinate choice."
        },
        "boundary_test": {
          "prompt": "A launched object continues under significant horizontal thrust after release. May the standard a_x=0 projectile specialization be used?",
          "answer": "No. The object is not in gravity-only free flight; its horizontal acceleration is not zero under that model.",
          "confirms": "Projectile equations are conditional consequences of a declared force/model state."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "A projectile needs a horizontal force to keep moving horizontally.",
          "diagnostic_prompt": "If a_x=0 after release, can v_x still be nonzero?",
          "repair": "Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero."
        },
        {
          "wrong_idea": "A horizontal launch has no vertical velocity throughout the flight.",
          "diagnostic_prompt": "One second after a horizontal launch, is v_y still zero under gravity?",
          "repair": "No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward."
        },
        {
          "wrong_idea": "At the highest point the whole velocity and the acceleration are both zero.",
          "diagnostic_prompt": "At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?",
          "repair": "Only v_y is zero at that instant. v_x remains u_x and a_y remains -g."
        },
        {
          "wrong_idea": "Same-height flight formulas may be used whenever the question is about a projectile range or flight time.",
          "diagnostic_prompt": "A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?",
          "repair": "No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition."
        },
        {
          "wrong_idea": "At two points of the same height on an ideal trajectory, the velocity vectors are identical.",
          "diagnostic_prompt": "On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?",
          "repair": "v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not."
        },
        {
          "wrong_idea": "Horizontal speed determines how long a horizontally launched object takes to fall.",
          "diagnostic_prompt": "If the horizontal launch speed doubles from the same height, does the ideal fall time change?",
          "repair": "No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK",
        "REP-KIN-2D-PROJECTILE-MODEL"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        },
        {
          "id": "REP-KIN-2D-PROJECTILE-MODEL",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Make the ideal projectile specialization conditional on the interactions that remain after release: gravity-only free flight licenses a_x=0 and a_y=-g; retained thrust, significant drag or contact requires a more general model.",
          "required_elements": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "relation_refs": [
            "REL-PROJECTILE-COMPONENT-MODEL"
          ],
          "read_order": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "instance_constraints": [
            "Model eligibility is determined from post-release interactions rather than trajectory shape.",
            "With +y upward, the ideal projectile specialization requires a_x=0 and a_y=-g.",
            "If horizontal thrust, significant drag or continuing contact is retained, the ideal projectile specialization is rejected even when the path is curved."
          ],
          "accessibility": [
            "Active post-release interactions are named in text; arrows or colours are not the only cue.",
            "The acceleration components and model status are readable as text or symbols.",
            "Invalid-model status states the violated assumption explicitly."
          ],
          "misleading_alternatives": [
            "Calling every launched or curved-path object an ideal projectile.",
            "Keeping a_x=0 while also showing an active horizontal rocket thrust."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "gravity-only status",
              "symbol": "g",
              "in_words": "The retained gravitational acceleration magnitude in the ideal projectile specialization."
            },
            {
              "element": "horizontal acceleration readout",
              "symbol": "v_x",
              "in_words": "The horizontal component whose constancy is a consequence of zero horizontal acceleration in the ideal specialization."
            },
            {
              "element": "vertical acceleration readout",
              "symbol": "v_y",
              "in_words": "The vertical velocity component that changes under the retained gravitational acceleration."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-PROJECTILE-MODEL-GATE"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-PROJ-V0",
              "label": "Launch story",
              "purpose": "Show the launched-object scenario without naming the model.",
              "visible_elements": [
                "launched-object scene"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V1",
              "label": "Interaction audit",
              "purpose": "Expose post-release interactions while leaving the model decision to the learner.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V2",
              "label": "Acceleration consequences",
              "purpose": "Show the acceleration components implied by the interaction audit without declaring final model eligibility.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V3",
              "label": "Model decision",
              "purpose": "Reveal the model-status gate after the interaction and acceleration evidence is visible.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout",
                "model-status gate"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL"
        }
      ],
      "relation_checks": [
        "v_x is constant.",
        "At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.",
        "Both component equations use the same t."
      ],
      "exit_task": {
        "prompt": "A stone is launched horizontally from a cliff with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one common t is used.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "a_x=0, a_y=-g; v_x=u, v_y=-gt; Delta x=ut, Delta y=-0.5gt², all at the same elapsed time t.",
          "reasoning": [
            "After release only gravity acts in the ideal model.",
            "Gravity has no horizontal component in the chosen frame.",
            "Both component coordinates describe the same stone at the same instant."
          ],
          "check": "Horizontal velocity remains constant while downward speed magnitude grows with time.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The exit task is symbolic and model-based; no cliff height or numerical g is required."
        }
      },
      "worked_anchors": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "initial_visual_ref": "REP-KIN-2D-SHARED-CLOCK",
      "initial_visual_stage_ref": "VIS-KIN-2D-SHARED-V0",
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 0,
      "post_attempt_hint_limit": 0
    },
    "orientation": null,
    "application": null
  },
  {
    "id": "CORE2A-Q-PHY-KIN-2D-2A-SHARED-CLOCK-01",
    "core": "CORE2A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
      "title": "Split one plane-motion event into independent x/y components with one clock",
      "inferential_jump": "Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.",
      "entry_assumptions": [
        "Can read signed vector components in a declared x-y frame."
      ],
      "teaching_path": [
        {
          "id": "K2D1-1",
          "role": "DECLARE",
          "action": "Choose one fixed x-y frame, one origin and one time origin for the whole plane-motion event.",
          "why_valid": "A component value is meaningful only after its frame and sign convention are fixed.",
          "inputs": [],
          "output": "one declared frame, origin, axis orientation and t=0"
        },
        {
          "id": "K2D1-2",
          "role": "TRANSFORM",
          "action": "Represent position, velocity and acceleration as signed x and y components in that same frame.",
          "why_valid": "A plane vector is completely represented by its perpendicular Cartesian components once the frame is declared.",
          "inputs": [
            "CAP-VECTOR-SIGNED-COMPONENT"
          ],
          "output": "signed component state (x,y), (v_x,v_y), (a_x,a_y)"
        },
        {
          "id": "K2D1-3",
          "role": "TRANSFORM",
          "action": "Keep x-quantities in the x description and y-quantities in the y description while using one shared elapsed time.",
          "why_valid": "The perpendicular component equations are independent in Cartesian kinematics, but both describe the same object during the same physical interval.",
          "inputs": [],
          "output": "two axis histories coupled by one clock"
        },
        {
          "id": "K2D1-4",
          "role": "VERIFY",
          "action": "Recombine only component values that refer to the same frame and the same instant.",
          "why_valid": "Mixing x at one time with y at another does not describe any single physical state of the object.",
          "inputs": [],
          "output": "one physically valid plane state reconstructed from simultaneous components"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If x and y components are independent, does that mean the object has two different clocks?",
          "defensible_answer": "No. The component equations are separate, but the event uses one common elapsed time."
        },
        "attempt": {
          "produces": "A two-column x/y setup with one shared t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Axes are kept separate while time/frame remain shared.",
              "evidence_of": "Correct component independence model."
            }
          ],
          "accepted": [
            "Separate x and y equations; same t for both."
          ],
          "rejected": [
            "Use x acceleration in the y equation or assign unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What must be declared before any component can have a sign?",
              "why_this_ask": "Recovers the common frame and axis convention.",
              "from_step_ref": "K2D1-1"
            },
            {
              "ask": "What separates between axes, and what must stay common because both descriptions belong to one event?",
              "why_this_ask": "Distinguishes component independence from the shared-clock invariant.",
              "from_step_ref": "K2D1-3"
            },
            {
              "ask": "Which x and y values may be recombined into one state?",
              "why_this_ask": "Makes simultaneity observable rather than implicit.",
              "from_step_ref": "K2D1-4"
            }
          ],
          "differs_from_teaching_path": "Teaching states the independence/common-time rule; reconstruction makes the learner distinguish what separates from what stays shared."
        },
        "boundary_test": {
          "prompt": "If a_x=0 but a_y is nonzero, may v_x stay constant while v_y changes?",
          "answer": "Yes. That is exactly what independent component evolution permits.",
          "confirms": "One component can change while the other does not."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "Independent x and y motions may use different elapsed times.",
          "diagnostic_prompt": "At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?",
          "repair": "No. Independence separates the axis equations; it does not give the same object two clocks."
        },
        {
          "wrong_idea": "The x-motion and y-motion are two different objects that can be paired arbitrarily later.",
          "diagnostic_prompt": "May x(2 s) be combined with y(3 s) to describe the particle's position?",
          "repair": "No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        }
      ],
      "relation_checks": [],
      "exit_task": {
        "prompt": "A particle has x-velocity 6 m/s and y-velocity -8 m/s at t=3 s. Explain what 'independent components' means and what must remain shared between the x and y descriptions.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "The x and y component equations are solved separately in the same frame, but both describe the same particle at the same t=3 s.",
          "reasoning": [
            "Keep x quantities in the x equation and y quantities in the y equation.",
            "Use one common elapsed time for the same physical instant.",
            "Recombine components only after each axis is handled consistently."
          ],
          "check": "Both component values must refer to the same frame and same instant.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "No new numerical computation is required."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2A-SHARED-CLOCK-01",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "A tracker reports x(t)=4t metres and y(t)=10-2t^2 metres for one particle in one fixed frame. Find the particle's position at t=2 s, and explain why x(2 s) may not be paired with y(3 s) to describe one position.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2A-SHARED-CLOCK-01",
      "subparts": [],
      "options": [],
      "conditions": [
        "The two functions refer to the same particle and the same time coordinate.",
        "Use the declared fixed x-y frame."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "What must be the same when x(t) and y(t) describe one particle at one instant?",
          "reveals": "CONCEPT"
        },
        {
          "text": "Evaluate both component functions at the requested t before pairing them.",
          "reveals": "METHOD"
        }
      ],
      "scaffolds": [
        {
          "text": "Write x(t) and y(t) in two columns connected to one clock t before substituting any number.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-2D-CLOCK-REPRESENT"
        },
        {
          "text": "Label the time beside each evaluated component before you pair the coordinates.",
          "support_kind": "CONNECT",
          "reveals": "METHOD",
          "supports_move_ref": "R-KIN-2D-CLOCK-PAIR"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-2D-CLOCK-REPRESENT",
          "kind": "REPRESENT",
          "action": "Treat x(t) and y(t) as two coordinate projections of the same particle in one fixed frame, tied to one common event time t.",
          "why_valid": "A single plane position is defined by simultaneous coordinates of one particle; independent component functions do not create independent clocks.",
          "inputs": [
            "x(t)=4t m",
            "y(t)=10-2t^2 m",
            "requested t=2 s"
          ],
          "output": "Both coordinates must be evaluated at the same t before they can form one position."
        },
        {
          "id": "R-KIN-2D-CLOCK-EVALUATE",
          "kind": "TRANSFORM",
          "action": "Substitute t=2 s into both component functions to obtain x(2)=8 m and y(2)=2 m.",
          "why_valid": "The requested state is the event labelled t=2 s, so both component functions must be sampled at that event.",
          "inputs": [
            "x(t)=4t",
            "y(t)=10-2t^2",
            "t=2 s"
          ],
          "output": "The simultaneous coordinate values are x=8 m and y=2 m."
        },
        {
          "id": "R-KIN-2D-CLOCK-PAIR",
          "kind": "CONNECT",
          "action": "Pair the two simultaneous values as the position (8,2) m and reject x(2) paired with y(3) as a single physical state.",
          "why_valid": "Coordinates form one state only when they refer to the same object, frame and instant; changing one timestamp changes the event.",
          "inputs": [
            "x(2)=8 m",
            "y(2)=2 m",
            "y(3) belongs to t=3 s"
          ],
          "output": "The valid t=2 s position is (8,2) m; x(2),y(3) is not one position."
        },
        {
          "id": "R-KIN-2D-CLOCK-CHECK",
          "kind": "VERIFY",
          "action": "Attach the timestamp to each component value and confirm the two timestamps match before calling the pair a position.",
          "why_valid": "Timestamp agreement is an independent event-identity check that does not depend on the arithmetic values themselves.",
          "inputs": [
            "x(2)",
            "y(2)"
          ],
          "output": "Both values carry t=2 s, so the reconstructed state is temporally consistent."
        }
      ],
      "crux_move_ref": "R-KIN-2D-CLOCK-PAIR",
      "check": "The answer must use one t for both components; mixing timestamps produces no real single-time state.",
      "solution": {
        "summary": "At t=2 s, x=8 m and y=2 m, so the position is (8,2) m in the declared frame. x(2 s) and y(3 s) cannot form one position because they refer to different instants.",
        "steps": [
          "Evaluate both component descriptions at the same requested time.",
          "x(2)=4(2)=8.",
          "y(2)=10-2(2^2)=2.",
          "A physical plane state is a simultaneous component pair."
        ],
        "rubric": []
      },
      "repair": {
        "step_ref": "K2D1-4"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 2,
      "post_attempt_hint_limit": 2
    },
    "orientation": null
  },
  {
    "id": "CORE2A-Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02",
    "core": "CORE2A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
      "title": "Apply constant-acceleration kinematics component by component",
      "inferential_jump": "The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.",
      "entry_assumptions": [
        "Can use the existing one-dimensional constant-acceleration model.",
        "Can keep x/y components separate with one common time."
      ],
      "teaching_path": [
        {
          "id": "K2D2-1",
          "role": "DECLARE",
          "action": "Check separately whether a_x and a_y are constant over the interval before choosing constant-acceleration equations on either axis.",
          "why_valid": "The familiar one-dimensional kinematic relations are exact only on an axis whose acceleration component is constant over the interval.",
          "inputs": [
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "per-axis model-validity decision"
        },
        {
          "id": "K2D2-2",
          "role": "TRANSFORM",
          "action": "Apply the one-dimensional constant-acceleration relations independently to x and y using only that axis's signed values and the same t.",
          "why_valid": "Each Cartesian component obeys the same one-dimensional relation when its acceleration component is constant.",
          "inputs": [
            "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x+a_x t; v_y=u_y+a_y t; Delta x=u_x t+0.5a_x t^2; Delta y=u_y t+0.5a_y t^2"
        },
        {
          "id": "K2D2-3",
          "role": "VERIFY",
          "action": "If one axis determines an event time, reuse that same time on the other axis before recombining and checking the plane state.",
          "why_valid": "The event occurs once for the object; a time obtained from one component is the clock value for every component at that same event.",
          "inputs": [],
          "output": "event time transferred across axes, then one checked plane state"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If a_x is nonzero and a_y is zero, which velocity component changes with time?",
          "defensible_answer": "Only v_x changes; v_y remains constant."
        },
        "attempt": {
          "produces": "Two correct component constant-acceleration equations using one t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Each axis uses only its own signed initial values and acceleration while sharing the same time.",
              "evidence_of": "2D component model use rather than a scalar-magnitude shortcut."
            }
          ],
          "accepted": [
            "v_x=u_x+a_x t and v_y=u_y+a_y t with one t."
          ],
          "rejected": [
            "Use |a| in both equations or use separate unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "Before using a constant-acceleration formula, what must be true about that axis's acceleration component?",
              "why_this_ask": "Makes model validity explicit rather than formula-driven.",
              "from_step_ref": "K2D2-1"
            },
            {
              "ask": "What does the 1D relation become when written only along x, and what changes for y?",
              "why_this_ask": "Transfers an existing model one axis at a time.",
              "from_step_ref": "K2D2-2"
            },
            {
              "ask": "If one component equation finds the event time, what time must the other component use?",
              "why_this_ask": "Recovers the shared-clock coupling at an event.",
              "from_step_ref": "K2D2-3"
            }
          ],
          "differs_from_teaching_path": "Teaching supplies component forms; reconstruction derives them by applying the existing 1D model separately to each axis."
        },
        "boundary_test": {
          "prompt": "If a_y changes with time while a_x stays constant, may the constant-acceleration equations still be exact on both axes for the whole interval?",
          "answer": "No. The x relation may remain exact, but the y constant-acceleration relation is not exact over that interval.",
          "confirms": "Model validity is checked per component."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "The magnitude of acceleration should be inserted unchanged into both x and y equations.",
          "diagnostic_prompt": "If a=(10 i + 4 j) m/s², should both component equations use a=√116?",
          "repair": "No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component."
        },
        {
          "wrong_idea": "If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.",
          "diagnostic_prompt": "If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?",
          "repair": "No. Model validity is checked per axis. A constant a_x does not make a_y constant."
        },
        {
          "wrong_idea": "A time found from the x equation may be replaced by a different convenient time in the y equation.",
          "diagnostic_prompt": "If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?",
          "repair": "Use t=3 s. Both components describe the same event and therefore share one clock."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        }
      ],
      "relation_checks": [
        "Units match velocity on both equations.",
        "If a_x=0 then v_x stays constant; likewise for y.",
        "Every term has length units.",
        "Setting one acceleration component to zero reduces that axis to uniform motion."
      ],
      "exit_task": {
        "prompt": "A particle starts with u=(0,5) m/s and constant a=(10,4) m/s². Set up the x and y position equations at common time t without solving a particular numerical t.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "Use Delta x=0*t+0.5(10)t² and Delta y=5t+0.5(4)t² with the same t.",
          "reasoning": [
            "Read signed component initial velocities and accelerations.",
            "Apply the 1D constant-acceleration displacement relation separately.",
            "Keep one common elapsed time."
          ],
          "check": "Units are metres on both displacements and no x quantity appears in the y equation or vice versa.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The task asks for exact symbolic setup, not a new numerical claim."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "A particle starts with velocity (3 i + 4 j) m/s and has constant acceleration (2 i - 1 j) m/s^2 for 3 s. Find its velocity and displacement after 3 s.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2A-CONSTANT-ACCEL-02",
      "subparts": [],
      "options": [],
      "conditions": [
        "Both acceleration components are constant over the 3 s interval.",
        "The initial position is irrelevant because the question asks for displacement."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "Write the x and y initial velocity and acceleration values separately before calculating.",
          "reveals": "CONCEPT"
        },
        {
          "text": "Apply the same 1D constant-acceleration relation independently on each axis using the common 3 s.",
          "reveals": "METHOD"
        }
      ],
      "scaffolds": [
        {
          "text": "Make a signed table for u_x, u_y, a_x and a_y before choosing equations.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-2D-CA-REPRESENT"
        },
        {
          "text": "Run the constant-acceleration relation once on x and once on y while keeping one shared 3 s interval.",
          "support_kind": "CONNECT",
          "reveals": "METHOD",
          "supports_move_ref": "R-KIN-2D-CA-MODEL"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-2D-CA-REPRESENT",
          "kind": "REPRESENT",
          "action": "Resolve the vectors into u_x=3, u_y=4, a_x=2 and a_y=-1, with the same elapsed time 3 s on both axes.",
          "why_valid": "Component kinematics is valid only after the signed components and common physical interval are explicit.",
          "inputs": [
            "u=(3i+4j) m/s",
            "a=(2i-j) m/s^2",
            "t=3 s"
          ],
          "output": "Two signed one-dimensional component problems share one 3 s interval."
        },
        {
          "id": "R-KIN-2D-CA-MODEL",
          "kind": "CONNECT",
          "action": "Apply v=u+at and displacement=ut+(1/2)at^2 separately to x and y while preserving signs and the common time.",
          "why_valid": "The given acceleration vector is constant, so each Cartesian acceleration component is constant over the same interval and the 1D relations apply component-wise.",
          "inputs": [
            "a_x=2 constant",
            "a_y=-1 constant",
            "t=3 s"
          ],
          "output": "The constant-acceleration relations are licensed independently on both axes."
        },
        {
          "id": "R-KIN-2D-CA-CALCULATE",
          "kind": "TRANSFORM",
          "action": "Compute v_x=9, v_y=1, Delta x=18 and Delta y=7.5 from the two component equations.",
          "why_valid": "Substitution into the component equations preserves the negative y acceleration instead of replacing signed components by magnitudes.",
          "inputs": [
            "u_x=3",
            "u_y=4",
            "a_x=2",
            "a_y=-1",
            "t=3"
          ],
          "output": "v=(9i+1j) m/s and Delta r=(18i+7.5j) m."
        },
        {
          "id": "R-KIN-2D-CA-CHECK",
          "kind": "VERIFY",
          "action": "Check units and signs axis by axis, then confirm both vector components refer to the same 3 s endpoint.",
          "why_valid": "Unit consistency detects relation misuse and the common-endpoint check prevents combining component states from different times.",
          "inputs": [
            "velocity components",
            "displacement components",
            "t=3 s"
          ],
          "output": "Velocity has m/s units, displacement has m units, and both vectors are single-event states."
        }
      ],
      "crux_move_ref": "R-KIN-2D-CA-MODEL",
      "check": "Each axis uses only its own signed component values; units are m/s for velocity and m for displacement.",
      "solution": {
        "summary": "v=(9 i + 1 j) m/s and Delta r=(18 i + 7.5 j) m.",
        "steps": [
          "Use v_x=3+2(3)=9 and v_y=4-1(3)=1.",
          "Use Delta x=3(3)+0.5(2)(3^2)=18.",
          "Use Delta y=4(3)+0.5(-1)(3^2)=7.5.",
          "Both axes use the same 3 s interval."
        ],
        "rubric": []
      },
      "repair": {
        "step_ref": "K2D2-2"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 2,
      "post_attempt_hint_limit": 2
    },
    "orientation": null
  },
  {
    "id": "CORE2A-Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03",
    "core": "CORE2A",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-PROJECTILE-MODEL",
      "title": "Select the gravity-only projectile model before using projectile consequences",
      "inferential_jump": "After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).",
      "entry_assumptions": [
        "Can solve 2D constant-acceleration component equations.",
        "If an oblique launch angle is given, angle-based vector decomposition is available as a separate prerequisite for that question."
      ],
      "teaching_path": [
        {
          "id": "K2D3-1",
          "role": "DECLARE",
          "action": "Decide whether the object is in ideal near-Earth free flight after release; neglect air resistance, declare +y, then set a_x=0 and a_y=-g.",
          "why_valid": "The standard projectile equations are a conditional specialization of 2D constant acceleration, not an automatic label for every launched object.",
          "inputs": [],
          "output": "gravity-only projectile acceleration state"
        },
        {
          "id": "K2D3-2",
          "role": "TRANSFORM",
          "action": "Use supplied or separately resolved u_x and u_y with one common t in the horizontal and vertical component equations.",
          "why_valid": "Horizontal, oblique and downward/upward initial components change the initial state, not the gravity-only model.",
          "inputs": [
            "CAP-KIN-2D-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x; v_y=u_y-g t; Delta x=u_x t; Delta y=u_y t-0.5g t^2"
        },
        {
          "id": "K2D3-3",
          "role": "DECLARE",
          "action": "Translate the requested event into the component condition that defines it before solving for time.",
          "why_valid": "Apex, same-height return, ground impact and a specified later instant are different events; each is identified by a different component condition.",
          "inputs": [],
          "output": "event condition chosen before calculation"
        },
        {
          "id": "K2D3-4",
          "role": "TRANSFORM",
          "action": "For an apex event, set v_y=0 while keeping v_x=u_x and a_y=-g.",
          "why_valid": "At the highest point only the vertical velocity component is momentarily zero; gravity still accelerates downward and horizontal motion continues.",
          "inputs": [],
          "output": "apex condition v_y=0 with nonzero horizontal velocity and nonzero downward acceleration"
        },
        {
          "id": "K2D3-5",
          "role": "TRANSFORM",
          "action": "For a return to the launch height, set Delta y=0 and treat any same-height flight-time/range shortcut as conditional on that equality.",
          "why_valid": "The shortcut follows from the vertical displacement returning to its initial value; it is not valid when the landing height differs.",
          "inputs": [],
          "output": "same-height event condition and its validity boundary"
        },
        {
          "id": "K2D3-6",
          "role": "TRANSFORM",
          "action": "For any unequal-height landing, use the actual Delta y=y_f-y_i in the vertical position equation and retain the actual u_y; for a horizontal launch specifically, set u_y=0, then obtain the event time vertically and share it with x.",
          "why_valid": "Initial vertical velocity and landing displacement describe different facts. The landing event is fixed by the actual vertical geometry, while u_y=0 is only the horizontal-launch initial condition.",
          "inputs": [],
          "output": "Delta y=y_f-y_i=u_y t_event-0.5g t_event^2; for horizontal launch u_y=0; reuse the solved t_event on x"
        },
        {
          "id": "K2D3-7",
          "role": "VERIFY",
          "action": "At the selected event time, reconstruct the requested velocity, speed, direction, displacement or range from simultaneous components and check qualitative limits.",
          "why_valid": "The reported projectile result is a consequence of one component model and one event, so its components must refer to the same instant and satisfy a_x=0, a_y=-g.",
          "inputs": [],
          "output": "checked projectile consequence at one physical event"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "Immediately after a horizontal launch, which acceleration component is zero in the ideal model?",
          "defensible_answer": "a_x is zero; a_y is -g if +y is upward."
        },
        "attempt": {
          "produces": "A model declaration and component-equation setup for a horizontal or oblique projectile.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "The learner selects gravity-only free flight, uses a_x=0/a_y=-g and one common time before calculating any named projectile quantity.",
              "evidence_of": "Projectile model selection rather than formula recall."
            }
          ],
          "accepted": [
            "State assumptions, set component accelerations, then solve x/y with one t."
          ],
          "rejected": [
            "Start from a memorized range/height formula without establishing the free-flight component model."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What forces remain after release in the idealized problem?",
              "why_this_ask": "Elicits the gravity-only model.",
              "from_step_ref": "K2D3-1"
            },
            {
              "ask": "What are the horizontal and vertical component equations, and what clock do they share?",
              "why_this_ask": "Rebuilds the projectile specialization from 2D constant acceleration.",
              "from_step_ref": "K2D3-2"
            },
            {
              "ask": "What exact component condition identifies the event the question asks about?",
              "why_this_ask": "Separates model selection from event selection.",
              "from_step_ref": "K2D3-3"
            },
            {
              "ask": "If the event is the apex, what becomes zero and what definitely does not?",
              "why_this_ask": "Protects against the common full-velocity/full-acceleration zero shortcut.",
              "from_step_ref": "K2D3-4"
            },
            {
              "ask": "Does launch height equal landing height? If not, which shortcut becomes invalid?",
              "why_this_ask": "Makes the same-height boundary explicit.",
              "from_step_ref": "K2D3-5"
            }
          ],
          "differs_from_teaching_path": "Teaching states the projectile specialization; reconstruction derives it from the post-release interaction model and coordinate choice."
        },
        "boundary_test": {
          "prompt": "A launched object continues under significant horizontal thrust after release. May the standard a_x=0 projectile specialization be used?",
          "answer": "No. The object is not in gravity-only free flight; its horizontal acceleration is not zero under that model.",
          "confirms": "Projectile equations are conditional consequences of a declared force/model state."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "A projectile needs a horizontal force to keep moving horizontally.",
          "diagnostic_prompt": "If a_x=0 after release, can v_x still be nonzero?",
          "repair": "Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero."
        },
        {
          "wrong_idea": "A horizontal launch has no vertical velocity throughout the flight.",
          "diagnostic_prompt": "One second after a horizontal launch, is v_y still zero under gravity?",
          "repair": "No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward."
        },
        {
          "wrong_idea": "At the highest point the whole velocity and the acceleration are both zero.",
          "diagnostic_prompt": "At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?",
          "repair": "Only v_y is zero at that instant. v_x remains u_x and a_y remains -g."
        },
        {
          "wrong_idea": "Same-height flight formulas may be used whenever the question is about a projectile range or flight time.",
          "diagnostic_prompt": "A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?",
          "repair": "No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition."
        },
        {
          "wrong_idea": "At two points of the same height on an ideal trajectory, the velocity vectors are identical.",
          "diagnostic_prompt": "On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?",
          "repair": "v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not."
        },
        {
          "wrong_idea": "Horizontal speed determines how long a horizontally launched object takes to fall.",
          "diagnostic_prompt": "If the horizontal launch speed doubles from the same height, does the ideal fall time change?",
          "repair": "No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK",
        "REP-KIN-2D-PROJECTILE-MODEL"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        },
        {
          "id": "REP-KIN-2D-PROJECTILE-MODEL",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Make the ideal projectile specialization conditional on the interactions that remain after release: gravity-only free flight licenses a_x=0 and a_y=-g; retained thrust, significant drag or contact requires a more general model.",
          "required_elements": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "relation_refs": [
            "REL-PROJECTILE-COMPONENT-MODEL"
          ],
          "read_order": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "instance_constraints": [
            "Model eligibility is determined from post-release interactions rather than trajectory shape.",
            "With +y upward, the ideal projectile specialization requires a_x=0 and a_y=-g.",
            "If horizontal thrust, significant drag or continuing contact is retained, the ideal projectile specialization is rejected even when the path is curved."
          ],
          "accessibility": [
            "Active post-release interactions are named in text; arrows or colours are not the only cue.",
            "The acceleration components and model status are readable as text or symbols.",
            "Invalid-model status states the violated assumption explicitly."
          ],
          "misleading_alternatives": [
            "Calling every launched or curved-path object an ideal projectile.",
            "Keeping a_x=0 while also showing an active horizontal rocket thrust."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "gravity-only status",
              "symbol": "g",
              "in_words": "The retained gravitational acceleration magnitude in the ideal projectile specialization."
            },
            {
              "element": "horizontal acceleration readout",
              "symbol": "v_x",
              "in_words": "The horizontal component whose constancy is a consequence of zero horizontal acceleration in the ideal specialization."
            },
            {
              "element": "vertical acceleration readout",
              "symbol": "v_y",
              "in_words": "The vertical velocity component that changes under the retained gravitational acceleration."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-PROJECTILE-MODEL-GATE"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-PROJ-V0",
              "label": "Launch story",
              "purpose": "Show the launched-object scenario without naming the model.",
              "visible_elements": [
                "launched-object scene"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V1",
              "label": "Interaction audit",
              "purpose": "Expose post-release interactions while leaving the model decision to the learner.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V2",
              "label": "Acceleration consequences",
              "purpose": "Show the acceleration components implied by the interaction audit without declaring final model eligibility.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V3",
              "label": "Model decision",
              "purpose": "Reveal the model-status gate after the interaction and acceleration evidence is visible.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout",
                "model-status gate"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL"
        }
      ],
      "relation_checks": [
        "v_x is constant.",
        "At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.",
        "Both component equations use the same t."
      ],
      "exit_task": {
        "prompt": "A stone is launched horizontally from a cliff with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one common t is used.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "a_x=0, a_y=-g; v_x=u, v_y=-gt; Delta x=ut, Delta y=-0.5gt², all at the same elapsed time t.",
          "reasoning": [
            "After release only gravity acts in the ideal model.",
            "Gravity has no horizontal component in the chosen frame.",
            "Both component coordinates describe the same stone at the same instant."
          ],
          "check": "Horizontal velocity remains constant while downward speed magnitude grows with time.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The exit task is symbolic and model-based; no cliff height or numerical g is required."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2A-PROJECTILE-APEX-03",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "An ideal projectile is launched with already-resolved components u_x=12 m/s and u_y=20 m/s. Take +y upward and g=10 m/s^2. Find the time to the apex, the velocity at the apex, the acceleration at the apex, and the height gained above launch.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2A-PROJECTILE-APEX-03",
      "subparts": [],
      "options": [],
      "conditions": [
        "Air resistance is neglected.",
        "After release, gravity is the only retained force.",
        "The given initial components are already resolved."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "Which component condition defines the apex?",
          "reveals": "CONCEPT"
        },
        {
          "text": "Set only v_y to zero, solve for the shared time, then evaluate the other requested quantities at that time.",
          "reveals": "METHOD"
        }
      ],
      "scaffolds": [
        {
          "text": "Write separate horizontal and vertical rules before deciding what condition defines the top of the path.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-2D-APEX-REPRESENT"
        },
        {
          "text": "At the apex, decide which velocity component changes sign and set only that component to zero.",
          "support_kind": "CONNECT",
          "reveals": "METHOD",
          "supports_move_ref": "R-KIN-2D-APEX-EVENT"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-2D-APEX-REPRESENT",
          "kind": "REPRESENT",
          "action": "Represent ideal flight with a_x=0, a_y=-g, constant v_x=u_x and v_y=u_y-gt in the upward-positive frame.",
          "why_valid": "Gravity-only free flight leaves horizontal velocity constant while vertical velocity changes under a constant downward acceleration.",
          "inputs": [
            "u_x=12 m/s",
            "u_y=20 m/s",
            "g=10 m/s^2"
          ],
          "output": "The apex can be located from vertical velocity while v_x remains 12 m/s."
        },
        {
          "id": "R-KIN-2D-APEX-EVENT",
          "kind": "DECIDE",
          "action": "Identify the apex by v_y=0, not by setting the full velocity or acceleration to zero.",
          "why_valid": "At a vertical turning point v_y changes sign, while horizontal motion continues and gravity remains present.",
          "inputs": [
            "v_y=u_y-gt",
            "v_x nonzero",
            "a_y=-g"
          ],
          "output": "The correct apex event equation is 0=20-10t."
        },
        {
          "id": "R-KIN-2D-APEX-CALCULATE",
          "kind": "TRANSFORM",
          "action": "Solve t=2 s, then evaluate velocity, acceleration and height gain at that same event time.",
          "why_valid": "Every requested quantity describes the same apex event, so the time obtained from v_y=0 must be reused across both components.",
          "inputs": [
            "t_apex=2 s",
            "u_x=12",
            "u_y=20",
            "g=10"
          ],
          "output": "v=(12i+0j) m/s, a=(0i-10j) m/s^2 and height gained=20 m."
        },
        {
          "id": "R-KIN-2D-APEX-CHECK",
          "kind": "VERIFY",
          "action": "Confirm that only v_y vanishes at the apex while v_x and downward acceleration remain nonzero.",
          "why_valid": "This component check distinguishes a vertical turning point from the false claim that the projectile stops or gravity vanishes.",
          "inputs": [
            "apex component values",
            "gravity-only acceleration"
          ],
          "output": "The apex state is consistent with continuous horizontal motion and unchanged gravity."
        }
      ],
      "crux_move_ref": "R-KIN-2D-APEX-EVENT",
      "check": "Only v_y is zero at the apex; neither the full velocity nor the acceleration is zero.",
      "solution": {
        "summary": "The apex occurs at t=2 s. There v=(12 i + 0 j) m/s, a=(0 i - 10 j) m/s^2, and the height gained is 20 m.",
        "steps": [
          "At the apex set v_y=u_y-gt=0, so t=20/10=2 s.",
          "Horizontal acceleration is zero, so v_x remains 12 m/s.",
          "Gravity still acts at the apex, so a_y=-10 m/s^2.",
          "Delta y=20(2)-0.5(10)(2^2)=20 m."
        ],
        "rubric": []
      },
      "repair": {
        "step_ref": "K2D3-4"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": false,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [],
      "pre_attempt_scaffold_limit": 0,
      "pre_attempt_hint_limit": 2,
      "post_attempt_hint_limit": 2
    },
    "orientation": null
  },
  {
    "id": "CORE2B-Q-PHY-KIN-2D-2B-REPRESENTATION-01",
    "core": "CORE2B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
      "title": "Split one plane-motion event into independent x/y components with one clock",
      "inferential_jump": "Perpendicular components may be solved separately because each axis equation contains only that axis's quantities, but they still describe one object at one physical time.",
      "entry_assumptions": [
        "Can read signed vector components in a declared x-y frame."
      ],
      "teaching_path": [
        {
          "id": "K2D1-1",
          "role": "DECLARE",
          "action": "Choose one fixed x-y frame, one origin and one time origin for the whole plane-motion event.",
          "why_valid": "A component value is meaningful only after its frame and sign convention are fixed.",
          "inputs": [],
          "output": "one declared frame, origin, axis orientation and t=0"
        },
        {
          "id": "K2D1-2",
          "role": "TRANSFORM",
          "action": "Represent position, velocity and acceleration as signed x and y components in that same frame.",
          "why_valid": "A plane vector is completely represented by its perpendicular Cartesian components once the frame is declared.",
          "inputs": [
            "CAP-VECTOR-SIGNED-COMPONENT"
          ],
          "output": "signed component state (x,y), (v_x,v_y), (a_x,a_y)"
        },
        {
          "id": "K2D1-3",
          "role": "TRANSFORM",
          "action": "Keep x-quantities in the x description and y-quantities in the y description while using one shared elapsed time.",
          "why_valid": "The perpendicular component equations are independent in Cartesian kinematics, but both describe the same object during the same physical interval.",
          "inputs": [],
          "output": "two axis histories coupled by one clock"
        },
        {
          "id": "K2D1-4",
          "role": "VERIFY",
          "action": "Recombine only component values that refer to the same frame and the same instant.",
          "why_valid": "Mixing x at one time with y at another does not describe any single physical state of the object.",
          "inputs": [],
          "output": "one physically valid plane state reconstructed from simultaneous components"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If x and y components are independent, does that mean the object has two different clocks?",
          "defensible_answer": "No. The component equations are separate, but the event uses one common elapsed time."
        },
        "attempt": {
          "produces": "A two-column x/y setup with one shared t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Axes are kept separate while time/frame remain shared.",
              "evidence_of": "Correct component independence model."
            }
          ],
          "accepted": [
            "Separate x and y equations; same t for both."
          ],
          "rejected": [
            "Use x acceleration in the y equation or assign unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What must be declared before any component can have a sign?",
              "why_this_ask": "Recovers the common frame and axis convention.",
              "from_step_ref": "K2D1-1"
            },
            {
              "ask": "What separates between axes, and what must stay common because both descriptions belong to one event?",
              "why_this_ask": "Distinguishes component independence from the shared-clock invariant.",
              "from_step_ref": "K2D1-3"
            },
            {
              "ask": "Which x and y values may be recombined into one state?",
              "why_this_ask": "Makes simultaneity observable rather than implicit.",
              "from_step_ref": "K2D1-4"
            }
          ],
          "differs_from_teaching_path": "Teaching states the independence/common-time rule; reconstruction makes the learner distinguish what separates from what stays shared."
        },
        "boundary_test": {
          "prompt": "If a_x=0 but a_y is nonzero, may v_x stay constant while v_y changes?",
          "answer": "Yes. That is exactly what independent component evolution permits.",
          "confirms": "One component can change while the other does not."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "Independent x and y motions may use different elapsed times.",
          "diagnostic_prompt": "At one instant 2 s after launch, may the x equation use t=2 s while the y equation uses another time?",
          "repair": "No. Independence separates the axis equations; it does not give the same object two clocks."
        },
        {
          "wrong_idea": "The x-motion and y-motion are two different objects that can be paired arbitrarily later.",
          "diagnostic_prompt": "May x(2 s) be combined with y(3 s) to describe the particle's position?",
          "repair": "No. A plane state is a simultaneous pair. Recombine x(t) and y(t) only at the same t in the same frame."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        }
      ],
      "relation_checks": [],
      "exit_task": {
        "prompt": "A particle has x-velocity 6 m/s and y-velocity -8 m/s at t=3 s. Explain what 'independent components' means and what must remain shared between the x and y descriptions.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "The x and y component equations are solved separately in the same frame, but both describe the same particle at the same t=3 s.",
          "reasoning": [
            "Keep x quantities in the x equation and y quantities in the y equation.",
            "Use one common elapsed time for the same physical instant.",
            "Recombine components only after each axis is handled consistently."
          ],
          "check": "Both component values must refer to the same frame and same instant.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "No new numerical computation is required."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2B-REPRESENTATION-01",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "A particle is described verbally: at t=0 it is at the origin, moving east at 6 m/s and north at 2 m/s; during the next interval its acceleration is 3 m/s^2 south and zero east-west. Without being given component equations, choose a coordinate convention and write the signed component state that should be used for later calculation.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2B-REPRESENTATION-01",
      "subparts": [],
      "options": [],
      "conditions": [
        "Use one fixed Cartesian frame.",
        "The verbal directions must be translated into signed components before calculation."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "Before writing numbers, which two perpendicular positive directions will you declare?",
          "reveals": "CONCEPT"
        },
        {
          "text": "Translate each directional word into a sign only after that frame is fixed.",
          "reveals": "METHOD"
        }
      ],
      "scaffolds": [
        {
          "text": "First list the raw direction words and magnitudes without plus or minus signs.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-2D-BREP-FACTS"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-2D-BREP-FACTS",
          "kind": "REPRESENT",
          "action": "List the verbal motion facts—eastward velocity, northward velocity, southward acceleration and zero east-west acceleration—without assigning signs yet.",
          "why_valid": "Direction words are physical facts independent of coordinates; keeping them sign-free first prevents a hidden axis convention from entering the translation.",
          "inputs": [
            "6 m/s east",
            "2 m/s north",
            "3 m/s^2 south",
            "zero east-west acceleration"
          ],
          "output": "A coordinate-free list of directional velocity and acceleration facts."
        },
        {
          "id": "R-KIN-2D-BREP-FRAME",
          "kind": "DECIDE",
          "action": "Choose and declare one perpendicular positive-axis convention before converting the directional facts into signed components.",
          "why_valid": "Component signs have meaning only relative to an explicitly chosen frame, and this task deliberately withholds that representation decision.",
          "inputs": [
            "directional facts",
            "need for one fixed Cartesian frame"
          ],
          "output": "For example, choose +x east and +y north; another consistent convention is also valid."
        },
        {
          "id": "R-KIN-2D-BREP-TRANSLATE",
          "kind": "TRANSFORM",
          "action": "Translate each directional fact using the declared frame to obtain u_x=+6, u_y=+2, a_x=0 and a_y=-3.",
          "why_valid": "Once positive directions are fixed, east and north align with positive axes while south opposes +y, so the signs follow from the chosen representation.",
          "inputs": [
            "declared +x east",
            "+y north",
            "directional facts"
          ],
          "output": "u_x=+6 m/s, u_y=+2 m/s, a_x=0, a_y=-3 m/s^2."
        },
        {
          "id": "R-KIN-2D-BREP-CHECK",
          "kind": "VERIFY",
          "action": "Reverse one axis convention mentally and verify that all affected component signs reverse together while the physical motion is unchanged.",
          "why_valid": "Coordinate descriptions may change under axis reversal, but a consistent transformation must preserve the underlying directional motion.",
          "inputs": [
            "signed components",
            "alternative consistent axis convention"
          ],
          "output": "The representation is internally consistent rather than tied to an undeclared sign convention."
        }
      ],
      "crux_move_ref": "R-KIN-2D-BREP-FRAME",
      "transfer": {
        "dimension": "representation_translation",
        "statement": "The learner must convert a verbal direction description into signed x/y state without being handed the component representation.",
        "builds_on": [
          "Q-PHY-KIN-2D-2A-SHARED-CLOCK-01"
        ],
        "protected_move_ref": "R-KIN-2D-BREP-FRAME"
      },
      "check": "Any consistently declared perpendicular axis convention is acceptable if all signs are transformed consistently.",
      "solution": {
        "summary": "One valid choice is +x east and +y north, giving u_x=+6 m/s, u_y=+2 m/s, a_x=0 and a_y=-3 m/s^2, all with one common t.",
        "steps": [
          "Declare +x east and +y north.",
          "Translate each direction into a sign in that frame.",
          "Keep the same frame and clock for both component histories."
        ],
        "rubric": [
          {
            "criterion": "Declares a single Cartesian frame before assigning signs.",
            "evidence_of": "Representation is chosen rather than assumed."
          },
          {
            "criterion": "Translates east/north/south statements into consistent signed components.",
            "evidence_of": "Verbal motion is converted into canonical x/y state."
          },
          {
            "criterion": "Keeps one common time for the two component histories.",
            "evidence_of": "Independent components are still one event."
          }
        ]
      },
      "repair": {
        "step_ref": "K2D1-2"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [
        "R-KIN-2D-BREP-FRAME"
      ],
      "pre_attempt_scaffold_limit": 1,
      "pre_attempt_hint_limit": 2,
      "post_attempt_hint_limit": 2
    },
    "orientation": null
  },
  {
    "id": "CORE2B-Q-PHY-KIN-2D-2B-MODEL-VALIDITY-02",
    "core": "CORE2B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION",
      "title": "Apply constant-acceleration kinematics component by component",
      "inferential_jump": "The one-dimensional constant-acceleration equations can be applied to each perpendicular component independently when a_x and a_y are each constant over the same interval.",
      "entry_assumptions": [
        "Can use the existing one-dimensional constant-acceleration model.",
        "Can keep x/y components separate with one common time."
      ],
      "teaching_path": [
        {
          "id": "K2D2-1",
          "role": "DECLARE",
          "action": "Check separately whether a_x and a_y are constant over the interval before choosing constant-acceleration equations on either axis.",
          "why_valid": "The familiar one-dimensional kinematic relations are exact only on an axis whose acceleration component is constant over the interval.",
          "inputs": [
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "per-axis model-validity decision"
        },
        {
          "id": "K2D2-2",
          "role": "TRANSFORM",
          "action": "Apply the one-dimensional constant-acceleration relations independently to x and y using only that axis's signed values and the same t.",
          "why_valid": "Each Cartesian component obeys the same one-dimensional relation when its acceleration component is constant.",
          "inputs": [
            "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
            "CAP-KIN-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x+a_x t; v_y=u_y+a_y t; Delta x=u_x t+0.5a_x t^2; Delta y=u_y t+0.5a_y t^2"
        },
        {
          "id": "K2D2-3",
          "role": "VERIFY",
          "action": "If one axis determines an event time, reuse that same time on the other axis before recombining and checking the plane state.",
          "why_valid": "The event occurs once for the object; a time obtained from one component is the clock value for every component at that same event.",
          "inputs": [],
          "output": "event time transferred across axes, then one checked plane state"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "If a_x is nonzero and a_y is zero, which velocity component changes with time?",
          "defensible_answer": "Only v_x changes; v_y remains constant."
        },
        "attempt": {
          "produces": "Two correct component constant-acceleration equations using one t.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "Each axis uses only its own signed initial values and acceleration while sharing the same time.",
              "evidence_of": "2D component model use rather than a scalar-magnitude shortcut."
            }
          ],
          "accepted": [
            "v_x=u_x+a_x t and v_y=u_y+a_y t with one t."
          ],
          "rejected": [
            "Use |a| in both equations or use separate unrelated times."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "Before using a constant-acceleration formula, what must be true about that axis's acceleration component?",
              "why_this_ask": "Makes model validity explicit rather than formula-driven.",
              "from_step_ref": "K2D2-1"
            },
            {
              "ask": "What does the 1D relation become when written only along x, and what changes for y?",
              "why_this_ask": "Transfers an existing model one axis at a time.",
              "from_step_ref": "K2D2-2"
            },
            {
              "ask": "If one component equation finds the event time, what time must the other component use?",
              "why_this_ask": "Recovers the shared-clock coupling at an event.",
              "from_step_ref": "K2D2-3"
            }
          ],
          "differs_from_teaching_path": "Teaching supplies component forms; reconstruction derives them by applying the existing 1D model separately to each axis."
        },
        "boundary_test": {
          "prompt": "If a_y changes with time while a_x stays constant, may the constant-acceleration equations still be exact on both axes for the whole interval?",
          "answer": "No. The x relation may remain exact, but the y constant-acceleration relation is not exact over that interval.",
          "confirms": "Model validity is checked per component."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "The magnitude of acceleration should be inserted unchanged into both x and y equations.",
          "diagnostic_prompt": "If a=(10 i + 4 j) m/s², should both component equations use a=√116?",
          "repair": "No. Use a_x=10 only in the x equation and a_y=4 only in the y equation; the magnitude is not either component."
        },
        {
          "wrong_idea": "If one acceleration component is constant, the constant-acceleration equations are automatically valid on both axes.",
          "diagnostic_prompt": "If a_x is constant but a_y changes with time, may the same constant-acceleration displacement formula be used exactly on y over the whole interval?",
          "repair": "No. Model validity is checked per axis. A constant a_x does not make a_y constant."
        },
        {
          "wrong_idea": "A time found from the x equation may be replaced by a different convenient time in the y equation.",
          "diagnostic_prompt": "If x-motion says an event occurs at t=3 s, what time belongs in the y equation for that same event?",
          "repair": "Use t=3 s. Both components describe the same event and therefore share one clock."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        }
      ],
      "relation_checks": [
        "Units match velocity on both equations.",
        "If a_x=0 then v_x stays constant; likewise for y.",
        "Every term has length units.",
        "Setting one acceleration component to zero reduces that axis to uniform motion."
      ],
      "exit_task": {
        "prompt": "A particle starts with u=(0,5) m/s and constant a=(10,4) m/s². Set up the x and y position equations at common time t without solving a particular numerical t.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "Use Delta x=0*t+0.5(10)t² and Delta y=5t+0.5(4)t² with the same t.",
          "reasoning": [
            "Read signed component initial velocities and accelerations.",
            "Apply the 1D constant-acceleration displacement relation separately.",
            "Keep one common elapsed time."
          ],
          "check": "Units are metres on both displacements and no x quantity appears in the y equation or vice versa.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The task asks for exact symbolic setup, not a new numerical claim."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2B-MODEL-VALIDITY-02",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "Over 0<=t<=4 s, a particle has a_x=2 m/s^2 but a_y=3t m/s^2. Decide whether the ordinary constant-acceleration equations may be used exactly on x, on y, on both, or on neither over the whole interval. Explain the model choice before doing any further calculation.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2B-MODEL-VALIDITY-02",
      "subparts": [],
      "options": [],
      "conditions": [
        "The acceleration components are given as functions of time.",
        "No numerical integration is required; the task is model selection."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "Is 'constant acceleration' one global label here, or must each component be checked over the interval?",
          "reveals": "CONCEPT"
        }
      ],
      "scaffolds": [
        {
          "text": "Make one row for a_x(t) and one for a_y(t), and write the validity condition each row must satisfy.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-2D-BMODEL-REPRESENT"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-2D-BMODEL-REPRESENT",
          "kind": "REPRESENT",
          "action": "Write the acceleration histories separately over the interval: a_x(t)=2 and a_y(t)=3t.",
          "why_valid": "The familiar component method remains available, but model validity must now be checked from how each acceleration component behaves with time.",
          "inputs": [
            "0<=t<=4 s",
            "a_x=2",
            "a_y=3t"
          ],
          "output": "One component is time-independent while the other explicitly varies with t."
        },
        {
          "id": "R-KIN-2D-BMODEL-DECIDE",
          "kind": "DECIDE",
          "action": "Decide separately for each axis whether the constant-acceleration condition is satisfied over the whole interval.",
          "why_valid": "The standard constant-acceleration equations require the relevant acceleration component to remain constant; validity on one axis does not license the other.",
          "inputs": [
            "a_x(t)=2",
            "a_y(t)=3t",
            "constant-acceleration condition"
          ],
          "output": "The model is exact on x and not exact on y over the interval."
        },
        {
          "id": "R-KIN-2D-BMODEL-BOUND",
          "kind": "CONNECT",
          "action": "Use ordinary constant-acceleration relations only for x and withhold them from y unless a different valid treatment is supplied.",
          "why_valid": "A model may be used only where its defining condition holds; rejecting it on y does not invalidate the independently valid x component.",
          "inputs": [
            "x condition satisfied",
            "y condition violated"
          ],
          "output": "Constant-acceleration equations are licensed on x only."
        },
        {
          "id": "R-KIN-2D-BMODEL-CHECK",
          "kind": "VERIFY",
          "action": "Compare endpoint accelerations: a_x is 2 at both ends, whereas a_y changes from 0 to 12 m/s^2.",
          "why_valid": "Endpoint comparison independently demonstrates constancy of x and non-constancy of y without relying on the equation choice.",
          "inputs": [
            "t=0",
            "t=4 s",
            "a_x(t)",
            "a_y(t)"
          ],
          "output": "The component-by-component model decision is confirmed."
        }
      ],
      "crux_move_ref": "R-KIN-2D-BMODEL-DECIDE",
      "transfer": {
        "dimension": "model_choice",
        "statement": "The learner must decide component-by-component whether the constant-acceleration model is valid instead of being told that it applies.",
        "builds_on": [
          "Q-PHY-KIN-2D-2A-CONSTANT-ACCEL-02"
        ],
        "protected_move_ref": "R-KIN-2D-BMODEL-DECIDE"
      },
      "check": "A constant total direction or a constant x component does not make the y component constant.",
      "solution": {
        "summary": "The constant-acceleration equations are exact on x because a_x is constant, but not on y because a_y changes with time over the interval.",
        "steps": [
          "Check each acceleration component separately.",
          "a_x=2 is constant, so the 1D constant-acceleration x relations are valid.",
          "a_y=3t varies with time, so the constant-a y relations are not exact over the whole interval."
        ],
        "rubric": [
          {
            "criterion": "Checks x and y acceleration components separately.",
            "evidence_of": "Model validity is treated per component."
          },
          {
            "criterion": "Accepts constant-acceleration equations only on x.",
            "evidence_of": "Does not let one valid axis license the other."
          }
        ]
      },
      "repair": {
        "step_ref": "K2D2-1"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [
        "R-KIN-2D-BMODEL-DECIDE"
      ],
      "pre_attempt_scaffold_limit": 1,
      "pre_attempt_hint_limit": 1,
      "post_attempt_hint_limit": 1
    },
    "orientation": null
  },
  {
    "id": "CORE2B-Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04",
    "core": "CORE2B",
    "contract_version": "1.0",
    "concept": {
      "microtopic_ref": "MIC-PHY-KIN-PROJECTILE-MODEL",
      "title": "Select the gravity-only projectile model before using projectile consequences",
      "inferential_jump": "After release in the ideal near-Earth model, projectile motion is not a new set of laws: it is the same component kinematics with a_x=0 and a_y=-g (for +y upward).",
      "entry_assumptions": [
        "Can solve 2D constant-acceleration component equations.",
        "If an oblique launch angle is given, angle-based vector decomposition is available as a separate prerequisite for that question."
      ],
      "teaching_path": [
        {
          "id": "K2D3-1",
          "role": "DECLARE",
          "action": "Decide whether the object is in ideal near-Earth free flight after release; neglect air resistance, declare +y, then set a_x=0 and a_y=-g.",
          "why_valid": "The standard projectile equations are a conditional specialization of 2D constant acceleration, not an automatic label for every launched object.",
          "inputs": [],
          "output": "gravity-only projectile acceleration state"
        },
        {
          "id": "K2D3-2",
          "role": "TRANSFORM",
          "action": "Use supplied or separately resolved u_x and u_y with one common t in the horizontal and vertical component equations.",
          "why_valid": "Horizontal, oblique and downward/upward initial components change the initial state, not the gravity-only model.",
          "inputs": [
            "CAP-KIN-2D-CONSTANT-ACCELERATION"
          ],
          "output": "v_x=u_x; v_y=u_y-g t; Delta x=u_x t; Delta y=u_y t-0.5g t^2"
        },
        {
          "id": "K2D3-3",
          "role": "DECLARE",
          "action": "Translate the requested event into the component condition that defines it before solving for time.",
          "why_valid": "Apex, same-height return, ground impact and a specified later instant are different events; each is identified by a different component condition.",
          "inputs": [],
          "output": "event condition chosen before calculation"
        },
        {
          "id": "K2D3-4",
          "role": "TRANSFORM",
          "action": "For an apex event, set v_y=0 while keeping v_x=u_x and a_y=-g.",
          "why_valid": "At the highest point only the vertical velocity component is momentarily zero; gravity still accelerates downward and horizontal motion continues.",
          "inputs": [],
          "output": "apex condition v_y=0 with nonzero horizontal velocity and nonzero downward acceleration"
        },
        {
          "id": "K2D3-5",
          "role": "TRANSFORM",
          "action": "For a return to the launch height, set Delta y=0 and treat any same-height flight-time/range shortcut as conditional on that equality.",
          "why_valid": "The shortcut follows from the vertical displacement returning to its initial value; it is not valid when the landing height differs.",
          "inputs": [],
          "output": "same-height event condition and its validity boundary"
        },
        {
          "id": "K2D3-6",
          "role": "TRANSFORM",
          "action": "For any unequal-height landing, use the actual Delta y=y_f-y_i in the vertical position equation and retain the actual u_y; for a horizontal launch specifically, set u_y=0, then obtain the event time vertically and share it with x.",
          "why_valid": "Initial vertical velocity and landing displacement describe different facts. The landing event is fixed by the actual vertical geometry, while u_y=0 is only the horizontal-launch initial condition.",
          "inputs": [],
          "output": "Delta y=y_f-y_i=u_y t_event-0.5g t_event^2; for horizontal launch u_y=0; reuse the solved t_event on x"
        },
        {
          "id": "K2D3-7",
          "role": "VERIFY",
          "action": "At the selected event time, reconstruct the requested velocity, speed, direction, displacement or range from simultaneous components and check qualitative limits.",
          "why_valid": "The reported projectile result is a consequence of one component model and one event, so its components must refer to the same instant and satisfy a_x=0, a_y=-g.",
          "inputs": [],
          "output": "checked projectile consequence at one physical event"
        }
      ],
      "elicitation": {
        "predict": {
          "prompt": "Immediately after a horizontal launch, which acceleration component is zero in the ideal model?",
          "defensible_answer": "a_x is zero; a_y is -g if +y is upward."
        },
        "attempt": {
          "produces": "A model declaration and component-equation setup for a horizontal or oblique projectile.",
          "closure": "RUBRIC",
          "rubric": [
            {
              "criterion": "The learner selects gravity-only free flight, uses a_x=0/a_y=-g and one common time before calculating any named projectile quantity.",
              "evidence_of": "Projectile model selection rather than formula recall."
            }
          ],
          "accepted": [
            "State assumptions, set component accelerations, then solve x/y with one t."
          ],
          "rejected": [
            "Start from a memorized range/height formula without establishing the free-flight component model."
          ]
        },
        "reconstruct": {
          "route": [
            {
              "ask": "What forces remain after release in the idealized problem?",
              "why_this_ask": "Elicits the gravity-only model.",
              "from_step_ref": "K2D3-1"
            },
            {
              "ask": "What are the horizontal and vertical component equations, and what clock do they share?",
              "why_this_ask": "Rebuilds the projectile specialization from 2D constant acceleration.",
              "from_step_ref": "K2D3-2"
            },
            {
              "ask": "What exact component condition identifies the event the question asks about?",
              "why_this_ask": "Separates model selection from event selection.",
              "from_step_ref": "K2D3-3"
            },
            {
              "ask": "If the event is the apex, what becomes zero and what definitely does not?",
              "why_this_ask": "Protects against the common full-velocity/full-acceleration zero shortcut.",
              "from_step_ref": "K2D3-4"
            },
            {
              "ask": "Does launch height equal landing height? If not, which shortcut becomes invalid?",
              "why_this_ask": "Makes the same-height boundary explicit.",
              "from_step_ref": "K2D3-5"
            }
          ],
          "differs_from_teaching_path": "Teaching states the projectile specialization; reconstruction derives it from the post-release interaction model and coordinate choice."
        },
        "boundary_test": {
          "prompt": "A launched object continues under significant horizontal thrust after release. May the standard a_x=0 projectile specialization be used?",
          "answer": "No. The object is not in gravity-only free flight; its horizontal acceleration is not zero under that model.",
          "confirms": "Projectile equations are conditional consequences of a declared force/model state."
        }
      },
      "misconceptions": [
        {
          "wrong_idea": "A projectile needs a horizontal force to keep moving horizontally.",
          "diagnostic_prompt": "If a_x=0 after release, can v_x still be nonzero?",
          "repair": "Yes. Zero horizontal acceleration means horizontal velocity stays constant, not that it becomes zero."
        },
        {
          "wrong_idea": "A horizontal launch has no vertical velocity throughout the flight.",
          "diagnostic_prompt": "One second after a horizontal launch, is v_y still zero under gravity?",
          "repair": "No. u_y=0 only at release; a_y=-g makes v_y=-gt afterward."
        },
        {
          "wrong_idea": "At the highest point the whole velocity and the acceleration are both zero.",
          "diagnostic_prompt": "At the apex of an oblique projectile, which of v_x, v_y and a_y is zero?",
          "repair": "Only v_y is zero at that instant. v_x remains u_x and a_y remains -g."
        },
        {
          "wrong_idea": "Same-height flight formulas may be used whenever the question is about a projectile range or flight time.",
          "diagnostic_prompt": "A ball launched from a roof lands on the ground below. May the same-height time-of-flight shortcut be used without checking the vertical displacement?",
          "repair": "No. Same-height shortcuts require Delta y=0 between launch and landing. For unequal heights, solve the vertical position condition."
        },
        {
          "wrong_idea": "At two points of the same height on an ideal trajectory, the velocity vectors are identical.",
          "diagnostic_prompt": "On ascent and descent at the same height, how do the horizontal and vertical velocity components compare?",
          "repair": "v_x is the same, while v_y has equal magnitude and opposite sign; the speed matches but the velocity vector does not."
        },
        {
          "wrong_idea": "Horizontal speed determines how long a horizontally launched object takes to fall.",
          "diagnostic_prompt": "If the horizontal launch speed doubles from the same height, does the ideal fall time change?",
          "repair": "No. The vertical position equation determines the fall time; horizontal speed changes the range, not the fall time."
        }
      ],
      "representation_refs": [
        "REP-KIN-2D-SHARED-CLOCK",
        "REP-KIN-2D-EVENT-CLOCK",
        "REP-KIN-2D-PROJECTILE-MODEL"
      ],
      "representations": [
        {
          "id": "REP-KIN-2D-SHARED-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Keep independently evolving x and y descriptions attached to one physical object, one declared frame and one shared clock, so only simultaneous component values are recombined into a plane state.",
          "required_elements": [
            "physical object",
            "declared x-y frame",
            "x-component history",
            "y-component history",
            "shared time marker",
            "simultaneous ordered-pair state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical object",
            "declared x-y frame",
            "shared time marker",
            "x-component history",
            "y-component history",
            "simultaneous ordered-pair state"
          ],
          "instance_constraints": [
            "The x and y histories describe the same object in the same declared frame.",
            "A reconstructed plane state uses x and y evaluated at one identical elapsed time.",
            "Mixed-time values may be individually valid measurements but must not be rendered as one simultaneous state."
          ],
          "accessibility": [
            "The shared time is stated numerically or textually; synchronization must not be conveyed by colour alone.",
            "Each component history is labelled with axis and signed quantity.",
            "An invalid mixed-time state is identified in text as non-simultaneous."
          ],
          "misleading_alternatives": [
            "Showing separate x and y clocks without marking a mismatch as invalid.",
            "Recombining x(t1) with y(t2) as though it were one physical state."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [
            {
              "id": "SCENE-KIN-2D-SHARED-CLOCK-PORTABLE-01",
              "cores": [
                "CORE1A",
                "CORE1B"
              ],
              "microtopic_ref": "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS",
              "datum_refs": [
                "DAT-KIN-2D-SHARED-T2",
                "DAT-KIN-2D-MIXED-T3"
              ],
              "scene": {
                "kind": "SHARED_CLOCK_2D",
                "frame": "One physical particle in one declared x-y frame; every component sample remains attached to its own sample time.",
                "caption": "Same-time x and y samples may reconstruct one simultaneous particle state; mixed-time samples are non-simultaneous and must be rejected.",
                "portable_workbench": {
                  "schema_version": "1.0.0",
                  "package_ref": "portable-motion-shared-clock",
                  "scene_ref": "portable-motion-shared-clock-scene",
                  "grid": {
                    "id": "shared-clock-grid",
                    "rows": [
                      "candidate",
                      "reconstruction"
                    ],
                    "columns": [
                      "sample",
                      "state"
                    ]
                  },
                  "entities": [
                    {
                      "id": "shared-clock-same-time-candidate",
                      "label": "x(2 s), y(2 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "semantic_state": "SIMULTANEOUS"
                    },
                    {
                      "id": "shared-clock-mixed-time-candidate",
                      "label": "x(2 s), y(3 s)",
                      "x_time_ref": "DAT-KIN-2D-SHARED-T2",
                      "y_time_ref": "DAT-KIN-2D-MIXED-T3",
                      "semantic_state": "NON_SIMULTANEOUS"
                    }
                  ],
                  "target": {
                    "id": "shared-clock-plane-state",
                    "label": "Reconstruct one simultaneous plane state",
                    "operation": "reconstruct-plane-state"
                  },
                  "transactions": [
                    {
                      "id": "same-time",
                      "source_entity_ref": "shared-clock-same-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "ACCEPT",
                      "summary": "Same-time x(2 s) and y(2 s) samples refer to one shared physical instant and may be recombined."
                    },
                    {
                      "id": "mixed-time",
                      "source_entity_ref": "shared-clock-mixed-time-candidate",
                      "target_ref": "shared-clock-plane-state",
                      "operation": "reconstruct-plane-state",
                      "outcome": "REJECT",
                      "reason": "Mixing x at one time with y at another does not describe any single physical state of the object."
                    }
                  ],
                  "accessibility": {
                    "validity_is_textual": true,
                    "synchronization_is_not_colour_only": true,
                    "mixed_time_reason_required": true
                  },
                  "release": {
                    "portable_package": "READY",
                    "standalone": "READY"
                  }
                }
              }
            }
          ],
          "correspondence": [
            {
              "element": "x-component history",
              "symbol": "v_x",
              "in_words": "The horizontal velocity component at the shared physical time."
            },
            {
              "element": "y-component history",
              "symbol": "v_y",
              "in_words": "The vertical velocity component at the same shared physical time."
            },
            {
              "element": "shared time marker",
              "symbol": "t",
              "in_words": "The one elapsed time used by both component descriptions."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-SHARED-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-SHARED-V0",
              "label": "Problem only",
              "purpose": "Show the physical motion without handing over the component representation.",
              "visible_elements": [
                "physical object"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V1",
              "label": "Frame and clock",
              "purpose": "Expose the common frame and one shared time marker before showing the completed component state.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V2",
              "label": "Component histories",
              "purpose": "Show separate signed x and y histories tied to the same clock while leaving final recombination to the learner.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history"
              ]
            },
            {
              "id": "VIS-KIN-2D-SHARED-V3",
              "label": "Simultaneous reconstruction",
              "purpose": "Reveal the valid ordered-pair state reconstructed from same-time component values.",
              "visible_elements": [
                "physical object",
                "declared x-y frame",
                "shared time marker",
                "x-component history",
                "y-component history",
                "simultaneous ordered-pair state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK"
        },
        {
          "id": "REP-KIN-2D-EVENT-CLOCK",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "GRAPH",
          "purpose": "Make event selection explicit: one component condition identifies the requested event time, and that same time is then reused on every component before reconstructing the requested state.",
          "required_elements": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "relation_refs": [
            "REL-KIN-2D-VELOCITY",
            "REL-KIN-2D-DISPLACEMENT"
          ],
          "read_order": [
            "physical event",
            "event condition",
            "shared event timeline",
            "solved event-time marker",
            "x-component evaluation",
            "y-component evaluation",
            "reconstructed event state"
          ],
          "instance_constraints": [
            "The event condition must name the physical instant before cross-axis calculation is performed.",
            "A time solved from one component is reused unchanged on the other component for that same event.",
            "The final event state contains only component values sampled at the solved event time."
          ],
          "accessibility": [
            "The event condition and solved time are stated in text as well as marked graphically.",
            "Cross-axis reuse of the event time is announced explicitly.",
            "Component evaluations are labelled with the same event-time value."
          ],
          "misleading_alternatives": [
            "Solving unrelated convenient times on x and y for one physical event.",
            "Using a projectile shortcut before identifying the event condition that makes it valid."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "solved event-time marker",
              "symbol": "t",
              "in_words": "The single elapsed time at which both component descriptions are evaluated for the selected event."
            },
            {
              "element": "x-component evaluation",
              "symbol": "Delta x",
              "in_words": "The horizontal displacement evaluated at the shared event time."
            },
            {
              "element": "y-component evaluation",
              "symbol": "Delta y",
              "in_words": "The vertical displacement evaluated at the same shared event time."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-EVENT-CLOCK"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-EVENT-V0",
              "label": "Requested event",
              "purpose": "Show only the physical story and requested event.",
              "visible_elements": [
                "physical event"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V1",
              "label": "Event condition",
              "purpose": "Expose the condition that identifies the event without solving its time.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V2",
              "label": "Shared event time",
              "purpose": "Reveal the solved event-time marker while leaving cross-axis evaluation to the learner.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker"
              ]
            },
            {
              "id": "VIS-KIN-2D-EVENT-V3",
              "label": "Event reconstruction",
              "purpose": "Show both component evaluations and the reconstructed simultaneous event state.",
              "visible_elements": [
                "physical event",
                "event condition",
                "shared event timeline",
                "solved event-time marker",
                "x-component evaluation",
                "y-component evaluation",
                "reconstructed event state"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-EVENT-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-EVENT-CLOCK"
        },
        {
          "id": "REP-KIN-2D-PROJECTILE-MODEL",
          "version": "0.1.0",
          "status": "CANDIDATE",
          "source_refs": [
            "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
          ],
          "evidence_refs": [],
          "extensions": {},
          "kind": "VECTOR",
          "purpose": "Make the ideal projectile specialization conditional on the interactions that remain after release: gravity-only free flight licenses a_x=0 and a_y=-g; retained thrust, significant drag or contact requires a more general model.",
          "required_elements": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "relation_refs": [
            "REL-PROJECTILE-COMPONENT-MODEL"
          ],
          "read_order": [
            "launched-object scene",
            "post-release interaction inventory",
            "gravity-only status",
            "horizontal acceleration readout",
            "vertical acceleration readout",
            "model-status gate"
          ],
          "instance_constraints": [
            "Model eligibility is determined from post-release interactions rather than trajectory shape.",
            "With +y upward, the ideal projectile specialization requires a_x=0 and a_y=-g.",
            "If horizontal thrust, significant drag or continuing contact is retained, the ideal projectile specialization is rejected even when the path is curved."
          ],
          "accessibility": [
            "Active post-release interactions are named in text; arrows or colours are not the only cue.",
            "The acceleration components and model status are readable as text or symbols.",
            "Invalid-model status states the violated assumption explicitly."
          ],
          "misleading_alternatives": [
            "Calling every launched or curved-path object an ideal projectile.",
            "Keeping a_x=0 while also showing an active horizontal rocket thrust."
          ],
          "rendered_asset_refs": [],
          "scene_instances": [],
          "correspondence": [
            {
              "element": "gravity-only status",
              "symbol": "g",
              "in_words": "The retained gravitational acceleration magnitude in the ideal projectile specialization."
            },
            {
              "element": "horizontal acceleration readout",
              "symbol": "v_x",
              "in_words": "The horizontal component whose constancy is a consequence of zero horizontal acceleration in the ideal specialization."
            },
            {
              "element": "vertical acceleration readout",
              "symbol": "v_y",
              "in_words": "The vertical velocity component that changes under the retained gravitational acceleration."
            }
          ],
          "interactive_resource_refs": [
            "ACT-KIN-2D-PROJECTILE-MODEL-GATE"
          ],
          "reveal_stages": [
            {
              "id": "VIS-KIN-2D-PROJ-V0",
              "label": "Launch story",
              "purpose": "Show the launched-object scenario without naming the model.",
              "visible_elements": [
                "launched-object scene"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V1",
              "label": "Interaction audit",
              "purpose": "Expose post-release interactions while leaving the model decision to the learner.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V2",
              "label": "Acceleration consequences",
              "purpose": "Show the acceleration components implied by the interaction audit without declaring final model eligibility.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout"
              ]
            },
            {
              "id": "VIS-KIN-2D-PROJ-V3",
              "label": "Model decision",
              "purpose": "Reveal the model-status gate after the interaction and acceleration evidence is visible.",
              "visible_elements": [
                "launched-object scene",
                "post-release interaction inventory",
                "gravity-only status",
                "horizontal acceleration readout",
                "vertical acceleration readout",
                "model-status gate"
              ]
            }
          ],
          "support_stage_map": [
            {
              "support_level": "low",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V0"
            },
            {
              "support_level": "medium",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
            },
            {
              "support_level": "high",
              "visual_stage_ref": "VIS-KIN-2D-PROJ-V2"
            }
          ],
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL"
        }
      ],
      "relation_checks": [
        "v_x is constant.",
        "At the highest point of an oblique trajectory, v_y=0 but a_y remains -g.",
        "Both component equations use the same t."
      ],
      "exit_task": {
        "prompt": "A stone is launched horizontally from a cliff with speed u. With +y upward and air resistance neglected, write its component acceleration, velocity and displacement relations after release and explain why one common t is used.",
        "source_ref": "SRC-EXAMSIDE-MIP-DEMAND",
        "answer": {
          "kind": "MODEL_RESPONSE",
          "summary": "a_x=0, a_y=-g; v_x=u, v_y=-gt; Delta x=ut, Delta y=-0.5gt², all at the same elapsed time t.",
          "reasoning": [
            "After release only gravity acts in the ideal model.",
            "Gravity has no horizontal component in the chosen frame.",
            "Both component coordinates describe the same stone at the same instant."
          ],
          "check": "Horizontal velocity remains constant while downward speed magnitude grows with time.",
          "acceptable_alternatives": [],
          "subpart_answers": [],
          "verification_status": "CHECKED_BY_AUTHOR"
        },
        "oracle": {
          "no_numeric_claim": "The exit task is symbolic and model-based; no cliff height or numerical g is required."
        }
      },
      "worked_anchors": []
    },
    "application": {
      "question_ref": "Q-PHY-KIN-2D-2B-PROJECTILE-VALIDITY-04",
      "family_ref": "FAM-PHY-KIN-2D-PRACTICE",
      "stem": "An object is launched and, after release, a small rocket motor continues to provide a horizontal thrust that gives a_x=2 m/s^2 while gravity gives a_y=-g. Decide whether the standard ideal projectile specialization a_x=0, a_y=-g is valid and state the correct bounded model to use.",
      "source_refs": [
        "SRC-AUTHOR-KIN-2D-EXAMSIDE-ADAPTATION"
      ],
      "origin": "AUTHORED",
      "original_number": "AUTHOR-KIN-2D-2B-PROJECTILE-VALIDITY-04",
      "subparts": [],
      "options": [],
      "conditions": [
        "Air resistance is neglected.",
        "The horizontal rocket thrust remains active after release.",
        "The question asks for model selection, not a full trajectory calculation."
      ],
      "figure_refs": [],
      "hints": [
        {
          "text": "Which post-release assumption makes a_x=0 in the standard projectile model, and is it true here?",
          "reveals": "CONCEPT"
        }
      ],
      "scaffolds": [
        {
          "text": "List the post-release interactions and the acceleration components they imply before you name any motion model.",
          "support_kind": "REPRESENT",
          "reveals": "CONCEPT",
          "supports_move_ref": "R-KIN-TRANSFER-INTERACTIONS",
          "visual_ref": "REP-KIN-2D-PROJECTILE-MODEL",
          "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
        }
      ],
      "reasoning_route": [
        {
          "id": "R-KIN-TRANSFER-INTERACTIONS",
          "kind": "REPRESENT",
          "action": "Inventory the interactions and acceleration components that remain after release before assigning a named motion model.",
          "why_valid": "Model validity follows from the retained post-release interactions, not from the fact that the object was launched or follows a curved path.",
          "inputs": [
            "horizontal rocket thrust remains active",
            "a_x=2 m/s^2",
            "a_y=-g"
          ],
          "output": "Post-release motion has nonzero horizontal acceleration and gravitational vertical acceleration.",
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL",
          "visual_stage_ref": "VIS-KIN-2D-PROJ-V1"
        },
        {
          "id": "R-KIN-TRANSFER-MODEL",
          "kind": "DECIDE",
          "action": "Reject the standard gravity-only projectile specialization because its defining horizontal-acceleration condition is violated.",
          "why_valid": "The standard specialization requires gravity-only free flight and therefore a_x=0, while the active motor gives a_x=2 m/s^2.",
          "inputs": [
            "projectile condition a_x=0",
            "actual a_x=2 m/s^2",
            "active post-release thrust"
          ],
          "output": "The standard ideal projectile specialization is invalid for this interval.",
          "representation_ref": "REP-KIN-2D-PROJECTILE-MODEL",
          "visual_stage_ref": "VIS-KIN-2D-PROJ-V3"
        },
        {
          "id": "R-KIN-TRANSFER-PARENT",
          "kind": "CONNECT",
          "action": "Use the parent two-dimensional constant-acceleration model with a_x=2 m/s^2 and a_y=-g for as long as both components remain constant.",
          "why_valid": "Rejecting a specialization does not discard the more general component model whose validity conditions are still satisfied.",
          "inputs": [
            "constant a_x=2 m/s^2",
            "constant a_y=-g",
            "one shared time"
          ],
          "output": "Use component constant-acceleration equations in x and y with one common clock.",
          "representation_ref": "REP-KIN-2D-SHARED-CLOCK",
          "visual_stage_ref": "VIS-KIN-2D-SHARED-V2"
        },
        {
          "id": "R-KIN-TRANSFER-CHECK",
          "kind": "VERIFY",
          "action": "Check the model boundary by switching the motor off while keeping drag negligible.",
          "why_valid": "Once the horizontal thrust ends, a_x returns to zero and gravity-only free flight licenses the standard projectile specialization from that later instant.",
          "inputs": [
            "motor off",
            "drag negligible",
            "gravity retained"
          ],
          "output": "The specialization becomes valid exactly when its defining interaction condition is restored."
        }
      ],
      "crux_move_ref": "R-KIN-TRANSFER-MODEL",
      "transfer": {
        "dimension": "model_choice",
        "statement": "The learner must reject the familiar projectile specialization because one of its defining force/model conditions is explicitly broken.",
        "builds_on": [
          "Q-PHY-KIN-2D-2A-HORIZONTAL-LAUNCH-04"
        ],
        "protected_move_ref": "R-KIN-TRANSFER-MODEL"
      },
      "check": "If the motor is switched off after release and drag remains negligible, the standard a_x=0 projectile model becomes valid from that later instant.",
      "solution": {
        "summary": "The standard ideal projectile specialization is not valid because a_x is not zero. Use the more general 2D constant-acceleration model with a_x=2 m/s^2 and a_y=-g for as long as those components remain constant.",
        "steps": [
          "The standard projectile specialization requires gravity-only free flight.",
          "The active rocket motor adds a retained horizontal acceleration.",
          "Therefore use the parent 2D constant-acceleration capability rather than the gravity-only projectile specialization."
        ],
        "rubric": [
          {
            "criterion": "Rejects the gravity-only projectile specialization.",
            "evidence_of": "Checks model conditions before formula use."
          },
          {
            "criterion": "Falls back to the general component constant-acceleration model.",
            "evidence_of": "Chooses the smallest valid parent model rather than inventing a new law."
          }
        ]
      },
      "repair": {
        "step_ref": "K2D3-1"
      },
      "figures": []
    },
    "presentation": {
      "attempt_before_reveal": true,
      "show_full_construction": false,
      "show_solution_initially": false,
      "protected_move_refs": [
        "R-KIN-TRANSFER-MODEL"
      ],
      "pre_attempt_scaffold_limit": 1,
      "pre_attempt_hint_limit": 1,
      "post_attempt_hint_limit": 1
    },
    "orientation": null
  }
];
export const recoveryManifest = {
  "issue": 274,
  "source_main_sha": "7982850a5d5d5ed133e3098522a889b89f1fc54a",
  "renderer_draft_head": "97005291accdfd85ea07f6b8e40693714334bd9d",
  "generated_by": "Physics/content/projectile-core-recovery/build.mjs",
  "source_package": "Physics/library/phy-kin-2d-motion.v1.json",
  "source_sha256": "ba7d7c937b3ecca2c84f6f919cd074a8b65393fe237cda4ee551beb6dc7a9b56",
  "bank_sha256": "5ba0ea9c3538214ade771b69570c2edff12feab630a70c1b66c20b3e22fde3e5",
  "renderer_sha256": "36a7d7d668ca27c0eb42979e5ac9ae09e0f970e8cc15fbee5eff8833be4ec1fd",
  "outputs": {
    "CORE1": "CANDIDATE_LEARNER_PREVIEW",
    "CORE1A": "HOLD_WORKED_ANCHOR_AND_SCENE_BINDING",
    "CORE1B": "CANDIDATE_INTERACTIVE_RECONSTRUCTION",
    "CORE2": "HOLD_ORDINARY_SOURCE_CUSTODY",
    "CORE2A": "CANDIDATE_INHERITED_HOLD",
    "CORE2B": "CANDIDATE_INHERITED_HOLD"
  },
  "question_identity": [
    {
      "owner_alias": "Q28",
      "canonical_question_ref": "PYQ-PHY-JEEMAIN-2026-04APR-S2-Q29",
      "original_identifier": "JEE Main|2026|Session 2 · 04 Apr 2026 · Shift 2|Physics|Q29",
      "primary_capability_ref": "CAP-KIN-2D-INDEPENDENT-COMPONENTS",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "DIAGNOSTIC_ONLY",
      "learner_eligibility": "NOT_ESTABLISHED"
    },
    {
      "owner_alias": "Q15",
      "canonical_question_ref": "PYQ-PHY-JEEADV-2018-P2-Q08",
      "original_identifier": "JEE (Advanced)|2018|Paper 2|Physics|Q8",
      "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "IDENTITY_HOLD",
      "learner_eligibility": "NOT_ESTABLISHED"
    },
    {
      "owner_alias": "Q15",
      "canonical_question_ref": "PYQ-PHY-JEEADV-2023-P1-Q01",
      "original_identifier": "JEE (Advanced)|2023|Paper 1|Physics|Q1",
      "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "IDENTITY_HOLD",
      "learner_eligibility": "NOT_ESTABLISHED"
    },
    {
      "owner_alias": "Q21",
      "canonical_question_ref": "PYQ-PHY-JEEADV-2022-P1-Q08",
      "original_identifier": "JEE (Advanced)|2022|Paper 1|Physics|Q8",
      "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "DIAGNOSTIC_ONLY",
      "learner_eligibility": "NOT_ESTABLISHED"
    },
    {
      "owner_alias": "Q26",
      "canonical_question_ref": "PYQ-PHY-JEEADV-2026-P1-Q06",
      "original_identifier": "JEE (Advanced)|2026|Paper 1|Physics|Q6",
      "primary_capability_ref": "CAP-KIN-PROJECTILE-MODEL",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "DIAGNOSTIC_ONLY",
      "learner_eligibility": "NOT_ESTABLISHED"
    },
    {
      "owner_alias": "Q23",
      "canonical_question_ref": "PYQ-PHY-JEEADV-2025-P2-Q15",
      "original_identifier": "JEE (Advanced)|2025|Paper 2|Physics|Q15",
      "primary_capability_ref": "CAP-KIN-2D-CONSTANT-ACCELERATION",
      "wording_custody": "BANK_RECORD_ONLY",
      "bank_status": "CANDIDATE",
      "disposition": "DIAGNOSTIC_ONLY",
      "learner_eligibility": "NOT_ESTABLISHED"
    }
  ],
  "holds": [
    "Core2 has no authorized ordinary source corpus for this bucket.",
    "Core1A has no canonical questions exposed as worked conceptual anchors.",
    "Event-clock and projectile-model representations lack canonical scene instances.",
    "Q15 source identity is ambiguous: 2018 P2 Q08 and 2023 P1 Q01 are different items.",
    "Five competitive-bank anchors are diagnostic evidence, not an accepted learner question set.",
    "PDF publication belongs to issue #273 and has not been validated."
  ]
};
export const activityLinks = {
  "MIC-PHY-KIN-2D-INDEPENDENT-COMPONENTS": "../explorers/shared-clock/index.html",
  "MIC-PHY-KIN-2D-CONSTANT-ACCELERATION": "../explorers/event-clock/index.html",
  "MIC-PHY-KIN-PROJECTILE-MODEL": "../explorers/projectile-model/index.html"
};
