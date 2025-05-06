/* Core variables */
const GH_ROOT = 'https://raw.githubusercontent.com/callumoulds/content/main/';
const NEWS = GH_ROOT + 'news.json';
const HEROES = GH_ROOT + 'heroes.json';
const META_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpDvuy3SvWv4ANInvOlo1AVwo9QHr_cDQfKX0h7m7ZYK6gMEiO-4H6oIY4b0sCTdqeWMzoSgnLT37u/pub?output=csv';

const store = {news:[],heroes:[],meta:null};

const navButtons = document.querySelectorAll('#main-nav button');
const container = document.getElementById('view-container');

/* Routing */
navButtons.forEach(btn=>btn.addEventListener('click',()=>{
  navButtons.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  showView(btn.dataset.view);
}));
function showView(view){
  container.innerHTML='';
  if(view==='news') renderNews();
  else if(view==='heroes') renderHeroes();
  else if(view==='meta') renderMeta();
}
window.addEventListener('hashchange',()=>{const v=location.hash.slice(1)||'news';showView(v);});
/* Initial load */
(async()=>{
 await Promise.all([loadNews(),loadHeroes(),loadMeta()]);
 showView(location.hash.slice(1)||'news');
 registerSW();
 setupInstallPrompt();
})();

/* Data loaders */
async function loadNews(){
  try{
    const res=await fetch(NEWS);
    store.news=await res.json();
  }catch(e){ console.error(e); }
}
async function loadHeroes(){
  try{
    const res=await fetch(HEROES);
    store.heroes=await res.json();
  }catch(e){console.error(e);}
}
async function loadMeta(){
  try{
    const res=await fetch(META_CSV);
    const text=await res.text();
    const rows=text.trim().split('\n').slice(1);
    store.meta=rows.map(r=>{const[c,win,pick]=r.split(',');return{heroID:c,win:parseFloat(win),pick:parseFloat(pick)}});
  }catch(e){console.error(e);}
}

/* Renderers */
function renderNews(){
  store.news.sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt));
  store.news.forEach(a=>{
    const card=document.createElement('article');
    card.className='card';
    card.innerHTML=`<h3>${a.title}</h3><p>${a.excerpt}</p>
      <small>${new Date(a.publishedAt).toLocaleDateString()}</small>
      <p><a href="${a.url}" target="_blank">Read &raquo;</a></p>`;
    container.appendChild(card);
  });
}
function renderHeroes(){
  store.heroes.forEach(h=>{
    const card=document.createElement('article');card.className='card';
    card.innerHTML=`<h3>${h.name}</h3><p>${h.role}</p><img src="${h.portraitURL}" alt="${h.name} portrait">
      <p>${h.bio}</p>`;
    container.appendChild(card);
  });
}
function renderMeta(){
  const canvas=document.createElement('canvas');
  container.appendChild(canvas);
  const labels = store.meta.map(e=>heroName(e.heroID));
  const data = store.meta.map(e=>e.win*100);
  new Chart(canvas,{type:'bar',data:{labels,datasets:[{label:'Win %',data}]},
    options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100}}}});
}
function heroName(id){const h=store.heroes.find(h=>h.id===id);return h?h.name:'Unknown';}

/* Service Worker */
function registerSW(){
 if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(console.error);
 }
}
/* A2HS */
function setupInstallPrompt(){
 let deferredPrompt;
 window.addEventListener('beforeinstallprompt',(e)=>{
   e.preventDefault();
   deferredPrompt=e;
   document.getElementById('install-banner').hidden=false;
 });
 document.getElementById('install-btn').addEventListener('click', async ()=>{
   if(!deferredPrompt) return;
   deferredPrompt.prompt();
   const {outcome}=await deferredPrompt.userChoice;
   if(outcome==='accepted') document.getElementById('install-banner').hidden=true;
   deferredPrompt=null;
 });
 document.getElementById('dismiss-btn').addEventListener('click',()=>document.getElementById('install-banner').hidden=true);
}
