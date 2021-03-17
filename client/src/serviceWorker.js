self.addEventListener('install', e => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  clients.claim().then(() => console.log('Service Worker active'))
});

self.addEventListener('fetch', e => {
  console.log('Network request detected');
  console.log(e);
});

self.addEventListener('message', e => {
  console.log('Message received');
});
