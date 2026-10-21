/* Guess the Cup: 3 cups, 1 ball. The winning cup is chosen (uniform 1/3) BEFORE any animation; the animation only moves cups. Win pays 2.5x TOTAL (stake included). */
const CUP_WIN_MULT=2.5,CUP_SHUFFLE_MS=[3500,5000],CUP_SWAP_MS=[80,130];   // very fast swaps (~8-12 per second): impossible to follow by eye
Games.guessthecup={title:'GUESS THE CUP',pick:()=>Math.floor(Econ.rnd()*3),mount(el){
if(!document.getElementById('stk-cup')){const s=document.createElement('style');s.id='stk-cup';s.textContent=`
.cups{position:relative;flex:1;min-height:360px;border-radius:14px;overflow:hidden;background:radial-gradient(ellipse at 50% -10%,#4a3470 0%,#1b1030 45%,#0b0614 100%)}
.cups::before{content:"";position:absolute;left:50%;top:0;width:70%;height:75%;transform:translateX(-50%);background:linear-gradient(#ffe9a855,transparent);clip-path:polygon(35% 0,65% 0,100% 100%,0 100%);pointer-events:none}
.cups .tbl{position:absolute;left:-5%;right:-5%;bottom:-8%;height:62%;border-radius:50% 50% 0 0/22% 22% 0 0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.035) 0 2px,transparent 2px 5px),radial-gradient(ellipse at 50% 20%,#8b3bd1,#4b167f 70%);box-shadow:inset 0 10px 30px #0008,0 -6px 0 #5a3a1c,0 -10px 18px #000a}
.cw{position:absolute;bottom:14%;width:22%;aspect-ratio:.82;transform:translateX(-50%);transition:left var(--sd,.35s) ease-in-out}.cw.front{z-index:3}.cw.back{z-index:1}
.cup{position:absolute;inset:0;transition:transform var(--sd,.35s) ease-in-out,filter .2s;clip-path:polygon(16% 0,84% 0,100% 100%,0 100%);background:linear-gradient(90deg,#8d0f12,#e0242a 35%,#ff5a55 50%,#c01a20 70%,#7a0c10);z-index:2}
.cup::after{content:"";position:absolute;left:16%;right:16%;top:0;height:7%;background:#ffb4ad;opacity:.55}
.cw.front .cup{transform:translateY(18%) scale(1.07)}.cw.back .cup{transform:translateY(-8%) scale(.94)}.cw.lift .cup{transform:translateY(-78%);transition:transform .5s}
.cw.can{cursor:pointer}.cw.can:hover .cup{filter:brightness(1.2);transform:translateY(-6%)}.cw .ball{position:absolute;left:50%;bottom:6%;width:22%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#ffd84a 55%,#b58900);box-shadow:0 4px 6px #0008;z-index:1}
.cw.win .cup{filter:drop-shadow(0 0 14px #7dff8a)}.cw.lose .cup{filter:drop-shadow(0 0 12px #ff5a5a)}.cstat{min-height:48px;margin-top:10px;font-weight:700}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Lock Bet</button><div class="hist">Find the ball! Three cups, one ball. A correct guess pays ${CUP_WIN_MULT}x your bet in total (stake included). Each cup has a 1-in-3 chance.</div></div><div class="stage" style="padding:10px"><div class="cups" id="cups"><div class="tbl"></div>${[0,1,2].map(i=>`<div class="cw" data-c="${i}" style="left:${[20,50,80][i]}%"><div class="ball" hidden></div><div class="cup" role="button" aria-label="Cup ${i+1}"></div></div>`).join('')}</div><div class="cstat" id="cs">Lock in a bet to start.</div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go'),cs=q('#cs'),cw=[...el.querySelectorAll('.cw')],T=[];const tm=(f,ms)=>{const h=setTimeout(f,ms);T.push(h);return h};
let phase='idle',rd=null,slot=[0,1,2];const LEFT=[20,50,80];
const place=()=>cw.forEach((c,i)=>c.style.left=LEFT[slot[i]]+'%');
function reset(){cw.forEach(c=>{c.className='cw';c.querySelector('.ball').hidden=true;c.style.removeProperty('--sd')});slot=[0,1,2];place()}
function settleOnce(win){if(!rd||rd.settled)return 0;rd.settled=true;return App.settle('GUESS THE CUP',rd.bet,win?rd.bet*CUP_WIN_MULT:0)}
function reveal(pick){phase='reveal';const win=pick===rd.ball;cw.forEach(c=>c.classList.remove('can'));cw[pick].querySelector('.ball').hidden=pick!==rd.ball;cw[pick].classList.add('lift',win?'win':'lose');
tm(()=>{cw.forEach((c,i)=>{c.querySelector('.ball').hidden=i!==rd.ball;if(i!==pick)c.classList.add('lift')})},900);
tm(()=>{const pay=settleOnce(win);cs.textContent=win?`You found the ball! Paid $${App.f(pay)} (+$${App.f(pay-rd.bet)} profit).`:`Wrong cup. The ball was under cup ${rd.ball+1}. Lost $${App.f(rd.bet)}.`;
App.toast(win?`Found it! +$${App.f(pay-rd.bet)} profit`:`Wrong cup! Lost $${App.f(rd.bet)}`);if(win)FX.confetti(q('#cups'),40);phase='idle';go.disabled=false;go.textContent='Lock Bet'},1700)}
function shuffle(){phase='shuffle';cs.textContent='Shuffling… watch the cups!';const D=CUP_SHUFFLE_MS[0]+Math.floor(Econ.rnd()*(CUP_SHUFFLE_MS[1]-CUP_SHUFFLE_MS[0]+1)),t0=performance.now();
const step=()=>{const e=performance.now()-t0;if(e>=D){cw.forEach(c=>c.classList.remove('front','back'));phase='pick';cs.textContent='Pick a cup!';cw.forEach(c=>c.classList.add('can'));return}
const dur=Math.round(CUP_SWAP_MS[1]-(CUP_SWAP_MS[1]-CUP_SWAP_MS[0])*Math.sin(Math.PI*e/D)),a=Math.floor(Math.random()*3);let b=Math.floor(Math.random()*3);if(b===a)b=(b+1)%3;
cw.forEach(c=>{c.classList.remove('front','back');c.style.setProperty('--sd',dur+'ms')});cw[a].classList.add('front');cw[b].classList.add('back');[slot[a],slot[b]]=[slot[b],slot[a]];place();tm(step,dur+8)};step()}
go.onclick=()=>{if(phase!=='idle')return;const bet=App.bet(el,'GUESS THE CUP');if(!bet)return;go.disabled=true;go.textContent='In round…';reset();
rd={bet,ball:Games.guessthecup.pick(),settled:false};phase='show';cs.textContent='Watch where the ball is…';cw[rd.ball].querySelector('.ball').hidden=false;cw[rd.ball].classList.add('lift');
tm(()=>{cw[rd.ball].classList.remove('lift');tm(()=>{cw[rd.ball].querySelector('.ball').hidden=true;shuffle()},550)},1100)};
cw.forEach((c,i)=>c.onclick=()=>{if(phase==='pick')reveal(i)});reset();
return()=>T.forEach(clearTimeout)}};
