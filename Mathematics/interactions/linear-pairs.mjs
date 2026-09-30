import { registerLocalRuntime } from "./portable-host.mjs";
// Governed LOCAL module: mounted only by the portable host with a digest-pinned model.

registerLocalRuntime("mathematics-linear-pairs-v1", (element, model) => {
  const {a,b,c,min,max} = model;
  if (![a,b,c,min,max].every(Number.isFinite) || b===0 || min>=max || max-min>1000)
    throw new Error("LINEAR_PAIRS_MODEL_INVALID");
  const root=element.shadowRoot || element.attachShadow({mode:"open"});
  root.innerHTML=`<style>
    :host{display:block;font:18px/1.5 system-ui}*{box-sizing:border-box}.layout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,1fr);gap:24px}
    svg{width:100%;max-height:650px;touch-action:none;border:1px solid #64748b;background:white;user-select:none}button,input{min-height:48px;font:inherit}button{min-width:48px;padding:8px 16px}input{max-width:100%}label{display:block;margin:12px 0}table{width:100%}td,th{text-align:left;padding:8px}
    :focus-visible{outline:3px solid #2563eb}.dot{fill:#047857}.cursor{fill:#b45309}output{display:block;min-height:48px}@media(max-width:950px){.layout{grid-template-columns:1fr}svg{max-height:550px}}@media print{button,input{display:none}}
    </style><h2>Test and collect solution pairs</h2><p data-equation></p>
    <div class="layout"><div><svg viewBox="0 0 600 600" role="img" aria-labelledby="plot-title plot-desc" tabindex="0"><title id="plot-title">Coordinate plane</title><desc id="plot-desc">Drag the amber point or use arrow keys. Accepted pairs appear as green points.</desc><g data-grid></g><g data-accepted></g><circle class="cursor" r="10" data-cursor></circle></svg><p>Drag the point to investigate. Arrow keys move by 0.25; Shift moves by 1. Values are rounded to hundredths.</p><output data-residual aria-live="polite"></output></div>
    <div><label>Choose x <input data-x type="range" step="0.25"></label><output data-x-label></output><label>Predict the matching y <input data-y type="number" step="any"></label><button data-test>Test my pair</button><output data-feedback role="status"></output><table><caption>Accepted pairs</caption><thead><tr><th>x</th><th>y</th></tr></thead><tbody></tbody></table></div></div>`;
  const get=s=>root.querySelector(s); const svg=get('svg'); const ns='http://www.w3.org/2000/svg';
  const pos=v=>30+(v-min)/(max-min)*540; const inv=v=>min+(v-30)/540*(max-min);
  const clamp=v=>Math.max(min,Math.min(max,v)); const round=v=>Math.round(v*100)/100;
  let point={x:0,y:0}; const pairs=[];
  get('[data-equation]').textContent=`Explore ${a}x + ${b}y + (${c}) = 0. Find pairs between the ones already collected.`;
  function line(x1,y1,x2,y2,color){const n=document.createElementNS(ns,'line');Object.entries({x1,y1,x2,y2,stroke:color,'stroke-width':1}).forEach(([k,v])=>n.setAttribute(k,v));get('[data-grid]').append(n)}
  for(let n=Math.ceil(min);n<=max;n++){line(pos(n),30,pos(n),570,n===0?'#334155':'#e2e8f0');line(30,600-pos(n),570,600-pos(n),n===0?'#334155':'#e2e8f0');const t=document.createElementNS(ns,'text');t.setAttribute('x',pos(n));t.setAttribute('y',600-pos(0)+20);t.setAttribute('font-size','14');t.textContent=n;get('[data-grid]').append(t);if(n!==0){const v=document.createElementNS(ns,'text');v.setAttribute('x',pos(0)-25);v.setAttribute('y',600-pos(n)+5);v.setAttribute('font-size','14');v.textContent=n;get('[data-grid]').append(v)}}
  const x=get('[data-x]'); x.min=min; x.max=max; x.value=0;
  function update(){get('[data-cursor]').setAttribute('cx',pos(point.x));get('[data-cursor]').setAttribute('cy',600-pos(point.y));get('[data-residual]').textContent=`Point (${point.x}, ${point.y}); residual = ${Number((a*point.x+b*point.y+c).toFixed(8))}`;get('[data-x-label]').textContent=`x = ${x.value}`;}
  function move(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const loc=p.matrixTransform(svg.getScreenCTM().inverse());point={x:round(clamp(inv(loc.x))),y:round(clamp(inv(600-loc.y)))};update();}
  svg.addEventListener('pointerdown',e=>{e.preventDefault();svg.focus();svg.setPointerCapture(e.pointerId);move(e)});
  svg.addEventListener('pointermove',e=>{if(svg.hasPointerCapture(e.pointerId))move(e)});
  svg.addEventListener('pointerup',e=>{if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId)});
  svg.addEventListener('keydown',e=>{const step=e.shiftKey?1:.25;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();point.x=round(clamp(point.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0)));point.y=round(clamp(point.y+(e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0)));update()});
  x.addEventListener('input',()=>{get('[data-x-label]').textContent=`x = ${x.value}`;get('[data-y]').value='';get('[data-feedback]').textContent='Predict y before testing.'});
  get('[data-test]').addEventListener('click',()=>{
    const raw=get('[data-y]').value.trim(); const px=Number(x.value),py=Number(raw);
    if(!raw||!Number.isFinite(py)){get('[data-feedback]').textContent='Enter a finite y value.';return}
    const residual=a*px+b*py+c; point={x:px,y:py};update();
    if(Math.abs(residual)>1e-9){get('[data-feedback]').textContent=`Not on the line: residual ${Number(residual.toFixed(8))}. Revise your pair.`;return}
    if(pairs.some(p=>p[0]===px&&p[1]===py)){get('[data-feedback]').textContent='Already collected. Try a new x.';return}
    pairs.push([px,py]);const tr=document.createElement('tr');[px,py].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});get('tbody').append(tr);
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',pos(px));dot.setAttribute('cy',600-pos(py));dot.setAttribute('r',6);dot.setAttribute('class','dot');const title=document.createElementNS(ns,'title');title.textContent=`(${px}, ${py})`;dot.append(title);get('[data-accepted]').append(dot);const label=document.createElementNS(ns,'text');label.setAttribute('x',pos(px)+8);label.setAttribute('y',600-pos(py)-10);label.setAttribute('font-size','14');label.textContent=`(${px}, ${py})`;get('[data-accepted]').append(label);
    get('[data-feedback]').textContent=`Accepted within numerical tolerance 1e-9. ${pairs.length} distinct pairs collected. Try an x between earlier pairs.`;
    if(pairs.length===3){const l=document.createElementNS(ns,'line');Object.entries({x1:pos(min),y1:600-pos((-c-a*min)/b),x2:pos(max),y2:600-pos((-c-a*max)/b),stroke:'#047857','stroke-width':2}).forEach(([k,v])=>l.setAttribute(k,v));get('[data-accepted]').prepend(l)}
    element.dispatchEvent(new CustomEvent('semantic-workbench-event',{detail:{type:'LOCAL_PAIR_ACCEPTED',pair:[px,py],residual},bubbles:true,composed:true}));
  });
  update();
});
