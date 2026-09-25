import { parseQ21, q21State, parseQ26, solvePointPassage, parseQ23, q23Horizontal, clamp, round } from "./study-model.mjs";

function svgPath(points, scaleX, scaleY) {
  return points.map((point, index) => `${index ? "L" : "M"}${round(scaleX(point.x), 1)},${round(scaleY(point.y), 1)}`).join(" ");
}
function sampled(count, fn) { return Array.from({ length: count + 1 }, (_, index) => fn(index / count)); }

export function renderQ21Stage(host, record) {
const p = parseQ21(record);
const current = q21State(host.state.q21.time, p.divisor);
const xScale = (x) => 62 + 610 * x / 1.05;
const yScale = (y) => 326 - 230 * y;
const ordinary = sampled(80, (u) => u <= 0.5 ? { x: u, y: 1 - (1 - 2 * u) ** 2 } : { x: u, y: 1 - (2 * u - 1) ** 2 });
const modified = sampled(80, (u) => {
  const t = current.endTime * u;
  return q21State(t, p.divisor);
});
const currentPath = sampled(60, (u) => q21State(current.t * u, p.divisor));
const px = xScale(current.x), py = yScale(current.y);
const vectorHtml = host.state.q21.vectors ? `<g class="vectors"><line x1="${px}" y1="${py}" x2="${px + 55}" y2="${py}" marker-end="url(#arrow)"/><text x="${px + 18}" y="${py - 8}">vₓ unchanged</text><line class="vy" x1="${px}" y1="${py}" x2="${px}" y2="${py - clamp(current.vy * 22, -75, 75)}" marker-end="url(#arrow)"/><line class="accel" x1="${px + 12}" y1="${py + 8}" x2="${px + 12}" y2="${py + 58}" marker-end="url(#arrow)"/><text x="${px + 20}" y="${py + 48}">${current.stage === "DESCENT" || current.stage === "LANDED" ? `g/${p.divisor}` : "g"}</text></g>` : "";
return `<section class="stage" aria-labelledby="visual-title"><div class="stage-head"><div><div class="section-kicker">Visualize</div><h3 id="visual-title">Same ascent. New descent.</h3></div><div class="stage-status"><b>${current.stage === "APEX" ? "At apex" : current.stage === "DESCENT" ? "After apex" : current.stage === "LANDED" ? "Landed" : "Before apex"}</b><span>${current.stage === "DESCENT" || current.stage === "LANDED" ? "Acceleration changed only now" : "Downward acceleration = g"}</span></div></div>
  <svg class="scene" viewBox="0 0 740 390" role="img" aria-label="Two-stage projectile motion with the acceleration changing only after the apex">
    <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z"/></marker></defs>
    <line class="ground" x1="42" y1="326" x2="704" y2="326"/><line class="boundary" x1="${xScale(.5)}" y1="72" x2="${xScale(.5)}" y2="326"/><text class="boundary-label" x="${xScale(.5)+8}" y="88">apex boundary</text>
    ${host.state.q21.compare ? `<path class="ghost" d="${svgPath(ordinary, xScale, yScale)}"/><text x="${xScale(.82)}" y="${yScale(.55)}" class="ghost-label">ordinary g</text>` : ""}
    <path class="active-full" d="${svgPath(modified, xScale, yScale)}"/><path class="active-progress" d="${svgPath(currentPath, xScale, yScale)}"/>
    <circle class="apex" cx="${xScale(.5)}" cy="${yScale(1)}" r="7"/><text x="${xScale(.5)-38}" y="${yScale(1)-14}">apex</text><circle class="projectile" cx="${px}" cy="${py}" r="9"/>
    ${vectorHtml}
    <line class="measure" x1="${xScale(0)}" y1="352" x2="${xScale(1)}" y2="352"/><text x="${xScale(.49)}" y="378">ordinary range d</text>
    <line class="measure modified" x1="${xScale(0)}" y1="338" x2="${xScale(current.rangeRatio)}" y2="338"/><text x="${xScale(.44)}" y="332">modified range d′</text>
  </svg>
  <div class="controls" aria-label="Q21 simulation controls"><button type="button" data-action="play">${host.state.q21.playing ? "Pause" : "Play"}</button><button type="button" data-action="apex">At apex</button><button type="button" data-action="continue">Continue after apex</button><button type="button" data-action="vectors" aria-pressed="${host.state.q21.vectors}">${host.state.q21.vectors ? "Hide" : "Show"} vectors</button><button type="button" data-action="compare" aria-pressed="${host.state.q21.compare}">${host.state.q21.compare ? "Hide" : "Compare"} ordinary path</button><button type="button" data-action="reset">Reset</button></div>
  <p class="visual-note">Normalized display: ordinary range is d and apex height is scaled to 1. No source launch speed or angle is invented.</p></section>`;
}

