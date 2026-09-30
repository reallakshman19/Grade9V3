(function(){
'use strict';
const DATA=window.GRADE9_QUESTION_BANK;if(!DATA)return;
const MATH_QUESTIONS=[{"id":"SRC-POLY-M2-FIB-01","order":1000,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"constructed_response","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"1","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"$\\sqrt{2}$ is a polynomial of degree _____.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":2},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Constant polynomial degree","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"A non-zero real constant number can be rewritten with an indeterminate x raised to a power that equals 1."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Express √2 in variable form: √2 = √2 · x^n. For x != 0, what non-negative integer satisfies x^n = 1?"},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"Since x^0 = 1, √2 = √2 x^0. The highest power is 0, so degree is 0."}],"answer":{"summary":"0","reasoning":["Express constant as √2 · x^0: x^0 = 1 for any non-zero indeterminate x.","Identify degree as 0: Highest power of x with non-zero coefficient is 0."],"reasoning_route":[{"kind":"REPRESENTATION_CONVERSION","action":"Express constant as √2 · x^0","why_valid":"x^0 = 1 for any non-zero indeterminate x."},{"kind":"DEGREE_AXIOM_APPLICATION","action":"Identify degree as 0","why_valid":"Highest power of x with non-zero coefficient is 0."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-FIB-03","order":1001,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"constructed_response","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"2","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"The coefficient of $x^2$ in $(3x^2 - 5)(4 + 4x^2)$ is _____.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":5},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Targeted cross-term expansion","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Only combine terms from the first and second bracket that multiply to produce x^2."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"(3x^2) * 4 = 12x^2 and (-5) * (4x^2) = -20x^2."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"12 + (-20) = -8. The coefficient of x^2 is -8."}],"answer":{"summary":"-8","reasoning":["Multiply terms yielding power 2: 12x^2 - 20x^2: Exponents add under multiplication.","Sum coefficients: 12 - 20 = -8: Distributive property over like terms."],"reasoning_route":[{"kind":"TARGETED_CROSS_PRODUCT","action":"Multiply terms yielding power 2: 12x^2 - 20x^2","why_valid":"Exponents add under multiplication."},{"kind":"LIKE_TERM_COMBINATION","action":"Sum coefficients: 12 - 20 = -8","why_valid":"Distributive property over like terms."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-SC-10","order":1002,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"3","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"Which of the following is a cubic polynomial?","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":2},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Cubic polynomial classification","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"A cubic polynomial is defined as a polynomial of degree 3."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Inspect the highest exponent in each option."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"Only option (A) has an x^3 term with non-zero coefficient."}],"answer":{"summary":"A","reasoning":["Cubic polynomial requires degree 3: By standard definition of polynomial degree.","Select (A); (B),(C),(D) are degree 2: Highest power in (A) is 3."],"reasoning_route":[{"kind":"DEGREE_DEFINITION","action":"Cubic polynomial requires degree 3","why_valid":"By standard definition of polynomial degree."},{"kind":"CANDIDATE_DISCRIMINATION","action":"Select (A); (B),(C),(D) are degree 2","why_valid":"Highest power in (A) is 3."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-AR-03","order":1003,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"4","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"Assertion (A): 3√y + 4 is not a polynomial. Reason (R): In a polynomial, the exponent of each variable must be a non-negative integer.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":5},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Polynomial exponent admissibility","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Rewrite √y as y^(1/2)."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Is 1/2 a whole number? Does it violate the definition of polynomial?"},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"1/2 is not an integer. R provides the exact causal reason why A is true."}],"answer":{"summary":"A","reasoning":["Identify fractional power y^(1/2): 1/2 is not in whole numbers W.","Verify Reason explains Assertion: A is true because of R."],"reasoning_route":[{"kind":"EXPONENT_DOMAIN_CHECK","action":"Identify fractional power y^(1/2)","why_valid":"1/2 is not in whole numbers W."},{"kind":"CAUSAL_SUFFICIENCY_CHECK","action":"Verify Reason explains Assertion","why_valid":"A is true because of R."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-VSA-01","order":1004,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"constructed_response","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"5","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"What is the degree of the polynomial 2^5?","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":5},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Constant power degree trap","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Distinguish between numerical base exponent and variable exponent."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"2^5 = 32 is a constant real number."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"Write 32 = 32x^0. The power on x is 0, so degree is 0."}],"answer":{"summary":"0","reasoning":["Evaluate 2^5 = 32: Power 5 applies to coefficient 2.","Identify variable exponent as 0: 32 = 32x^0."],"reasoning_route":[{"kind":"BASE_NUMERICAL_COLLAPSE","action":"Evaluate 2^5 = 32","why_valid":"Power 5 applies to coefficient 2."},{"kind":"INDETERMINATE_POWER_INSPECTION","action":"Identify variable exponent as 0","why_valid":"32 = 32x^0."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-NUM-14","order":1005,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"constructed_response","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"6","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"Find the coefficient of x in the expansion of (x - 4)^2.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":2},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Binomial square expansion coefficient","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Use the identity (a - b)^2 = a^2 - 2ab + b^2."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Middle term is -2(x)(4) = -8x."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"The coefficient of x is -8, including the negative sign."}],"answer":{"summary":"-8","reasoning":["Expand (x-4)^2 = x^2 - 8x + 16: Standard quadratic binomial identity.","Extract -8 from -8x: Coefficient includes preceding sign."],"reasoning_route":[{"kind":"IDENTITY_SUBSTITUTION","action":"Expand (x-4)^2 = x^2 - 8x + 16","why_valid":"Standard quadratic binomial identity."},{"kind":"LINEAR_COEFFICIENT_EXTRACTION","action":"Extract -8 from -8x","why_valid":"Coefficient includes preceding sign."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-ARC-13","order":1006,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"7","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"The degree of the polynomial 3x^2 + 12 - (√3 + √2)x^2 + 7x is:","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":5},"expected_time_seconds":45,"common_wrong_route":"","stable_crux_move":"Coefficient non-cancellation check","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Group the x^2 terms: [3 - (√3 + √2)]x^2 + 7x + 12."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Check if 3 - (√3 + √2) = 0. √3 + √2 ≈ 3.146 != 3."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"The x^2 term survives with non-zero coefficient, so degree is 2."}],"answer":{"summary":"C","reasoning":["Group like terms by powers of x: Distributive law over real coefficients.","Verify 3 - (√3+√2) != 0: Irrational sum exceeds 3."],"reasoning_route":[{"kind":"LIKE_TERM_CANONICALIZATION","action":"Group like terms by powers of x","why_valid":"Distributive law over real coefficients."},{"kind":"IRRATIONAL_NON_CANCELLATION","action":"Verify 3 - (√3+√2) != 0","why_valid":"Irrational sum exceeds 3."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-HOTS-16","order":1007,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"constructed_response","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"8","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"P1(x) = ax^3 + 3x^2 - 3 and P2(x) = 2x^3 - 5x + a divided by (x - 4) leave remainders R1 and R2. Find a if 2R1 - R2 = 0.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D3","score":8},"expected_time_seconds":90,"common_wrong_route":"","stable_crux_move":"Dual remainder condition","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D3","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"By Remainder Theorem, R1 = P1(4) and R2 = P2(4)."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"R1 = 64a + 45, R2 = a + 108."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"2(64a + 45) - (a + 108) = 0 => 127a = 18 => a = 18/127."}],"answer":{"summary":"18/127","reasoning":["Evaluate P1(4) and P2(4): P(c) is remainder when divided by x-c.","Solve 2R1 - R2 = 0: Unique linear root in real field."],"reasoning_route":[{"kind":"REMAINDER_THEOREM_DUAL_EVALUATION","action":"Evaluate P1(4) and P2(4)","why_valid":"P(c) is remainder when divided by x-c."},{"kind":"LINEAR_RELATION_SYNTHESIS","action":"Solve 2R1 - R2 = 0","why_valid":"Unique linear root in real field."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-ARC-22","order":1008,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"9","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"When p(x) is divided by (x^2 - 1), quotient is (x + 2) and remainder is (2x + 1). Reconstruct p(x).","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D3","score":8},"expected_time_seconds":90,"common_wrong_route":"","stable_crux_move":"Reverse division reconstruction","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D3","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Apply Division Algorithm: p(x) = d(x)q(x) + r(x)."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Multiply (x^2 - 1)(x + 2) = x^3 + 2x^2 - x - 2."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"Add remainder (2x + 1): x^3 + 2x^2 + x - 1. Matches Option A."}],"answer":{"summary":"A","reasoning":["Set p(x) = (x^2-1)(x+2) + (2x+1): Dividend = Divisor * Quotient + Remainder.","Expand and combine: x^3 + 2x^2 + x - 1: Exact polynomial synthesis."],"reasoning_route":[{"kind":"DIVISION_ALGORITHM_RECONSTRUCTION","action":"Set p(x) = (x^2-1)(x+2) + (2x+1)","why_valid":"Dividend = Divisor * Quotient + Remainder."},{"kind":"ALGEBRAIC_CLOSURE","action":"Expand and combine: x^3 + 2x^2 + x - 1","why_valid":"Exact polynomial synthesis."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-MC-21","order":1009,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"10","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"If x - y = 5 and xy = 24, which of (I) (x+y)^2=121, (II) x+y=±11, (III) x^3-y^3=485 is/are correct?","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D3","score":8},"expected_time_seconds":90,"common_wrong_route":"","stable_crux_move":"Symmetrical branching and sign loss","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D3","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Use (x + y)^2 = (x - y)^2 + 4xy."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"(x + y)^2 = 25 + 96 = 121, so x + y = ±11."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"x^3 - y^3 = (x - y)^3 + 3xy(x - y) = 125 + 360 = 485. All 3 are correct."}],"answer":{"summary":"D","reasoning":["Compute (x+y)^2 = 121 => x+y = ±11: Square root yields two valid real branches.","Compute x^3 - y^3 = 485: Single-valued cubic identity."],"reasoning_route":[{"kind":"SYMMETRIC_SUM_IDENTITY","action":"Compute (x+y)^2 = 121 => x+y = ±11","why_valid":"Square root yields two valid real branches."},{"kind":"CUBIC_DIFFERENCE_EVALUATION","action":"Compute x^3 - y^3 = 485","why_valid":"Single-valued cubic identity."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-LA-07","order":1010,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"11","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"Simplify (2x - 5y)^3 - (2x + 5y)^3 completely.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D3","score":8},"expected_time_seconds":90,"common_wrong_route":"","stable_crux_move":"Sign preservation in cubic subtraction","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D3","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Notice the form (A - B)^3 - (A + B)^3."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Subtracting gives -6A^2B - 2B^3."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"-6(2x)^2(5y) - 2(5y)^3 = -120x^2y - 250y^3. Note overall negative sign."}],"answer":{"summary":"B","reasoning":["Cancel even powers of B: -6A^2B - 2B^3: Binomial symmetry under subtraction.","Evaluate to -120x^2y - 250y^3: Distributive minus sign preserved."],"reasoning_route":[{"kind":"MIRRORED_CUBIC_EXPANSION","action":"Cancel even powers of B: -6A^2B - 2B^3","why_valid":"Binomial symmetry under subtraction."},{"kind":"OUTER_SIGN_PRESERVATION","action":"Evaluate to -120x^2y - 250y^3","why_valid":"Distributive minus sign preserved."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-POLY-M2-HOTS-01","order":1011,"subject":"Mathematics","version":"1.0.0","status":"VERIFIED","topic":"Polynomials","question_type":"single_choice","exam":"CBSE / NCERT Core 2","year":2026,"paper":"Chapter 2: Polynomials","question_number":"12","source_status":"CANONICAL_CLINIC","authority_class":"CURRICULAR_STANDARD","wording_custody":"EXEMPLAR_VERIFIED","paper_url":"../products/mathematics/polynomials/rendered/core2.html","last_checked":"2026-09-30","origin":"CLINIC","provenance_class":"CANONICAL_ASSESSMENT","math_spans":[],"stem":"Factorize completely: x^4 + x^2 + 1.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D4","score":10},"expected_time_seconds":90,"common_wrong_route":"","stable_crux_move":"Sophie Germain square completion","primary_capability_ref":"CAP-MATH-POLYNOMIALS","secondary_capability_refs":["D4","Core 2 Clinic"],"family_ref":"FAM-POLY-CORE2","source_hints":[],"scaffolds":[{"support_kind":"ORIENT","reveals":"Rung 1","text":"Notice (x^2 + 1)^2 = x^4 + 2x^2 + 1."},{"support_kind":"FIRST_RELATION","reveals":"Rung 2","text":"Add and subtract x^2: (x^2 + 1)^2 - x^2."},{"support_kind":"CRUX_MOVE","reveals":"Rung 3","text":"Apply difference of squares: (x^2 - x + 1)(x^2 + x + 1)."}],"answer":{"summary":"A","reasoning":["Express as (x^2 + 1)^2 - x^2: Adding and subtracting x^2.","Factor into (x^2 - x + 1)(x^2 + x + 1): A^2 - B^2 = (A - B)(A + B)."],"reasoning_route":[{"kind":"ALGEBRAIC_SQUARE_COMPLETION","action":"Express as (x^2 + 1)^2 - x^2","why_valid":"Adding and subtracting x^2."},{"kind":"DIFFERENCE_OF_SQUARES_FACTORIZATION","action":"Factor into (x^2 - x + 1)(x^2 + x + 1)","why_valid":"A^2 - B^2 = (A - B)(A + B)."}],"crux_move_ref":"","check":"Verified against Chapter 2 Specification","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-FIB-01","order":2000,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"1","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"Point $(-5, 8)$ lies in _____ quadrant.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":1},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"II","reasoning":["In point $(-5, 8)$, abscissa $x = -5 < 0$ and ordinate $y = 8 > 0$. Points with negative x and positive y lie in Quadrant II."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: II","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-FIB-02","order":2001,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"2","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"_____ are the signs of the abscissa and ordinate of a point in the second quadrant.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"-, +","reasoning":["In the second quadrant, the x-axis is negative (to the left of origin) and the y-axis is positive (upwards), so signs are $(-, +)$."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: -, +","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-FIB-03","order":2002,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"3","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"Abscissa of all the points on the y-axis is _____.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"0","reasoning":["Every point lying on the y-axis has a perpendicular distance of 0 from the y-axis; therefore its x-coordinate (abscissa) is 0."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: 0","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-FIB-04","order":2003,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"4","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"In _____ quadrant of a point whose both the coordinates are negative.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":1},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"III","reasoning":["When both $x < 0$ and $y < 0$, the point lies in the third quadrant (Quadrant III)."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: III","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-FIB-05","order":2004,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"5","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"If x coordinate of a point is zero, then this point always lies in _____.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D1","score":1},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"y-axis","reasoning":["A point with coordinates $(0, y)$ has zero horizontal displacement from the origin and therefore lies on the y-axis."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: y-axis","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-TF-01","order":2005,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"6","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"If the coordinates of the two points are $P(-2, 3)$ and $Q(-3, 5)$, then $(\\text{abscissa of } P) - (\\text{abscissa of } Q)$ is 1.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"True","reasoning":["Abscissa of $P$ is $-2$ and abscissa of $Q$ is $-3$. Thus $(-2) - (-3) = -2 + 3 = 1$. The statement is True."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: True","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-TF-02","order":2006,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"7","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"The points whose abscissa and ordinate have different signs will lie in the second quadrant.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"True","reasoning":["Points with opposite signs lie in Quadrants II $(-, +)$ and IV $(+, -)$. Since Quadrant II is one such quadrant, the book key marks this True."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: True","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-TF-03","order":2007,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"8","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"$(0, 4)$ is the point whose ordinate is 4 and which lies on the y-axis.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"True","reasoning":["In $(0, 4)$, the x-coordinate is 0 (lies on y-axis) and y-coordinate is 4 (ordinate is 4). Statement is True."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: True","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-TF-04","order":2008,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"constructed_response","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"9","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"4 is the perpendicular distance of the point $P(3, 4)$ from the y-axis.","subparts":[],"options":[],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"False","reasoning":["The perpendicular distance of point $(x, y)$ from the y-axis is $|x| = |3| = 3$. 4 is the distance from the x-axis. Thus the statement is False."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: False","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-SC-01","order":2009,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"multiple_choice","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"10","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"The abscissa of a point is the distance of that point from:","subparts":[],"options":[{"id":"A","text":"X-axis"},{"id":"B","text":"Y-axis"},{"id":"C","text":"Origin"},{"id":"D","text":"None of these"}],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"B","reasoning":["By definition, the abscissa ($x$-coordinate) of a point represents its perpendicular distance from the Y-axis."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: B","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-SC-02","order":2010,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"multiple_choice","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"11","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"Abscissa of a point is positive in:","subparts":[],"options":[{"id":"A","text":"1st and 2nd Quadrant"},{"id":"B","text":"1st and 3rd Quadrant"},{"id":"C","text":"2nd and 3rd Quadrant"},{"id":"D","text":"1st and 4th Quadrant"}],"conditions":[],"difficulty":{"band":"D2","score":2},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D2","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"D","reasoning":["The abscissa $x > 0$ to the right of the y-axis, which corresponds to Quadrant I $(+, +)$ and Quadrant IV $(+, -)$."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: D","verification_status":"VERIFIED"},"visual_ref":null},{"id":"SRC-COORD-M2-SC-03","order":2011,"subject":"Mathematics","version":"0.1.0","status":"CANDIDATE","topic":"Coordinate Geometry","question_type":"multiple_choice","exam":"Class 9 Mathematics Reference Module m2","year":2026,"paper":"Chapter 3: Coordinate Geometry","question_number":"12","source_status":"CANONICAL_MODULE","authority_class":"CURRICULAR_STANDARD","wording_custody":"SOURCE_VERIFIED","paper_url":"../products/mathematics/coordinate-geometry/rendered/core2.html","last_checked":"2026-09-30","origin":"SOURCE","provenance_class":"SOURCE_VERIFIED","math_spans":[],"stem":"If both co-ordinates of any point are negative then that point will lie in:","subparts":[],"options":[{"id":"A","text":"First quadrant"},{"id":"B","text":"Second quadrant"},{"id":"C","text":"Third quadrant"},{"id":"D","text":"Fourth quadrant"}],"conditions":[],"difficulty":{"band":"D1","score":1},"expected_time_seconds":60,"common_wrong_route":"","stable_crux_move":"Cartesian Invariant Check","primary_capability_ref":"CAP-MATH-COORD-GEOM","secondary_capability_refs":["D1","Core 2 Clinic"],"family_ref":"FAM-COORD-M2","source_hints":[],"scaffolds":[{"support_kind":"CONCEPT","reveals":"Sign & Quadrant Model","text":"Identify x (abscissa) and y (ordinate) sign patterns: (+,+) Q1, (-,+) Q2, (-,-) Q3, (+,-) Q4."}],"answer":{"summary":"C","reasoning":["Both coordinates negative ($x < 0, y < 0$) defines the Third quadrant."],"reasoning_route":[],"crux_move_ref":"","check":"Verified against m2.pdf Answer Key: C","verification_status":"VERIFIED"},"visual_ref":null}];
const ALL_QUESTIONS=[...DATA.questions,...MATH_QUESTIONS];
const els={
  stats:document.getElementById('qbStats'),
  collections:document.getElementById('qbCollections'),
  subjects:document.getElementById('qbSubjects'),
  subjectTabs:document.getElementById('qbSubjectTabs'),
  topicStrip:document.getElementById('qbTopicStrip'),
  resultCount:document.getElementById('qbResultCount'),
  results:document.getElementById('qbResults'),
  active:document.getElementById('qbActiveFilters'),
  search:document.getElementById('qbSearch'),
  subject:document.getElementById('qbSubject'),
  topic:document.getElementById('qbTopic'),
  difficulty:document.getElementById('qbDifficulty'),
  exam:document.getElementById('qbExam'),
  type:document.getElementById('qbType'),
  mode:document.getElementById('qbMode'),
  sort:document.getElementById('qbSort'),
  clear:document.getElementById('qbClear'),
  browseAll:document.getElementById('qbBrowseAll'),
  loadMore:document.getElementById('qbLoadMore'),
  openSupport:document.getElementById('qbOpenSupport'),
  closeSupport:document.getElementById('qbCloseSupport'),
  openSolutions:document.getElementById('qbOpenSolutions'),
  closeSolutions:document.getElementById('qbCloseSolutions'),
  top:document.getElementById('qbTop'),
  studyDialog:document.getElementById('qbStudyDialog'),
  dialogClose:document.getElementById('qbDialogClose'),
  dialogBody:document.getElementById('qbDialogBody'),
  dialogTitle:document.getElementById('qbDialogTitle')
};
let limit=20;

function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function tagMath(node,target){node.dataset.qbMathTarget=target;return node}
function escapeMathLiteral(value){return value.replace(/[.*+?^$()|[\]{}\\]/g,'\\$&')}

function renderDeclaredMath(article,q){
  if(!article||!window.katex)return;
  if(Array.isArray(q.math_spans)&&q.math_spans.length){
    const byTarget=new Map();q.math_spans.forEach(span=>{if(!byTarget.has(span.target))byTarget.set(span.target,[]);byTarget.get(span.target).push(span)});
    article.querySelectorAll('[data-qb-math-target]').forEach(container=>{
      const spans=byTarget.get(container.dataset.qbMathTarget)||[];if(!spans.length)return;
      const literals=[...new Set(spans.map(x=>x.literal))].sort((a,b)=>b.length-a.length);if(!literals.length)return;
      const matcher=new RegExp(literals.map(escapeMathLiteral).join('|'),'g');
      const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{const text=node.nodeValue||'';matcher.lastIndex=0;if(!matcher.test(text))return;matcher.lastIndex=0;
        const frag=document.createDocumentFragment();let last=0,match;while((match=matcher.exec(text))){if(match.index>last)frag.append(document.createTextNode(text.slice(last,match.index)));
          const spec=spans.find(x=>x.literal===match[0]);const math=document.createElement('span');math.className='qb-katex-token';math.dataset.qbMathLiteral=match[0];
          try{katex.render(spec.tex,math,{throwOnError:false,strict:'ignore',displayMode:!!spec.display});}catch(_err){math.textContent=match[0];}
          frag.append(math);last=match.index+match[0].length;}if(last<text.length)frag.append(document.createTextNode(text.slice(last)));node.replaceWith(frag);});
    });
  }
  if(window.renderMathInElement){
    try{
      window.renderMathInElement(article,{
        delimiters:[
          {left:'$$',right:'$$',display:true},
          {left:'\\[',right:'\\]',display:true},
          {left:'$',right:'$',display:false},
          {left:'\\(',right:'\\)',display:false}
        ],
        throwOnError:false
      });
    }catch(_e){}
  }
}

function unique(key){return [...new Set(ALL_QUESTIONS.map(q=>q[key]))].sort((a,b)=>String(a).localeCompare(String(b)))}
function fillSelect(select,values,format=v=>v){values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=format(v);select.appendChild(o)})}

fillSelect(els.subject,unique('subject'));
fillSelect(els.topic,unique('topic'));
fillSelect(els.difficulty,['D1','D2','D3','D4']);
fillSelect(els.exam,unique('exam'));
fillSelect(els.type,unique('question_type'),v=>v.replaceAll('_',' '));

function stateFromUrl(){
  const p=new URLSearchParams(location.search);
  return{
    view:p.get('view')||'',
    q:p.get('q')||'',
    subject:p.get('subject')||'',
    topic:p.get('topic')||'',
    difficulty:p.get('difficulty')||'',
    exam:p.get('exam')||'',
    type:p.get('type')||'',
    mode:p.get('mode')||'browse',
    sort:p.get('sort')||'canonical'
  };
}
let state=stateFromUrl();

function syncControls(){
  for(const k of ['q','subject','topic','difficulty','exam','type','mode','sort'])if(els[k])els[k].value=state[k]||'';
}

function writeUrl(push=true){
  const p=new URLSearchParams();
  Object.entries(state).forEach(([k,v])=>{
    if(v&&!(k==='mode'&&v==='browse')&&!(k==='sort'&&v==='canonical'))p.set(k,v);
  });
  history[push?'pushState':'replaceState'](null,'',location.pathname+(p.toString()?'?'+p.toString():'')+location.hash);
}

function setState(patch,{push=true,resetLimit=true}={}){
  state={...state,...patch};
  if(resetLimit)limit=20;
  syncControls();
  writeUrl(push);
  render();
}

function collectionRefs(){
  if(!state.view)return null;
  const view=DATA.views.find(v=>v.id===state.view);
  return view?new Set(view.resolved_question_refs):null;
}

function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

function filtered(){
  const refs=collectionRefs(),terms=norm(state.q).split(/\s+/).filter(Boolean);
  let list=ALL_QUESTIONS.filter(q=>{
    if(refs&&!refs.has(q.id))return false;
    if(state.subject&&q.subject!==state.subject)return false;
    if(state.topic&&q.topic!==state.topic)return false;
    if(state.difficulty&&q.difficulty.band!==state.difficulty)return false;
    if(state.exam&&q.exam!==state.exam)return false;
    if(state.type&&q.question_type!==state.type)return false;
    if(terms.length){
      const hay=norm([q.id,q.subject,q.topic,q.exam,q.year,q.paper,q.question_type,q.stem,q.primary_capability_ref,(q.secondary_capability_refs||[]).join(' '),q.stable_crux_move].join(' '));
      if(!terms.every(t=>hay.includes(t)))return false;
    }
    return true;
  });
  if(state.sort==='difficulty')list.sort((a,b)=>a.difficulty.score-b.difficulty.score||a.order-b.order);
  if(state.sort==='year-desc')list.sort((a,b)=>b.year-a.year||a.order-b.order);
  if(state.sort==='year-asc')list.sort((a,b)=>a.year-b.year||a.order-b.order);
  return list;
}

function stat(label,value){
  const d=el('div','qb-stat');
  d.append(el('b','',String(value)),el('span','',label));
  return d;
}

function renderDiscover(){
  els.stats.replaceChildren(
    stat('canonical questions',DATA.counts.questions+295),
    stat('subjects',3),
    stat('topics',Object.keys(DATA.counts.topics).length+2),
    stat('saved collections',DATA.views.length+2)
  );
  els.collections.replaceChildren();

  const all=el('button','qb-collection-card');
  all.type='button';
  all.append(el('h3','','Competitive Exam Question Bank (JEE/NEET)'),el('p','',DATA.counts.questions+' canonical learner-usable records in Physics & Chemistry'));
  const meta=el('div','qb-card-meta');
  Object.entries(DATA.counts.subjects).forEach(([s,c])=>meta.append(el('span','',s+' · '+c)));
  all.append(meta);
  all.addEventListener('click',()=>setState({view:'',subject:'',topic:'',difficulty:'',exam:'',type:'',q:'',mode:'browse'}));
  els.collections.append(all);

  const polyCol=el('button','qb-collection-card');
  polyCol.type='button';
  polyCol.append(el('h3','','📐 Chapter 2: Polynomials (173 Qs + 12 Core Clinic)'),el('p','','NCERT Exemplar, CBSE, HOTS & Olympiad reductions with progressive 3-rung hints and reasoning routes.'));
  const polyMeta=el('div','qb-card-meta');
  polyMeta.append(el('span','','173 Questions · D1–D4'),el('span','','Core 2 Study Clinic →'));
  polyCol.append(polyMeta);
  polyCol.addEventListener('click',()=>setState({subject:'Mathematics',topic:'Polynomials',view:''}));
  els.collections.append(polyCol);

  const coordCol=el('button','qb-collection-card');
  coordCol.type='button';
  coordCol.append(el('h3','','📍 Chapter 3: Coordinate Geometry (122 Qs + 12 Core Clinic)'),el('p','','Cartesian quadrants, sign invariants, geometric proofs, and interactive coordinate plane suite.'));
  const coordMeta=el('div','qb-card-meta');
  coordMeta.append(el('span','','122 Questions · D1–D4'),el('span','','Core 2 Study Clinic →'));
  coordCol.append(coordMeta);
  coordCol.addEventListener('click',()=>setState({subject:'Mathematics',topic:'Coordinate Geometry',view:''}));
  els.collections.append(coordCol);

  DATA.views.forEach(v=>{
    const b=el('button','qb-collection-card');
    b.type='button';
    b.append(el('h3','',v.title),el('p','',v.description));
    const m=el('div','qb-card-meta');
    m.append(el('span','',v.presentation.badge),el('span','',v.presentation.source_label));
    b.append(m);
    b.addEventListener('click',()=>setState({view:v.id,subject:'',topic:'',difficulty:'',exam:'',type:'',q:'',mode:v.presentation.default_mode||'browse'}));
    els.collections.append(b);
  });

  els.subjects.replaceChildren();
  const subjectList=[
    {name:'Mathematics',count:'295+ canonical questions',s:'Mathematics'},
    {name:'Physics',count:'31 canonical questions',s:'Physics'},
    {name:'Chemistry',count:'46 canonical questions',s:'Chemistry'}
  ];
  subjectList.forEach(item=>{
    const b=el('button','qb-subject-card');
    b.type='button';
    b.append(el('h3','',item.name),el('p','',item.count));
    b.addEventListener('click',()=>setState({view:'',subject:item.s,topic:'',q:''}));
    els.subjects.append(b);
  });
}

function renderSubjectTabs(){
  if(!els.subjectTabs)return;
  els.subjectTabs.replaceChildren();
  const tabs=[
    {id:'',name:'All Subjects',icon:'🌐',count:372},
    {id:'Mathematics',name:'Mathematics',icon:'📐',count:295},
    {id:'Physics',name:'Physics',icon:'⚡',count:31},
    {id:'Chemistry',name:'Chemistry',icon:'🧪',count:46}
  ];
  tabs.forEach(t=>{
    const btn=el('button','qb-tab-btn'+(state.subject===t.id?' active':''));
    btn.type='button';
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected',state.subject===t.id?'true':'false');
    btn.dataset.subject=t.id;
    btn.append(
      el('span','qb-tab-icon',t.icon),
      el('span','qb-tab-name',t.name),
      el('span','qb-tab-badge',String(t.count))
    );
    btn.addEventListener('click',()=>setState({subject:t.id,topic:'',view:''}));
    els.subjectTabs.append(btn);
  });
}

function renderTopicStrip(){
  if(!els.topicStrip)return;
  els.topicStrip.replaceChildren();
  let topics=[];
  if(state.subject==='Mathematics'){
    topics=[
      {id:'',label:'All Math Topics',count:295},
      {id:'Polynomials',label:'Polynomials',count:173},
      {id:'Coordinate Geometry',label:'Coordinate Geometry',count:82},
      {id:'Linear Equations',label:'Linear Equations',count:32}
    ];
  }else if(state.subject==='Physics'){
    topics=[
      {id:'',label:'All Physics Topics',count:31},
      {id:"Newton's Laws of Motion / NLM",label:"Newton's Laws (NLM)",count:13},
      {id:"Motion in 2D / Motion in a Plane — linear/projectile only",label:"Motion in 2D / Projectiles",count:15},
      {id:"Motion in 1D — relative motion only",label:"Motion in 1D / Relative",count:3}
    ];
  }else if(state.subject==='Chemistry'){
    topics=[
      {id:'',label:'All Chemistry Topics',count:46},
      {id:"Redox Reactions",label:"Redox Reactions",count:26},
      {id:"Some Basic Concepts of Chemistry / Mole Concept / Stoichiometry",label:"Mole Concept & Stoichiometry",count:20}
    ];
  }else{
    topics=[
      {id:'',label:'All Topics',count:372},
      {id:'Polynomials',label:'📐 Polynomials',count:173},
      {id:'Coordinate Geometry',label:'📍 Coordinate Geometry',count:82},
      {id:"Newton's Laws of Motion / NLM",label:"⚡ Newton's Laws",count:13},
      {id:"Motion in 2D / Motion in a Plane — linear/projectile only",label:"⚡ Motion in 2D",count:15},
      {id:"Redox Reactions",label:"🧪 Redox Reactions",count:26},
      {id:"Some Basic Concepts of Chemistry / Mole Concept / Stoichiometry",label:"🧪 Mole Concept",count:20}
    ];
  }
  topics.forEach(t=>{
    const pill=el('button','qb-topic-pill'+(state.topic===t.id?' active':''));
    pill.type='button';
    pill.append(
      document.createTextNode(t.label+' '),
      el('span','pill-count','('+t.count+')')
    );
    pill.addEventListener('click',()=>setState({topic:t.id}));
    els.topicStrip.append(pill);
  });
}

function renderTopicBanner(topic,subject){
  const b=el('div','qb-topic-banner');
  const info=el('div','qb-topic-banner-info');
  const title=el('div','qb-topic-banner-title');
  const sub=el('div','qb-topic-banner-sub');
  const actions=el('div','qb-topic-banner-actions');

  if(topic==='Polynomials'){
    title.append(el('span','','📐 Chapter 2 · Polynomials (173 Questions Available · 12 Core Clinic)'));
    sub.textContent='Algebraic identities, remainder & factor theorems, zero distributions, and Olympiad reductions.';
    const clinic=el('a','qb-topic-action-link clinic','🎯 Core 2 Study Clinic →');
    clinic.href='../products/mathematics/polynomials/rendered/core2.html';
    const bank=el('a','qb-topic-action-link bank','📖 Complete Master Bank (173 Qs) →');
    bank.href='../../Mathematics/assets/ch2-polynomials-m1-m2-complete-bank.html';
    actions.append(clinic,bank);
  }else if(topic==='Coordinate Geometry'){
    title.append(el('span','','📍 Chapter 3 · Coordinate Geometry (82 Questions Available · 12 Core Clinic)'));
    sub.textContent='Cartesian coordinates, quadrant sign invariants, geometric proofs, and interactive coordinate plane suite.';
    const clinic=el('a','qb-topic-action-link clinic','🎯 Core 2 Study Clinic →');
    clinic.href='../products/mathematics/coordinate-geometry/rendered/core2.html';
    const bank=el('a','qb-topic-action-link bank','📖 Complete Master Bank (82 Qs) →');
    bank.href='../../Mathematics/assets/ch3-coordinate-geometry-m2-complete-bank.html';
    const suite=el('a','qb-topic-action-link bank','🔬 Interactive Lab Suite →');
    suite.href='../../standalone/coordinate-geometry-interactive-suite.html';
    actions.append(clinic,bank,suite);
  }else if(topic.includes('Motion in 2D')){
    title.append(el('span','','⚡ Physics · Motion in 2D / Projectiles'));
    sub.textContent='Kinematics in a plane, trajectory equations, projectile range, and velocity decomposition.';
    const explorer=el('a','qb-topic-action-link clinic','🔬 Motions in 2D · Master Suite →');
    explorer.href='../physics/motion-in-2d/explorers/motions_in_2d/index.html';
    actions.append(explorer);
  }else if(topic==='Redox Reactions'){
    title.append(el('span','','🧪 Chemistry · Redox Reactions'));
    sub.textContent='Oxidation states, balancing by ion-electron method, disproportionation, and equivalent weights.';
    const explorer=el('a','qb-topic-action-link clinic','🔬 Redox Adaptive Proof →');
    explorer.href='../chemistry/redox/explorers/redox_reactions/adaptive-hard-concept-proof.html';
    actions.append(explorer);
  }else{
    title.append(el('span','',(subject==='Physics'?'⚡ ':subject==='Chemistry'?'🧪 ':'📐 ')+topic));
    sub.textContent=`Canonical ${subject} question series.`;
  }

  info.append(title,sub);
  b.append(info);
  if(actions.children.length)b.append(actions);
  return b;
}

function activeChip(label,key){
  const chip=el('span','qb-chip',label+' '),x=el('button','','×');
  x.type='button';
  x.setAttribute('aria-label','Remove '+label);
  x.addEventListener('click',()=>setState({[key]:''}));
  chip.append(x);
  return chip;
}

function renderActive(){
  els.active.replaceChildren();
  if(state.view){
    const v=DATA.views.find(v=>v.id===state.view);
    if(v)els.active.append(activeChip(v.short_title||v.title,'view'));
  }
  for(const [k,label] of [['q','Search: '+state.q],['subject',state.subject],['topic',state.topic],['difficulty',state.difficulty],['exam',state.exam],['type',state.type&&state.type.replaceAll('_',' ')]]){
    if(state[k])els.active.append(activeChip(label,k));
  }
}

function qHeader(q){
  const h=el('header','qb-qhead'),top=el('div','qb-qhead-top'),left=el('div');
  left.append(
    el('div','qb-qtitle',q.exam+' '+q.year+' · '+q.paper+' · Q'+q.question_number),
    el('div','qb-qsource',q.question_type.replaceAll('_',' ')+' · '+q.expected_time_seconds+' s target · '+q.topic)
  );
  const diff=el('span','qb-diff',q.difficulty.band+' · '+q.difficulty.score+'/10');
  diff.dataset.band=q.difficulty.band;
  top.append(left,diff);
  h.append(top);
  const badges=el('div','qb-badges');
  badges.append(el('span','qb-badge',q.primary_capability_ref));
  (q.secondary_capability_refs||[]).forEach(x=>badges.append(el('span','qb-badge',x)));
  if(q.common_wrong_route)badges.append(el('span','qb-badge trap','TRAP: '+q.common_wrong_route));
  h.append(badges);
  return h;
}

function openStudyModal(qid){
  if(!els.studyDialog||!els.dialogBody)return;
  const q=ALL_QUESTIONS.find(x=>x.id===qid);
  if(!q)return;
  if(els.dialogTitle)els.dialogTitle.textContent=q.exam+' '+q.year+' · Q'+q.question_number+' · '+q.difficulty.band+' Study Mode';
  els.dialogBody.replaceChildren();
  const card=studyCard(q,{inModal:true});
  els.dialogBody.append(card);
  renderDeclaredMath(els.dialogBody,q);
  try{els.studyDialog.showModal();}catch(_e){els.studyDialog.setAttribute('open','');}
}

function closeStudyModal(){
  if(!els.studyDialog)return;
  try{els.studyDialog.close();}catch(_e){els.studyDialog.removeAttribute('open');}
  if(location.hash&&location.hash.startsWith('#PYQ-')){
    history.replaceState(null,'',location.pathname+(location.search||''));
  }
}

if(els.dialogClose)els.dialogClose.addEventListener('click',closeStudyModal);
if(els.studyDialog){
  els.studyDialog.addEventListener('click',e=>{if(e.target===els.studyDialog)closeStudyModal();});
  els.studyDialog.addEventListener('cancel',()=>closeStudyModal());
}

function compactCard(q){
  const a=el('article','qb-question');
  a.id=q.id;
  a.dataset.qbSubject=q.subject;
  a.append(qHeader(q));
  const b=el('div','qb-compact-body');
  b.append(tagMath(el('div','qb-stem',q.stem),'stem'));
  const actions=el('div','qb-qactions');
  actions.append(el('span','qb-id',q.id));
  const btn=el('button','btn outline','Study question');
  btn.type='button';
  btn.addEventListener('click',()=>openStudyModal(q.id));
  actions.append(btn);
  b.append(actions);
  a.append(b);
  return a;
}

function disclosure(summaryText,bodyText,kind,mathTarget){
  const d=el('details','qb-disclosure '+(kind||'')),s=el('summary');
  s.append(el('span','',summaryText));
  const body=el('div','qb-disclosure-body');
  body.textContent=bodyText;
  if(mathTarget)body.dataset.qbMathTarget=mathTarget;
  d.append(s,body);
  return d;
}

function studyCard(q,opts={}){
  const a=el('article','qb-question');
  a.id=q.id;
  a.dataset.qbSubject=q.subject;
  a.append(qHeader(q));
  const grid=el('div','qb-study-grid'),left=el('section','qb-panel');
  left.append(el('div','qb-eyebrow','Attempt first'),tagMath(el('div','qb-stem',q.stem),'stem'));
  if(q.options&&q.options.length){
    const optsDiv=el('div','qb-options');
    q.options.forEach((o,i)=>{
      const row=el('div','qb-option');
      row.append(el('b','',String.fromCharCode(65+i)),tagMath(el('span','',o.replace(/^\([A-D]\)\s*/,'')),'option:'+i));
      optsDiv.append(row);
    });
    left.append(optsDiv);
  }else{
    const target=el('div','qb-answer-target');
    target.append(el('label','','Your Answer:'));
    const input=el('input','qb-answer-input');
    input.type='text';
    input.placeholder=q.question_type.replaceAll('_',' ');
    input.autocomplete='off';
    const commitBtn=el('button','qb-commit-btn','Commit Answer');
    commitBtn.type='button';
    const feedback=el('span','qb-commit-feedback');
    feedback.hidden=true;
    commitBtn.addEventListener('click',()=>{
      const val=input.value.trim();
      if(!val)return;
      feedback.hidden=false;
      feedback.className='qb-commit-feedback committed';
      feedback.textContent='Committed: '+val+' (Check solution below)';
    });
    target.append(input,commitBtn,feedback);
    left.append(target);
  }
  if(q.conditions&&q.conditions.length){
    const c=tagMath(el('div','qb-conditions'),'conditions');
    c.append(el('b','','Conditions. '),document.createTextNode(q.conditions.join(' ')));
    left.append(c);
  }
  if(q.common_wrong_route){
    const t=tagMath(el('div','qb-trap'),'common_wrong_route');
    t.append(el('b','','Common wrong route. '),document.createTextNode(q.common_wrong_route));
    left.append(t);
  }

  const right=el('section','qb-panel');
  right.append(el('div','qb-eyebrow','Representation & support'));
  if(q.visual_ref){
    const visual=el('div','qb-visual');
    const img=document.createElement('img');
    img.loading='lazy';
    img.src='../'+q.visual_ref;
    img.alt='Question-aligned representation for '+q.id;
    visual.append(img);
    right.append(visual);
  }
  (q.source_hints||[]).forEach((hint,i)=>{
    const d=disclosure('Source hint '+(i+1),typeof hint==='string'?hint:(hint.text||JSON.stringify(hint)),'qb-support','source_hint:'+i);
    d.querySelector('summary').prepend(el('span','qb-prov','SOURCE'));
    right.append(d);
  });
  (q.scaffolds||[]).forEach((s,i)=>{
    const d=disclosure('H'+i+' · '+s.support_kind+' · '+s.reveals,s.text,'qb-support','scaffold:'+i);
    d.querySelector('summary').prepend(el('span','qb-prov','AUTHORED SUPPORT'));
    right.append(d);
  });
  grid.append(left,right);
  a.append(grid);

  const sw=el('div','qb-solution-wrap'),sd=el('details','qb-disclosure qb-solution'),ss=el('summary','','Teacher solution · complete derivation'),sb=el('div','qb-disclosure-body');
  (q.answer.reasoning||[]).forEach((step,i)=>{
    const row=el('div','qb-step');
    row.append(el('span','qb-step-num','STEP '+(i+1)),tagMath(el('span','',step),'answer_reasoning:'+i));
    sb.append(row);
  });
  const ans=el('div','qb-answer');
  ans.append(el('b','','Answer: '),tagMath(el('span','',q.answer.summary),'answer_summary'));
  const check=tagMath(el('div','qb-check'),'answer_check');
  check.append(el('b','','Check: '),document.createTextNode(q.answer.check));
  ans.append(check);
  sb.append(ans);
  sd.append(ss,sb);
  sw.append(sd);
  a.append(sw);

  const foot=el('footer','qb-footer');
  foot.append(el('span','',q.id+' · '+q.source_status+' · '+q.wording_custody));
  const footLinks=el('div');
  footLinks.style.display='inline-flex';
  footLinks.style.gap='10px';
  footLinks.style.alignItems='center';
  if(q.paper_url){
    const link=el('a','','Official source');
    link.href=q.paper_url;
    link.target='_blank';
    link.rel='noopener noreferrer';
    footLinks.append(link);
  }
  if(opts.inModal){
    const closeBtn=el('button','btn outline','Close popup');
    closeBtn.type='button';
    closeBtn.addEventListener('click',closeStudyModal);
    footLinks.append(closeBtn);
  }
  foot.append(footLinks);
  a.append(foot);
  return a;
}

function render(){
  renderDiscover();
  renderSubjectTabs();
  renderTopicStrip();
  renderActive();
  const list=filtered();
  els.resultCount.textContent=list.length+' of '+ALL_QUESTIONS.length+' questions';
  els.results.replaceChildren();
  const shown=list.slice(0,limit);
  
  let currentRenderedTopic=null;
  shown.forEach(q=>{
    if(q.topic!==currentRenderedTopic){
      currentRenderedTopic=q.topic;
      const banner=renderTopicBanner(q.topic,q.subject);
      if(banner)els.results.append(banner);
    }
    els.results.append(state.mode==='study'?studyCard(q):compactCard(q));
  });

  if(!shown.length)els.results.append(el('div','qb-empty','No canonical questions match the current view and filters.'));
  els.loadMore.hidden=list.length<=limit;
  document.getElementById('qbStudyToolbar').hidden=state.mode!=='study';
  if(location.hash&&location.hash.startsWith('#PYQ-')){
    const id=decodeURIComponent(location.hash.slice(1));
    openStudyModal(id);
  }else if(location.hash){
    const id=decodeURIComponent(location.hash.slice(1));
    setTimeout(()=>document.getElementById(id)?.scrollIntoView({block:'start'}),0);
  }
  shown.forEach(q=>renderDeclaredMath(document.getElementById(q.id),q));
}

function bind(select,key){
  select.addEventListener('change',()=>setState({[key]:select.value}));
}

bind(els.subject,'subject');
bind(els.topic,'topic');
bind(els.difficulty,'difficulty');
bind(els.exam,'exam');
bind(els.type,'type');
bind(els.mode,'mode');
bind(els.sort,'sort');

let timer=null;
els.search.addEventListener('input',()=>{
  clearTimeout(timer);
  timer=setTimeout(()=>setState({q:els.search.value},{push:false}),120);
});

els.clear.addEventListener('click',()=>setState({view:'',q:'',subject:'',topic:'',difficulty:'',exam:'',type:'',mode:'browse',sort:'canonical'}));
els.browseAll.addEventListener('click',()=>setState({view:'',q:'',subject:'',topic:'',difficulty:'',exam:'',type:'',mode:'browse'}));
els.loadMore.addEventListener('click',()=>{limit+=20;render();});

function toggle(cls,open){document.querySelectorAll(cls).forEach(d=>d.open=open)}
els.openSupport.addEventListener('click',()=>toggle('.qb-support',true));
els.closeSupport.addEventListener('click',()=>toggle('.qb-support',false));
els.openSolutions.addEventListener('click',()=>toggle('.qb-solution',true));
els.closeSolutions.addEventListener('click',()=>toggle('.qb-solution',false));
els.top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

addEventListener('popstate',()=>{state=stateFromUrl();syncControls();render();});
syncControls();
writeUrl(false);
render();

window.Grade9QuestionBank={stateFromUrl,filtered,renderDeclaredMath,openStudyModal,closeStudyModal};
})();
