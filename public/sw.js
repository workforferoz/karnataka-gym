const CACHE_NAME = 'karnataka-gym-cache-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/karnataka-gym-logo.png',
  '/karnataka-gym-badge.png',
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
  const url = new URL(event.request.url);

  // Never intercept internal Next.js assets, HMR web sockets, or local development
  if (url.pathname.startsWith('/_next') || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Network-First strategy for HTML / navigation requests:
  // Always fetch the freshest deployment from Vercel; only fallback to cache when offline
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // Stale-While-Revalidate for images, icons, and static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
