// Guarda o app no celular para abrir sem internet
const CACHE = 'fichas-cana-v12';
const ARQUIVOS = ['./', './index.html', './manifest.json', './strada.png', './feixe.png', './icon-192.png', './icon-512.png', './logo.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Rede primeiro (pega atualizações); sem sinal, usa o que está guardado
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r && (r.ok || r.type === 'opaque')) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
  );
});
