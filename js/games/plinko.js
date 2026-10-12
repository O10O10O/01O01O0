(()=>{const MX={8:[5.6,13,29,50],9:[5.6,18,43,100],10:[8.9,22,76,201],11:[8.4,24,120,324],12:[10,33,170,619],13:[8.1,43,260,1012],14:[7.1,58,420,2369],15:[15,88,620,5000],16:[16,110,1000,10000]};
const mults=(r,k)=>{const mx=MX[r][k],mn=[.5,.4,.2,.2][k],h=r/2;return Array.from({length:r+1},(_,i)=>{const d=Math.abs(i-h)/h;return Math.round(mn*Math.pow(mx/mn,Math.pow(d,1.6))*10)/10})};
Games.plinko={title:'PLINKO',mount(el){
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<label>Risk</label><select id="rk"><option value="0">Easy</option><option value="1" selected>Medium</option><option value="2">Hard</option><option value="3">Expert</option></select><label>Rows: <span id="rv">12</span></label><input id="rw" type="range" min="8" max="16" value="12"><button class="btn" id="go">Drop ball</button></div><div class="stage"><canvas width="640" height="520"></canvas></div></div>`;
const cv=el.querySelector('canvas'),c=cv.getContext('2d'),W=640,rk=el.querySelector('#rk'),rw=el.querySelector('#rw');
let R=12,K=1,balls=[],raf=0;
const geo=()=>({sp:Math.min(46,(W-40)/(R+2)),dy:Math.min(34,380/(R+1)),top:40});
function draw(){const{sp,dy,top}=geo(),m=mults(R,K);c.clearRect(0,0,W,520);c.fillStyle='#cbd5e1';
for(let i=0;i<R;i++)for(let j=0;j<i+3;j++){c.beginPath();c.arc(W/2+(j-(i+2)/2)*sp,top+i*dy,3,0,7);c.fill()}
c.font='bold 11px sans-serif';c.textAlign='center';
m.forEach((v,i)=>{const x=W/2+(i-R/2)*sp,y=top+R*dy+22;c.fillStyle=`hsl(${120-Math.min(1,Math.log10(v+1)/2.5)*120} 70% 45%)`;c.fillRect(x-sp/2+2,y,sp-4,28);c.fillStyle='#fff';c.fillText(v+'x',x,y+18)});
c.fillStyle='#f472b6';balls.forEach(b=>{const i=Math.min(Math.floor(b.t),R-1),f=b.t-i,x=b.path[i]+(b.path[i+1]-b.path[i])*f;c.beginPath();c.arc(W/2+x*sp,top+(i+f)*dy-Math.sin(f*Math.PI)*10-8,7,0,7);c.fill()})}
function frame(){balls.forEach(b=>b.t+=.14);balls=balls.filter(b=>{if(b.t<R)return true;land(b);return false});draw();if(balls.length)raf=requestAnimationFrame(frame);else{rk.disabled=rw.disabled=false}}
function land(b){App.settle('PLINKO',b.bet,b.bet*b.mult);App.toast(`${b.mult}x → $${App.f(b.bet*b.mult)}`)}
rk.onchange=()=>{K=+rk.value;draw()};rw.oninput=()=>{R=+rw.value;el.querySelector('#rv').textContent=R;draw()};
el.querySelector('#go').onclick=()=>{const bet=App.bet(el,'PLINKO',1);if(!bet)return;let p=0;const path=[0];for(let i=0;i<R;i++){p+=Math.random()<.5?-.5:.5;path.push(p)}
const mult=mults(R,K)[Math.round(p+R/2)];rk.disabled=rw.disabled=true;const idle=!balls.length;balls.push({path,bet,mult,t:0});if(idle)raf=requestAnimationFrame(frame)};
draw();return()=>{cancelAnimationFrame(raf);balls.forEach(land)}}}})();
