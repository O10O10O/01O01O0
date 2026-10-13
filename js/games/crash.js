Games.crash={title:'CRASH',mount(el){
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<label>Auto cashout (x, optional)</label><input id="au" type="number" min="1.01" step="0.01" placeholder="e.g. 2.00"><button class="btn" id="go">Place bet</button><div class="hist" id="hs"></div></div><div class="stage"><div class="mult" id="mu">Next round…</div><canvas width="640" height="340"></canvas></div></div>`;
const cv=el.querySelector('canvas'),c=cv.getContext('2d'),mu=el.querySelector('#mu'),go=el.querySelector('#go'),hs=el.querySelector('#hs');
// ---- visual state only: none of this feeds back into the crash logic ----
const W=640,H=340,DPR=Math.min(2,window.devicePixelRatio||1),RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),rr=Math.random;
cv.width=W*DPR;cv.height=H*DPR;
const LAY=[{n:420,d:.15,s:[.4,.9],a:.45},{n:200,d:.4,s:[.8,1.5],a:.7},{n:70,d:.8,s:[1.4,2.4],a:1}].map(L=>({...L,st:Array.from({length:L.n},()=>[-W+rr()*3*W,-H+rr()*3*H,L.s[0]+rr()*(L.s[1]-L.s[0]),rr()*6.28])}));
const spr=document.createElement('canvas');spr.width=spr.height=64;{const g=spr.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.4,'rgba(255,255,255,.45)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}
let smoke=[],seed=.5,prevPh='bet',zl=0,rot=-.3,lastT=0;
function bez(p){const u=1-p,P1=[W*(.42+.12*seed),H*(.9-.06*seed)],P2=[W*(.74-.08*seed),H*(.62+.1*seed)],a=u*u*u,b=3*u*u*p,d=3*u*p*p,e=p*p*p;
return[a*40+b*P1[0]+d*P2[0]+e*W*.84+Math.sin(p*6+seed*6)*5*p,a*(H-38)+b*P1[1]+d*P2[1]+e*H*.16+Math.cos(p*5+seed*4)*3*p]}
let tip=[630,30],exp=0,ph='bet',t0=performance.now(),m=1,pt=1,placed=0,cashed=false,pts=[],hist=[],raf=0;
const newPt=()=>Math.min(1000,Math.max(1,.99/(1-Math.random())));
function btn(){go.textContent=ph==='bet'?(placed?'Bet placed':'Place bet'):ph==='run'&&placed&&!cashed?'Cash out':'Wait…';go.disabled=ph==='bet'?!!placed:!(ph==='run'&&placed&&!cashed)}
function cash(){if(!placed||cashed||ph!=='run')return;cashed=true;App.settle('CRASH',placed,placed*m);App.toast(`Cashed out at ${m.toFixed(2)}x: +$${App.f(placed*m-placed)}`);btn()}
function draw(now){const dt=Math.min(.05,Math.max(0,(now-lastT)/1000));lastT=now;
if(ph==='run'&&prevPh!=='run'){seed=rr();smoke=[];rot=-.3}prevPh=ph;
const run=ph==='run',crashed=ph==='crash',idle=ph==='bet';
zl+=((idle?0:Math.log(Math.max(1,m)))-zl)*Math.min(1,dt*(idle?2.5:6));const Z=RM?0:zl,p=idle?0:1-Math.pow(Math.max(1,m),-.5);
c.setTransform(DPR,0,0,DPR,0,0);
let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#02040a');g.addColorStop(.6,'#060d1f');g.addColorStop(1,'#0b1a35');c.fillStyle=g;c.fillRect(0,0,W,H);
const nb=(x,y,r,col)=>{const s=1/(1+.12*Z),X=W/2+(x-W/2)*s,Y=H/2+(y-H/2)*s,q=c.createRadialGradient(X,Y,0,X,Y,r*s);q.addColorStop(0,col);q.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=q;c.fillRect(0,0,W,H)};
nb(160,90,220,'rgba(88,60,160,.16)');nb(500,250,240,'rgba(30,90,170,.14)');
c.fillStyle='#fff';LAY.forEach(L=>{const s=1/(1+L.d*.4*Z),k=Math.sqrt(s);L.st.forEach(t=>{const x=W/2+(t[0]-W/2)*s,y=H/2+(t[1]-H/2)*s;if(x<-3||x>W+3||y<-3||y>H+3)return;c.globalAlpha=L.a*(RM?1:.6+.4*Math.sin(now/600+t[3]*3));c.fillRect(x,y,t[2]*k,t[2]*k)})});c.globalAlpha=1;
const a0=bez(Math.max(0,p-.006)),a1=bez(Math.max(p,.006)),tp=bez(p);tip=[tp[0],tp[1]];
rot+=(Math.atan2(a1[1]-a0[1],a1[0]-a0[0])-rot)*Math.min(1,dt*10);
const n=idle?0:Math.max(2,Math.ceil(p*60)),fade=crashed?Math.max(0,1-(now-t0)/2200):1;
if(n>=2&&fade>0){const q=[];for(let i=0;i<=n;i++)q.push(bez(p*i/n));const A=q[0],B=q[n];c.lineCap='round';c.lineJoin='round';c.beginPath();q.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));
let gr=c.createLinearGradient(A[0],A[1],B[0],B[1]);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(255,255,255,${.12*fade})`);c.strokeStyle=gr;c.lineWidth=10;c.stroke();
gr=c.createLinearGradient(A[0],A[1],B[0],B[1]);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(255,255,255,${.65*fade})`);c.save();c.shadowColor='rgba(180,215,255,.9)';c.shadowBlur=14;c.strokeStyle=gr;c.lineWidth=3;c.stroke();c.restore()}
if(run&&!RM){const d=[Math.cos(rot),Math.sin(rot)];for(let i=0;i<2;i++)smoke.push({x:tip[0]-d[0]*16+(rr()-.5)*4,y:tip[1]-d[1]*16+(rr()-.5)*4,vx:-d[0]*(14+rr()*20)+(rr()-.5)*22,vy:-d[1]*(14+rr()*20)+(rr()-.5)*22-4,l:0,r:4+rr()*3});if(smoke.length>150)smoke.splice(0,smoke.length-150)}
smoke.forEach(v=>{v.l+=dt;v.x+=v.vx*dt;v.y+=v.vy*dt;v.vx*=.985;v.vy*=.985});smoke=smoke.filter(v=>v.l<1.7);
smoke.forEach(v=>{const u=v.l/1.7,r=v.r+u*20;c.globalAlpha=.26*(1-u)*(1-u*.3);c.drawImage(spr,v.x-r,v.y-r,r*2,r*2)});c.globalAlpha=1;
if(!crashed){const jx=RM||idle?0:Math.sin(now/90)*.5,jy=RM||idle?0:Math.cos(now/110)*.5,fl=(idle?.35:1)*(RM?.8:.8+rr()*.5),L1=26*fl;c.save();c.translate(tip[0]+jx,tip[1]+jy);c.rotate(rot);c.scale(1.15,1.15);
c.globalCompositeOperation='lighter';const eg=c.createRadialGradient(-14,0,0,-14,0,22);eg.addColorStop(0,'rgba(255,220,140,.9)');eg.addColorStop(1,'rgba(255,120,40,0)');c.fillStyle=eg;c.beginPath();c.arc(-14,0,22,0,7);c.fill();c.globalCompositeOperation='source-over';
c.fillStyle='#fb923c';c.beginPath();c.moveTo(-13,-5);c.quadraticCurveTo(-13-L1,0,-13,5);c.fill();c.fillStyle='#fde68a';c.beginPath();c.moveTo(-13,-3);c.quadraticCurveTo(-13-L1*.55,0,-13,3);c.fill();
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
