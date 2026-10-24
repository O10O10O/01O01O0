Games.lockpick={title:'LOCKPICK',mount(el){
if(!document.getElementById('stk-lp')){const s=document.createElement('style');s.id='stk-lp';s.textContent=`.lpi{position:absolute;left:16px;bottom:12px;text-align:left;font-size:15px;line-height:1.5}canvas.shk{animation:shkc .45s}@keyframes shkc{20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(5px)}}.dis{opacity:.4;pointer-events:none}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Bet</button><button class="btn alt" id="co" disabled>Cash out</button><p style="font-size:14px;line-height:1.5;color:#e2e8f0">Risky, timing-based game, the red line rotates across the circle, time it perfectly into the green to add the multiplier by 0.5. Mistime it and you lose the amount that you bet!<br><br>Click the lock or press Space to pick.</p></div><div class="stage" style="min-height:480px;display:flex;justify-content:center"><canvas width="560" height="440" style="cursor:pointer;max-width:100%"></canvas><div class="lpi" id="li"></div></div></div>`;
const q=s=>el.querySelector(s),cv=q('canvas'),c=cv.getContext('2d'),go=q('#go'),co=q('#co'),br=q('.betrow'),stage=q('.stage'),CX=280,CY=250,R=112,BASE=1.9,TAU=Math.PI*2;
let run=false,n=0,mult=1,th=-.8,g=2.4,sp=1,bet=0,flash=0,open=0,cashed=false,last=performance.now(),raf=0,tm=[];const T=(f,ms)=>tm.push(setTimeout(f,ms));
const fm=v=>+v.toFixed(1),spd=k=>+Math.pow(1.5,k).toFixed(2);
function upd(){q('#li').innerHTML=`Multiplier: <b>${fm(mult)}x</b><br>Next: <b>${fm(mult+.5)}x</b><br>Cash out: <b>${run&&n?'$'+App.f(bet*mult):'$__'}</b><br>Current speed: <b>${spd(n)}x</b><br>Next speed: <b>${spd(n+1)}x</b>`}
function reset(){run=false;cashed=false;n=0;mult=1;sp=1;th=-.8;g=2.4;flash=0;go.disabled=false;co.disabled=true;br.classList.remove('dis');upd()}
function pick(){if(!run)return;const d=Math.abs((((th-g+Math.PI)%TAU)+TAU)%TAU-Math.PI);
if(d<=.26){n++;mult=1+n*.5;sp=Math.pow(1.5,n);g=th+1.5+Math.random()*3;flash=1;co.disabled=false;upd()}
else{run=false;flash=-1;App.settle('LOCKPICK',bet,0);App.toast('Missed! Lost $'+App.f(bet));cv.classList.remove('shk');void cv.offsetWidth;cv.classList.add('shk');co.disabled=true;T(reset,1500)}}
go.onclick=()=>{if(run||cashed)return;bet=App.bet(el,'LOCKPICK');if(!bet)return;run=true;n=0;mult=1;sp=1;open=0;g=th+2+Math.random()*3;go.disabled=true;co.disabled=true;br.classList.add('dis');upd()};
co.onclick=()=>{if(!run||n<1)return;run=false;cashed=true;const w=bet*mult;App.settle('LOCKPICK',bet,w);App.toast(`Cashed out ${fm(mult)}x: +$${App.f(w-bet)}`);FX.confetti(stage,30);co.disabled=true;T(reset,1700)};
cv.onclick=pick;const key=e=>{if(e.code==='Space'){e.preventDefault();pick()}};addEventListener('keydown',key);
function draw(){c.clearRect(0,0,560,440);c.lineCap='butt';c.strokeStyle='#3a3a3a';c.lineWidth=30;c.beginPath();c.moveTo(CX-72,CY-60-open*34);c.lineTo(CX-72,CY-110-open*34);c.arc(CX,CY-110-open*34,72,Math.PI,0);c.lineTo(CX+72,CY-60-open*34);c.stroke();
c.lineWidth=42;c.strokeStyle=flash<0?'#fca5a5':'#d4d4d4';c.beginPath();c.arc(CX,CY,R,0,TAU);c.stroke();
c.save();c.lineCap='round';c.strokeStyle='#22c55e';if(flash>0){c.shadowColor='#4ade80';c.shadowBlur=24*flash}c.beginPath();c.arc(CX,CY,R,g-.22,g+.22);c.stroke();c.restore();
c.strokeStyle='#ef4444';c.lineWidth=3;c.beginPath();c.moveTo(CX+(R-26)*Math.cos(th),CY+(R-26)*Math.sin(th));c.lineTo(CX+(R+26)*Math.cos(th),CY+(R+26)*Math.sin(th));c.stroke();
c.fillStyle='#fff';c.font='500 78px Montserrat,sans-serif';c.textAlign='center';c.fillText('x'+fm(mult),CX,CY+27)}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(run)th+=BASE*sp*dt;flash+=(0-flash)*Math.min(1,dt*4);open+=((cashed?1:0)-open)*Math.min(1,dt*6);draw();raf=requestAnimationFrame(loop)}
upd();raf=requestAnimationFrame(loop);
return()=>{cancelAnimationFrame(raf);removeEventListener('keydown',key);tm.forEach(clearTimeout)}}};
