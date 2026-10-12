const Games={};
const $=id=>document.getElementById(id);
const LIST = [
  ['plinko', 'PLINKO', '<img src="img/plinko.png" alt="PLINKO" class="card-img">'],
  ['mines', 'MINES', '<img src="img/mines.png" alt="MINES" class="card-img">'],
  ['crash', 'CRASH', '<img src="img/crash.png" alt="CRASH" class="card-img">'],
  ['chicken', 'CHICKEN', '<img src="img/chicken.png" alt="CHICKEN" class="card-img">'],
  ['flip', 'FLIP', '<img src="img/flip.png" alt="FLIP" class="card-img">'],
  ['aviamasters', 'AVIAMASTERS', '<img src="img/aviamasters.png" alt="AVIAMASTERS" class="card-img">']
];
const App={cur:null,live:null,
f:n=>(+n).toFixed(2),
toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(this.tt);this.tt=setTimeout(()=>t.classList.remove('on'),2200)},
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
home(){this.mid('user');$('app').innerHTML=`<h2 class="sec">🔥 Steak Originals ›</h2><div class="cards">${LIST.map(([k,n,art])=>`<a class="card c-${k}" href="#${k}">${art}<span class="nm">${n}</span></a>`).join('')}</div>
<h2 class="sec" style="margin-top:26px">💲 Your Balance ›</h2><div class="wallet"><div class="wtop"><img src="img/wallet.png" class="wi" alt="Wallet"><div><small>Current Balance:</small><div class="big2">$<span class="bal"></span> Steakcoin</div></div><button class="pillbtn" id="rs">Click to reset back to $10</button></div><div class="stats">${Stats.html()}</div></div>`;
$('rs').onclick=()=>{Store.reset();this.home()};this.bal()},
init(){document.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const i=b.parentElement.querySelector('.bet');i.value=Math.max(0.01,Math.floor(i.value*b.dataset.m*100)/100)});
addEventListener('hashchange',()=>this.route());this.route()}};
