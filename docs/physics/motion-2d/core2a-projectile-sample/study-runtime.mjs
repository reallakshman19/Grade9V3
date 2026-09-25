export const STUDY_STATES = Object.freeze({
  INITIAL: "INITIAL",
  ATTEMPTING: "ATTEMPTING",
  COMMITTED: "COMMITTED",
  SUPPORTED: "SUPPORTED",
  SOLUTION_OPEN: "SOLUTION_OPEN",
  CHECKED: "CHECKED",
});

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createStudyState(ownerLabel) {
  return {
    ownerLabel,
    phase: STUDY_STATES.INITIAL,
    attempt: ownerLabel === "Q26" ? [] : "",
    supportIndex: 0,
    reasoningOpen: false,
    cruxOpen: false,
    solutionOpen: false,
    checked: false,
    simulation: ownerLabel === "Q21"
      ? {time: 0, playing: false, compare: true, vectors: true}
      : ownerLabel === "Q26"
        ? {caseKey: "45", atPoint: true}
        : {time: 0, playing: false, compare: true, vectors: true},
  };
}

export function transitionStudyState(current, action) {
  const state = clone(current);
  switch (action.type) {
    case "BEGIN":
      if (state.phase === STUDY_STATES.INITIAL) state.phase = STUDY_STATES.ATTEMPTING;
      break;
    case "SET_ATTEMPT":
      state.attempt = clone(action.value);
      if (state.phase === STUDY_STATES.INITIAL) state.phase = STUDY_STATES.ATTEMPTING;
      break;
    case "COMMIT":
      if (state.ownerLabel === "Q26") {
        if (!Array.isArray(state.attempt) || state.attempt.length < 1) return {state, accepted:false, reason:"SELECT_AT_LEAST_ONE_OPTION"};
      } else if (!String(state.attempt ?? "").trim()) {
        return {state, accepted:false, reason:"ANSWER_REQUIRED"};
      }
      state.phase = STUDY_STATES.COMMITTED;
      break;
    case "SUPPORT":
      if (![STUDY_STATES.COMMITTED, STUDY_STATES.SUPPORTED].includes(state.phase)) {
        return {state, accepted:false, reason:"ATTEMPT_REQUIRED"};
      }
      state.supportIndex = Math.max(state.supportIndex, Number(action.index || 1));
      state.phase = STUDY_STATES.SUPPORTED;
      break;
    case "OPEN_REASONING":
      if (![STUDY_STATES.COMMITTED, STUDY_STATES.SUPPORTED].includes(state.phase)) {
        return {state, accepted:false, reason:"ATTEMPT_REQUIRED"};
      }
      state.reasoningOpen = true;
      break;
    case "OPEN_CRUX":
      if (!state.reasoningOpen) return {state, accepted:false, reason:"REASONING_REQUIRED"};
      state.cruxOpen = true;
      break;
    case "OPEN_SOLUTION":
      if (!state.cruxOpen) return {state, accepted:false, reason:"CRUX_REQUIRED"};
      state.solutionOpen = true;
      state.phase = STUDY_STATES.SOLUTION_OPEN;
      break;
    case "CHECK":
      if (!state.solutionOpen) return {state, accepted:false, reason:"SOLUTION_REQUIRED"};
      state.checked = true;
      state.phase = STUDY_STATES.CHECKED;
      break;
    case "SIM":
      state.simulation = {...state.simulation, ...clone(action.patch || {})};
      break;
    default:
      return {state, accepted:false, reason:"UNKNOWN_ACTION"};
  }
  return {state, accepted:true, reason:"OK"};
}

export function q21RangeRatio(gravityDivisor = 0.81) {
  return 0.5 + 0.5 * Math.sqrt(gravityDivisor);
}

export function q21StateAt(time, gravityDivisor = 0.81) {
  const descentRatio = Math.sqrt(gravityDivisor);
  const end = 1 + descentRatio;
  const t = Math.max(0, Math.min(end, Number(time) || 0));
  if (t <= 1) {
    return {stage:"ASCENT", x:0.5*t, y:2*t-t*t, vx:0.5, vy:2-2*t, ay:-2, end};
  }
  const tau = t - 1;
  return {
    stage:"CHANGED_DESCENT",
    x:0.5+0.5*tau,
    y:Math.max(0, 1-Math.pow(tau/descentRatio,2)),
    vx:0.5,
    vy:-2*tau/(descentRatio*descentRatio),
    ay:-2/(descentRatio*descentRatio),
    end,
  };
}

export function q21OrdinaryStateAt(time) {
  const t = Math.max(0, Math.min(2, Number(time) || 0));
  if (t <= 1) return {x:0.5*t, y:2*t-t*t};
  const tau=t-1;
  return {x:0.5+0.5*tau, y:Math.max(0,1-tau*tau)};
}

export function q26Case(thetaKey, point=[5,1], g=9.8) {
  const [x,y] = point;
  const theta = thetaKey === "45" ? Math.PI/4
    : thetaKey === "30" ? Math.PI/6
      : Math.atan(1/5);
  const tan = Math.tan(theta);
  const cos = Math.cos(theta);
  const gap = x*tan-y;
  if (gap <= 1e-10) {
    return {theta, tan, finite:false, slopeAtP:null, apexBeforeP:null, v:null, vx:null, vy:null, apex:null};
  }
  const v2 = g*x*x/(2*cos*cos*gap);
  const v = Math.sqrt(v2);
  const vx=v*cos;
  const tP=x/vx;
  const vy=v*Math.sin(theta)-g*tP;
  const slopeAtP=vy/vx;
  const tA=v*Math.sin(theta)/g;
  const apex={x:vx*tA,y:(v*Math.sin(theta))*tA-0.5*g*tA*tA};
  return {theta,tan,finite:true,v,v2,vx,vy,tP,slopeAtP,apexBeforeP:slopeAtP<0,apex};
}

export function q26YAtX(x, result, g=9.8) {
  if (!result?.finite) return null;
  return x*Math.tan(result.theta)-g*x*x/(2*result.v2*Math.cos(result.theta)**2);
}

export function q23StateAt(time, params) {
  const t=Math.max(0,Math.min(params.event_time_s,Number(time)||0));
  const angle=params.launch_angle_deg*Math.PI/180;
  const vx0=params.launch_speed_m_s*Math.cos(angle);
  const vy0=params.launch_speed_m_s*Math.sin(angle);
  const tau=params.mass_kg/params.drag_c_kg_s;
  const decay=Math.pow(params.source_e,-t/tau);
  const vx=vx0*decay;
  const x=vx0*tau*(1-decay);
  return {t,vx0,vy0,tau,decay,vx,x,noDragX:vx0*t,finalSpeedTimesTime:vx*t};
}

export function q23DistanceAtEvent(params) {
  return q23StateAt(params.event_time_s, params).x;
}
