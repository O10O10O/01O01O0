const Stats={
record(g,b,p){const s=Store.d.g[g]=Store.d.g[g]||{w:0,l:0,x:0};const n=Math.round((p-b)*100)/100;s.w+=b;
if(n>0){s.x+=n;Store.d.pw++;if(!Store.d.bw||n>Store.d.bw.v)Store.d.bw={v:n,g}}
else if(n<0){s.l-=n;Store.d.pl++;if(!Store.d.bl||-n>Store.d.bl.v)Store.d.bl={v:-n,g}}Store.save()},
top(k){let b='___',v=0;for(const g in Store.d.g)if(Store.d.g[g][k]>v){v=Store.d.g[g][k];b=g}return b},
html(){const d=Store.d,be=o=>o?`$${o.v.toFixed(2)} in ${o.g}`:'___';
return `<div>Lifetime mini-game round played: <b>${d.lq}</b></div><div>Most 01O0coin spent on: <b>${this.top('w')}</b></div><div>Most 01O0coin lost on: <b>${this.top('l')}</b></div><div>Most 01O0coin made on: <b>${this.top('x')}</b></div><div>Most 01O0coin made on one round: <b>${be(d.bw)}</b></div><div>Most 01O0coin lost in one round: <b>${be(d.bl)}</b></div>`}};
