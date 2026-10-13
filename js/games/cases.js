Games.cases={title:'CASES',mount(el){
const RAR=[{k:'Common',c:'#94a3b8',ic:'▼',min:.5,max:1,p:50},{k:'Uncommon',c:'#22c55e',ic:'✦',min:1,max:5,p:27},{k:'Rare',c:'#4f6bff',ic:'◆',min:5,max:15,p:13},{k:'Legendary',c:'#fbbf24',ic:'★',min:15,max:25,p:6},{k:'Mythic',c:'#ef4444',ic:'✹',min:25,max:50,p:3},{k:'Secret',c:'#05070a',b:'#6b7280',ic:'✪',min:50,max:100,p:1}];
if(Math.round(RAR.reduce((a,r)=>a+r.p,0))!==100)console.error('Case odds must total 100');
const TW=104,STEP=114,N=60,WIN=48,REST=4,DUR=3000;
if(!document.getElementById('stk-cs')){const s=document.createElement('style');s.id='stk-cs';s.textContent=`
.cs-odds{font-size:20px;line-height:1.5;text-align:center}.cs-odds h3{margin:6px 0;font-weight:400;font-size:26px;color:#3f566b}
.cs-past{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px;min-height:30px;justify-content:flex-start}.cs-past b{font-size:13px;padding:4px 14px;border-radius:999px;background:var(--c);color:#fff;border:2px solid var(--b)}
.cs-wrap{position:relative;overflow:hidden;height:215px;background:#0a1620;border-radius:12px}.cs-strip{display:flex;gap:10px;padding-top:8px;will-change:transform}
.ct{flex:0 0 ${TW}px;height:150px;border-radius:12px;border:3px solid var(--b);background:linear-gradient(#1d3a50,#12263a);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px 6px 8px;color:var(--b)}
.ct i{font-style:normal;font-size:56px;line-height:1;filter:drop-shadow(0 0 8px var(--b))}.ct b{background:#0d1b27;border:2px solid var(--b);color:#fff;border-radius:999px;font-size:13px;padding:2px 10px}
.ct.win{outline:3px solid #fff;box-shadow:0 0 32px var(--b);transform:scale(1.07);transition:transform .3s}
.cs-sel{position:absolute;left:50%;top:4px;width:${TW+10}px;height:160px;transform:translateX(-50%);border:3px solid #fff;border-radius:14px;box-shadow:0 0 18px #fff6;pointer-events:none}
.cs-ptr{position:absolute;left:50%;top:166px;width:3px;height:34px;margin-left:-1px;background:#fff;pointer-events:none}.cs-ptr::after{content:"";position:absolute;left:-8px;bottom:-14px;width:16px;height:16px;border:3px solid #fff;border-radius:50%;background:#0a1620}
.cs-res{margin-top:14px;font-size:17px;min-height:50px}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Lock in Bet</button><div class="cs-odds"><h3>Case Odds:</h3>${RAR.map(r=>`<div style="color:${r.k==='Secret'?'#0a0a0a;text-shadow:0 0 6px #fff,0 0 2px #888':r.c}">${r.k}: ${r.p}%</div>`).join('')}</div></div><div class="stage"><div style="text-align:left;color:#7d93a8">Past Rolls:</div><div class="cs-past" id="pa"></div><div class="cs-wrap" id="wr"><div class="cs-strip" id="sr"></div><div class="cs-sel"></div><div class="cs-ptr"></div></div><div class="cs-res" id="rs">Lock in a bet to open a case.</div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go'),wr=q('#wr'),sr=q('#sr'),rs=q('#rs'),br=q('.betrow'),bi=q('.bet');
let busy=false,rd=null,past=[],prev=null,tm=[],raf=0,x0=0,xT=0;
const rnd=()=>{try{return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296}catch(e){return Math.random()}};
function roll(){let r=rnd()*100,i=0;for(;i<RAR.length-1;i++){if(r<RAR[i].p)break;r-=RAR[i].p}const z=RAR[i];return{r:z,m:Math.min(z.max,Math.max(z.min,Math.round((z.min+rnd()*(z.max-z.min))*100)/100))}}
const tile=(o,w)=>`<div class="ct${w?' win':''}" style="--c:${o.r.c};--b:${o.r.b||o.r.c}"><i>${o.r.ic}</i><b>${o.m.toFixed(2)}x</b></div>`;
const pill=o=>`<b style="--c:${o.r.c};--b:${o.r.b||o.r.c}">${o.m.toFixed(2)}x</b>`;
function center(i){return wr.clientWidth/2-(i*STEP+TW/2)}
function build(winner){const a=Array.from({length:N},()=>roll());a[REST]=prev||a[REST];if(winner)a[WIN]=winner;sr.innerHTML=a.map(o=>tile(o)).join('');sr.style.transform=`translate3d(${center(REST)}px,0,0)`;return a}
function settleOnce(){if(!rd||rd.settled)return 0;rd.settled=true;const pay=Math.round(rd.bet*rd.o.m*100)/100;App.settle('CASES',rd.bet,pay);return pay}
function finish(){if(!busy||rd.finished)return;rd.finished=true;cancelAnimationFrame(raf);sr.style.transform=`translate3d(${xT}px,0,0)`;sr.children[WIN].classList.add('win');
const pay=settleOnce(),pr=Math.round((pay-rd.bet)*100)/100,o=rd.o;prev=o;past.unshift(o);past=past.slice(0,7);q('#pa').innerHTML=past.map(pill).join('');
rs.innerHTML=`Bet: <b>$${App.f(rd.bet)}</b> • Multiplier: <b style="color:${o.r.k==='Secret'?'#fff':o.r.c}">${o.m.toFixed(2)}x (${o.r.k})</b> • Payout: <b style="color:${pr>=0?'#22c55e':'#ef4444'}">$${App.f(pay)}</b>`;
App.toast(pr>=0?`${o.m.toFixed(2)}x: +$${App.f(pr)} profit`:`${o.m.toFixed(2)}x: lost $${App.f(-pr)}`);
busy=false;go.disabled=false;go.textContent='Lock in Bet';br.classList.remove('dis');bi.disabled=false}
go.onclick=()=>{if(busy)return;const bet=App.bet(el,'CASES',1);if(!bet)return;
busy=true;rd={bet,o:roll(),settled:false,finished:false};go.disabled=true;go.textContent='Opening…';br.classList.add('dis');bi.disabled=true;
rs.innerHTML=`Bet locked: <b>$${App.f(bet)}</b>. Opening case…`;build(rd.o);x0=center(REST);xT=center(WIN);
const t0=performance.now();(function f(now){const p=Math.min(1,(now-t0)/DUR),e=(1-Math.pow(1-p,3.5))*Math.min(1,p*8);sr.style.transform=`translate3d(${x0+(xT-x0)*e}px,0,0)`;if(p<1)raf=requestAnimationFrame(f)})(t0);
tm.push(setTimeout(finish,DUR))};
const rest=()=>{if(!busy)sr.style.transform=`translate3d(${center(REST)}px,0,0)`};addEventListener('resize',rest);
build();
return()=>{cancelAnimationFrame(raf);tm.forEach(clearTimeout);removeEventListener('resize',rest);if(busy)settleOnce()}}};
