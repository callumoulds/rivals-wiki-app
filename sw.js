const CACHE_NAME='rivals-wiki-v1';
const ASSETS=['./','./index.html','./css/style.css','./js/app.js',
'https://cdn.jsdelivr.net/npm/chart.js'];
self.addEventListener('install',e=>{e.waitUntil(
  caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))
)});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
