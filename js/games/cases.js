Games.cases={title:'CASES',mount(el){
// ---- Odds config: p = percent actually rolled (one decimal place max, must total 100); d = percent shown in the "Case Odds" list (display text only); fx = VFX colour ----
const RAR=[{k:'Common',c:'#94a3b8',ic:'▼',min:.25,max:1,p:75,d:50},{k:'Uncommon',c:'#22c55e',ic:'✦',min:1,max:3,p:17,d:27},{k:'Rare',c:'#4f6bff',ic:'◆',min:3,max:15,p:6,d:13},{k:'Legendary',c:'#fbbf24',ic:'★',min:15,max:25,p:1.5,d:6,fx:'#fbbf24'},{k:'Mythic',c:'#ef4444',ic:'✹',min:25,max:50,p:.4,d:3,fx:'#ef4444'},{k:'Secret',c:'#05070a',b:'#6b7280',ic:'✪',min:50,max:100,p:.1,d:1,fx:'#e5e7eb'}];
const LIFE=['Legendary','Mythic','Secret'],AUTO_GAP=1200;
RAR.forEach(r=>r.w=Math.round(r.p*10));const TOT=RAR.reduce((a,r)=>a+r.w,0);
// ---- Spin timing: single authoritative duration (ms) ----
const DUR=6500,EA=.1,EC=.35,EL=1-EC,EV=1/(EA/2+(EC-EA)+EL/3);
function ease(p){if(p<=0)return 0;if(p>=1)return 1;if(p<EA)return .5*EV*p*p/EA;const d1=.5*EV*EA;if(p<EC)return d1+EV*(p-EA);const q=(p-EC)/EL;return d1+EV*(EC-EA)+EV*EL/3*(1-Math.pow(1-q,3))}
if(TOT!==1000)console.error('Case odds must total 100');
const TW=104,STEP=114,N=60,WIN=48,REST=4;
if(!document.getElementById('stk-cs')){const s=document.createElement('style');s.id='stk-cs';s.textContent=`
.cs-odds{font-size:20px;line-height:1.5;text-align:center}.cs-odds h3{margin:6px 0;font-weight:400;font-size:26px;color:#3f566b}
.cs-past{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px;min-height:30px;justify-content:flex-start}.cs-past b{font-size:13px;padding:4px 14px;border-radius:999px;background:var(--c);color:#fff;border:2px solid var(--b)}
.cs-wrap{position:relative;overflow:hidden;height:215px;background:#0a1620;border-radius:12px}.cs-strip{display:flex;gap:10px;padding-top:8px;will-change:transform}
.ct{flex:0 0 ${TW}px;height:150px;border-radius:12px;border:3px solid var(--b);background:linear-gradient(#1d3a50,#12263a);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px 6px 8px;color:var(--b);cursor:pointer;opacity:.55;filter:saturate(.35) brightness(.75);box-shadow:0 8px 14px #000a;transition:opacity .2s,filter .2s,transform .2s,box-shadow .2s}.ct.sel{opacity:1;filter:none;transform:scale(1.05);box-shadow:0 0 26px var(--b)}.ct:focus-visible{outline:3px solid #fff}
.ct i{font-style:normal;font-size:56px;line-height:1;filter:drop-shadow(0 0 8px var(--b))}.ct b{background:#0d1b27;border:2px solid var(--b);color:#fff;border-radius:999px;font-size:13px;padding:2px 10px}
.ct.win{outline:3px solid #fff;box-shadow:0 0 32px var(--b);transform:scale(1.07);opacity:1;filter:none}
.cs-sel{position:absolute;left:50%;top:4px;width:${TW+10}px;height:160px;transform:translateX(-50%);border:3px solid #fff;border-radius:14px;box-shadow:0 0 18px #fff6;pointer-events:none}
.cs-ptr{position:absolute;left:50%;top:166px;width:3px;height:34px;margin-left:-1px;background:#fff;pointer-events:none}.cs-ptr::after{content:"";position:absolute;left:-8px;bottom:-14px;width:16px;height:16px;border:3px solid #fff;border-radius:50%;background:#0a1620}
.cs-res{margin-top:14px;font-size:17px;min-height:50px}
.cs-life{display:flex;gap:16px;flex-wrap:wrap;justify-content:flex-start;margin:0 0 8px;font-size:14px;font-weight:700}.cs-life b{font-weight:900}.cs-life span:first-child{color:#7d93a8;font-weight:400}
.btn.as{background:#ef4444;color:#fff;display:flex;align-items:center;justify-content:center;gap:8px}.btn.as.on{background:#22c55e;color:#04210f}.btn.as.locked{background:#7f1d1d;color:#fecaca;opacity:.85}.btn.as svg{width:16px;height:16px;flex:none}.cs-hint{font-size:12px;color:#7d93a8;text-align:center}
.ct.hi{position:relative;overflow:hidden;opacity:.9;filter:saturate(.9) brightness(.95);animation:csGlow 2s ease-in-out infinite}
.ct.hi::before{content:"";position:absolute;top:-10%;bottom:-10%;left:-60%;width:50%;background:linear-gradient(100deg,transparent,var(--fx),transparent);opacity:.4;transform:skewX(-18deg);animation:csSheen 2.4s linear infinite;pointer-events:none}
.ct.hi::after{content:"";position:absolute;left:0;right:0;bottom:0;height:70%;background:radial-gradient(circle at 20% 100%,var(--fx) 0 2px,transparent 3px),radial-gradient(circle at 55% 100%,var(--fx) 0 2px,transparent 3px),radial-gradient(circle at 85% 100%,var(--fx) 0 1.5px,transparent 2.5px);opacity:0;pointer-events:none;animation:csRise 2.2s ease-in infinite}
.ct.r-Mythic{animation-duration:1.1s}.ct.r-Mythic::before{animation-duration:1.6s}.ct.r-Mythic::after{animation-duration:1.4s}
.ct.r-Secret{animation-duration:1.5s}.ct.r-Secret i{animation:csFlick 1.8s steps(1) infinite}.ct.r-Secret::before{opacity:.55}
.ct.hi.sel,.ct.hi.win{opacity:1;filter:none}.ct.hi.win{animation:csWin .7s ease-in-out infinite}
@keyframes csGlow{0%,100%{box-shadow:0 0 6px var(--fx),0 8px 14px #000a}50%{box-shadow:0 0 22px var(--fx),0 8px 14px #000a}}
@keyframes csWin{0%,100%{box-shadow:0 0 22px var(--fx),0 0 40px var(--fx)}50%{box-shadow:0 0 46px var(--fx),0 0 90px var(--fx)}}
@keyframes csSheen{from{left:-60%}to{left:130%}}@keyframes csRise{0%{opacity:0;transform:translateY(30%)}30%{opacity:.9}100%{opacity:0;transform:translateY(-60%)}}
@keyframes csFlick{0%,100%{opacity:1}46%{opacity:1}48%{opacity:.25}50%{opacity:1}52%{opacity:.4}54%{opacity:1}}
.cs-burst{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:5}
.cs-burst b{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:var(--fx);box-shadow:0 0 10px var(--fx);animation:csPart 1.2s ease-out forwards}
.cs-ring{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;border:4px solid var(--fx);box-shadow:0 0 18px var(--fx);animation:csRing 1s ease-out forwards}
.cs-flash{position:absolute;left:-400px;top:-120px;width:800px;height:240px;background:radial-gradient(ellipse,var(--fx),transparent 65%);opacity:0;animation:csFlash .9s ease-out forwards}
@keyframes csPart{to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}@keyframes csRing{to{transform:scale(16);opacity:0;border-width:1px}}@keyframes csFlash{0%{opacity:.9}100%{opacity:0}}
.cs-wrap.glow{animation:csFrame 1.8s ease-out}@keyframes csFrame{0%,100%{box-shadow:0 0 0 var(--fx)}15%{box-shadow:0 0 40px var(--fx),inset 0 0 40px var(--fx)}}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Lock in Bet</button><button class="btn as" id="as" type="button"></button><div class="cs-hint">Press Space to lock in a bet</div><div class="cs-odds"><h3>Case Odds:</h3>${RAR.map(r=>`<div style="color:${r.k==='Secret'?'#0a0a0a;text-shadow:0 0 6px #fff,0 0 2px #888':r.c}">${r.k}: ${r.d}%</div>`).join('')}</div></div><div class="stage"><div class="cs-life" id="lf"></div><div style="text-align:left;color:#7d93a8">Past Rolls:</div><div class="cs-past" id="pa"></div><div class="cs-wrap" id="wr"><div class="cs-strip" id="sr"></div><div class="cs-sel"></div><div class="cs-ptr"></div></div><div class="cs-res" id="rs">Lock in a bet to open a case.</div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go'),as=q('#as'),wr=q('#wr'),sr=q('#sr'),rs=q('#rs'),br=q('.betrow'),bi=q('.bet');
let auto=false,at=0,arr=[],sel=REST,busy=false,rd=null,past=[],prev=null,tm=[],raf=0,x0=0,xT=0;
const rnd=()=>{try{return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296}catch(e){return Math.random()}};
function roll(){let r=Math.floor(rnd()*TOT),i=0;for(;i<RAR.length-1;i++){if(r<RAR[i].w)break;r-=RAR[i].w}const z=RAR[i];return{r:z,m:Math.min(z.max,Math.max(z.min,Math.round((z.min+rnd()*(z.max-z.min))*100)/100))}}
const tile=(o,i)=>`<div class="ct${o.r.fx?' hi r-'+o.r.k:''}" data-i="${i}" tabindex="0" role="button" aria-label="${o.r.k} ${o.m.toFixed(2)}x" style="--c:${o.r.c};--b:${o.r.b||o.r.c};--fx:${o.r.fx||o.r.c}"><i>${o.r.ic}</i><b>${o.m.toFixed(2)}x</b></div>`;
const pill=o=>`<b style="--c:${o.r.c};--b:${o.r.b||o.r.c}">${o.m.toFixed(2)}x</b>`;
function center(i){return wr.clientWidth/2-(i*STEP+TW/2)}
function build(winner){const a=Array.from({length:N},()=>roll());a[REST]=prev||a[REST];if(winner)a[WIN]=winner;arr=a;sr.innerHTML=a.map((o,i)=>tile(o,i)).join('');sr.style.transition='none';sr.style.transform=`translate3d(${center(REST)}px,0,0)`;sel=-1;mark(REST);return a}
function mark(i){const o=sr.children[sel];if(o){o.classList.remove('sel');o.removeAttribute('aria-pressed')}sel=i;const n=sr.children[i];if(n){n.classList.add('sel');n.setAttribute('aria-pressed','true')}}
function choose(i){if(busy||!sr.children[i])return;mark(i);sr.style.transition='transform .35s ease';sr.style.transform=`translate3d(${center(i)}px,0,0)`}
function settleOnce(){if(!rd||rd.settled)return 0;rd.settled=true;if(LIFE.includes(rd.o.r.k))Store.d.cc[rd.o.r.k]=(Store.d.cc[rd.o.r.k]||0)+1;const pay=App.settle('CASES',rd.bet,Math.round(rd.bet*rd.o.m*100)/100);return pay}
function finish(){if(!busy||rd.finished)return;rd.finished=true;cancelAnimationFrame(raf);sr.style.transform=`translate3d(${xT}px,0,0)`;mark(WIN);sr.children[WIN].classList.add('win');
const pay=settleOnce(),pr=Math.round((pay-rd.bet)*100)/100,o=rd.o;life();burst(o);prev=o;past.unshift(o);past=past.slice(0,7);q('#pa').innerHTML=past.map(pill).join('');
rs.innerHTML=`Bet: <b>$${App.f(rd.bet)}</b> • Multiplier: <b style="color:${o.r.k==='Secret'?'#fff':o.r.c}">${o.m.toFixed(2)}x (${o.r.k})</b> • Payout: <b style="color:${pr>=0?'#22c55e':'#ef4444'}">$${App.f(pay)}</b>`;
App.toast(pr>=0?`${o.m.toFixed(2)}x: +$${App.f(pr)} profit`:`${o.m.toFixed(2)}x: lost $${App.f(-pr)}`);
busy=false;go.disabled=false;go.textContent='Lock in Bet';br.classList.remove('dis');bi.disabled=false;if(auto)at=setTimeout(()=>{if(auto&&!busy)spin(true)},AUTO_GAP),tm.push(at)}
/* Lifetime Legendary / Mythic / Secret counters */
function life(){q('#lf').innerHTML='<span>Lifetime spins:</span>'+LIFE.map(k=>{const r=RAR.find(x=>x.k===k);return `<span style="color:${r.fx}">${k}: <b>${Store.d.cc[k]||0}</b></span>`}).join('')}
/* Colourful burst when a Legendary / Mythic / Secret lands */
function burst(o){if(!o.r.fx)return;const n={Legendary:18,Mythic:28,Secret:40}[o.r.k],f=document.createElement('div');f.className='cs-burst';f.style.setProperty('--fx',o.r.fx);let h='<i class="cs-flash"></i><i class="cs-ring"></i>';
for(let i=0;i<n;i++){const a=Math.random()*6.283,d=70+Math.random()*(o.r.k==='Legendary'?90:150);h+=`<b style="--dx:${Math.cos(a)*d*1.6}px;--dy:${Math.sin(a)*d*.8}px;animation-delay:${Math.random()*.12}s"></b>`}
f.innerHTML=h;wr.appendChild(f);wr.style.setProperty('--fx',o.r.fx);wr.classList.remove('glow');void wr.offsetWidth;wr.classList.add('glow');tm.push(setTimeout(()=>f.remove(),1600))}
/* Auto-Spin: unlocked at Silver rank. Always starts OFF when the page loads. */
const silver=()=>Store.d.rk>=CFG.AUTOSPIN_RANK;
const LOCK='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>';
function paintAs(){const lk=!silver();as.className='btn as'+(lk?' locked':auto?' on':'');as.setAttribute('aria-pressed',String(auto&&!lk));as.title=lk?'Reach Silver rank to unlock Auto-Spin':'';as.innerHTML=lk?LOCK+'Auto-Spin':'Auto-Spin: '+(auto?'ON':'OFF')}
function setAuto(v){auto=!!v&&silver();if(!auto)clearTimeout(at);paintAs()}
as.onclick=()=>{as.blur();if(!silver()){App.toast('Auto-Spin unlocks at Silver rank');return}setAuto(!auto);if(auto&&!busy)spin(true)};
function spin(isAuto){if(busy)return;clearTimeout(at);
if(isAuto){const c=Econ.checkBet(bi.value,'CASES',Store.d.balance);if(!c.ok){setAuto(false);App.toast('Auto-Spin stopped: '+c.msg);return}}
const bet=App.bet(el,'CASES',1);if(!bet){if(isAuto)setAuto(false);return}
busy=true;rd={bet,o:roll(),settled:false,finished:false};go.disabled=true;go.textContent='Opening…';br.classList.add('dis');bi.disabled=true;
rs.innerHTML=`Bet locked: <b>$${App.f(bet)}</b>. Opening case…`;prev=arr[sel]||prev;build(rd.o);x0=center(REST);xT=center(WIN);
const t0=performance.now();(function f(now){const p=Math.min(1,(now-t0)/DUR),e=ease(p),x=x0+(xT-x0)*e;sr.style.transform=`translate3d(${x}px,0,0)`;const ti=Math.round((wr.clientWidth/2-TW/2-x)/STEP);if(ti!==sel&&ti>=0&&ti<N)mark(ti);if(p<1)raf=requestAnimationFrame(f)})(t0);
tm.push(setTimeout(finish,DUR))}
go.onclick=()=>spin(false);
const rest=()=>{if(!busy)sr.style.transform=`translate3d(${center(sel)}px,0,0)`};sr.onclick=e=>{const t=e.target.closest('.ct');if(t)choose(+t.dataset.i)};
sr.onkeydown=e=>{const t=e.target.closest('.ct');if(!t)return;const i=+t.dataset.i;if(e.key==='Enter'){e.preventDefault();choose(i)}else if(e.key===' '){e.preventDefault();spin(false)}else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const j=i+(e.key==='ArrowRight'?1:-1);if(sr.children[j]){choose(j);sr.children[j].focus({preventScroll:true})}}};addEventListener('resize',rest);
/* Spacebar = Lock in Bet (ignored while typing, on other buttons, or with a dialog open) */
const onKey=e=>{if(e.code!=='Space'||e.defaultPrevented||e.repeat)return;const t=e.target,tg=t&&t.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT'||tg==='BUTTON'||document.querySelector('.mo'))return;e.preventDefault();spin(false)};
document.addEventListener('keydown',onKey);el.addEventListener('click',e=>{const m=e.target.closest('.mini');if(m)m.blur()});
build();life();paintAs();
return()=>{document.removeEventListener('keydown',onKey);cancelAnimationFrame(raf);tm.forEach(clearTimeout);removeEventListener('resize',rest);if(busy)settleOnce()}}};
