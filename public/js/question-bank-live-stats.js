(function(){
'use strict';

const stats=document.getElementById('qbStats');
const resultCount=document.getElementById('qbResultCount');
if(!stats||!resultCount)return;

function metric(label,value){
  const box=document.createElement('div');
  box.className='qb-stat';
  const number=document.createElement('b');
  number.textContent=String(value);
  const caption=document.createElement('span');
  caption.textContent=label;
  box.append(number,caption);
  return box;
}

function update(){
  const api=window.Grade9QuestionBank;
  const data=window.Grade9QuestionBankData;
  if(!api||typeof api.filtered!=='function')return;
  let questions;
  try{questions=api.filtered();}
  catch(_error){return;}
  const all=data&&typeof data.summaries==='function'?data.summaries():questions;
  const subjects=new Set(questions.map(q=>q.subject_ref).filter(Boolean));
  const topics=new Set(questions.map(q=>q.topic_ref).filter(Boolean));
  stats.setAttribute('aria-label','Current Question Bank view');
  stats.replaceChildren(
    metric('canonical questions',all.length),
    metric('matching questions',questions.length),
    metric('subjects in view',subjects.size),
    metric('topics in view',topics.size)
  );
}

let frame=0;
function schedule(){
  if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;update();});
}

const observer=new MutationObserver(schedule);
observer.observe(resultCount,{childList:true,subtree:true,characterData:true});
window.addEventListener('popstate',schedule);

const api=window.Grade9QuestionBank;
if(api&&api.ready&&typeof api.ready.then==='function')api.ready.then(schedule);
else schedule();
})();
