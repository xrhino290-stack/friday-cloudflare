const $=id=>document.getElementById(id);
const S={get(k,d){try{const v=localStorage.getItem('fr_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('fr_'+k,JSON.stringify(v))}catch(e){}}};
let voiceOn=S.get('von',true),modeIdx=S.get('mode',0),voices=[];
const MODES=[{n:'Movie (female)',p:1.08,r:.95},{n:'Soft',p:1.25,r:.88},{n:'Fast',p:1.1,r:1.2},{n:'Deep',p:.7,r:.9},{n:'Robot',p:.5,r:1}];
/* lock + boot */
function unlock(){const pw=S.get('pw','friday');if($('pw').value.trim().toLowerCase()===String(pw).toLowerCase()){$('lock').style.display='none';$('boot').style.display='flex';
const L=['Core online','Voice module loaded','Economics engine ready','Mentor module ready'];let i=0;const t=setInterval(()=>{$('bt').textContent=L[i++]||'';if(i>L.length){clearInterval(t);$('boot').style.display='none';$('app').style.display='block';say('System on. Main Friday hoon. Boliye, kya karna hai?')}},550)}else $('lmsg').textContent='Galat password. Pehli baar ho to "friday" try karo.'}
$('unl').onclick=unlock;$('pw').onkeydown=e=>{if(e.key==='Enter')unlock()};
/* voice */
function loadVoices(){voices=speechSynthesis.getVoices();const fem=/female|zira|samantha|heera|neerja|swara|veena|aria|jenny|karen|susan|google uk english female|hindi/i;
$('vv').innerHTML=voices.map((v,i)=>`<option value="${i}">${v.name} (${v.lang})</option>`).join('');
let si=S.get('vi',-1);if(si<0||!voices[si]){si=voices.findIndex(v=>fem.test(v.name)&&/en|hi/i.test(v.lang));if(si<0)si=0}$('vv').value=si}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
$('vm').innerHTML=MODES.map((m,i)=>`<option value="${i}">${m.n}</option>`).join('');$('vm').value=modeIdx;
$('vm').onchange=()=>{modeIdx=+$('vm').value;S.set('mode',modeIdx);say('Voice badal gayi.')};
$('vv').onchange=()=>{S.set('vi',+$('vv').value);say('Ye meri nayi awaaz hai.')};
$('vt').onclick=()=>say('Hello Nitu, main Friday hoon.');
$('vs').onclick=()=>{voiceOn=!voiceOn;S.set('von',voiceOn);if(!voiceOn)speechSynthesis.cancel();log('f','Voice '+(voiceOn?'on':'off'))};
function say(t,silent,nolog){if(!nolog)log('f',t);if(!voiceOn||silent)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g,'').replace(/[*#_]/g,'').slice(0,500));const v=voices[+$('vv').value];if(v){u.voice=v;u.lang=v.lang}const m=MODES[modeIdx];u.pitch=m.p;u.rate=m.r;u.onstart=()=>$('orb').classList.add('talk');u.onend=()=>$('orb').classList.remove('talk');speechSynthesis.speak(u)}catch(e){}}
function log(c,t){const p=document.createElement('p');p.className=c;p.innerHTML=c==='u'?'› '+esc(t):'<b>F:</b> '+t;$('log').appendChild(p);$('log').scrollTop=1e6}
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
/* open links */
function openUrl(u){const w=window.open(u,'_blank');if(!w)log('f',`Browser ne pop-up roka. <a href="${u}" target="_blank" rel="noopener" style="color:var(--cy)">Yahan tap karo</a>`)}
