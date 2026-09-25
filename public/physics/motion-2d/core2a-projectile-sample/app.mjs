import {
  STUDY_STATES,
  createStudyState,
  transitionStudyState,
  q21RangeRatio,
  q21StateAt,
  q21OrdinaryStateAt,
  q26Case,
  q26YAtX,
  q23StateAt,
} from "./study-runtime.mjs";

const payload = window.GRADE9V3_CORE2A_PROJECTILE_SAMPLE;
if (!payload) throw new Error("Core2A projectile sample data unavailable");

const byOwner = new Map(payload.questions.map((q) => [q.owner_label, q]));
const tabs = [...document.querySelectorAll("[data-question]")];
const ownerLabel = document.getElementById("owner-label");
const provenance = document.getElementById("provenance");
const title = document.getElementById("question-title");
const stem = document.getElementById("question-stem");
const conditions = document.getElementById("conditions");
const attemptArea = document.getElementById("attempt-area");
const visualControls = document.getElementById("visual-controls");
const visualStage = document.getElementById("visual-stage");
const visualStatus = document.getElementById("visual-status");
const visualCaption = document.getElementById("visual-caption");
const supportSlot = document.getElementById("support-slot");
const reasoningSlot = document.getElementById("reasoning-slot");
const progress = document.getElementById("study-progress");
const contractChip = document.getElementById("contract-chip");

let activeOwner = "Q21";
let state = createStudyState(activeOwner);
let animationFrame = 0;
let lastFrameTime = 0;

const progressLabels = ["Question", "Try", "Visualize", "Support", "Reasoning", "Check"];
const phaseRank = {
  INITIAL: 0,
  ATTEMPTING: 1,
  COMMITTED: 2,
  SUPPORTED: 3,
  SOLUTION_OPEN: 4,
  CHECKED: 5,
};

