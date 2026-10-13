const Store={key:'steak_v1.1',d:null,
def(){return{user:'',balance:10,pw:0,pl:0,g:{}}},
num(v,fb){return typeof v==='number'&&isFinite(v)?v:fb},
load(){let o=null;try{o=JSON.parse(localStorage.getItem(this.key))}catch(e){}
const d=this.def();
if(o&&typeof o==='object'){d.user=typeof o.user==='string'?o.user:'';d.balance=Math.round(this.num(o.balance,10)*100)/100;d.pw=this.num(o.pw,0);d.pl=this.num(o.pl,0);
if(o.g&&typeof o.g==='object')for(const k in o.g){const s=o.g[k]||{};d.g[k]={w:this.num(s.w,0),l:this.num(s.l,0),x:this.num(s.x,0)}}}
this.d=d;return d},
save(){try{localStorage.setItem(this.key,JSON.stringify(this.d))}catch(e){}},
reset(){const u=this.d.user;this.d=this.def();this.d.user=u;this.save()}};
Store.load();
