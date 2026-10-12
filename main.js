const Games={};
const $=id=>document.getElementById(id);
const LIST=[['plinko','PLINKO','🪙<small>10000×</small>','linear-gradient(135deg,#7c3aed,#ec4899)'],['mines','MINES','💎💣','linear-gradient(135deg,#1d4ed8,#0ea5e9)'],['crash','CRASH','🚀','linear-gradient(135deg,#1d4ed8,#f97316)'],['chicken','CHICKEN','🐔','#2563eb'],['flip','FLIP','🪙','linear-gradient(135deg,#059669,#22c55e)'],['aviamasters','AVIAMASTERS','✈️','linear-gradient(180deg,#38bdf8,#2563eb)']];
const App={cur:null,live:null,
f:n=>(+n).toFixed(2),
toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(this.tt);this.tt=setTimeout(()=>t.classList.remove('on'),2200)},
bal(){document.querySelectorAll('.bal').forEach(e=>e.textContent=this.f(Store.d.balance))},
betHTML(){return '<div class="betrow"><input class="bet" type="number" min="0.01" step="0.01" value="1"><button class="mini" data-m="0.5">½</button><button class="mini" data-m="2">2×</button></div>'},
bet(el,game,keep){if(!Store.d.user){$('gate').style.display='flex';return 0}
const v=Math.round(parseFloat(el.querySelector('.bet').value)*100)/100;
if(!(v>0)){this.toast('Enter a bet above 0');return 0}
if(v>Store.d.balance+1e-9){this.toast('Not enough Steakcoin');return 0}
Store.d.balance=Math.round((Store.d.balance-v)*100)/100;if(!keep)this.live={game,bet:v};Store.save();this.bal();return v},
settle(game,bet,pay){pay=Math.round(pay*100)/100;Store.d.balance=Math.round((Store.d.balance+pay)*100)/100;
if(this.live&&this.live.game===game&&this.live.bet===bet)this.live=null;Stats.record(game,bet,pay);this.bal()},
setUser(n){n=(n||'').trim().slice(0,16);if(!n)return;Store.d.user=n;Store.save();$('un').value=n;$('gate').style.display='none'},
route(){if(this.cur){this.cur();this.cur=null}
if(this.live){const l=this.live;this.live=null;this.settle(l.game,l.bet,0)}
const k=location.hash.slice(1),g=Games[k];
if(!g){this.home();return}
const app=$('app');app.innerHTML=`<div class="gh"><a class="back" href="#">‹ Back</a><h2>${g.title}</h2><span>Balance: $<span class="bal"></span></span></div><div id="gm"></div>`;
this.cur=g.mount($('gm'))||null;this.bal()},
home(){$('app').innerHTML=`<h2 class="sec">🔥 Steak Originals ›</h2><div class="cards">${LIST.map(([k,n,ic,bg])=>`<a class="card" href="#${k}" style="background:${bg}"><span class="ic">${ic}</span>${n}</a>`).join('')}</div>
<h2 class="sec">Your Balance ›</h2><div class="wallet"><div class="wtop"><span class="wi">👛</span><div><small>Current Balance:</small><div class="big">$<span class="bal"></span> Steakcoin</div></div><button class="btn" id="rs">Click to reset back to $10</button></div><div class="stats" id="st">${Stats.html()}</div></div>`;
$('rs').onclick=()=>{Store.reset();this.home()};this.bal()},
init(){if(Store.d.user){$('un').value=Store.d.user;$('gate').style.display='none'}
$('gb').onclick=()=>this.setUser($('gu').value);$('gu').onkeydown=e=>{if(e.key==='Enter')this.setUser(e.target.value)};
$('un').onchange=e=>this.setUser(e.target.value);
document.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const i=b.parentElement.querySelector('.bet');i.value=Math.max(0.01,Math.floor(i.value*b.dataset.m*100)/100)});
addEventListener('hashchange',()=>this.route());this.route()}};
