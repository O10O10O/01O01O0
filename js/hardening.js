/* v2.25 hardening. Loaded after main.js, before the pages/games.
   1) Freezes Math.random / crypto.getRandomValues / Date.now so a console one-liner such as  Math.random=()=>0  can no longer rig game outcomes.
   2) Math.random is now backed by the browser CSPRNG (game RNG is no longer the predictable V8 xorshift generator).
   3) Router only accepts real game/page routes (e.g. #constructor, #__proto__, #_tick used to throw and blank the page).
   4) Shows the "save reset / tampering detected" notice. */
(()=>{
try{const c=window.crypto,g=c.getRandomValues.bind(c),pool=new Uint32Array(128);let i=128;
Object.defineProperty(c,'getRandomValues',{value:a=>g(a),writable:false,configurable:false});
Object.defineProperty(Math,'random',{value:()=>{if(i>=128){g(pool);i=0}return pool[i++]/4294967296},writable:false,configurable:false});
const now=Date.now.bind(Date);Object.defineProperty(Date,'now',{value:()=>now(),writable:false,configurable:false})}catch(e){}
const isRoute=k=>[Games,Pages].some(o=>Object.prototype.hasOwnProperty.call(o,k)&&o[k]&&typeof o[k].mount==='function');
const route=App.route;
App.route=function(){const k=location.hash.slice(1);
if(k&&!isRoute(k)){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
if(Store.notice){const m=Store.notice;Store.notice='';setTimeout(()=>App.toast(m),400)}
return route.call(this)}})();
