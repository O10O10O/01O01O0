Games.crash={title:'CRASH',mount(el){
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<label>Auto cashout (x, optional)</label><input id="au" type="number" min="1.01" step="0.01" placeholder="e.g. 2.00"><button class="btn" id="go">Place bet</button><div class="hist" id="hs"></div></div><div class="stage"><div class="mult" id="mu">Next round…</div><canvas width="640" height="340"></canvas></div></div>`;
const cv=el.querySelector('canvas'),c=cv.getContext('2d'),mu=el.querySelector('#mu'),go=el.querySelector('#go'),hs=el.querySelector('#hs');
const stars=Array.from({length:70},()=>[Math.random()*640,Math.random()*340,Math.random()*1.6+.5]);let tip=[630,30],exp=0,ph='bet',t0=performance.now(),m=1,pt=1,placed=0,cashed=false,pts=[],hist=[],raf=0;
const newPt=()=>Math.min(1000,Math.max(1,.99/(1-Math.random())));
function btn(){go.textContent=ph==='bet'?(placed?'Bet placed':'Place bet'):ph==='run'&&placed&&!cashed?'Cash out':'Wait…';go.disabled=ph==='bet'?!!placed:!(ph==='run'&&placed&&!cashed)}
function cash(){if(!placed||cashed||ph!=='run')return;cashed=true;App.settle('CRASH',placed,placed*m);App.toast(`Cashed out at ${m.toFixed(2)}x: +$${App.f(placed*m-placed)}`);btn()}
function draw(now){const bg=c.createLinearGradient(0,0,0,340);bg.addColorStop(0,'#04060d');bg.addColorStop(1,'#0c1f3a');c.fillStyle=bg;c.fillRect(0,0,640,340);c.fillStyle='#fff';
stars.forEach((s,i)=>{c.globalAlpha=.35+.55*Math.abs(Math.sin(now/700*s[2]+i));c.fillRect(s[0],s[1],s[2],s[2])});c.globalAlpha=1;
const xm=Math.max(6,pts.length?pts[pts.length-1][0]:0),ym=Math.max(2,m);let px2=0,py2=0,ang=-.5;c.strokeStyle=ph==='crash'?'#ef4444':'#22c55e';c.lineWidth=4;c.beginPath();
pts.forEach(([t,v],i)=>{const x=t/xm*620+10,y=330-(Math.log(v)/Math.log(ym))*300;i?c.lineTo(x,y):c.moveTo(x,y);if(i===pts.length-1&&i>0)ang=Math.atan2(y-py2,x-px2);px2=x;py2=y;tip=[x,y]});c.stroke();
if(pts.length>1&&ph==='run'){c.save();c.translate(tip[0],tip[1]);c.rotate(ang);c.fillStyle='#fb923c';c.beginPath();c.moveTo(-14,0);c.lineTo(-30-Math.random()*10,-5);c.lineTo(-30-Math.random()*10,5);c.fill();
c.fillStyle='#ef4444';c.beginPath();c.moveTo(-8,-5);c.lineTo(-18,-15);c.lineTo(-2,-6);c.moveTo(-8,5);c.lineTo(-18,15);c.lineTo(-2,6);c.fill();
c.fillStyle='#e2e8f0';c.beginPath();c.ellipse(0,0,18,7,0,0,7);c.fill();c.fillStyle='#ef4444';c.beginPath();c.moveTo(10,-6);c.quadraticCurveTo(27,0,10,6);c.fill();c.fillStyle='#38bdf8';c.beginPath();c.arc(1,0,3,0,7);c.fill();c.restore()}}
function tick(now){const s=(now-t0)/1000;
if(ph==='bet'){const cd=5-s;mu.textContent=`Next round in ${Math.max(0,cd).toFixed(1)}s`;mu.style.color='#e2e8f0';if(cd<=0){ph='run';t0=now;pt=newPt();pts=[];cashed=false;m=1;btn()}}
else if(ph==='run'){m=Math.exp(.15*s);pts.push([s,m]);mu.textContent=m.toFixed(2)+'x';mu.style.color='#22c55e';const a=parseFloat(el.querySelector('#au').value);if(placed&&!cashed&&a>=1.01&&m>=a){m=a;cash()}
if(m>=pt){m=pt;ph='crash';mu.textContent='Crashed @ '+pt.toFixed(2)+'x';mu.style.color='#ef4444';hist.unshift(pt.toFixed(2)+'x');hs.textContent=hist.slice(0,8).join('  ');exp=1;if(placed&&!cashed){App.settle('CRASH',placed,0)}t0=now;btn()}}
else if(s>2.5){ph='bet';t0=now;placed=0;btn()}
draw(now);if(exp){exp=0;const k=cv.clientWidth/640;FX.boom(cv.parentNode,cv.offsetLeft+tip[0]*k,cv.offsetTop+tip[1]*k,true)}raf=requestAnimationFrame(tick)}
go.onclick=()=>{if(ph==='bet'&&!placed){const b=App.bet(el,'CRASH');if(b)placed=b}else cash();btn()};
btn();raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)}};
