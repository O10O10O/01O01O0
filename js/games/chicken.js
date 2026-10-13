Games.chicken={title:'CHICKEN',mount(el){
const P=[.94,.85,.74,.6],L=12,LW=110;
if(!document.getElementById('stk-chk')){const s=document.createElement('style');s.id='stk-chk';s.textContent=`
.wr{overflow-x:auto;border-radius:12px;background:#0f2230}.rd{position:relative;height:310px}
.rl{position:absolute;top:0;bottom:0;width:${LW}px;border-left:3px dashed #1e3347;overflow:hidden}
.rl.st{border:0}.rl.st::after{content:"";position:absolute;left:18px;right:18px;top:150px;height:112px;background:repeating-linear-gradient(180deg,#33506a 0 14px,transparent 14px 27px);border-radius:6px}
.ph{position:absolute;left:20px;top:168px;width:70px;height:42px}
.gr{width:100%;height:100%;border-radius:50%;border:3px solid #3a566f;background:radial-gradient(#0b1721 30%,transparent 32%),repeating-linear-gradient(90deg,#1d3346 0 6px,#2d475f 6px 9px)}
.ph svg{position:absolute;left:-25px;top:-19px;width:120px;height:80px;fill:none;stroke:#cbd5e1;stroke-width:3;stroke-linecap:round;stroke-dasharray:260;stroke-dashoffset:260;pointer-events:none}
.ph.crack .gr{animation:pk .5s forwards}.ph.crack svg{animation:dr .4s forwards}
@keyframes pk{30%{transform:scale(1.12) rotate(-3deg)}to{transform:scale(1.35);background:#02060a;border-color:#64748b}}@keyframes dr{to{stroke-dashoffset:0}}
.cpl{position:absolute;top:238px;left:50%;transform:translateX(-50%);background:#2a4259;color:#e2e8f0;border-radius:10px;padding:4px 14px;font-weight:700;font-size:14px;transition:background .2s}
.rl.ok .cpl{background:#16a34a}.rl.would .cpl{background:#a16207}.rl.bad .cpl{background:#b91c1c}.rl.ok .gr{border-color:#22c55e}
.car{position:absolute;left:29px;top:-110px;width:52px;height:96px;border-radius:26px 26px 16px 16px;z-index:4;animation:cp .8s linear forwards;box-shadow:0 8px 12px #0008}
.car::before{content:"";position:absolute;left:8px;right:8px;top:30px;height:24px;border-radius:12px;background:#bfdbfe99}
@keyframes cp{to{top:330px}}
#ck{position:absolute;top:128px;left:25px;z-index:3;font-size:58px;line-height:1;transition:left .35s ease-in-out}
.cf{transform:scaleX(-1)}.ca{display:block}
.ca.hop{animation:hp .35s}@keyframes hp{50%{transform:translateY(-55px) rotate(-12deg)}}
.ca.hit{animation:ht .5s forwards}@keyframes ht{to{transform:scaleY(.15) translateY(300px);opacity:.8}}
.ca.fall{animation:fa .5s forwards}@keyframes fa{to{transform:scale(0) rotate(180deg);opacity:0}}
.ca.cheer{animation:ch .7s}@keyframes ch{25%,75%{transform:translateY(-30px)}50%,100%{transform:none}}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Amount</label>${App.betHTML()}<label>Difficulty</label><select id="df"><option value="0">Easy</option><option value="1">Medium</option><option value="2" selected>Hard</option><option value="3">Expert</option></select><button class="btn" id="pl">Play</button><button class="btn dim" id="mv" disabled>Go</button><button class="btn alt" id="co" disabled>Cash out</button><label id="ng">Total net gain (1.00x)</label><input id="nv" readonly value="0.00"><div class="hist" id="wi"></div></div><div class="stage"><div class="wr" id="wr"><div class="rd" id="rd" style="width:${(L+1)*LW}px"><div id="ck"><div class="cf"><div class="ca">🐔</div></div></div></div></div></div></div>`;
const q=s=>el.querySelector(s),pl=q('#pl'),mv=q('#mv'),co=q('#co'),wr=q('#wr'),rd=q('#rd'),ck=q('#ck'),ca=ck.querySelector('.ca');
let on=false,busy=false,n=0,bet=0,K=2,tm=[],lanes=[],fate=[];
const mul=i=>i?.97/Math.pow(P[K],i):1,T=(f,ms)=>tm.push(setTimeout(f,ms)),place=i=>ck.style.left=(i*LW+LW/2-32)+'px';
function build(){lanes.forEach(x=>x.remove());lanes=[];for(let i=0;i<=L;i++){const d=document.createElement('div');d.className='rl'+(i?'':' st');d.style.left=i*LW+'px';
if(i)d.innerHTML=`<div class="ph"><div class="gr"></div><svg viewBox="0 0 120 80"><path d="M60 40L50 26L58 18L46 4M60 40L75 30L70 20L86 6M60 40L52 56L62 64L48 78M60 40L76 54L72 66L88 76"/></svg></div><div class="cpl">${mul(i).toFixed(2)}x</div>`;rd.insertBefore(d,ck);lanes.push(d)}}
function upd(){q('#ng').textContent=`Total net gain (${mul(n).toFixed(2)}x)`;q('#nv').value=App.f(bet*mul(n)-bet)}
function car(i){const d=document.createElement('div');d.className='car';d.style.background=['#2563eb','#ef4444','#f59e0b','#8b5cf6','#10b981'][Math.random()*5|0];lanes[i].appendChild(d);T(()=>d.remove(),950)}
function hop(i){ca.className='ca hop';place(i);T(()=>ca.className='ca',350);wr.scrollTo({left:Math.max(0,i*LW-LW*1.5),behavior:'smooth'})}
function end(){on=false;busy=false;pl.disabled=false;mv.disabled=co.disabled=true}
function lose(t){let k=t;while(k<L&&fate[k+1])k++;for(let j=t+1;j<=k;j++)lanes[j].classList.add('would');const x=mul(k);q('#wi').innerHTML=k===t?'You would have been stopped here anyway.':`If you'd kept going you'd have crossed ${k-t} more lane${k-t>1?'s':''} and reached <b>${x.toFixed(2)}x</b> ($${App.f(bet*x)}).`;lanes[t].classList.add('bad');App.settle('CHICKEN',bet,0);App.toast('Splat! Lost $'+App.f(bet));end()}
function cash(){if(!on||busy||!n)return;const w=bet*mul(n);App.settle('CHICKEN',bet,w);App.toast(`Cashed out ${mul(n).toFixed(2)}x: +$${App.f(w-bet)}`);ca.className='ca cheer';let k=n;while(k<L&&fate[k+1])k++;for(let j=n+1;j<=k;j++)lanes[j].classList.add('would');if(k<L)lanes[k+1].classList.add('bad');q('#wi').innerHTML=k===n?(n===L?'You cleared every lane!':'Great timing! The next lane would have been fatal.'):`You could have gone <b>${k-n} more lane${k-n>1?'s':''}</b> to reach <b>${mul(k).toFixed(2)}x</b> ($${App.f(bet*mul(k))}).`;end()}
pl.onclick=()=>{if(on)return;const b=App.bet(el,'CHICKEN');if(!b)return;bet=b;K=+q('#df').value;tm.forEach(clearTimeout);tm=[];ca.className='ca';build();place(0);wr.scrollLeft=0;n=0;fate=Array.from({length:L+1},()=>Math.random()<P[K]);q('#wi').textContent='';on=true;busy=false;pl.disabled=true;mv.disabled=false;co.disabled=true;upd()};
q('#df').onchange=()=>{if(!on){K=+q('#df').value;build()}};
mv.onclick=()=>{if(!on||busy)return;busy=true;const t=n+1,ok=fate[t];hop(t);
if(ok){let r=0,g=0;do{r=1+Math.random()*L|0}while((r===t||r===n)&&++g<20);if(r!==t&&r!==n)car(r);
T(()=>{n=t;lanes[t].classList.add('ok');co.disabled=false;upd();busy=false;if(n===L)cash()},380)}
else if(Math.random()<.5){car(t);T(()=>{ca.className='ca hit';FX.boom(rd,t*LW+LW/2,170,false);lose(t)},520)}
else{T(()=>{lanes[t].querySelector('.ph').classList.add('crack');ca.className='ca fall';FX.boom(rd,t*LW+LW/2,190,true)},380);T(()=>lose(t),900)}};
co.onclick=cash;
const amb=setInterval(()=>{if(busy||!lanes.length)return;const r=1+Math.random()*L|0;if(r!==n)car(r)},1500);
build();place(0);
return()=>{clearInterval(amb);tm.forEach(clearTimeout)}}};