export function renderQ26Stage(host, record) {
const p = parseQ26(record);
const visualG = 10;
const selectedDegrees = host.state.q26.angle === "degree0" ? p.degrees[0] : host.state.q26.angle === "degree1" ? p.degrees[1] : null;
const angle = selectedDegrees == null ? Math.atan(p.atanRatio.numerator / p.atanRatio.denominator) : selectedDegrees * Math.PI / 180;
const result = solvePointPassage(angle, visualG, p.point);
const xMax = 8;
const yMax = result.valid ? Math.max(3.2, result.apexY * 1.35) : 3.2;
const sx = (x) => 60 + 610 * x / xMax;
const sy = (y) => 330 - 245 * y / yMax;
let path = "";
if (result.valid) {
  const points = sampled(90, (u) => {
    const x = xMax * u;
    const y = Math.max(0, x * Math.tan(angle) - visualG * x * x / (2 * result.v2 * Math.cos(angle) ** 2));
    return { x, y };
  }).filter((point) => point.y >= 0);
  path = svgPath(points, sx, sy);
}
const px = sx(p.point.x), py = sy(p.point.y);
const angleLabel = host.state.q26.angle === "atan" ? `tan⁻¹(${p.atanRatio.numerator}/${p.atanRatio.denominator})` : `${selectedDegrees}°`;
const vScale = result.valid ? 24 / Math.max(1, Math.hypot(result.vx, result.vy)) : 0;
return `<section class="stage" aria-labelledby="visual-title"><div class="stage-head"><div><div class="section-kicker">Visualize</div><h3 id="visual-title">Pass through P — then inspect direction</h3></div><div class="stage-status"><b>θ = ${angleLabel}</b><span>${result.valid ? "A finite launch speed can pass through P" : "No finite launch speed reaches P at this angle"}</span></div></div>
  <div class="angle-picker" role="group" aria-label="Investigate launch angle"><button type="button" data-action="angle" data-angle="degree0" aria-pressed="${host.state.q26.angle === "degree0"}">${p.degrees[0]}°</button><button type="button" data-action="angle" data-angle="degree1" aria-pressed="${host.state.q26.angle === "degree1"}">${p.degrees[1]}°</button><button type="button" data-action="angle" data-angle="atan" aria-pressed="${host.state.q26.angle === "atan"}">tan⁻¹(${p.atanRatio.numerator}/${p.atanRatio.denominator})</button></div>
  <svg class="scene q26" viewBox="0 0 740 390" role="img" aria-label="Coordinate grid projectile trajectory through the canonical point P with apex and velocity components at P">
    ${Array.from({length:9},(_,i)=>`<line class="grid" x1="${sx(i)}" y1="70" x2="${sx(i)}" y2="330"/>`).join("")}${Array.from({length:4},(_,i)=>`<line class="grid" x1="60" y1="${sy(i)}" x2="690" y2="${sy(i)}"/>`).join("")}
    <line class="axis" x1="60" y1="330" x2="700" y2="330"/><line class="axis" x1="60" y1="340" x2="60" y2="55"/><text x="43" y="352">O</text><text x="694" y="352">x</text><text x="40" y="60">y</text>
    ${result.valid ? `<path class="active-full" d="${path}"/><circle class="apex" cx="${sx(result.apexX)}" cy="${sy(result.apexY)}" r="7"/><text x="${sx(result.apexX)+10}" y="${sy(result.apexY)-8}">apex</text>` : `<line class="launch-line" x1="${sx(0)}" y1="${sy(0)}" x2="${sx(p.point.x)}" y2="${sy(p.point.y)}"/><text x="${sx(2.1)}" y="${sy(.55)-12}">gravity bends below this line</text>`}
    <circle class="point-p" cx="${px}" cy="${py}" r="9"/><text x="${px+12}" y="${py-12}">P (${p.point.x},${p.point.y})</text>
    ${result.valid ? `<line class="velocity" x1="${px}" y1="${py}" x2="${px + result.vx * vScale * 5}" y2="${py - result.vy * vScale * 5}"/><line class="component" x1="${px}" y1="${py}" x2="${px + result.vx * vScale * 5}" y2="${py}"/><line class="component vertical" x1="${px + result.vx * vScale * 5}" y1="${py}" x2="${px + result.vx * vScale * 5}" y2="${py - result.vy * vScale * 5}"/><text x="${px+36}" y="${py+22}">vₓ</text><text x="${px + result.vx*vScale*5 + 8}" y="${py - result.vy*vScale*2.5}">vᵧ</text>` : ""}
  </svg>
  <div class="equation-strip"><span>Trajectory model</span><code>y = x tanθ − gx²/(2v² cos²θ)</code><span>Then inspect the direction at P.</span></div>
  <p class="visual-note">Visualization value only: g = 10 m/s². The canonical source keeps g symbolic; symbolic reasoning remains authoritative.</p></section>`;
}

