/* commands */
const JOKES=['Programmer ko bola gaya "bahar jao". Wo bola: pehle break point lagata hoon.','WiFi aur main same hain: dono ko password chahiye aur dono kabhi connect nahi hote.','Bug nahi hai, ye undocumented feature hai.'];
const TIPS=['Aaj ek chhota kaam 25 minute bina phone ke karo. Phir 5 minute break.','Skill ko paise mein badalne ke liye pehle 1 paying client dhundho, 10 nahi.','Kal ka kaam aaj raat likh ke so jao. Subah decision lene mein energy waste nahi hogi.','Roz 10 page padho. Saal mein 12+ books ho jaati hain.','Galti hui to seekho aur aage badho. Khud se politely baat karo.','Apna kaam dikhao: ek portfolio link har client ko bhejo.'];
const QUOTES=['Jo roz thoda sa karta hai, wo ek din bahut kuch kar jaata hai.','Chhota start bhi start hota hai.','Discipline motivation se zyada der tak chalta hai.'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function run(raw){const q=raw.trim();if(!q)return;log('u',q);const l=q.toLowerCase();let m;
if(free(l)){ask(q)}
else if(m=l.match(/^(?:ask|puchho|batao|samjhao)\s+(.+)/)){ask(m[1])}
else if(m=l.match(/^(?:play|gana|song)\s+(.+)/)){say(`${m[1]} YouTube pe khol raha hoon.`);openUrl('https://www.youtube.com/results?search_query='+encodeURIComponent(m[1]+' song'))}
else if(m=l.match(/^(?:youtube|yt)\s*(.*)/)){say('YouTube khol raha hoon.');openUrl(m[1]?'https://www.youtube.com/results?search_query='+encodeURIComponent(m[1]):'https://www.youtube.com')}
else if(m=l.match(/^(?:search|google|dhundo)\s+(.+)/)){say(`"${m[1]}" search kar raha hoon.`);openUrl('https://www.google.com/search?q='+encodeURIComponent(m[1]))}
else if(m=l.match(/^(?:wiki|wikipedia)\s+(.+)/)){say('Wikipedia khol raha hoon.');openUrl('https://en.wikipedia.org/w/index.php?search='+encodeURIComponent(m[1]))}
else if(m=l.match(/^(?:map|maps)\s+(.+)/)){say('Map khol raha hoon.');openUrl('https://www.google.com/maps/search/'+encodeURIComponent(m[1]))}
else if(m=l.match(/^(?:translate|anuvad)\s+(.+)/)){say('Translate khol raha hoon.');openUrl('https://translate.google.com/?sl=auto&tl=hi&text='+encodeURIComponent(m[1]))}
else if(/\b(time|samay|baje)\b/.test(l))say('Abhi '+new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})+' baje hain.');
else if(/\b(date|tarikh|aaj kya din)\b/.test(l))say('Aaj '+new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' hai.');
else if(m=l.match(/^(?:note|yaad rakho)\s+(.+)/)){const n=S.get('notes',[]);n.unshift(m[1]);S.set('notes',n);renderNotes();say('Note save kar liya.')}
else if(m=l.match(/^(?:timer)\s+(\d+)\s*(min|sec|s|m)?/)){const s=+m[1]*(/^m/.test(m[2]||'m')?60:1);say(`${m[1]} ${/^m/.test(m[2]||'m')?'minute':'second'} ka timer start.`);setTimeout(()=>say('Timer khatam ho gaya!'),s*1000)}
else if(m=l.match(/^(?:calc|calculate|hisab)\s+(.+)/)){const ex=m[1].replace(/x/g,'*').replace(/[^0-9+\-*/().%\s]/g,'');try{const r=Function('"use strict";return ('+ex+')')();say(`Answer: <b>${r}</b>`)}catch(e){say('Ye calculation samajh nahi aayi.')}}
else if(/profit|economics|business|break.?even/.test(l)){tab('eco');say('Business planner khol diya. Numbers daalo, main 24 mahine ka plan aur risk dikhaungi.')}
else if(/joke|mazak/.test(l))say(pick(JOKES));
else if(/quote|motivat|himmat/.test(l))say(pick(QUOTES));
else if(/tip|mentor|growth/.test(l)){tab('grow');say(pick(TIPS))}
else if(/book|kitab/.test(l)){tab('books');say('Books panel khol diya.')}
else if(/voice (change|badlo)|awaaz/.test(l)){modeIdx=(modeIdx+1)%MODES.length;$('vm').value=modeIdx;S.set('mode',modeIdx);say('Voice mode: '+MODES[modeIdx].n)}
else if(/^lock/.test(l)){location.reload()}
else if(/help|kya kar sakti/.test(l))say('Main ye kar sakti hoon: <b>play [song]</b>, <b>search [kuch bhi]</b>, <b>youtube</b>, <b>wiki</b>, <b>map</b>, <b>translate</b>, <b>time</b>, <b>date</b>, <b>note [text]</b>, <b>timer 5 min</b>, <b>calc 12*8</b>, <b>profit</b>, <b>tip</b>, <b>joke</b>, <b>quote</b>, <b>voice badlo</b>, <b>lock</b>. Aur kuch bhi poochho, Friday AI se jawab degi.');
else if(/^(hello|hi|hey|namaste)\b/.test(l))say('Namaste Nitu! Kya karein aaj?');
else{ask(q)}}
$('go').onclick=()=>{run($('cmd').value);$('cmd').value=''};$('cmd').onkeydown=e=>{if(e.key==='Enter')$('go').click()};
['play kesariya','youtube','time','joke','quote','tip','profit','help'].forEach(c=>{const b=document.createElement('button');b.textContent=c;b.onclick=()=>run(c);$('chips').appendChild(b)});
/* mic */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let rec=null;
function listen(){try{speechSynthesis.cancel()}catch(e){}if(curAudio){curAudio.pause();curAudio=null}$('orb').classList.remove('talk');
if(rec){try{rec.stop()}catch(e){}return}
if(!SR){say('Is browser mein mic support nahi hai. Chrome try karo.');return}
const r=new SR();rec=r;r.lang='en-IN';$('orb').classList.add('listen');$('status').textContent='Sun rahi hoon...';
r.onresult=e=>run(e.results[0][0].transcript);r.onerror=()=>say('Mic ka permission ya awaaz nahi mili.');r.onend=()=>{rec=null;$('orb').classList.remove('listen');$('status').textContent='Ready'};
try{r.start()}catch(e){rec=null;$('orb').classList.remove('listen');$('status').textContent='Ready'}}
$('mic').onclick=listen;$('orb').onclick=listen;
$('orb').style.cursor='pointer';$('orb').style.webkitTapHighlightColor='transparent';$('orb').setAttribute('role','button');$('orb').setAttribute('aria-label','Friday se baat karo');
/* tabs */
const T=[['eco','Economics'],['notes','Notes'],['books','Books'],['grow','Growth'],['set','Settings']];
T.forEach(([k,n])=>{const b=document.createElement('button');b.textContent=n;b.id='t-'+k;b.onclick=()=>tab(k);$('tabs').appendChild(b)});
function tab(k){T.forEach(([x])=>{$('p-'+x).classList.toggle('on',x===k);$('t-'+x).classList.toggle('on',x===k)})}tab('eco');
