const Stats={
record(g,b,p){const s=Store.d.g[g]=Store.d.g[g]||{w:0,l:0,x:0};const n=Math.round((p-b)*100)/100;s.w+=b;if(n>0){s.x+=n;Store.d.pw++}else if(n<0){s.l-=n;Store.d.pl++}Store.save()},
top(k){let b='—',v=0;for(const g in Store.d.g)if(Store.d.g[g][k]>v){v=Store.d.g[g][k];b=g}return b},
html(){const d=Store.d,n=Math.round((d.balance-10)*100)/100,f=x=>x.toFixed(2);
return `<div class="g">MADE +PROFIT: ${d.pw}</div><div class="r">MADE -PROFIT: ${d.pl}</div><div>Started with: $10 Steakcoin</div>
<div>Profit made: <span class="${n<0?'r':'g'}">${n<0?'(−)':'(+)'}$${f(Math.abs(n))} Steakcoin</span></div>
<div>Most Steakcoin spent on: <b>${this.top('w')}</b></div><div>Most Steakcoin lost on: <b>${this.top('l')}</b></div><div>Most Steakcoin made on: <b>${this.top('x')}</b></div>`}};
