Games.mines={title:'MINES',mount(el){
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<label>Mines</label><select id="mc">${Array.from({length:24},(_,i)=>`<option ${i==2?'selected':''}>${i+1}</option>`).join('')}</select><button class="btn" id="go">Bet</button><button class="btn alt" id="co" disabled>Cash out</button><div id="info"></div></div><div class="stage"><div class="grid5" id="gr"></div></div></div>`;
let on=false,mines=new Set,rev=new Set,bet=0,M=3;const gr=el.querySelector('#gr'),go=el.querySelector('#go'),co=el.querySelector('#co'),info=el.querySelector('#info');
const mul=d=>{let m=.97;for(let i=0;i<d;i++)m*=(25-i)/(25-M-i);return m};
function paint(all){gr.innerHTML='';for(let i=0;i<25;i++){const b=document.createElement('button'),r=rev.has(i),m=mines.has(i);b.className='tile'+(r?' ok':'')+(all&&m?(r?'':' bad'):'')+(all&&!r&&!m?' ghost':'');b.textContent=r?'💎':(all&&m?'💣':'');b.onclick=()=>pick(i);gr.appendChild(b)}
const d=rev.size;info.innerHTML=on?`Multiplier: <b>${mul(d).toFixed(2)}x</b><br>Next: ${mul(d+1).toFixed(2)}x<br>Cash out: $${App.f(bet*mul(d))}`:''}
function end(win){on=false;go.disabled=false;co.disabled=true;if(win){App.settle('MINES',bet,bet*mul(rev.size));App.toast(`Cashed out ${mul(rev.size).toFixed(2)}x`)}else{App.settle('MINES',bet,0);App.toast('Boom! Lost $'+App.f(bet))}paint(true)}
function pick(i){if(!on||rev.has(i))return;if(mines.has(i)){end(false);return}rev.add(i);co.disabled=false;if(rev.size===25-M)end(true);else paint()}
go.onclick=()=>{bet=App.bet(el,'MINES');if(!bet)return;M=+el.querySelector('#mc').value;mines=new Set;while(mines.size<M)mines.add(Math.floor(Math.random()*25));rev=new Set;on=true;go.disabled=true;co.disabled=true;paint()};
co.onclick=()=>{if(on&&rev.size)end(true)};paint();}};
