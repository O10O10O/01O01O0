/* v2.25 loader. Fetches every game script and runs them inside ONE private function scope, so Store / Econ / App / Games are NOT reachable
   from the browser console (a pasted `Store.d.balance=1e9` now throws ReferenceError). Falls back to plain <script> tags if fetch is unavailable
   (e.g. opening index.html from file://), where the in-code integrity checks (signed saves + shadow ledger) still apply. */
(()=>{
try{if(window.top!==window.self){document.documentElement.innerHTML='';return}}catch(e){document.documentElement.innerHTML='';return}   // anti-clickjacking
const F=['config','cosmetics','cosfx','storage','stats','economy','main','hardening','ui','pages','games/plinko','games/mines','games/crash','games/chicken','games/flip','games/aviamasters','games/doubleornothing','games/blackjack','games/cases','games/guessthecup'].map(n=>'js/'+n+'.js');
const fallback=()=>{let i=0;const next=()=>{if(i>=F.length){Shell.init();App.init();return}const s=document.createElement('script');s.src=F[i++];s.onload=next;s.onerror=next;document.body.appendChild(s)};next()};
Promise.all(F.map(f=>fetch(f,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw new Error(f);return r.text()}))).then(a=>{
let run;try{run=new Function(a.join('\n;\n')+'\n;Shell.init();App.init();')}catch(e){console.error(e);return fallback()}
run()},fallback)})();
