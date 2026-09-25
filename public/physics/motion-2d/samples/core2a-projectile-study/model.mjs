export const SAMPLE_BLUEPRINT_REF = "BP-CORE2A-SUPPORTED-APPLICATION@1.0.0";
export const SAMPLE_SHELL_REF = "G9-TABLET-SHELL-V1";
export const SAMPLE_LAYOUT_FAMILY = "QUESTION_STUDY";

export const QUESTION_REFS = Object.freeze({
  Q21: "PYQ-PHY-JEEADV-2022-P1-Q08",
  Q26: "PYQ-PHY-JEEADV-2026-P1-Q06",
  Q23: "PYQ-PHY-JEEADV-2025-P2-Q15",
});

export const STUDY_STATES = Object.freeze([
  "INITIAL",
  "ATTEMPTING",
  "COMMITTED",
  "SUPPORTED",
  "SOLUTION_OPEN",
  "CHECKED",
]);

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export function q21RangeRatio() {
  return 0.5 + 0.5 * Math.sqrt(0.81);
}

export function q21Snapshot(time) {
  const t = clamp(Number(time) || 0, 0, 1.9);
  if (t <= 1) {
    return {
      time: t,
      phase: t === 1 ? "APEX" : "ASCENT",
      xRatio: 0.5 * t,
      yRatio: 2 * t - t * t,
      vxRatio: 0.5,
      vyRatio: 2 - 2 * t,
      accelerationRatio: 1,
      changedGravityActive: false,
    };
  }
  const s = t - 1;
  return {
    time: t,
    phase: "CHANGED_DESCENT",
    xRatio: 0.5 + 0.5 * s,
    yRatio: Math.max(0, 1 - (s * s) / 0.81),
    vxRatio: 0.5,
    vyRatio: -(2 * s) / 0.81,
    accelerationRatio: 1 / 0.81,
    changedGravityActive: true,
  };
}

export function q21OrdinarySnapshot(time) {
  const t = clamp(Number(time) || 0, 0, 2);
  return {
    time: t,
    xRatio: 0.5 * t,
    yRatio: Math.max(0, 2 * t - t * t),
    vxRatio: 0.5,
    vyRatio: 2 - 2 * t,
    accelerationRatio: 1,
  };
}

const Q26_POINT = Object.freeze({ x: 5, y: 1 });
const ANGLES = Object.freeze({
  "45": Math.PI / 4,
  "30": Math.PI / 6,
  "atan1over5": Math.atan(1 / 5),
});

export function q26Case(angleKey, g = 9.8) {
  const theta = ANGLES[angleKey];
  if (theta == null) throw new Error("Q26_ANGLE_UNSUPPORTED");
  const { x, y } = Q26_POINT;
  const tangent = Math.tan(theta);
  const cosine = Math.cos(theta);
  const heightMargin = x * tangent - y;
  const denominator = 2 * cosine * cosine * heightMargin;
  if (denominator <= 1e-12) {
    return {
      angleKey,
      theta,
      point: { ...Q26_POINT },
      finiteSpeed: false,
      reason: "NO_FINITE_SPEED",
      heightMargin,
    };
  }
  const v2 = (g * x * x) / denominator;
  const v = Math.sqrt(v2);
  const vx = v * cosine;
  const slopeAtP = tangent - (g * x) / (v2 * cosine * cosine);
  const vyAtP = slopeAtP * vx;
  const tAtP = x / vx;
  const apexTime = (v * Math.sin(theta)) / g;
  const apexX = vx * apexTime;
  const apexY = (v * v * Math.sin(theta) * Math.sin(theta)) / (2 * g);
  return {
    angleKey,
    theta,
    point: { ...Q26_POINT },
    finiteSpeed: true,
    g,
    v,
    v2,
    vx,
    vyAtP,
    slopeAtP,
    tAtP,
    apexTime,
    apexX,
    apexY,
    apexRelation: slopeAtP < -1e-9 ? "BEFORE_P" : slopeAtP > 1e-9 ? "AFTER_P" : "AT_P",
    symbolicSpeed: angleKey === "45" ? "5√g / 2" : null,
  };
}