function q() { return byOwner.get(activeOwner); }
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function svgEsc(value) { return esc(value); }
function isCommitted() { return phaseRank[state.phase] >= phaseRank.COMMITTED; }
function dispatch(action) {
  const out = transitionStudyState(state, action);
  state = out.state;
  render();
  return out;
}
function setSim(patch, rerender=true) {
  const out = transitionStudyState(state, {type:"SIM", patch});
  state = out.state;
  if (rerender) renderVisualOnly();
}
function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  lastFrameTime = 0;
  if (state.simulation.playing) state.simulation.playing = false;
}
function syncUrl() {
  const url = new URL(location.href);
  url.searchParams.set("q", activeOwner);
  history.replaceState({q:activeOwner}, "", url);
}
function setActive(owner, focus=false) {
  if (!byOwner.has(owner)) return;
  stopAnimation();
  activeOwner = owner;
  state = createStudyState(owner);
  syncUrl();
  tabs.forEach((tab) => {
    const selected = tab.dataset.question === owner;
    tab.setAttribute("aria-selected", selected ? "true" : "false");
    tab.tabIndex = selected ? 0 : -1;
  });
  render();
  if (focus) document.getElementById("tab-" + owner)?.focus();
}
function formatNumber(value, digits=2) {
  return Number(value).toFixed(digits).replace(/\.00$/, "");
}
function line(x1,y1,x2,y2,cls,marker="") {
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'" '+(marker?'marker-end="url(#'+marker+')"':'')+'/>';
}
function defs() {
  return '<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#8ee3bf"/></marker><marker id="accArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ffad86"/></marker></defs>';
}
function pathFrom(points) {
  return points.map((p,i) => (i?"L":"M")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
}

function render() {
  const row = q();
  ownerLabel.textContent = row.owner_label;
  provenance.textContent = row.provenance_badge + " · " + row.wording_custody.replaceAll("_"," ").toLowerCase();
  title.textContent = row.owner_label + " · " + ({
    Q21:"Gravity changes after the apex",
    Q26:"Trajectory through P = (5 m, 1 m)",
    Q23:"Projectile motion with linear drag",
  }[activeOwner]);
  stem.textContent = row.stem;
  conditions.replaceChildren(...row.conditions.map((text) => {
    const node=document.createElement("span"); node.className="condition"; node.textContent=text; return node;
  }));
  renderAttempt();
  renderVisualOnly();
  renderSupport();
  renderProgress();
}

function renderProgress() {
  const rank=phaseRank[state.phase];
  progress.innerHTML = progressLabels.map((label,index) => {
    const cls=index<rank?"done":index===rank?"active":"";
    return '<li class="'+cls+'">'+label+'</li>';
  }).join("");
}

function renderAttempt() {
  const row=q();
  if (activeOwner === "Q26") {
    const selected=new Set(state.attempt);
    attemptArea.innerHTML =
      '<div class="attempt-box"><label>Try · choose every statement you think is correct</label>'+
      '<div class="choice-list">'+row.options.map((opt,i) => {
        const letter=String.fromCharCode(65+i);
        return '<label class="choice"><input type="checkbox" data-choice="'+letter+'" '+(selected.has(letter)?"checked":"")+'><span>'+esc(opt)+'</span></label>';
      }).join("")+'</div>'+
      '<div class="answer-row"><button class="primary-action" id="commit-answer" type="button" '+(isCommitted()?"disabled":"")+'>Commit answer</button><button class="secondary-action" id="reset-question" type="button">Reset</button></div>'+
      '<p class="attempt-feedback" id="attempt-feedback">'+(isCommitted()?"Attempt committed. The answer is still hidden; use support or open the reasoning when you are ready.":"No choices are marked correct until you commit.")+'</p></div>';
    attemptArea.querySelectorAll("[data-choice]").forEach((box) => box.addEventListener("change", () => {
      const values=[...attemptArea.querySelectorAll("[data-choice]:checked")].map((n)=>n.dataset.choice);
      dispatch({type:"SET_ATTEMPT", value:values});
    }));
  } else {
    const label=activeOwner==="Q21"?"Predict n = d′/d":"Predict the wall distance (m)";
    attemptArea.innerHTML =
      '<div class="attempt-box"><label for="numeric-attempt">'+label+'</label>'+
      '<div class="answer-row"><input id="numeric-attempt" inputmode="decimal" type="number" step="'+(activeOwner==="Q21"?"0.01":"1")+'" value="'+esc(state.attempt)+'" '+(isCommitted()?"disabled":"")+'><button class="primary-action" id="commit-answer" type="button" '+(isCommitted()?"disabled":"")+'>Commit answer</button><button class="secondary-action" id="reset-question" type="button">Reset</button></div>'+
      '<p class="attempt-feedback" id="attempt-feedback">'+(isCommitted()?"Attempt committed. The answer is still hidden; use support or open the reasoning when you are ready.":"Your prediction unlocks support and the complete reasoning route.")+'</p></div>';
    const input=document.getElementById("numeric-attempt");
    input.addEventListener("input",()=>dispatch({type:"SET_ATTEMPT",value:input.value}));
  }
  document.getElementById("commit-answer").addEventListener("click", () => {
    const out=dispatch({type:"COMMIT"});
    if (!out.accepted) {
      const node=document.getElementById("attempt-feedback");
      node.textContent=out.reason==="SELECT_AT_LEAST_ONE_OPTION"?"Choose at least one option before committing.":"Enter a prediction before committing.";
      document.getElementById(activeOwner==="Q26"?"commit-answer":"numeric-attempt")?.focus();
    }
  });
  document.getElementById("reset-question").addEventListener("click",()=>setActive(activeOwner));
}

function renderVisualOnly() {
  if (activeOwner==="Q21") renderQ21();
  else if (activeOwner==="Q26") renderQ26();
  else renderQ23();
}

function renderQ21() {
  const row=q(), sim=state.simulation, divisor=row.visualization.post_apex_gravity_divisor;
  const ratio=Math.sqrt(divisor), end=1+ratio, current=q21StateAt(sim.time,divisor);
  visualControls.innerHTML =
    '<button id="play" type="button">'+(sim.playing?"Pause":"Play")+'</button>'+
    '<button id="apex" type="button">At apex</button><button id="continue" type="button">Continue after apex</button>'+
    '<label class="toggle"><input id="vectors" type="checkbox" '+(sim.vectors?"checked":"")+'> Vectors</label>'+
    '<label class="toggle"><input id="compare" type="checkbox" '+(sim.compare?"checked":"")+'> Compare ordinary g</label>'+
    '<button id="sim-reset" type="button">Reset</button>';
  bindCommonSimulationControls({
    end,
    apex:1,
    continueFrom:Math.max(1.001,sim.time),
    onTick:(dt)=>Math.min(end,sim.time+dt*0.55),
  });

  const W=800,H=360,left=58,ground=304,xScale=680,yScale=225;
  const map=(x,y)=>[left+x*xScale,ground-y*yScale];
  const active=[];
  const steps=90;
  for(let i=0;i<=steps;i++){const t=current.end*i/steps;if(t>sim.time)break;const s=q21StateAt(t,divisor);active.push(map(s.x,s.y));}
  const ghost=[];
  for(let i=0;i<=100;i++){const t=2*i/100,s=q21OrdinaryStateAt(t);ghost.push(map(s.x,s.y));}
  const p=map(current.x,current.y), apex=map(.5,1), dEnd=map(1,0), dpEnd=map(q21RangeRatio(divisor),0);
  let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Two-stage projectile motion. The path to the apex is unchanged. Only the descent has stronger downward acceleration.">'+defs();
  svg+=line(left,ground,760,ground,"svg-axis");
  if(sim.compare) svg+='<path d="'+pathFrom(ghost)+'" class="svg-ghost"/>';
  if(active.length>1) svg+='<path d="'+pathFrom(active)+'" class="svg-path"/>';
  svg+=line(apex[0],54,apex[0],ground,"svg-boundary");
  svg+='<circle cx="'+apex[0]+'" cy="'+apex[1]+'" r="7" class="svg-apex"/><text x="'+(apex[0]+10)+'" y="'+(apex[1]-10)+'" class="svg-label">apex / boundary</text>';
  svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" class="svg-projectile"/>';
  svg+='<text x="'+(left+5)+'" y="'+(ground+27)+'" class="svg-small">launch</text>';
  svg+='<text x="'+(dEnd[0]-15)+'" y="'+(ground+27)+'" class="svg-small">d</text><text x="'+(dpEnd[0]-20)+'" y="'+(ground-10)+'" class="svg-label">d′</text>';
  svg+=line(left,ground+38,dEnd[0],ground+38,"svg-ghost")+line(left,ground+55,dpEnd[0],ground+55,"svg-path");
  if(sim.vectors){
    svg+=line(p[0],p[1],p[0]+78,p[1],"svg-vector","arrow");
    const vy=Math.max(-65,Math.min(65,-current.vy*24));
    svg+=line(p[0],p[1],p[0],p[1]+vy,"svg-vector","arrow");
    svg+=line(p[0]-18,p[1],p[0]-18,p[1]+55,"svg-accel","accArrow");
    svg+='<text x="'+(p[0]+83)+'" y="'+(p[1]+5)+'" class="svg-small">vₓ unchanged</text>';
  }
  svg+='<text x="'+(left+10)+'" y="32" class="svg-label">'+(current.stage==="ASCENT"?"ordinary g during ascent":"changed acceleration only after apex")+'</text>';
  svg+='</svg>';
  visualStage.innerHTML=svg;
  visualStatus.textContent=current.stage==="ASCENT"?"Before the apex: ordinary gravity.":"After the apex: downward acceleration = g/0.81; horizontal velocity is unchanged.";
  visualCaption.textContent="Normalized view: ordinary range d = 1 and apex height = 1. No source speed or launch angle is invented.";
}

function bindCommonSimulationControls(opts) {
  document.getElementById("play")?.addEventListener("click", () => {
    if (state.simulation.playing) { stopAnimation(); renderVisualOnly(); return; }
    state.simulation.playing=true; lastFrameTime=0; renderVisualOnly();
    const loop=(stamp)=>{
      if(!state.simulation.playing) return;
      if(!lastFrameTime) lastFrameTime=stamp;
      const dt=Math.min(.05,(stamp-lastFrameTime)/1000); lastFrameTime=stamp;
      const next=opts.onTick(dt);
      state.simulation.time=next;
      renderVisualOnly();
      if(next>=opts.end){state.simulation.playing=false;animationFrame=0;return;}
      animationFrame=requestAnimationFrame(loop);
    };
    animationFrame=requestAnimationFrame(loop);
  });
  document.getElementById("apex")?.addEventListener("click",()=>{stopAnimation();setSim({time:opts.apex,playing:false});});
  document.getElementById("continue")?.addEventListener("click",()=>{stopAnimation();setSim({time:Math.min(opts.end,opts.continueFrom+.28),playing:false});});
  document.getElementById("vectors")?.addEventListener("change",(e)=>setSim({vectors:e.target.checked}));
  document.getElementById("compare")?.addEventListener("change",(e)=>setSim({compare:e.target.checked}));
  document.getElementById("sim-reset")?.addEventListener("click",()=>{stopAnimation();setSim({time:0,playing:false,compare:true,vectors:true});});
}

function renderQ26() {
  const row=q(), sim=state.simulation, point=row.visualization.point, g=row.visualization.visualization_g_m_s2;
  const result=q26Case(sim.caseKey,point,g);
  visualControls.innerHTML =
    '<button class="angle-btn" data-angle="45" aria-pressed="'+(sim.caseKey==="45")+'">45°</button>'+
    '<button class="angle-btn" data-angle="30" aria-pressed="'+(sim.caseKey==="30")+'">30°</button>'+
    '<button class="angle-btn" data-angle="atan" aria-pressed="'+(sim.caseKey==="atan")+'">tan⁻¹(1/5)</button>'+
    '<button id="at-p" type="button">At P</button><button id="sim-reset" type="button">Reset</button>';
  visualControls.querySelectorAll("[data-angle]").forEach((b)=>b.addEventListener("click",()=>setSim({caseKey:b.dataset.angle,atPoint:true})));
  document.getElementById("at-p").addEventListener("click",()=>setSim({atPoint:true}));
  document.getElementById("sim-reset").addEventListener("click",()=>setSim({caseKey:"45",atPoint:true}));

  const W=800,H=390,left=62,ground=330,xScale=105,yScale=85;
  let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Coordinate-grid projectile trajectory through point P with velocity direction shown at P.">'+defs();
  for(let x=0;x<=6;x++) svg+=line(left+x*xScale,40,left+x*xScale,ground,"svg-grid");
  for(let y=0;y<=3;y++) svg+=line(left,ground-y*yScale,740,ground-y*yScale,"svg-grid");
  svg+=line(left,ground,744,ground,"svg-axis")+line(left,ground,left,38,"svg-axis");
  svg+='<text x="'+(left-20)+'" y="'+(ground+25)+'" class="svg-label">O</text>';
  const p=[left+point[0]*xScale,ground-point[1]*yScale];
  svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="8" class="svg-point"/><text x="'+(p[0]+10)+'" y="'+(p[1]-8)+'" class="svg-label">P (5, 1)</text>';
  if(result.finite){
    const xs=[]; const xmax=Math.min(6.35, Math.max(5.4,(2*result.v2*Math.sin(result.theta)*Math.cos(result.theta)/g)));
    for(let i=0;i<=100;i++){const x=xmax*i/100,y=q26YAtX(x,result,g);if(y>=-.05)xs.push([left+x*xScale,ground-y*yScale]);}
    svg+='<path d="'+pathFrom(xs)+'" class="svg-path"/>';
    const ap=[left+result.apex.x*xScale,ground-result.apex.y*yScale];
    svg+='<circle cx="'+ap[0]+'" cy="'+ap[1]+'" r="7" class="svg-apex"/><text x="'+(ap[0]+9)+'" y="'+(ap[1]-8)+'" class="svg-small">apex</text>';
    const tangentScale=42;
    svg+=line(p[0]-tangentScale,p[1]+result.slopeAtP*tangentScale,p[0]+tangentScale,p[1]-result.slopeAtP*tangentScale,"svg-ghost");
    svg+=line(p[0],p[1],p[0]+72,p[1],"svg-vector","arrow");
    svg+=line(p[0],p[1],p[0],p[1]-Math.max(-65,Math.min(65,result.vy*7)),"svg-vector","arrow");
    svg+='<text x="'+(p[0]+76)+'" y="'+(p[1]+4)+'" class="svg-small">vₓ</text><text x="'+(p[0]+8)+'" y="'+(p[1]-Math.max(-65,Math.min(65,result.vy*7)))+'" class="svg-small">vᵧ</text>';
    if(isCommitted() && sim.caseKey==="45"){
      svg+='<text x="90" y="38" class="svg-label">45° case: v = 5√g / 2 · slope at P &lt; 0</text>';
    }
  } else {
    const theta=result.theta;
    const x2=5.8,y2=x2*Math.tan(theta);
    svg+=line(left,ground,left+x2*xScale,ground-y2*yScale,"svg-ghost");
    svg+='<text x="95" y="45" class="svg-warn">No finite launch speed can keep the gravity term at zero.</text>';
  }
  svg+='</svg>';
  visualStage.innerHTML=svg;
  const angleLabel=sim.caseKey==="45"?"45°":sim.caseKey==="30"?"30°":"tan⁻¹(1/5)";
  visualStatus.textContent=result.finite
    ? angleLabel+": a finite speed can pass through P. Inspect the direction at P as well as the point."
    : angleLabel+": the straight launch line already reaches y = 1 at x = 5, so gravity would put the projectile below P for every finite speed.";
  visualCaption.textContent="Visualization value only: g = "+g+" m/s². The symbolic trajectory equation remains authoritative.";
}

function renderQ23() {
  const row=q(), sim=state.simulation, params=row.visualization, s=q23StateAt(sim.time,params);
  visualControls.innerHTML =
    '<button id="play" type="button">'+(sim.playing?"Pause":"Play")+'</button>'+
    '<button id="time-minus" type="button" aria-label="Move time backward">−0.25 s</button>'+
    '<input id="time-scrub" aria-label="Elapsed time" type="range" min="0" max="'+params.event_time_s+'" step="0.05" value="'+s.t+'">'+
    '<button id="time-plus" type="button" aria-label="Move time forward">+0.25 s</button>'+
    '<label class="toggle"><input id="compare" type="checkbox" '+(sim.compare?"checked":"")+'> No-drag comparison</label>'+
    '<label class="toggle"><input id="vectors" type="checkbox" '+(sim.vectors?"checked":"")+'> Velocity vector</label>'+
    '<button id="sim-reset" type="button">Reset</button>';
  bindQ23Controls(params);

  const W=800,H=410,left=68,right=748,trackY=118,plotTop=215,plotBottom=360;
  const xMax=s.vx0*params.event_time_s;
  const xMap=(x)=>left+(right-left)*(x/xMax);
  const wallX=xMap(q23StateAt(params.event_time_s,params).x);
  let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Horizontal component under linear drag, with exponentially decreasing horizontal velocity and accumulated position from integration.">'+defs();
  svg+=line(left,trackY,right,trackY,"svg-axis");
  svg+=line(wallX,62,wallX,165,"svg-boundary")+'<text x="'+(wallX-35)+'" y="51" class="svg-label">wall · t = 2 s</text>';
  svg+='<circle cx="'+xMap(s.x)+'" cy="'+trackY+'" r="10" class="svg-projectile"/>';
  if(sim.compare) svg+='<circle cx="'+xMap(s.noDragX)+'" cy="'+(trackY+38)+'" r="7" fill="#8397ad"/><text x="'+left+'" y="'+(trackY+62)+'" class="svg-small">hypothetical no drag → 270 m at 2 s</text>';
  if(sim.vectors) svg+=line(xMap(s.x),trackY,xMap(s.x)+Math.max(18,85*s.vx/s.vx0),trackY,"svg-vector","arrow");
  svg+='<text x="'+left+'" y="28" class="svg-label">launch decomposition: vₓ₀ = 135 m/s · vᵧ₀ = 270 sin60°</text>';
  svg+='<text x="'+left+'" y="52" class="svg-small">horizontal-component view only — no fake vacuum parabola is drawn</text>';
  svg+=line(left,plotBottom,right,plotBottom,"svg-axis")+line(left,plotBottom,left,plotTop,"svg-axis");
  const pts=[];
  for(let i=0;i<=80;i++){const t=params.event_time_s*i/80,st=q23StateAt(t,params);pts.push([left+(right-left)*(t/params.event_time_s),plotBottom-(plotBottom-plotTop)*(st.vx/st.vx0)]);}
  svg+='<path d="'+pathFrom(pts)+'" class="svg-path"/>';
  const px=left+(right-left)*(s.t/params.event_time_s), py=plotBottom-(plotBottom-plotTop)*(s.vx/s.vx0);
  svg+='<circle cx="'+px+'" cy="'+py+'" r="6" class="svg-point"/><text x="'+(left+8)+'" y="'+(plotTop+8)+'" class="svg-small">vₓ(t)</text><text x="'+(right-35)+'" y="'+(plotBottom+25)+'" class="svg-small">2 s</text>';
  svg+='</svg>';
  visualStage.innerHTML=svg;
  visualStatus.textContent="elapsed "+s.t.toFixed(2)+" s · vₓ is shrinking exponentially while horizontal position keeps accumulating.";
  visualCaption.textContent=isCommitted()
    ? "Source convention e = 2.7 is used in the displayed exponential model. Distance is the accumulated area under vₓ(t), not final vₓ × time."
    : "The wall position is intentionally unlabeled until you commit a prediction. Compare the growing displacement with the shrinking vₓ.";
}

function bindQ23Controls(params){
  const end=params.event_time_s;
  document.getElementById("play").addEventListener("click",()=>{
    if(state.simulation.playing){stopAnimation();renderVisualOnly();return;}
    state.simulation.playing=true;lastFrameTime=0;renderVisualOnly();
    const loop=(stamp)=>{
      if(!state.simulation.playing)return;
      if(!lastFrameTime)lastFrameTime=stamp;
      const dt=Math.min(.05,(stamp-lastFrameTime)/1000);lastFrameTime=stamp;
      state.simulation.time=Math.min(end,state.simulation.time+dt*.8);
      renderVisualOnly();
      if(state.simulation.time>=end){state.simulation.playing=false;animationFrame=0;return;}
      animationFrame=requestAnimationFrame(loop);
    };
    animationFrame=requestAnimationFrame(loop);
  });
  document.getElementById("time-minus").addEventListener("click",()=>{stopAnimation();setSim({time:Math.max(0,state.simulation.time-.25),playing:false});});
  document.getElementById("time-plus").addEventListener("click",()=>{stopAnimation();setSim({time:Math.min(end,state.simulation.time+.25),playing:false});});
  document.getElementById("time-scrub").addEventListener("input",(e)=>{stopAnimation();setSim({time:Number(e.target.value),playing:false});});
  document.getElementById("compare").addEventListener("change",(e)=>setSim({compare:e.target.checked}));
  document.getElementById("vectors").addEventListener("change",(e)=>setSim({vectors:e.target.checked}));
  document.getElementById("sim-reset").addEventListener("click",()=>{stopAnimation();setSim({time:0,playing:false,compare:true,vectors:true});});
}

function renderSupport(){
  const row=q();
  if(!isCommitted()){
    supportSlot.innerHTML='<h3>Need a hint?</h3><p>Commit a genuine attempt first. Support is learner-controlled and comes from the repository\'s authored scaffold records.</p>';
    reasoningSlot.innerHTML='<h3>Reasoning</h3><p>The reasoning route, crux, answer, and check are not mounted before commitment.</p>';
    return;
  }

  let hints='';
  if(state.supportIndex>0){
    hints='<div class="hint-stack">'+row.scaffolds.slice(0,state.supportIndex).map((h,i)=>'<div class="hint"><strong>Scaffold '+(i+1)+'</strong><br>'+esc(h.text)+'</div>').join("")+'</div>';
  }
  supportSlot.innerHTML='<h3>Need a hint?</h3><p>Reveal one repository-authored scaffold at a time.</p>'+hints+
    '<div class="support-actions"><button id="hint-next" class="secondary-action" type="button" '+(state.supportIndex>=row.scaffolds.length?"disabled":"")+'>'+(state.supportIndex?"Next hint":"Show a hint")+'</button></div>';
  document.getElementById("hint-next")?.addEventListener("click",()=>dispatch({type:"SUPPORT",index:state.supportIndex+1}));

  let html='<h3>Why?</h3>';
  if(!state.reasoningOpen){
    html+='<p>Your attempt is locked in. Open the structured route when you want to connect the visual state to the algebra.</p><div class="support-actions"><button id="open-reasoning" class="primary-action" type="button">Open reasoning</button></div>';
  } else {
    html+='<div class="reasoning-list">'+row.answer.reasoning_route.map((move)=>'<div class="reasoning-step"><strong>'+esc(move.kind)+'</strong><br>'+esc(move.action)+'</div>').join("")+'</div>';
    if(!state.cruxOpen) html+='<div class="support-actions"><button id="open-crux" class="secondary-action" type="button">Show crux</button></div>';
    else {
      html+='<div class="crux-box"><strong>Crux</strong><br>'+esc(row.analysis.stable_crux_move)+'</div>';
      if(!state.solutionOpen) html+='<div class="support-actions"><button id="open-solution" class="primary-action" type="button">Complete solution</button></div>';
    }
  }
  if(state.solutionOpen){
    html+='<div class="reasoning-step"><strong>Repository answer</strong><br>'+esc(row.answer.summary)+'</div>';
    if(activeOwner==="Q23"){
      html+='<div class="reasoning-list"><div class="reasoning-step">1. vₓ₀ = 270 cos60° = 135 m/s</div><div class="reasoning-step">2. m/c = 2 s</div><div class="reasoning-step">3. vₓ(t) = vₓ₀ exp[−(c/m)t]</div><div class="reasoning-step">4. x(t) = vₓ₀(m/c)[1 − exp(−ct/m)]</div><div class="reasoning-step">5. Evaluate at t = 2 s with source e = 2.7</div><div class="reasoning-step">6. x = 170 m</div></div>';
    }
    if(!state.checked) html+='<div class="support-actions"><button id="independent-check" class="primary-action" type="button">Check</button></div>';
  }
  if(state.checked){
    html+='<div class="check-box"><strong>Independent check</strong><br>'+esc(row.answer.check)+'</div>';
    html+='<div class="repair-box"><strong>Repair if needed</strong><br>Avoid this route: '+esc(row.analysis.common_wrong_route)+'</div>';
  }
  reasoningSlot.innerHTML=html;
  document.getElementById("open-reasoning")?.addEventListener("click",()=>dispatch({type:"OPEN_REASONING"}));
  document.getElementById("open-crux")?.addEventListener("click",()=>dispatch({type:"OPEN_CRUX"}));
  document.getElementById("open-solution")?.addEventListener("click",()=>dispatch({type:"OPEN_SOLUTION"}));
  document.getElementById("independent-check")?.addEventListener("click",()=>dispatch({type:"CHECK"}));
}

tabs.forEach((tab)=>{
  tab.addEventListener("click",()=>setActive(tab.dataset.question));
  tab.addEventListener("keydown",(event)=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const index=tabs.indexOf(tab);
    const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:event.key==="ArrowRight"?(index+1)%tabs.length:(index-1+tabs.length)%tabs.length;
    setActive(tabs[next].dataset.question,true);
  });
});
document.getElementById("back").addEventListener("click",()=>history.length>1?history.back():location.assign("../../../physics/motion-2d/index.html"));
document.getElementById("refresh").addEventListener("click",()=>setActive(activeOwner));
document.getElementById("site-search").addEventListener("submit",(event)=>{event.preventDefault();const term=document.getElementById("site-search-input").value.trim();if(term&&typeof window.find==="function")window.find(term);});
let scale=1;
const applyScale=()=>document.documentElement.style.fontSize=(16*scale)+"px";
document.getElementById("display-down").addEventListener("click",()=>{scale=Math.max(.8,scale-.1);applyScale();});
document.getElementById("display-up").addEventListener("click",()=>{scale=Math.min(1.5,scale+.1);applyScale();});

contractChip.textContent=payload.blueprint.ref+" · "+payload.blueprint.layout_family;
const requested=new URL(location.href).searchParams.get("q");
if(requested&&byOwner.has(requested)) activeOwner=requested;
setActive(activeOwner);
window.__core2aProjectileSampleReady=true;
window.__core2aProjectileSampleState=()=>JSON.parse(JSON.stringify(state));
