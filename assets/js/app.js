/* DriveAssist v4 development instrumentation. Static hosting; no server-side collection. */
(function(){
'use strict';
const CANONICAL='You are always the driver. DriveAssist does not make your vehicle self-driving. Keep your hands on the wheel and your eyes on the road. Watch for traffic and hazards the system may not detect. Be ready to steer and brake at any moment, even without a warning.';
const DEV=!!(window.DA_CONFIG&&window.DA_CONFIG.dev), BUILD=(window.DA_CONFIG&&window.DA_CONFIG.build)||'v4';
const p=new URLSearchParams(location.search), condition=p.get('c')==='1'?'A':p.get('c')==='2'?'B':null;
const test=DEV&&p.get('test')==='1', mode=p.get('mode')==='embed'?'embed':'window';
const rid=(p.get('rid')||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,64);
const layout=DEV&&p.get('layout')==='swap'?'swap':'shift';
const imgHeight=DEV&&p.get('img')==='230'?'230':'270';
const notice=document.getElementById('notice'), site=document.getElementById('site');
if(!condition){notice.hidden=false;return;}
site.hidden=false; document.body.dataset.imgHeight=imgHeight;
const clone=id=>document.getElementById(id).content.firstElementChild.cloneNode(true);
const stmt=clone('tpl-statement'); document.getElementById(condition==='A'?'slot-main':'slot-learn').appendChild(stmt);
if(layout==='swap'){
 document.getElementById(condition==='A'?'slot-learn':'slot-main').appendChild(clone('tpl-sensor'));
}
if(mode==='embed') document.getElementById('end').hidden=true;
const t0=performance.now(), now=()=>performance.now(), dt=()=>Math.round(now()-t0);
const state={hidden_ms:0,hidden_since:document.hidden?now():null,completed:0,scroll_max:0,faqOpen:[0,0,0,0],faqEver:[0,0,0,0],faqFirst:[-1,-1,-1,-1],faqTotal:0,faqOpenMs:[0,0,0,0],faqOpenSince:[null,null,null,null],reentry:0,reloads:0};
const names=['statement','acc','lane','features','where','limits','learn'];
const els={statement:stmt,acc:document.querySelector('.features .feature:nth-child(1) p'),lane:document.querySelector('.features .feature:nth-child(2) p'),features:document.getElementById('features'),where:document.getElementById('where'),limits:document.getElementById('limits'),learn:document.getElementById('learn')};
const vis={};names.forEach(n=>vis[n]={intersection:0,activeSince:null,total:0,first:-1});
function visibleTab(){return !document.hidden&&document.visibilityState==='visible';}
function settle(n,t){const v=vis[n];if(v.activeSince!==null){v.total+=Math.max(0,t-v.activeSince);v.activeSince=null;}}
function sync(n,t){const v=vis[n], qualifies=visibleTab()&&v.intersection>=.5&&els[n].getClientRects().length>0;
 if(qualifies&&v.activeSince===null){v.activeSince=t;if(v.first<0)v.first=Math.round(t-t0);}else if(!qualifies)settle(n,t);
}
const observer=new IntersectionObserver(entries=>{const t=now();entries.forEach(e=>{const n=e.target.dataset.observe;vis[n].intersection=e.intersectionRatio;sync(n,t);});},{threshold:[0,.5,1]});
names.forEach(n=>{els[n].dataset.observe=n;observer.observe(els[n]);});
function syncAll(){const t=now();names.forEach(n=>sync(n,t));}
function tick(){syncAll();const t=now();for(let i=0;i<4;i++){
 if(state.faqOpen[i]&&visibleTab()&&state.faqOpenSince[i]===null)state.faqOpenSince[i]=t;
 if((!state.faqOpen[i]||!visibleTab())&&state.faqOpenSince[i]!==null){state.faqOpenMs[i]+=t-state.faqOpenSince[i];state.faqOpenSince[i]=null;}
}}
function snapshot(n){const v=vis[n];return Math.round(v.total+(v.activeSince!==null?now()-v.activeSince:0));}
function scrollPct(){const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);return Math.min(100,Math.round(100*scrollY/total));}
function onScroll(){state.scroll_max=Math.max(state.scroll_max,scrollPct());}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',()=>{syncAll();onScroll();});
for(let i=1;i<=4;i++){
 const btn=document.getElementById(`faq${i}-toggle`),panel=document.getElementById(`faq${i}-panel`),idx=i-1;
 btn.addEventListener('click',()=>{
  const open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));panel.hidden=!open;
  state.faqOpen[idx]=open?1:0;
  if(open){state.faqTotal++;state.faqEver[idx]=1;if(state.faqFirst[idx]<0)state.faqFirst[idx]=dt();}
  tick();syncAll();send();
 });
}
document.addEventListener('visibilitychange',()=>{
 const t=now();if(document.hidden){state.hidden_since=t;}else if(state.hidden_since!==null){state.hidden_ms+=t-state.hidden_since;state.hidden_since=null;}
 tick();syncAll();
});
function storeGet(k){try{return sessionStorage.getItem(k);}catch(e){return null;}}
function storeSet(k,v){try{sessionStorage.setItem(k,v);}catch(e){}}
const key='da_v4_'+rid+'_'+condition;
let visit=Number(storeGet(key)||'0');state.reloads=visit>0?visit:0;storeSet(key,String(visit+1));
addEventListener('pageshow',e=>{if(e.persisted){state.reentry++;tick();syncAll();}});
const nav=performance.getEntriesByType('navigation');if(nav.length&&nav[0].type==='reload')state.reloads=Math.max(state.reloads,1);
function payload(){tick();onScroll();const t=now();const hidden=state.hidden_ms+(state.hidden_since!==null?t-state.hidden_since:0);
 const d={cond:condition,build:BUILD,layout:layout,rid:rid,time_on_page_ms:dt(),tab_hidden_ms:Math.round(hidden),completed:state.completed,
 stmt_visible_ms:snapshot('statement'),stmt_first_visible_ms:vis.statement.first,stmt_seen:snapshot('statement')>=1000?1:0,
 acc_seen:snapshot('acc')>=1000?1:0,lane_seen:snapshot('lane')>=1000?1:0,
 reach_features:snapshot('features')>=1000?1:0,reach_where:snapshot('where')>=1000?1:0,reach_limits:snapshot('limits')>=1000?1:0,reach_learn:snapshot('learn')>=1000?1:0,
 max_scroll_pct:state.scroll_max,vw:innerWidth,vh:innerHeight,reloads:state.reloads,reentry_count:state.reentry,
 faq_open_count:state.faqTotal,faq_unique_opened:state.faqEver.reduce((a,b)=>a+b,0),faq1_first_open_ms:state.faqFirst[0]};
 for(let i=0;i<4;i++){d['faq'+(i+1)+'_opened']=state.faqEver[i];d['faq'+(i+1)+'_open_ms']=Math.round(state.faqOpenMs[i]+(state.faqOpenSince[i]!==null?t-state.faqOpenSince[i]:0));}
 d.lm_opens=d.faq_open_count;d.lm_first_open_ms=d.faq1_first_open_ms;d.lm_open_ms=d.faq1_open_ms;
 return d;
}
function qualtricsURL(raw){try{const u=new URL(raw);return u.protocol==='https:'&&/(^|\.)qualtrics\.com$/i.test(u.hostname)?u:null;}catch(e){return null;}}
// A second survey URL is configured externally. Never put a Prolific ID in this URL.
const ret=qualtricsURL(p.get('ret'));
const btn=document.getElementById('continue');btn.addEventListener('click',()=>{
 state.completed=1;const d=payload();if(ret){Object.entries(d).forEach(([k,v])=>ret.searchParams.set(k,String(v)));location.assign(ret.toString());}
 else if(test){renderTest('Continue clicked; no return URL provided.');}
 else{state.completed=0;btn.disabled=true;btn.textContent='Survey return link unavailable';}
});
let parentOrigin=null;try{const u=new URL(document.referrer);if(u.protocol==='https:'&&/(^|\.)qualtrics\.com$/i.test(u.hostname))parentOrigin=u.origin;}catch(e){}
function send(){if(mode==='embed'&&parentOrigin&&parent!==window)parent.postMessage({type:'driveassist',data:payload()},parentOrigin);}
if(mode==='embed'){setInterval(send,5000);addEventListener('pagehide',send);send();}
setInterval(tick,200);
function renderTest(msg){if(!testBox)return;const d=payload();const norm=s=>s.replace(/\s+/g,' ').trim();
 const st=document.querySelectorAll('[data-block="statement"]');const correct=st.length===1&&norm(st[0].textContent)===norm(CANONICAL);
 const expected=condition==='A'?'slot-main':'slot-learn';const where=st[0]&&st[0].parentElement.id;
 const integrity=correct&&where===expected;
 testBox.textContent=`V4 TEST | ${condition} | ${layout} | img ${imgHeight}px\nstatement once / canonical: ${correct?'PASS':'FAIL'}\nlocation: ${where} (${integrity?'PASS':'FAIL'})\nFAQ rows: ${document.querySelectorAll('.faq-item').length}\nLearn More y: ${Math.round(document.getElementById('learn').getBoundingClientRect().top+scrollY)}px\nPage height: ${document.documentElement.scrollHeight}px\n\n`+Object.entries(d).map(([k,v])=>`${k}: ${v}`).join('\n')+(msg?'\n'+msg:'');
}
let testBox=null;if(test){testBox=document.createElement('aside');testBox.className='test-panel';testBox.style.whiteSpace='pre-wrap';document.body.appendChild(testBox);setInterval(()=>renderTest(),500);renderTest();}
window.__DA_TEST__=DEV?{payload,statement:stmt,vis,faq:state}:undefined;
})();
