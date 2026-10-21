/* Persistent state (localStorage). Client-side only: NOT secure against manipulation. */
const Store={key:'steak_v2',tpKey:'steak_v2_playtime',d:null,
def(){return{user:'',balance:CFG.UNRANKED_START,pw:0,pl:0,g:{},rk:0,rc:0,rq:0,lq:0,pt:{},bw:null,bl:null,dl:0,dr:null,dc:true,bx:0,ndp:false,cc:{Legendary:0,Mythic:0,Secret:0},gems:0,inv:[],eq:{tag:null,grad:null},shop:null,shopSalt:0,q:{dw:-1,ww:-1,d:Store.scope(null),w:Store.scope(null)}}},
num(v,fb){return typeof v==='number'&&isFinite(v)?v:fb},
int(v,fb=0){return Math.max(0,Math.floor(this.num(v,fb)))},
best(o){return o&&typeof o==='object'&&this.num(o.v,0)>0&&typeof o.g==='string'?{v:o.v,g:o.g}:null},
scope(o){const s={p:{rounds:0,profit:0,rank:0},c:{},n:{}};if(o&&typeof o==='object'){for(const k in s.p)s.p[k]=Math.max(0,this.num(o.p&&o.p[k],0));for(const k of['c','n'])if(o[k]&&typeof o[k]==='object')for(const id in o[k])if(o[k][id])s[k][id]=1}return s},
load(){let o=null;try{o=JSON.parse(localStorage.getItem(this.key))}catch(e){}
const d=this.def();
if(o&&typeof o==='object'){d.user=typeof o.user==='string'?o.user:'';d.balance=Math.round(this.num(o.balance,d.balance)*100)/100;d.pw=this.num(o.pw,0);d.pl=this.num(o.pl,0);
d.rk=Math.min(CFG.RANKS.length-1,this.int(o.rk));d.rc=Math.max(0,this.num(o.rc,0));d.rq=this.int(o.rq);d.lq=this.int(o.lq);d.gems=this.int(o.gems);
if(o.pt&&typeof o.pt==='object')for(const k in o.pt)d.pt[k]=this.int(o.pt[k]);
d.bw=this.best(o.bw);d.bl=this.best(o.bl);d.dl=this.num(o.dl,0);d.dc=o.dc!==false;d.bx=this.num(o.bx,0);d.ndp=o.ndp===true;if(o.cc&&typeof o.cc==='object')for(const k in d.cc)d.cc[k]=this.int(o.cc[k]);
if(o.dr&&typeof o.dr==='object'&&['low','gem','x2'].includes(o.dr.id))d.dr={id:o.dr.id,amount:this.int(o.dr.amount)};
if(Array.isArray(o.inv))d.inv=[...new Set(o.inv.filter(id=>Cos.by(id)))];
if(o.eq&&typeof o.eq==='object')for(const k of['tag','grad']){const c=Cos.by(o.eq[k]);if(c&&c.type===k&&d.inv.includes(c.id))d.eq[k]=c.id}
if(o.shop&&typeof o.shop==='object'&&Array.isArray(o.shop.offers)&&o.shop.offers.every(x=>Cos.by(x.id)))d.shop={id:this.num(o.shop.id,-1),salt:this.int(o.shop.salt),offers:o.shop.offers.map(x=>({id:x.id,deal:!!x.deal}))};
d.shopSalt=this.int(o.shopSalt);
if(o.q&&typeof o.q==='object'){d.q.dw=this.num(o.q.dw,-1);d.q.ww=this.num(o.q.ww,-1);d.q.d=this.scope(o.q.d);d.q.w=this.scope(o.q.w)}
if(o.g&&typeof o.g==='object')for(const k in o.g){const s=o.g[k]||{};d.g[k]={w:this.num(s.w,0),l:this.num(s.l,0),x:this.num(s.x,0)}}}
if(!d.q.d.p)d.q.d=this.scope(null);if(!d.q.w.p)d.q.w=this.scope(null);
this.d=d;return d},
save(){try{localStorage.setItem(this.key,JSON.stringify(this.d))}catch(e){}},
/* Total playtime (ms): kept under its own key so several open tabs never overwrite each other. Only visible tabs count, and a tab only adds time
   if no other tab has already counted the last second, so playtime ~= wall-clock time with the game open. */
playtime(){try{const o=JSON.parse(localStorage.getItem(this.tpKey));return{t:Math.max(0,this.num(o&&o.t,0)),l:this.num(o&&o.l,0)}}catch(e){return{t:0,l:0}}},
tickPlaytime(now=Date.now()){const p=this.playtime();if(typeof document!=='undefined'&&document.visibilityState==='hidden')return p.t;
const dt=now-p.l;if(dt>=900){p.t+=Math.min(dt,2500);p.l=now;try{localStorage.setItem(this.tpKey,JSON.stringify(p))}catch(e){}}return p.t}};
Store.load();
if(typeof addEventListener==='function')addEventListener('storage',e=>{if(e.key===Store.key){Store.load();if(typeof App!=='undefined'&&App.bal)App.bal()}}); // keep other tabs in sync
