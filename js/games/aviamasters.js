Games.aviamasters={title:'AVIAMASTERS',mount(el){
const ITEMS=[['·',45],['🚀',30],['+1',8],['+2',6],['+5',3],['+10',1],['×2',5],['×3',3],['×4',2],['×5',1]],STEPS=7;
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Launch plane</button><div class="hist">+n adds to the multiplier, ×n multiplies it. A rocket halves it and costs 1 altitude. Hit 0 altitude and you crash into the sea.</div></div><div class="stage"><div class="mult" id="mu">Ready</div><div id="inf"></div><div class="lanes" id="ln"></div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go');let dead=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pick=()=>{let r=Math.random()*ITEMS.reduce((a,b)=>a+b[1],0);for(const[i,w]of ITEMS){if((r-=w)<0)return i}return'·'};
function paint(pos,items,m,alt,bet){q('#ln').innerHTML=items.map((it,i)=>`<div class="lane${i===pos?' cur':''}"><small>${i<pos+1?it:'?'}</small><span>${i===pos?'✈️':i<pos?'☁️':'🌤️'}</span></div>`).join('');
q('#inf').textContent='Altitude: '+'❤️'.repeat(Math.max(alt,0))+' '+(alt<=0?'🌊':'');const mu=q('#mu');mu.textContent='$'+App.f(bet*m)+' ('+m.toFixed(2)+'x)';mu.style.color=m>=1?'#22c55e':'#ef4444'}
go.onclick=async()=>{const bet=App.bet(el,'AVIAMASTERS');if(!bet)return;go.disabled=true;let m=1,alt=3;const items=Array.from({length:STEPS},pick);paint(-1,items,m,alt,bet);
for(let i=0;i<STEPS;i++){await sleep(650);if(dead)return;const it=items[i];if(it==='🚀'){m/=2;alt--}else if(it[0]==='+')m+=+it.slice(1);else if(it[0]==='×')m*=+it.slice(1);
paint(i,items,m,alt,bet);if(alt<=0){await sleep(500);if(dead)return;App.settle('AVIAMASTERS',bet,0);q('#mu').textContent='Crashed into the sea';q('#mu').style.color='#ef4444';go.disabled=false;return}}
await sleep(500);if(dead)return;App.settle('AVIAMASTERS',bet,bet*m);App.toast(`Landed! ${m.toFixed(2)}x → $${App.f(bet*m)}`);go.disabled=false};
return()=>{dead=true}}};
