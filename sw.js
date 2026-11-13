const V = "abnt-v4", SHELL = ["./", "index.html", "icon.svg", "logo.svg", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if(r.method !== "GET") return;
  if(u.origin === location.origin){
    e.respondWith(fetch(r).then(res => { if(res.ok){ const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r).then(hit => hit || caches.match("index.html"))));
  } else if(u.hostname === "cdnjs.cloudflare.com"){
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if(res.ok || res.type === "opaque"){ const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
  }
});
