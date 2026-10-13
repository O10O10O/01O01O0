Games.doubleornothing={title:'DOUBLE OR NOTHING',mount(el){
if(!document.getElementById('stk-don')){const s=document.createElement('style');s.id='stk-don';s.textContent=`
.coinw{perspective:900px;width:clamp(180px,34vmin,340px);height:clamp(180px,34vmin,340px)}.coinw.hop{animation:hpc 1.8s}@keyframes hpc{45%{transform:translateY(-80px)}}
.coin{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 1.8s cubic-bezier(.2,.7,.25,1)}
.cface{position:absolute;inset:0;border-radius:50%;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;font-size:clamp(60px,12vmin,120px);font-weight:900;box-shadow:inset 0 0 0 16px var(--r1),inset 0 0 0 22px var(--r2),0 12px 0 var(--ed)}
.cg{--r1:#3fd773;--r2:#8cf0b3;--ed:#16a34a;background:radial-gradient(circle at 35% 30%,#c4f8d6,#7ceaa3 70%);color:#22c55e}
.cr{--r1:#ef4444;--r2:#fca5a5;--ed:#b91c1c;background:radial-gradient(circle at 35% 30%,#fecaca,#f87171 70%);color:#dc2626;transform:rotateY(180deg)}`;document.head.appendChild(s)}
el.innerHTML=`<div class="play"><div class="side"><label>Bet</label>${App.betHTML()}<button class="btn" id="go">Bet</button><p style="font-size:15px;line-height:1.5;color:#e2e8f0">Double your bet or lose it all?<br><br>Test your luck, a 49% chance to double, but a 51% chance to lose your Steakcoin bet!</p></div><div class="stage" style="display:flex;align-items:center;justify-content:center"><div class="coinw" id="cw"><div class="coin" id="cn"><div class="cface cg">X2</div><div class="cface cr">X</div></div></div></div></div>`;
const q=s=>el.querySelector(s),go=q('#go'),cn=q('#cn'),cw=q('#cw'),stage=q('.stage');let rot=0,busy=false,tm;
go.onclick=()=>{if(busy)return;const bet=App.bet(el,'DOUBLE OR NOTHING');if(!bet)return;busy=true;go.disabled=true;const win=Math.random()<.49;
rot=Math.ceil(rot/360)*360+1800+(win?0:180);cw.classList.remove('hop');void cw.offsetWidth;cw.classList.add('hop');cn.style.transform=`rotateY(${rot}deg)`;
tm=setTimeout(()=>{App.settle('DOUBLE OR NOTHING',bet,win?bet*2:0);if(win){FX.confetti(stage,50);App.toast(`X2! +$${App.f(bet)} profit`)}else App.toast(`X! Lost $${App.f(bet)}`);busy=false;go.disabled=false},1850)};
return()=>clearTimeout(tm)}};
