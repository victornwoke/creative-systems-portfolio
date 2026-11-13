/* Creative Evaluation Lab - original demonstration by Victor Nwoke.
   Standalone, dependency-free. All project data is synthetic.
   Weighted score (0–100): sum(score / 5 * criterion weight).
   Critical flags do not alter score; they block readiness verdict. */
(() => {
  'use strict';
  const VERSION = 'creative-eval-lab-v1';
  const CRITERIA = [
    {id:'brief', name:'Brief adherence', weight:25, description:'Mandatory workshop details, prices, dates, location, access information and a booking route.', a:5, b:1, evidenceA:'Dates, times and GBP prices appear beside each workshop; venue and access information are visible.', evidenceB:'No dated schedule or visible prices; venue and access information are missing.'},
    {id:'craft', name:'Professional craft', weight:20, description:'Layout, hierarchy, typography, spacing, polish and consistency of visual choices.', a:4, b:3, evidenceA:'Strong headline hierarchy, measured spacing and visual grouping support scanning.', evidenceB:'Expressive colour and typography but competing headlines, compressed copy and poorly organised details.'},
    {id:'messaging', name:'Content and messaging', weight:15, description:'Specificity, clarity, plain language and the usefulness of supporting copy.', a:5, b:2, evidenceA:'Simple value proposition, precise workshop names and practical microcopy.', evidenceB:'Generic promises such as “Make magic” do not answer what, when or how.'},
    {id:'audience', name:'Audience suitability', weight:15, description:'Whether a newcomer can understand the offering and confidently make a decision.', a:4, b:2, evidenceA:'Approachable wording and side-by-side practical workshop information reduce uncertainty.', evidenceB:'The atmosphere is appealing but no clear workshop selection or decision path is supplied.'},
    {id:'accessibility', name:'Accessibility and usability', weight:10, description:'Meaningful navigation, readable information, useful labels, clear action text and access provisions.', a:4, b:1, evidenceA:'Clear text labels and event details. Access arrangements still need an actionable information route.', evidenceB:'High-intensity visual arrangement, vague CTA and no access information. Keyboard and contrast checks would also be required in a real build.'},
    {id:'consistency', name:'Consistency and production readiness', weight:10, description:'Content completeness, coherent style and practical requirements before publication.', a:4, b:2, evidenceA:'Consistent information structure; real booking destination and event details would need verification before a production release.', evidenceB:'No booking destination or operational details. Presentational visuals are not a launch-ready page.'},
    {id:'originality', name:'Originality within constraints', weight:5, description:'Distinctive design decisions that improve the experience without undermining the brief.', a:4, b:4, evidenceA:'Editorial typography and a restrained, warm visual language distinguish the studio without hiding facts.', evidenceB:'Bold layout and playful styling are memorable, even though visual expressiveness does not resolve missing essentials.'}
  ];
  const qs = sel => document.querySelector(sel);
  const qsa = sel => [...document.querySelectorAll(sel)];
  const initial = () => ({
    scores:Object.fromEntries(CRITERIA.map(c => [c.id,{a:c.a,b:c.b,evidenceA:c.evidenceA,evidenceB:c.evidenceB}])),
    criticalA:false, criticalB:true, rationale:'', next:'', rationaleCustom:false, nextCustom:false
  });
  const readSaved = () => {
    try {
      const raw = localStorage.getItem(VERSION);
      if (!raw) return initial();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.scores) return initial();
      const fresh = initial();
      for (const c of CRITERIA) {
        const item = parsed.scores[c.id] || {};
        for(const side of ['a','b']) if(Number.isFinite(+item[side])) fresh.scores[c.id][side] = Math.min(5,Math.max(0,Math.round(+item[side])));
        for(const key of ['evidenceA','evidenceB']) if(typeof item[key]==='string') fresh.scores[c.id][key] = item[key].slice(0,6000);
      }
      fresh.criticalA = Boolean(parsed.criticalA);
      fresh.criticalB = Boolean(parsed.criticalB);
      for (const k of ['rationale','next']) if(typeof parsed[k] === 'string') fresh[k] = parsed[k].slice(0,14000);
      fresh.rationaleCustom = Boolean(parsed.rationaleCustom);
      fresh.nextCustom = Boolean(parsed.nextCustom);
      return fresh;
    } catch {return initial()}
  };
  let state = readSaved();
  function persist(){try{localStorage.setItem(VERSION,JSON.stringify(state))}catch{/* storage optional */}}
  function score(side){return CRITERIA.reduce((t,c)=>t+(state.scores[c.id][side]/5*c.weight),0)}
  function fmt(n){return n.toFixed(1)}
  function status(side){if(side==='a'?state.criticalA:state.criticalB) return {text:'Blocked - critical requirement missing',kind:'blocked'};
    const val = score(side); if(val>=80) return {text:'Strong candidate - validate before launch',kind:'strong'};
    if(val>=65) return {text:'Promising - targeted revisions required',kind:'revise'};
    return {text:'Major revision required',kind:'blocked'};
  }
  function decision(){
    const a=score('a'), b=score('b'), sA=status('a'), sB=status('b');
    const aa=!state.criticalA, bb=!state.criticalB;
    let winner = a===b?'tie':a>b?'A':'B';
    const viable= aa && !bb?'A':!aa && bb?'B':aa && bb?winner:'none';
    let headline = viable==='none'?'Neither submission meets essential requirements.':viable==='tie'?'The two scores are tied.':`Submission ${viable} is the stronger starting point.`;
    let summary=`Submission A scored ${fmt(a)}/100 and submission B ${fmt(b)}/100. A is ${sA.text.toLowerCase()}; B is ${sB.text.toLowerCase()}. Scores are weighted and remain visible even when a critical requirement blocks publication.`;
    return {a,b,sA,sB,viable,headline,summary}
  }
  function templateRationale(){
    const d=decision(); const lead=d.viable==='none'?'Neither concept is currently suitable for release.':d.viable==='tie'?'The numerical assessments are tied.':`Submission ${d.viable} is the preferred design direction in this illustrative review.`;
    const core=`Submission A provides clear scheduled sessions, prices and a more usable hierarchy; submission B makes a stronger expressive visual gesture but withholds essential decision information. Missing dates, prices and accessibility information are treated as a critical release blocker for B. This conclusion is based on the stated fictional brief and visible example screens, not on user testing or claims about any AI model.`;
    return `${lead} ${core} Current totals: A ${fmt(d.a)}/100; B ${fmt(d.b)}/100. ${state.criticalA?'A has a critical failure flagged. ':''}${state.criticalB?'B has a critical failure flagged.':''}`;
  }
  function templateNext(){return '1. Advance the stronger direction only after checking event information, venue/access details and booking destination.\n2. Prototype the primary booking action and test it using keyboard and touch input at mobile widths.\n3. Validate typography contrast and assistive-technology labels in an actual implementation.\n4. Run a small, documented review with first-time visitors before making claims about effectiveness.'}
  let toastTimer;
  function notify(s){const el=qs('#toast');el.textContent=s;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),3500)}
  function setView(name){
    if(!qs(`[data-page="${name}"]`)) return;
    qsa('[data-page]').forEach(p=>{const show=p.dataset.page===name;p.hidden=!show;p.classList.toggle('is-visible',show)});
    qsa('[data-go]').forEach(btn=>{const active=btn.dataset.go===name && btn.classList.contains('nav-link');btn.classList.toggle('is-active',active);if(btn.classList.contains('nav-link')){if(active) btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')}});
    if(name==='report') updateReport();
    const page=qs(`[data-page="${name}"]`);const h=page.querySelector('h1');if(h) {h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    try{history.replaceState(null,'',`#${name}`)}catch{}
  }
  function buildRubric(){
    const host=qs('#criteria-list');host.textContent='';
    for(const c of CRITERIA){
      const entry=document.createElement('article');entry.className='criterion';
      const name=document.createElement('div');name.innerHTML=`<div class="criterion-title">${c.name}</div><div class="criterion-desc">${c.description}</div><span class="score-ruler">0 absent → 5 exemplary</span>`;
      const weight=document.createElement('div');weight.className='criterion-weight';weight.textContent=c.weight+'%';
      const selections=[];
      for (const side of ['a','b']){
        const id=`score-${c.id}-${side}`;
        const select=document.createElement('select');select.id=id;select.dataset.criterion=c.id;select.dataset.side=side;
        select.setAttribute('aria-label',`${c.name}, submission ${side.toUpperCase()}`);
        for(let n=0;n<=5;n++){const opt=document.createElement('option');opt.value=String(n);opt.textContent=String(n);select.appendChild(opt)}
        select.value=String(state.scores[c.id][side]);selections.push(select);
      }
      const notes=document.createElement('div');notes.className='inputs';
      for(const side of ['a','b']){
        const label=document.createElement('label');label.textContent=`SUBMISSION ${side.toUpperCase()} / OBSERVABLE EVIDENCE`;
        const ta=document.createElement('textarea');ta.dataset.noteFor=c.id;ta.dataset.side=side;ta.rows=3;ta.maxLength=6000;ta.value=state.scores[c.id][side==='a'?'evidenceA':'evidenceB'];label.appendChild(ta);notes.appendChild(label);
      }
      entry.append(name,weight,...selections,notes);host.appendChild(entry);
    }
  }
  function updateTotals(){
    const d=decision();qs('#score-a-total').textContent=fmt(d.a);qs('#score-b-total').textContent=fmt(d.b);
    qs('#bar-a').style.width=d.a+'%';qs('#bar-b').style.width=d.b+'%';
  }
  function updateReport(){
    const d=decision();qs('#decision-a-score').textContent=fmt(d.a);qs('#decision-b-score').textContent=fmt(d.b);
    qs('#decision-a-status').textContent=d.sA.text;qs('#decision-b-status').textContent=d.sB.text;
    qs('#decision-headline').textContent=d.headline;qs('#decision-summary').textContent=d.summary;
    if(!state.rationaleCustom) state.rationale=templateRationale();
    if(!state.nextCustom) state.next=templateNext();
    qs('#evaluation-rationale').value=state.rationale;qs('#evaluation-next').value=state.next;
    qs('#report-breakdown').textContent='';
    for(const c of CRITERIA){const row=document.createElement('tr');
      for(const t of [c.name,c.weight+'%',state.scores[c.id].a+' / 5',state.scores[c.id].b+' / 5']){const cell=document.createElement('td');cell.textContent=t;row.appendChild(cell)}qs('#report-breakdown').appendChild(row)}
    qs('#report-rationale-display').textContent=state.rationale;qs('#report-next-display').textContent=state.next;
    persist();
  }
  function render(){buildRubric();qs('#critical-a').checked=state.criticalA;qs('#critical-b').checked=state.criticalB;updateTotals();updateReport()}
  function escapeMd(s){return String(s||'').replace(/\|/g,'\\|')}
  function reportContent(){
    const d=decision();const today=new Date().toISOString().slice(0,10);
    const lines=[`# Creative Evaluation Report`, '',`**Project:** FIELDWORK - Weekend Workshop Landing Page (fictional client)`,`**Prepared by:** Victor Nwoke · Original demonstration`,`**Export date:** ${today}`,`**Context:** Synthetic portfolio work, not a Mercor rubric or real AI model comparison.`,'',`## Decision`,`**${d.headline}**`,'',d.summary,'',`## Weighted scorecard`,'','| Criterion | Weight | A (0–5) | B (0–5) | A evidence | B evidence |','|---|---:|---:|---:|---|---|'];
    for(const c of CRITERIA){const s=state.scores[c.id];lines.push(`| ${c.name} | ${c.weight}% | ${s.a} | ${s.b} | ${escapeMd(s.evidenceA).replace(/\n/g,' ')} | ${escapeMd(s.evidenceB).replace(/\n/g,' ')} |`)}
    lines.push('',`**Total A:** ${fmt(d.a)}/100 · **Total B:** ${fmt(d.b)}/100`,'',`**Critical failure A:** ${state.criticalA?'Yes':'No'}`,`**Critical failure B:** ${state.criticalB?'Yes':'No'}`,'',`**Readiness A:** ${d.sA.text}`,`**Readiness B:** ${d.sB.text}`,'','## Written judgement','',state.rationale,'','## Recommended next steps','',state.next,'','---','**Method:** Each criterion has an integer rating 0–5, multiplied by its weight divided by 5. Weights total 100%. Critical flags block readiness but do not modify numeric totals. The brief, entries and submissions are fictional examples.');
    return lines.join('\n');
  }
  function saveFile(name,body,mime){const blob=new Blob([body],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}
  function reset(){if(!window.confirm('Restore all demonstration scores and evidence notes? Your edits in this browser will be replaced.'))return;state=initial();persist();render();notify('Demonstration restored.');}
  qsa('[data-go]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.go)));
  qsa('[data-device]').forEach(b=>b.addEventListener('click',()=>{const mobile=b.dataset.device==='mobile';qs('#comparison-grid').classList.toggle('is-mobile',mobile);qsa('[data-device]').forEach(el=>{const active=el===b;el.classList.toggle('is-selected',active);el.setAttribute('aria-pressed',String(active))})}));
  qs('#browse-workshops').addEventListener('click',()=>{qs('#a-workshops').scrollIntoView({behavior:'smooth',block:'center'})});
  qs('#book-open').addEventListener('click',()=>qs('#booking-dialog').showModal());
  qs('#demo-confirm').addEventListener('click',()=>{qs('#booking-dialog').close();notify('Demo session selected - no booking made.');});
  qs('#criteria-list').addEventListener('change',e=>{
    if(!e.target.matches('select[data-criterion]'))return;
    const {criterion,side}=e.target.dataset;state.scores[criterion][side]=Number(e.target.value);updateTotals();updateReport();persist();
  });
  qs('#criteria-list').addEventListener('input',e=>{
    if(!e.target.matches('textarea[data-note-for]'))return;
    const {noteFor,side}=e.target.dataset;state.scores[noteFor][side==='a'?'evidenceA':'evidenceB']=e.target.value;persist();
  });
  for(const side of ['a','b'])qs('#critical-'+side).addEventListener('change',e=>{state[side==='a'?'criticalA':'criticalB']=e.target.checked;updateTotals();updateReport()});
  for(const [id,field] of [['evaluation-rationale','rationale'],['evaluation-next','next']])qs('#'+id).addEventListener('input',e=>{state[field]=e.target.value;state[field+'Custom']=true;qs('#report-'+(field==='rationale'?'rationale-display':'next-display')).textContent=e.target.value;persist()});
  for (const id of ['restart-top','reset-rubric'])qs('#'+id).addEventListener('click',reset);
  qs('#download-report').addEventListener('click',()=>{updateReport();saveFile('Victor_Nwoke_Creative_Evaluation_Report.md',reportContent(),'text/markdown;charset=utf-8');notify('Markdown report exported.')});
  qs('#download-json').addEventListener('click',()=>{saveFile('Creative_Evaluation_Rubric_Scores.json',JSON.stringify({title:'FIELDWORK synthetic evaluation',scoring:'sum((0–5 rating / 5) * weight)',weights:CRITERIA.map(({id,name,weight})=>({id,name,weight})),state,totals:{a:score('a'),b:score('b')},context:'Original synthetic portfolio demonstration; not official Mercor evaluation'},null,2),'application/json');notify('Structured scoring data exported.')});
  qs('#print-report').addEventListener('click',()=>{updateReport();window.print()});
  render();
  const requested=window.location.hash.slice(1);setView(qs(`[data-page="${requested}"]`)?requested:'overview');
})();
