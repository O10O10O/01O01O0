const Games={};
const FX={boom(host,x,y,big){const f=document.createElement('div');f.className='fx';f.style.left=x+'px';f.style.top=y+'px';f.innerHTML='<div class="xr"></div><div class="xf"></div>';
const cols=['#fde047','#fb923c','#ef4444','#fff'];
for(let i=0;i<(big?22:14);i++){const p=document.createElement('div');p.className='xp';const a=Math.random()*6.28,d=30+Math.random()*(big?70:50);
p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',Math.sin(a)*d+'px');p.style.background=cols[i%4];f.appendChild(p)}
host.appendChild(f);setTimeout(()=>f.remove(),900)},
confetti(host,n){const w=host.clientWidth||600,cols=['#fde047','#4ade80','#60a5fa','#f472b6','#fb923c'];for(let i=0;i<(n||40);i++){const d=document.createElement('i');d.className='cfi';d.style.cssText=`left:${w/2}px;top:40%;background:${cols[i%5]};--dx:${(Math.random()-.5)*w*.8}px;--dy:${-80-Math.random()*160}px;--r:${Math.random()*720}deg;animation-delay:${Math.random()*.15}s`;host.appendChild(d);setTimeout(()=>d.remove(),1700)}}};
(()=>{const s=document.createElement('style');s.textContent=`
#toast{display:none}
#stk-toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,16px);background:#0d1b27;color:#fff;border:2px solid #9db8d2;border-radius:12px;padding:12px 24px;font:500 16px Montserrat,sans-serif;opacity:0;pointer-events:none;z-index:9999;white-space:nowrap}
#stk-toast.good{color:#4ade80;border-color:#22c55e}#stk-toast.bad{color:#f87171;border-color:#ef4444}
#stk-toast.show{animation:stkt 2.4s ease forwards}
@keyframes stkt{0%{opacity:0;transform:translate(-50%,16px)}12%{opacity:1;transform:translate(-50%,0)}80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-6px)}}
.stage{position:relative}.grid5{position:relative}.grid5.shake{animation:stks .45s}
@keyframes stks{20%{transform:translate(-5px,3px)}40%{transform:translate(5px,-3px)}60%{transform:translate(-4px,-2px)}80%{transform:translate(3px,2px)}}
.tl{aspect-ratio:1;perspective:400px;cursor:pointer;position:relative}
.fi{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .45s}.tl.flip .fi{transform:rotateY(180deg)}
.ff,.fb{position:absolute;inset:0;border-radius:10px;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;font-size:30px}
.ff{background:#334155;transition:background .15s}.tl:not(.flip):hover .ff{background:#475569}
.fb{transform:rotateY(180deg);background:#14532d}.fb.bomb{background:#7f1d1d}.tl.ghost{opacity:.5}
.fx{position:absolute;pointer-events:none;width:0;height:0;z-index:6}
.xr{position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;border:4px solid #fb923c;animation:xr .7s ease-out forwards}
@keyframes xr{to{transform:scale(7);opacity:0;border-width:1px}}
.xf{position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;background:#fde047;animation:xf .35s ease-out forwards}
@keyframes xf{to{transform:scale(4);opacity:0}}
.xp{position:absolute;left:-3px;top:-3px;width:7px;height:7px;border-radius:50%;animation:xp .8s ease-out forwards}
@keyframes xp{to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}
.cfi{position:absolute;width:8px;height:12px;z-index:8;pointer-events:none;animation:cfa 1.5s ease-out forwards}
@keyframes cfa{35%{transform:translate(calc(var(--dx)*.6),var(--dy)) rotate(calc(var(--r)*.5))}to{transform:translate(var(--dx),260px) rotate(var(--r));opacity:0}}
.play>*{min-width:0}`;document.head.appendChild(s)})();
const $=id=>document.getElementById(id);
const LIST=[['plinko','PLINKO'],['mines','MINES'],['crash','CRASH'],['chicken','CHICKEN'],['flip','FLIP'],['aviamasters','AVIAMASTERS'],['doubleornothing','DOUBLE OR NOTHING'],['blackjack','BLACKJACK'],['cases','CASES']];
const App={cur:null,live:null,
f:n=>(+n).toFixed(2),
toast(m){let t=$('stk-toast');if(!t){t=document.createElement('div');t.id='stk-toast';document.body.appendChild(t)}
t.textContent=m;t.className='';void t.offsetWidth;t.className='show '+(/lost|boom|splat|crash|not enough|enter a/i.test(m)?'bad':/cashed|landed|\+\$|saved/i.test(m)?'good':'')},
bal(){document.querySelectorAll('.bal').forEach(e=>e.textContent=this.f(Store.d.balance))},
betHTML(){return '<div class="betrow"><input class="bet" type="number" min="0.01" step="0.01" value="1"><button class="mini" data-m="0.5">½</button><button class="mini" data-m="2">2×</button></div>'},
bet(el,game,keep){if(!Store.d.user){this.route();return 0}
const v=Math.round(parseFloat(el.querySelector('.bet').value)*100)/100;
if(!(v>0)){this.toast('Enter a bet above 0');return 0}
if(v>Store.d.balance+1e-9){this.toast('Not enough Steakcoin');return 0}
Store.d.balance=Math.round((Store.d.balance-v)*100)/100;if(!keep)this.live={game,bet:v};Store.save();this.bal();return v},
settle(game,bet,pay){pay=Math.round(pay*100)/100;Store.d.balance=Math.round((Store.d.balance+pay)*100)/100;
if(this.live&&this.live.game===game&&this.live.bet===bet)this.live=null;Stats.record(game,bet,pay);this.bal()},
setUser(n){n=(n||'').trim().slice(0,16);if(!n)return false;Store.d.user=n;Store.save();return true},
mid(t){const m=$('mid');
if(t==='user'){m.innerHTML='<input id="un" placeholder="Set username…" maxlength="16">';const u=$('un');u.value=Store.d.user;u.onchange=()=>{if(this.setUser(u.value))this.toast('Username saved');else u.value=Store.d.user};u.onkeydown=e=>{if(e.key==='Enter')u.blur()}}
else if(t==='bal')m.innerHTML='<div class="pill">BALANCE: $<span class="bal"></span> SteakCoin</div>';else m.innerHTML=''},
route(){if(this.cur){this.cur();this.cur=null}
if(this.live){const l=this.live;this.live=null;this.settle(l.game,l.bet,0)}
if(!Store.d.user){this.welcome();return}
const g=Games[location.hash.slice(1)];
if(!g){this.home();return}
this.mid('bal');$('app').innerHTML=`<h2 class="gt">&lt; ${g.title} &gt;</h2><div class="frame" id="gm"></div>`;
this.cur=g.mount($('gm'))||null;this.bal()},
welcome(){this.mid('');$('app').innerHTML='<section class="welcome"><h1>Welcome to Steak 🔥</h1><input id="gu" placeholder="Type username here…" maxlength="16" autofocus><button id="gb" class="pillbtn">Continue…</button></section>';
const go=()=>{if(this.setUser($('gu').value)){location.hash='';this.route()}else this.toast('Type a username first')};
$('gb').onclick=go;$('gu').onkeydown=e=>{if(e.key==='Enter')go()}},
home(){this.mid('user');$('app').innerHTML=`<h2 class="sec">🔥 Steak Original Minigames ›</h2><div class="cards">${LIST.map(([k,n])=>`<a class="card c-${k}" href="#${k}" aria-label="${n}" title="${n}"></a>`).join('')}</div>
<h2 class="sec" style="margin-top:26px">💲 Your Balance ›</h2><div class="wallet"><div class="wtop"><img src="img/wallet.png" class="wi" alt="Wallet"><div><small>Current Balance:</small><div class="big2">$<span class="bal"></span> Steakcoin</div></div><div id="rsw"><button class="pillbtn" id="rs">Click to reset back to $10</button></div></div><div class="stats">${Stats.html()}</div></div>`;
const rsw=$('rsw'),ask=()=>{rsw.innerHTML='<button class="pillbtn" id="ry" style="border-color:#ef4444;color:#fca5a5">Are you sure?</button> <button class="pillbtn" id="rn">Cancel</button>';
$('ry').onclick=()=>{Store.reset();this.home();this.toast('Balance and stats reset')};
$('rn').onclick=()=>{rsw.innerHTML='<button class="pillbtn" id="rs">Click to reset back to $10</button>';$('rs').onclick=ask}};
$('rs').onclick=ask;this.bal()},
init(){document.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const i=b.parentElement.querySelector('.bet');i.value=Math.max(0.01,Math.floor(i.value*b.dataset.m*100)/100)});
addEventListener('hashchange',()=>this.route());this.route()}};
