const CACHE_NAME = 'karnataka-gym-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/karnataka-gym-logo.png',
  '/karnataka-gym-banner.jpg',
  '/member/home',
  '/member/check-in',
  '/member/history',
  '/member/renew',
  '/member/add-ons',
  '/member/profile',
  '/owner/dashboard',
  '/owner/churn-risk',
  '/owner/manage/members',
  '/owner/assisted-checkin',
  '/owner/summary'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => console.log('PWA cache prefetch note:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        })
      );
    })
  );
});

