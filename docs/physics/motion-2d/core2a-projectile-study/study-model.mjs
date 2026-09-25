export const ORDER = Object.freeze(["Q21", "Q26", "Q23"]);
const PHASES = new Set(["INITIAL", "ATTEMPTING", "COMMITTED", "SUPPORTED", "SOLUTION_OPEN", "CHECKED"]);
const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const round = (value, digits = 2) => Number(value.toFixed(digits));

export class ProjectileStudyError extends Error {
  constructor(code, detail = "") {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "ProjectileStudyError";
    this.code = code;
  }
}

export function requirePublicCondition(condition, code, detail = "") {
  if (!condition) throw new ProjectileStudyError(code, detail);
}

function parseNumber(pattern, text, code) {
  const match = String(text || "").match(pattern);
  requirePublicCondition(match, code, String(text || ""));
  const value = Number(match[1]);
  requirePublicCondition(Number.isFinite(value), code, match[1]);
  return value;
}

export function parseQ21(record) {
  const divisor = parseNumber(/acceleration is g\/([0-9.]+)/i, record?.stem, "Q21_GRAVITY_RATIO_MISSING");
  requirePublicCondition(divisor > 0, "Q21_GRAVITY_RATIO_INVALID");
  const descentTimeRatio = Math.sqrt(divisor);
  const rangeRatio = 0.5 + 0.5 * descentTimeRatio;
  return { divisor, descentTimeRatio, rangeRatio };
}

export function q21State(time, divisor) {
  const gravityDivisor = Number(divisor);
  requirePublicCondition(Number.isFinite(gravityDivisor) && gravityDivisor > 0, "Q21_GRAVITY_RATIO_INVALID");
  const apexTime = 1;
  const descentTime = Math.sqrt(gravityDivisor);
  const endTime = apexTime + descentTime;
  const t = clamp(Number(time) || 0, 0, endTime);
  let x;
  let y;
  let vx = 0.5;
  let vy;
  let accelerationFactor;
  let stage;
  if (t <= apexTime) {
    x = 0.5 * t;
    y = 1 - (1 - t) ** 2;
    vy = 2 * (1 - t);
    accelerationFactor = 1;
    stage = t === apexTime ? "APEX" : "ASCENT";
  } else {
    const tau = t - apexTime;
    x = 0.5 + 0.5 * tau;
    y = Math.max(0, 1 - (tau / descentTime) ** 2);
    vy = -2 * tau / (descentTime ** 2);
    accelerationFactor = 1 / gravityDivisor;
    stage = t >= endTime ? "LANDED" : "DESCENT";
  }
  return { t, x, y, vx, vy, accelerationFactor, stage, apexTime, descentTime, endTime, rangeRatio: 0.5 + 0.5 * descentTime };
}

export function parseQ26(record) {
  const pointText = (record?.conditions || []).find((item) => /coordinates/i.test(item)) || "";
  const match = pointText.match(/\(([0-9.]+)\s*m\s*,\s*([0-9.]+)\s*m\)/i);
  requirePublicCondition(match, "Q26_POINT_MISSING", pointText);
  const point = { x: Number(match[1]), y: Number(match[2]) };
  const optionText = (record?.options || []).join("\n");
  const degreeMatches = [...optionText.matchAll(/theta=([0-9.]+)°/g)].map((match) => Number(match[1]));
  const degrees = [...new Set(degreeMatches)];
  requirePublicCondition(degrees.includes(45), "Q26_45_DEGREE_OPTION_MISSING");
  requirePublicCondition(degrees.includes(30), "Q26_30_DEGREE_OPTION_MISSING");
  const ratio = optionText.match(/tan\^-1\(([0-9.]+)\/([0-9.]+)\)/);
  requirePublicCondition(ratio, "Q26_ATAN_OPTION_MISSING");
  return { point, degrees, atanRatio: { numerator: Number(ratio[1]), denominator: Number(ratio[2]) } };
}

export function solvePointPassage(thetaRadians, g, point) {
  const theta = Number(thetaRadians);
  const visualG = Number(g);
  requirePublicCondition(Number.isFinite(visualG) && visualG > 0, "Q26_VISUAL_G_INVALID");
  requirePublicCondition(point && typeof point === "object", "Q26_POINT_REQUIRED");
  const x = Number(point.x);
  const y = Number(point.y);
  requirePublicCondition(Number.isFinite(x) && Number.isFinite(y), "Q26_POINT_INVALID");
  const tan = Math.tan(theta);
  const cos = Math.cos(theta);
  const clearance = x * tan - y;
  if (!(clearance > 1e-10) || !(cos > 0)) {
    return { valid: false, clearance, theta, point: { x, y }, g: visualG };
  }
  const v2 = visualG * x * x / (2 * cos * cos * clearance);
  const v = Math.sqrt(v2);
  const tAtP = x / (v * cos);
  const vx = v * cos;
  const vy = v * Math.sin(theta) - visualG * tAtP;
  const slope = vy / vx;
  const apexX = v2 * Math.sin(theta) * cos / visualG;
  const apexY = v2 * Math.sin(theta) ** 2 / (2 * visualG);
  return {
    valid: true,
    theta,
    point: { x, y },
    g: visualG,
    v,
    v2,
    tAtP,
    vx,
    vy,
    slope,
    apexX,
    apexY,
    apexRelativeToP: apexX < x - 1e-9 ? "BEFORE" : apexX > x + 1e-9 ? "AFTER" : "AT_P",
  };
}

