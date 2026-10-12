Games.flip={title:'FLIP',mount(el){
let n=0,bet=0,busy=false;const mul=k=>.98*Math.pow(2,k);
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="h">Heads</button><button class="btn" id="t">Tails</button><button class="btn alt" id="co" disabled>Cash out</button><div class="hist">Each win doubles the multiplier (max 20 wins, ${mul(20).toLocaleString(undefined,{maximumFractionDigits:0})}x).</div></div><div class="stage"><div class="mult" id="mu">Pick a side</div><div id="coin">?</div></div></div>`;
const q=s=>el.querySelector(s),coin=q('#coin'),co=q('#co');let tm;
function cash(){App.settle('FLIP',bet,bet*mul(n));App.toast(`Cashed out ${mul(n).toLocaleString(undefined,{maximumFractionDigits:2})}x`);n=0;co.disabled=true;q('#mu').textContent='Pick a side'}
function flip(g){if(busy)return;if(n===0){bet=App.bet(el,'FLIP');if(!bet)return}busy=true;coin.classList.remove('spin');void coin.offsetWidth;coin.classList.add('spin');
tm=setTimeout(()=>{const r=Math.random()<.5?'H':'T';coin.textContent=r;busy=false;
if(r===g){n++;q('#mu').textContent=mul(n).toLocaleString(undefined,{maximumFractionDigits:2})+'x';co.disabled=false;if(n>=20)cash()}
else{App.settle('FLIP',bet,0);n=0;co.disabled=true;q('#mu').textContent='Lost $'+App.f(bet)}},700)}
q('#h').onclick=()=>flip('H');q('#t').onclick=()=>flip('T');co.onclick=()=>{if(!busy&&n)cash()};
return()=>clearTimeout(tm)}};
