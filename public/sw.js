// Minimalen service worker — potreben za PWA namestitev (Add to Home Screen).
// Namerno NIČ ne kešira (network passthrough), da posodobitve na Vercelu vedno pridejo skozi.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request));
});