export function q26TrajectoryY(x, model) {
  if (!model?.finiteSpeed) return null;
  const cosine = Math.cos(model.theta);
  return x * Math.tan(model.theta)
    - (model.g * x * x) / (2 * model.v2 * cosine * cosine);
}

const Q23 = Object.freeze({
  mass: 0.2,
  c: 0.1,
  launchSpeed: 270,
  theta: Math.PI / 3,
  vx0: 135,
  tau: 2,
  eventTime: 2,
  sourceE: 2.7,
});

export function q23Constants() {
  return { ...Q23 };
}

export function q23Horizontal(time, { sourceApproxAtEvent = false } = {}) {
  const t = clamp(Number(time) || 0, 0, Q23.eventTime);
  const exponent = -t / Q23.tau;
  const expTerm = sourceApproxAtEvent && Math.abs(t - Q23.eventTime) < 1e-12
    ? 1 / Q23.sourceE
    : Math.exp(exponent);
  const vx = Q23.vx0 * expTerm;
  const x = Q23.vx0 * Q23.tau * (1 - expTerm);
  return {
    time: t,
    expTerm,
    vx,
    x,
    noDragX: Q23.vx0 * t,
    tau: Q23.tau,
  };
}

export function q23FullState(time, g = 9.8) {
  const horizontal = q23Horizontal(time);
  const t = horizontal.time;
  const expTerm = horizontal.expTerm;
  const vy0 = Q23.launchSpeed * Math.sin(Q23.theta);
  const vy = (vy0 + g * Q23.tau) * expTerm - g * Q23.tau;
  const y = (vy0 + g * Q23.tau) * Q23.tau * (1 - expTerm) - g * Q23.tau * t;
  return { ...horizontal, vy0, vy, y, g };
}

export function q23SourceDistance() {
  return q23Horizontal(Q23.eventTime, { sourceApproxAtEvent: true }).x;
}

export function createStudyState(owner = "Q21") {
  if (!QUESTION_REFS[owner]) throw new Error("STUDY_OWNER_UNKNOWN");
  return {
    owner,
    phase: "INITIAL",
    attempted: false,
    response: null,
    supportIndex: 0,
    reasoningOpen: false,
    solutionOpen: false,
    checked: false,
  };
}

export function markAttempting(state) {
  if (state.attempted) return { ...state };
  return { ...state, phase: "ATTEMPTING" };
}

function genuineResponse(response) {
  if (Array.isArray(response)) return response.length > 0;
  return String(response ?? "").trim().length > 0;
}

export function commitAttempt(state, response) {
  if (!genuineResponse(response)) throw new Error("GENUINE_ATTEMPT_REQUIRED");
  return {
    ...state,
    phase: "COMMITTED",
    attempted: true,
    response: Array.isArray(response) ? [...response] : String(response).trim(),
    supportIndex: 0,
    reasoningOpen: false,
    solutionOpen: false,
    checked: false,
  };
}

export function revealSupport(state, availableCount) {
  if (!state.attempted) throw new Error("ATTEMPT_REQUIRED_FOR_SUPPORT");
  const next = Math.min(availableCount, state.supportIndex + 1);
  return { ...state, phase: "SUPPORTED", supportIndex: next };
}

export function openReasoning(state) {
  if (!state.attempted) throw new Error("ATTEMPT_REQUIRED_FOR_REASONING");
  return { ...state, phase: "SUPPORTED", reasoningOpen: true };
}

export function openSolution(state) {
  if (!state.attempted) throw new Error("ATTEMPT_REQUIRED_FOR_SOLUTION");
  return { ...state, phase: "SOLUTION_OPEN", solutionOpen: true, reasoningOpen: true };
}

export function markChecked(state) {
  if (!state.solutionOpen) throw new Error("SOLUTION_REQUIRED_FOR_CHECK");
  return { ...state, phase: "CHECKED", checked: true };
}

export function answerMatches(owner, response) {
  if (owner === "Q21") {
    const value = Number(response);
    return Number.isFinite(value) && Math.abs(value - 0.95) <= 0.005;
  }
  if (owner === "Q26") {
    const selected = Array.isArray(response) ? [...response].sort().join("") : "";
    return selected === "AB";
  }
  if (owner === "Q23") {
    const value = Number(response);
    return Number.isFinite(value) && value >= 167 && value <= 171;
  }
  return false;
}
