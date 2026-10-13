(()=>{const N=8,DS=110,START=49,DRIFT=3,RDROP=8,BOOST=3,FUEL=5,PR=.38,M0=.1,D=(N+1)*DS;
const V=[['+',1,20],['+',2,5],['+',5,.8],['+',10,.15],['×',2,2.5],['×',3,1],['×',4,.3],['f',0,70]],TOT=V.reduce((a,b)=>a+b[2],0);
const pick=()=>{let r=Math.random()*TOT;for(const v of V)if((r-=v[2])<0)return v;return V[0]};
function plan(){let alt=START,m=M0,pts=[[0,2],[45,START]],ev=[];
for(let i=1;i<=N;i++){const d=i*DS,ab=alt-DRIFT;
if(ab<=0){const p=pts[pts.length-1],dc=p[0]+p[1]/(p[1]-ab)*(d-p[0]);pts.push([dc,0]);return{ev,pts,crash:true,dc,m}}
pts.push([d,ab]);const e={d,altB:ab};
if(Math.random()<PR){e.k='r';m/=2;alt=ab-RDROP}else{const v=pick();if(v[0]==='f'){e.k='f';alt=ab+FUEL}else{e.k='m';e.op=v[0];e.v=v[1];m=v[0]==='+'?m+v[1]:m*v[1];alt=ab+BOOST}}
e.m=m;ev.push(e);if(alt<=0){pts.push([d+20,0]);return{ev,pts,crash:true,dc:d+20,m}}pts.push([d+20,alt])}
alt-=DRIFT;if(alt<=0){pts.push([D,0]);return{ev,pts,crash:true,dc:D,m}}const mm=Math.min(m,250);pts.push([D,alt]);return{ev,pts,crash:false,m:mm,fall:Math.random()<(mm<2.5?.1:mm<5?.2:mm<7?.25:.3)}}
const altAt=(pts,x)=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(x<b[0])return a[1]+(b[1]-a[1])*Math.max(0,(x-a[0])/(b[0]-a[0]))}return pts[pts.length-1][1]};
Games.aviamasters={title:'AVIAMASTERS',plan,mount(el){
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Launch plane</button><div class="hist">Grab +n and ×2–×4 items to grow the multiplier; fuel cans lift the plane without adding any. Rockets halve it and knock the plane down. Land on the carrier to win (max 250x), but the plane can still slide off the runway. Hit the sea and you lose your bet.</div><div class="hist" id="lw">Last win: $0.00</div></div><div class="stage"><canvas width="800" height="420"></canvas></div></div>`;
const cv=el.querySelector('canvas'),c=cv.getContext('2d'),go=el.querySelector('#go'),lw=el.querySelector('#lw'),W=800,H=420,SEA=345,PX=3,PXX=230,f=a=>SEA-10-a*5.2,DECK=f(2);
let px=PXX,vy=0,tl=0,st='idle',dist=0,P=null,bet=0,idx=0,mHud=1,pops=[],parts=[],puffs=[],amb=[],shake=0,py=DECK,prevY=py,hold=0,raf=0,last=performance.now();
const stars=Array.from({length:70},()=>[Math.random()*W,Math.random()*250,Math.random()*1.4+.4]);
const clouds=Array.from({length:16},()=>({x:Math.random()*1100,y:30+Math.random()*230,s:.6+Math.random()*1.3,l:Math.random()<.5?.12:.3}));
const burst=(x,y,col,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,v=40+Math.random()*160;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:1,c:col})}};
function finish(win){const pay=win?bet*P.m:0,pr=pay-bet;App.settle('AVIAMASTERS',bet,pay);lw.textContent='Last win: $'+App.f(pay);
if(win){FX.confetti(cv.parentNode,40);App.toast(pr>=0?`Landed! +$${App.f(pr)} profit at ${P.m.toFixed(2)}x`:`Landed at ${P.m.toFixed(2)}x: lost $${App.f(-pr)}`)}
else App.toast(P.fall?'Fell off the runway! Lost $'+App.f(bet):'Crashed into the sea! Lost $'+App.f(bet));st='end';hold=0}
function update(dt){
if(Math.random()<.035)amb.push({x:W+30,y:40+Math.random()*270,v:90+Math.random()*130});amb.forEach(a=>a.x-=a.v*dt);amb=amb.filter(a=>a.x>-40);
if(st==='fly'){dist+=110*dt;py=f(altAt(P.pts,dist));
while(idx<P.ev.length&&P.ev[idx].d<=dist){const e=P.ev[idx++];mHud=e.m;if(e.k==='r'){shake=14;burst(PXX,py,'#fb923c',26);pops.push({t:'÷2',x:PXX,y:py-24,a:0,c:'#f87171'})}else pops.push({t:e.k==='f'?'FUEL':e.op+e.v,x:PXX,y:py-24,a:0,c:e.k==='f'?'#fbbf24':'#4ade80'})}
puffs.push({d:dist-8,y:py+2,a:1});
if(P.crash&&dist>=P.dc)st='crashing';else if(!P.crash&&dist>=D-30){st='landing';hold=0;tl=0}}
else if(st==='crashing'){dist+=70*dt;py+=320*dt;if(py>=SEA-6){burst(PXX,SEA-4,'#7dd3fc',30);shake=10;finish(false)}}
else if(st==='landing'){tl+=dt;const q=Math.min(1,tl/1.5),e2=1-(1-q)*(1-q);px=PXX+(P.fall?232:150)*e2;py+=(DECK-py)*Math.min(1,dt*7);if(q>=1){if(P.fall){st='falling';vy=0}else{hold+=dt;if(hold>.6)finish(true)}}}
else if(st==='falling'){vy+=700*dt;py+=vy*dt;px+=60*dt;if(py>=SEA-6){burst(px,SEA-4,'#fb923c',44);burst(px,SEA-4,'#fde047',26);burst(px,SEA-4,'#7dd3fc',20);shake=18;finish(false)}}
else if(st==='end'){hold+=dt;if(hold>2.2){st='idle';dist=0;P=null;px=PXX;py=DECK;puffs=[];mHud=1;go.disabled=false}}
parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.l-=dt*1.1});parts=parts.filter(p=>p.l>0);
pops.forEach(p=>{p.a+=dt*1.1;p.y-=30*dt});pops=pops.filter(p=>p.a<1);puffs.forEach(p=>p.a-=dt*.7);puffs=puffs.filter(p=>p.a>0)}
function missile(x,y){c.fillStyle='#fde047';c.beginPath();c.ellipse(x+22,y,9,3,0,0,7);c.fill();c.fillStyle='#ef4444';c.fillRect(x-16,y-3,36,6);c.fillStyle='#e2e8f0';c.beginPath();c.moveTo(x-16,y-3);c.lineTo(x-26,y);c.lineTo(x-16,y+3);c.fill();c.fillStyle='#b91c1c';c.fillRect(x+10,y-6,7,12)}
function plane(x,y,a){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#e11d2f';c.beginPath();c.ellipse(0,0,28,10,0,0,7);c.fill();c.beginPath();c.moveTo(-22,-4);c.lineTo(-38,-14);c.lineTo(-30,2);c.fill();c.fillStyle='#fbbf24';c.fillRect(-8,-1,22,3);c.fillStyle='#b4121f';c.beginPath();c.ellipse(-2,-2,13,5,-.3,0,7);c.fill();c.fillStyle='#1e3a5f';c.beginPath();c.arc(8,-7,5,0,7);c.fill();c.fillStyle='#ffffff88';c.beginPath();c.ellipse(30,0,2,12,0,0,7);c.fill();c.fillStyle='#111';c.beginPath();c.arc(2,11,3,0,7);c.fill();c.restore()}
function carrier(x){c.fillStyle='#16213a';c.fillRect(x-110,SEA-6,250,28);c.fillStyle='#2f3f5e';c.fillRect(x-110,SEA-12,250,8);c.fillStyle='#94a3b8';for(let i=0;i<9;i++)c.fillRect(x-100+i*27,SEA-9,14,2);c.fillStyle='#1f2d4a';c.fillRect(x+90,SEA-34,26,22);c.fillStyle='#fde047';c.fillRect(x+98,SEA-28,10,4)}
function draw(t){c.save();if(shake>0){c.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake--}
let g=c.createLinearGradient(0,0,0,SEA);g.addColorStop(0,'#030818');g.addColorStop(.55,'#0d2352');g.addColorStop(1,'#35609f');c.fillStyle=g;c.fillRect(-20,-20,W+40,H+40);
stars.forEach((s,i)=>{c.fillStyle=`rgba(255,255,255,${.35+.45*Math.abs(Math.sin(t*s[2]+i))})`;c.fillRect(s[0],s[1],s[2],s[2])});
const mg=c.createRadialGradient(690,80,4,690,80,80);mg.addColorStop(0,'#fff8dc');mg.addColorStop(.2,'#f5e9b8');mg.addColorStop(.21,'rgba(245,233,184,.22)');mg.addColorStop(1,'rgba(245,233,184,0)');c.fillStyle=mg;c.beginPath();c.arc(690,80,80,0,7);c.fill();
c.fillStyle='#ffffff14';c.font='900 40px Montserrat,sans-serif';c.textAlign='center';c.fillText('AVIAMASTERS',W/2,60);
clouds.forEach(k=>{const x=((k.x-dist*PX*k.l-t*10*k.l)%1100+1100)%1100-150;c.fillStyle=`rgba(175,200,240,${.07+k.l*.4})`;for(let j=0;j<6;j++){c.beginPath();c.ellipse(x+j*26*k.s,k.y+Math.sin(j*2.1)*9*k.s,42*k.s,(15+j%3*4)*k.s,0,0,7);c.fill()}});
c.fillStyle='#10294f';const o2=(dist*PX*.1)%700;for(let k=-1;k<3;k++){const x=k*700-o2;c.beginPath();c.moveTo(x,SEA);c.lineTo(x+180,SEA-90);c.lineTo(x+330,SEA-40);c.lineTo(x+470,SEA-110);c.lineTo(x+620,SEA);c.fill()}
c.fillStyle='#0b1c3d';const o=(dist*PX*.25)%520;for(let k=-1;k<3;k++){const x=k*520-o+120;c.beginPath();c.moveTo(x,SEA);c.quadraticCurveTo(x+90,SEA-70,x+200,SEA);c.fill();c.fillRect(x+90,SEA-80,3,18)}
g=c.createLinearGradient(0,SEA,0,H);g.addColorStop(0,'#0e2c58');g.addColorStop(1,'#050f24');c.fillStyle=g;c.fillRect(-20,SEA,W+40,H-SEA+20);
c.fillStyle='rgba(245,233,184,.13)';for(let r=0;r<7;r++)c.fillRect(690-22+r*2+Math.sin(t*2+r)*7,SEA+5+r*9,44-r*5,3);
c.strokeStyle='#3b82f655';c.lineWidth=2;for(let r=0;r<3;r++){c.beginPath();for(let x=0;x<=W;x+=20)c.lineTo(x,SEA+8+r*14+Math.sin(x*.03+t*2+r)*3);c.stroke()}
[0,250,500,750].forEach(d=>carrier(PXX+(d-dist)*PX));amb.forEach(a=>missile(a.x,a.y));if(P){const fx=PXX+(D-dist)*PX;carrier(fx);}

if(P)P.dec.forEach((e,i)=>{const x=PXX+(e.d-dist)*PX;if(x>-40&&x<W+40)missile(x,f(e.alt)+Math.sin(t*4+i*2)*2)});
if(P)P.ev.forEach((e,i)=>{if(i<idx)return;const x=PXX+(e.d-dist)*PX;if(x<-40||x>W+40)return;const y=f(e.altB)+Math.sin(t*4+i)*2;
if(e.k==='r')missile(x,y);else if(e.k==='f'){c.save();c.shadowColor='#fbbf24';c.shadowBlur=14;c.fillStyle='#ef4444';c.fillRect(x-11,y-12,22,26);c.fillStyle='#b91c1c';c.fillRect(x-8,y-18,10,6);c.fillStyle='#fde047';c.fillRect(x-6,y-3,12,9);c.restore()}else{c.save();c.shadowColor='#3b82f6';c.shadowBlur=16;c.fillStyle='#fff';c.font='900 30px Montserrat,sans-serif';c.fillText(e.op+e.v,x,y+10);c.restore()}});
puffs.forEach(p=>{c.fillStyle=`rgba(255,255,255,${p.a*.5})`;c.beginPath();c.arc(PXX+(p.d-dist)*PX,p.y,4+(1-p.a)*6,0,7);c.fill()});
const ang=st==='crashing'||st==='falling'?1.1:Math.max(-.5,Math.min(.5,(py-prevY)*.12));prevY=py;if(!(st==='end'&&P&&(P.crash||P.fall)))plane(px,py,ang);
parts.forEach(p=>{c.fillStyle=p.c;c.globalAlpha=Math.max(0,p.l);c.beginPath();c.arc(p.x,p.y,3,0,7);c.fill()});c.globalAlpha=1;
pops.forEach(p=>{c.globalAlpha=1-p.a;c.fillStyle=p.c;c.font='900 24px Montserrat,sans-serif';c.fillText(p.t,p.x,p.y);c.globalAlpha=1});
if(P&&st!=='idle'){c.fillStyle='#7dd3fc';c.font='bold 12px Montserrat,sans-serif';c.fillText('$'+App.f(bet*Math.min(mHud,250)),PXX,py-26)}
c.fillStyle='#0b1a33cc';c.beginPath();c.roundRect?c.roundRect(20,356,380,50,12):c.rect(20,356,380,50);c.fill();
const alt=P&&st==='fly'?altAt(P.pts,dist):0,bad=st==='end'&&P&&(P.crash||P.fall);c.textAlign='left';
[['ALTITUDE',alt.toFixed(1)+'m',40],['DISTANCE',Math.min(dist,D).toFixed(1)+'m',160],['MULTIPLIER','×'+Math.min(mHud,250).toFixed(1),285]].forEach(([l,v,x],i)=>{c.fillStyle='#94a3b8';c.font='bold 11px Montserrat,sans-serif';c.fillText(l,x,375);c.fillStyle=i===2?(bad?'#f87171':'#4ade80'):'#fff';c.font='bold 18px Montserrat,sans-serif';c.fillText(v,x,396)});
c.textAlign='center';if(st==='idle'){c.fillStyle='#e2e8f0';c.font='500 18px Montserrat,sans-serif';c.fillText('Set your bet and launch the plane',W/2,200)}
c.restore()}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);draw(now/1000);raf=requestAnimationFrame(loop)}
go.onclick=()=>{if(st!=='idle')return;bet=App.bet(el,'AVIAMASTERS');if(!bet)return;P=plan();P.dec=Array.from({length:6},()=>{const d=70+Math.random()*(D-130),a=altAt(P.pts,d),up=a<30||(a<55&&Math.random()<.5);return{d,alt:up?a+11+Math.random()*9:a-11-Math.random()*9}});idx=0;dist=0;mHud=M0;go.disabled=true;st='fly'};
raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)}};})();