export function renderQ23Stage(host, record) {
const p = parseQ23(record);
const m = q23Horizontal(host.state.q23.time, p);
const sx = (x) => 56 + 630 * x / 280;
const graphX = (t) => 68 + 600 * t / p.wallTime;
const graphY = (v) => 300 - 150 * v / m.vx0;
const curve = sampled(70, (u) => {
  const t = p.wallTime * u;
  const state = q23Horizontal(t, p);
  return { x: t, y: state.vx };
});
const plotPath = curve.map((point,index)=>`${index?"L":"M"}${round(graphX(point.x),1)},${round(graphY(point.y),1)}`).join(" ");
const projectileX = sx(m.x);
const vectorEnd = projectileX + clamp(82 * m.vx / m.vx0, 18, 82);
const xReadout = host.state.attempted ? `${round(m.x, 1)} m accumulated` : "distance hidden until you commit";
return `<section class="stage" aria-labelledby="visual-title"><div class="stage-head"><div><div class="section-kicker">Visualize</div><h3 id="visual-title">Horizontal speed decays; distance accumulates</h3></div><div class="stage-status"><b>t = ${round(m.t, 2)} s</b><span>vₓ = ${round(m.vx, 1)} m/s · ${xReadout}</span></div></div>
  <svg class="scene q23" viewBox="0 0 740 390" role="img" aria-label="Horizontal linear-drag motion with decaying velocity and a velocity-time plot">
    <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z"/></marker></defs>
    <text x="56" y="42">launch: ${p.speed} m/s at ${p.angleDegrees}°</text><line class="launch-vector" x1="70" y1="92" x2="132" y2="50"/><line class="component" x1="70" y1="92" x2="132" y2="92"/><line class="component vertical" x1="132" y1="92" x2="132" y2="50"/><text x="92" y="112">vₓ₀</text><text x="140" y="70">vᵧ₀</text>
    <line class="rail" x1="56" y1="150" x2="686" y2="150"/><circle class="projectile" cx="${projectileX}" cy="150" r="10"/>${host.state.q23.vector ? `<line class="velocity" x1="${projectileX+10}" y1="150" x2="${vectorEnd}" y2="150"/><text x="${projectileX+14}" y="135">vₓ(t)</text>` : ""}
    ${host.state.q23.compare ? `<circle class="ghost-dot" cx="${sx(m.noDragX)}" cy="150" r="8"/><text x="${Math.min(610,sx(m.noDragX)-35)}" y="180">no drag</text>` : ""}<text x="56" y="180">launch</text><text x="590" y="180">${round(m.vx0 * p.wallTime, 0)} m no-drag at ${p.wallTime} s</text>
    <line class="axis" x1="68" y1="300" x2="688" y2="300"/><line class="axis" x1="68" y1="310" x2="68" y2="205"/><path class="vx-curve" d="${plotPath}"/><line class="time-marker" x1="${graphX(m.t)}" y1="205" x2="${graphX(m.t)}" y2="300"/><text x="76" y="220">vₓ(t)</text><text x="655" y="322">2 s</text><text x="50" y="322">0</text>
  </svg>
  <div class="controls"><button type="button" data-action="play">${host.state.q23.playing ? "Pause" : "Play"}</button><label class="scrubber">Time <input data-time-scrubber type="range" min="0" max="${p.wallTime}" step="0.02" value="${m.t}" aria-label="Elapsed time"></label><button type="button" data-action="compare" aria-pressed="${host.state.q23.compare}">${host.state.q23.compare ? "Hide" : "Show"} no-drag</button><button type="button" data-action="vector" aria-pressed="${host.state.q23.vector}">${host.state.q23.vector ? "Hide" : "Show"} velocity</button><button type="button" data-action="reset">Reset</button></div>
  <div class="equation-strip"><span>Horizontal model</span><code>m dvₓ/dt = −c vₓ</code><span>Distance is the accumulated area under vₓ(t), not final vₓ × time.</span></div><p class="visual-note">The stage uses the source approximation e = ${p.eBase} for its exponential evaluation. No vacuum parabola is used for the drag motion.</p></section>`;
}