export function parseQ23(record) {
  const text = String(record?.stem || "");
  return {
    mass: parseNumber(/^A\s+([0-9.]+)\s*kg/i, text, "Q23_MASS_MISSING"),
    speed: parseNumber(/launched at\s+([0-9.]+)\s*m\/s/i, text, "Q23_SPEED_MISSING"),
    angleDegrees: parseNumber(/at\s+([0-9.]+)\s+degrees/i, text, "Q23_ANGLE_MISSING"),
    c: parseNumber(/c=([0-9.]+)\s*kg\/s/i, text, "Q23_DRAG_MISSING"),
    wallTime: parseNumber(/after\s+([0-9.]+)\s*s/i, text, "Q23_TIME_MISSING"),
    eBase: parseNumber(/Taking e=([0-9.]+)/i, text, "Q23_E_MISSING"),
  };
}

export function q23Horizontal(time, params) {
  const { mass, speed, angleDegrees, c, eBase } = params;
  const t = Math.max(0, Number(time) || 0);
  const vx0 = speed * Math.cos(angleDegrees * Math.PI / 180);
  const tau = mass / c;
  const decay = eBase ** (-t / tau);
  const vx = vx0 * decay;
  const x = vx0 * tau * (1 - decay);
  const noDragX = vx0 * t;
  return { t, vx0, tau, decay, vx, x, noDragX };
}

export function createStudyState(owner = "Q21") {
  requirePublicCondition(ORDER.includes(owner), "STUDY_OWNER_UNKNOWN", owner);
  return {
    owner,
    phase: "INITIAL",
    attempted: false,
    attempt: owner === "Q26" ? [] : "",
    supportIndex: 0,
    reasoningIndex: 0,
    solutionOpen: false,
    checked: false,
    q21: { time: 0, playing: false, vectors: false, compare: true },
    q26: { angle: "degree0" },
    q23: { time: 0, playing: false, compare: true, vector: true },
  };
}

export function transitionStudyState(input, event) {
  const state = clone(input);
  requirePublicCondition(state && ORDER.includes(state.owner), "STUDY_STATE_INVALID");
  requirePublicCondition(PHASES.has(state.phase), "STUDY_PHASE_INVALID", String(state.phase));
  requirePublicCondition(event && typeof event.type === "string", "STUDY_EVENT_REQUIRED");
  const setAttempting = () => {
    if (!state.attempted && state.phase === "INITIAL") state.phase = "ATTEMPTING";
  };

  if (event.type === "SET_ATTEMPT") {
    state.attempt = clone(event.value);
    setAttempting();
    return state;
  }
  if (event.type === "COMMIT_ATTEMPT") {
    const genuine = Array.isArray(state.attempt)
      ? state.attempt.length > 0
      : String(state.attempt || "").trim().length > 0;
    requirePublicCondition(genuine, "GENUINE_ATTEMPT_REQUIRED");
    state.attempted = true;
    state.phase = "COMMITTED";
    state.q21.playing = false;
    state.q23.playing = false;
    return state;
  }
  if (event.type === "REQUEST_SUPPORT") {
    const total = Number(event.total || 0);
    const blockedIndex = Number.isInteger(event.blockedIndex) ? event.blockedIndex : -1;
    if (state.supportIndex >= total) return state;
    if (!state.attempted && state.supportIndex === blockedIndex) return state;
    state.supportIndex += 1;
    if (state.attempted && state.phase === "COMMITTED") state.phase = "SUPPORTED";
    return state;
  }
  if (event.type === "SHOW_REASONING") {
    if (!state.attempted) return state;
    const total = Number(event.total || 0);
    state.reasoningIndex = Math.min(total, state.reasoningIndex + 1);
    return state;
  }
  if (event.type === "OPEN_SOLUTION") {
    if (!state.attempted || state.reasoningIndex < Number(event.requiredReasoning || 0)) return state;
    state.solutionOpen = true;
    state.phase = "SOLUTION_OPEN";
    return state;
  }
  if (event.type === "CHECK") {
    if (!state.solutionOpen) return state;
    state.checked = true;
    state.phase = "CHECKED";
    return state;
  }
  if (event.type === "RESET") return createStudyState(state.owner);
  throw new ProjectileStudyError("STUDY_EVENT_UNSUPPORTED", event.type);
}

