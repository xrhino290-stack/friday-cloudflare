/* economics */
const R=n=>(n<0?'-':'')+'₹'+Math.round(Math.abs(n)).toLocaleString('en-IN');
const gv=id=>+$(id).value||0;
function emi(P,r,n){if(!P||!n)return 0;const i=r/1200;return i?P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1):P/n}
function sim(o,k){const E=o.inv-o.loan,pay=emi(o.loan,o.rate,o.ten);let cum=-E,rows=[],pb=null,be=null,mn=cum;
for(let m=1;m<=24;m++){const u=Math.min(o.cap,o.u1*k*Math.pow(1+o.gr/100,m-1));const pr=(o.p-o.v)*u-o.fx-o.ow-(m<=o.ten?pay:0);cum+=pr;rows.push({m,u,pr,cum});if(be===null&&pr>=0)be=m;if(pb===null&&cum>=0)pb=m;mn=Math.min(mn,cum)}
return{rows,pb,be,mn,pay,E}}
const pbT=s=>s.pb?s.pb+' mahine':'24 mahine mein nahi';
function eco(){const o={inv:gv('e1'),fx:gv('e2'),p:gv('e3'),v:gv('e4'),u1:gv('e5'),gr:gv('e6'),cap:gv('e7')||1e9,ow:gv('e8'),loan:gv('e9'),rate:gv('e10'),ten:gv('e11')};o.loan=Math.min(o.loan,o.inv);
const cm=o.p-o.v,B=sim(o,1),P=sim(o,.6),O=sim(o,1.4);
if(cm<=0){$('eout').innerHTML='<div class="bad">Price cost se kam ya barabar hai. Har bikri pe nuksan hoga. Price badhao ya cost ghatao.</div>';$('echart').innerHTML='';return 'Price cost se kam hai, ye business nahi chalega.'}
const bep=(o.fx+o.ow+B.pay)/cm,m6=B.rows[5].u,mos=(m6-bep)/m6*100;
let v,c;if(B.pb&&B.pb<=12&&P.pb&&P.pb<=24){v='GO: numbers majboot hain';c='ok'}else if(B.pb&&B.pb<=24){v='CAREFUL: chalega, par risk hai';c='k'}else{v='ABHI NAHI: plan badlo';c='bad'}
const st=(n,f,k)=>{const q={...o};f(q);return n+': '+pbT(sim(q,k))};
let h=`<div style="font-size:17px" class="${c}"><b>${v}</b></div>
<div>Margin/unit: <span class="k">${R(cm)}</span> (${(cm/o.p*100).toFixed(0)}%)${o.loan?` | Loan EMI: <span class="k">${R(B.pay)}</span>`:''}</div>
<div>Break-even: <span class="k">${Math.ceil(bep)} units/mahina</span> (${R(bep*o.p)} sales). Mahina 6 mein safety margin: <span class="${mos>=0?'ok':'bad'}">${mos.toFixed(0)}%</span></div>
<div>Pehla profitable mahina: <span class="k">${B.be||'24 tak nahi'}</span> | Paisa wapas (payback): <span class="k">${pbT(B)}</span></div>
<div>12 mahine ka cash: <span class="${B.rows[11].cum>=0?'ok':'bad'}">${R(B.rows[11].cum)}</span> | 24 mahine: <span class="${B.rows[23].cum>=0?'ok':'bad'}">${R(B.rows[23].cum)}</span></div>
<div style="margin-top:6px">Kam se kam cash jo chahiye: <span class="k">${R(-B.mn)}</span>. Bura waqt (sales 40% kam) mein: <span class="bad">${R(-P.mn)}</span>. Itna backup rakho.</div>
<h4 style="margin:12px 0 4px;color:var(--cy)">Agar aisa hua to? (payback)</h4>
<div>${st('Sales 20% kam',()=>{},.8)}</div><div>${st('Price 10% kam',q=>q.p*=.9,1)}</div><div>${st('Cost 10% zyada',q=>q.v*=1.1,1)}</div><div>${st('Fixed cost 20% zyada',q=>q.fx*=1.2,1)}</div>
<div style="margin-top:6px;color:var(--mut)">Bura (60%): ${pbT(P)} | Base: ${pbT(B)} | Acha (140%): ${pbT(O)}</div>`;
$('eout').innerHTML=h;
const all=[B,P,O],vals=all.flatMap(x=>x.rows.map(r=>r.cum)).concat(0),mx=Math.max(...vals),mn=Math.min(...vals),W=320,H=140,y=n=>6+(mx-n)/((mx-mn)||1)*(H-12),x=m=>8+(m-1)*(W-16)/23;
const ln=(S,col)=>`<polyline fill="none" stroke="${col}" stroke-width="2" points="${S.rows.map(r=>x(r.m)+','+y(r.cum)).join(' ')}"/>`;
$('echart').innerHTML=`<svg viewBox="0 0 ${W} ${H+18}"><line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="#16324d" stroke-dasharray="4"/>${ln(P,'#ff6b7a')}${ln(O,'#46f0a0')}${ln(B,'#38e8ff')}<text x="8" y="${H+14}" fill="#7fa3b3" font-size="10">Mahina 1</text><text x="${W-8}" y="${H+14}" fill="#7fa3b3" font-size="10" text-anchor="end">Mahina 24</text></svg><div style="font-size:12px;color:var(--mut)">Total cash: <span style="color:#38e8ff">base</span>, <span style="color:#46f0a0">acha</span>, <span style="color:#ff6b7a">bura</span>. Dotted line ke upar matlab paisa wapas mil gaya.</div>`;
return v+'. Payback '+pbT(B)+'. Kam se kam '+R(-B.mn)+' cash chahiye.'}
$('ecoGo').onclick=()=>{const r=eco();lastEco=r;say(r)};eco();
/* AI brain */
let AI=null,lastEco='',hist=[];
const WORKER_URL='https://friday.studyhackai5.workers.dev';AI=async(prompt,o)=>{const r=await fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});if(!r.ok)throw{code:r.status===429?'rate_limited':'error'};const d=await r.json();if(o&&o.onText)o.onText({text:d.text});return{text:d.text}};
const free=l=>l.split(/\s+/).length>4&&!/^(play|gana|song|youtube|yt|search|google|dhundo|wiki|wikipedia|map|maps|translate|anuvad|note|yaad|timer|calc|calculate|hisab)\b/.test(l);
function fmt(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
$('am').value=S.get('am','normal');$('am').onchange=()=>{S.set('am',$('am').value);say('AI mode badal diya.')};
async function ask(q){
if(!AI){say('AI dimaag is link mein available nahi hai. Main isse Google pe dhundh rahi hoon.');openUrl('https://www.google.com/search?q='+encodeURIComponent(q));return}
const M={normal:'Normal assistant mode: har sawaal ka seedha, kaam ka jawab do.',mentor:'Mentor mode: growth coach ki tarah books, habits, career aur discipline pe practical salah do. Galti ho to politely sudharo. Ant mein ek chhota next step batao.',biz:`Business advisor mode: economics aur naya business shuru karne pe honest salah do, risk batao. Planner ke inputs: investment ${gv('e1')}, fixed cost/mahina ${gv('e2')}, price ${gv('e3')}, cost/unit ${gv('e4')}, pehle mahine ki sales ${gv('e5')}, growth ${gv('e6')}%, loan ${gv('e9')}. Planner ka latest result: ${lastEco||'abhi run nahi hua'}.`};
const inst='Tum Friday ho, Nitu ki personal AI assistant (movie ke Jarvis jaisi, female, polite aur smart). Hamesha Hinglish (Hindi Roman script mein, English words ke saath) mein jawab do. Jawab chhota rakho (max 5 vaakya), seedha point pe, bina markdown aur emoji ke. Jo nahi pata wo maan lo ki nahi pata. '+M[$('am').value];
const p=document.createElement('p');p.className='f';p.innerHTML='<b>F:</b> Soch rahi hoon...';$('log').appendChild(p);$('log').scrollTop=1e6;$('status').textContent='Soch rahi hoon...';
const ctx=hist.map(x=>(x.r==='u'?'Nitu: ':'Friday: ')+x.t).join('\n');
try{const r=await AI(inst+'\n\nPichli baat-cheet:\n'+(ctx||'(shuruaat)')+'\n\nNitu: '+q+'\nFriday:',{cache:false,onText:({text})=>{p.innerHTML='<b>F:</b> '+fmt(text);$('log').scrollTop=1e6}});
p.innerHTML='<b>F:</b> '+fmt(r.text);hist.push({r:'u',t:q},{r:'f',t:r.text});hist=hist.slice(-8);say(r.text,false,true)}
catch(e){const c=e&&e.code;p.innerHTML='<b>F:</b> '+(c==='not_granted'?'AI use karne ki permission nahi mili. Allow karoge to main baat kar paungi.':c==='rate_limited'?'Bahut zyada requests ho gayi. Thodi der baad try karo.':e&&e.text?fmt(e.text):'AI se jawab nahi aaya. Dobara try karo.')}
$('status').textContent='Ready'}
/* notes */
function renderNotes(){const n=S.get('notes',[]);$('nl').innerHTML=n.map((t,i)=>`<div class="item"><span>${esc(t)}</span><button data-i="${i}">✕</button></div>`).join('')||'<div style="color:var(--mut)">Koi note nahi.</div>';$('nl').querySelectorAll('button').forEach(b=>b.onclick=()=>{const n=S.get('notes',[]);n.splice(+b.dataset.i,1);S.set('notes',n);renderNotes()})}
$('na').onclick=()=>{if($('ni').value.trim()){run('note '+$('ni').value);$('ni').value=''}};renderNotes();
/* books */
function renderBooks(){const b=S.get('books',[]);$('bl').innerHTML=b.map((x,i)=>`<div style="margin-bottom:10px"><b>${esc(x.n)}</b> <span style="color:var(--mut)">${x.r}/${x.t} pages</span><div class="bar"><b style="width:${Math.min(100,x.r/x.t*100)}%"></b></div><div class="row"><input type="number" placeholder="Aaj kitne page padhe?" data-i="${i}"><button data-a="${i}">Add</button><button data-d="${i}">✕</button></div></div>`).join('')||'<div style="color:var(--mut)">Pehli book add karo.</div>';
$('bl').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=S.get('books',[]),i=+b.dataset.a,v=+$('bl').querySelector(`input[data-i="${i}"]`).value;if(v>0){a[i].r=Math.min(a[i].t,a[i].r+v);S.set('books',a);renderBooks();say(a[i].r>=a[i].t?'Badhai ho, book khatam!':`Shabaash! ${a[i].r} page ho gaye.`)}});
$('bl').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const a=S.get('books',[]);a.splice(+b.dataset.d,1);S.set('books',a);renderBooks()})}
$('ba').onclick=()=>{const n=$('bn').value.trim(),t=+$('bp').value;if(n&&t>0){const a=S.get('books',[]);a.push({n,t,r:0});S.set('books',a);$('bn').value=$('bp').value='';renderBooks()}};renderBooks();
/* growth */
function tip(){$('tip').innerHTML='💡 '+pick(TIPS)}$('tipn').onclick=tip;tip();
const day=new Date().toDateString();
function renderH(){const h=S.get('habits',[]);$('hl').innerHTML=h.map((x,i)=>`<div class="item"><input type="checkbox" style="width:auto" data-i="${i}" ${x.done===day?'checked':''}><span>${esc(x.n)} <small style="color:var(--mut)">streak ${x.s||0}</small></span><button data-d="${i}">✕</button></div>`).join('')||'<div style="color:var(--mut)">Koi habit nahi. Ek add karo.</div>';
$('hl').querySelectorAll('input').forEach(c=>c.onchange=()=>{const h=S.get('habits',[]),x=h[+c.dataset.i];if(c.checked&&x.done!==day){x.done=day;x.s=(x.s||0)+1;say('Badhiya! Streak '+x.s+' din.')}else if(!c.checked&&x.done===day){x.done='';x.s=Math.max(0,(x.s||1)-1)}S.set('habits',h);renderH()});
$('hl').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const h=S.get('habits',[]);h.splice(+b.dataset.d,1);S.set('habits',h);renderH()})}
$('ha').onclick=()=>{if($('hi').value.trim()){const h=S.get('habits',[]);h.push({n:$('hi').value.trim(),s:0,done:''});S.set('habits',h);$('hi').value='';renderH()}};renderH();
/* settings */
$('ns').onclick=()=>{if($('np').value.length>=4){S.set('pw',$('np').value);$('np').value='';say('Password badal diya.')}else say('Password kam se kam 4 character ka rakho.')};
$('lk').onclick=()=>location.reload();
