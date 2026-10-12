Games.chicken={title:'CHICKEN',mount(el){
const P=[.94,.85,.74,.6],L=12;let on=false,n=0,bet=0,dead=false,K=1;
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<label>Difficulty</label><select id="df"><option value="0">Easy</option><option value="1" selected>Medium</option><option value="2">Hard</option><option value="3">Expert</option></select><button class="btn" id="go">Start</button><button class="btn dim" id="mv" disabled>Cross next lane</button><button class="btn alt" id="co" disabled>Cash out</button></div><div class="stage"><div class="mult" id="mu">1.00x</div><div class="lanes" id="ln"></div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go'),mv=q('#mv'),co=q('#co'),ln=q('#ln');
const mul=i=>.97/Math.pow(P[K],i);
function paint(){ln.innerHTML='';for(let i=0;i<=L;i++){const d=document.createElement('div');d.className='lane'+(i===n?' cur':'');d.innerHTML=`<small>${i?mul(i).toFixed(2)+'x':'Start'}</small><span>${dead&&i===n+1?'🚗💥':i===n?'🐔':i?'🛣️':'🏁'}</span>`;ln.appendChild(d)}
q('#mu').textContent=mul(n).toFixed(2)+'x';ln.children[Math.min(n,L)].scrollIntoView({inline:'center',block:'nearest'})}
function end(w){on=false;go.disabled=false;mv.disabled=co.disabled=true;if(w){App.settle('CHICKEN',bet,bet*mul(n));App.toast(`Cashed out ${mul(n).toFixed(2)}x`)}else{dead=true;App.settle('CHICKEN',bet,0);App.toast('Splat! Lost $'+App.f(bet))}paint()}
go.onclick=()=>{bet=App.bet(el,'CHICKEN');if(!bet)return;K=+q('#df').value;n=0;dead=false;on=true;go.disabled=true;mv.disabled=false;co.disabled=true;paint()};
mv.onclick=()=>{if(!on)return;if(Math.random()<P[K]){n++;co.disabled=false;if(n===L)end(true);else paint()}else end(false)};
co.onclick=()=>{if(on&&n)end(true)};paint()}};
