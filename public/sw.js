/**
 * GrowPet Service Worker — Production Ready PWA
 * Strategy:
 *  - Cache-first for static assets (JS, CSS, fonts, images, icons)
 *  - Network-first for navigation (SPA routing fallback to index.html)
 *  - BYPASS (no-cache) for all auth, database, AI API, and external API calls
 *  - Clean old cache versions on activate
 *  - Handle app update notifications via postMessage
 */

const CACHE_NAME = 'growpet-static-v1.0.0';
const OFFLINE_URL = '/index.html';

// ==================== SECURITY BYPASS LIST ====================
// These domains/patterns are NEVER cached – they carry live data,
// auth tokens, or sensitive user responses.
const BYPASS_PATTERNS = [
  // Firebase Auth
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  // Firestore Database
  'firestore.googleapis.com',
  'firebaseio.com',
  // Firebase Storage
  'firebasestorage.googleapis.com',
  // Google AI / Gemini
  'generativelanguage.googleapis.com',
  // OpenStreetMap APIs (live GPS data)
  'overpass-api.de',
  'nominatim.openstreetmap.org',
  // Google Fonts (handled separately below)
  // Any analytics
  'www.google-analytics.com',
  'analytics.google.com',
  'firebase.googleapis.com',
];

// ==================== STATIC ASSET CACHE LIST ====================
// Pre-cache critical app shell resources on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512x512.png',
  '/icons/apple-touch-icon-180x180.png',
  '/icons/favicon-32x32.png',
  '/favicon.svg',
];

// ===================== INSTALL EVENT =====================
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        // Pre-cache static app shell
        await cache.addAll(STATIC_ASSETS);
        console.log('[GrowPet SW] Static assets pre-cached.');
      } catch (err) {
        // Non-fatal — best effort pre-cache
        console.warn('[GrowPet SW] Pre-cache warning (non-fatal):', err);
      }
      // Take control immediately without waiting for old tabs to close
      await self.skipWaiting();
    })()
  );
});

// ===================== ACTIVATE EVENT =====================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete all old caches (previous versions)
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[GrowPet SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
      // Claim all existing clients immediately
      await self.clients.claim();
      console.log('[GrowPet SW] Activated. Controlling all clients.');
    })()
  );
});

// ===================== FETCH EVENT =====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Only handle http/https
  if (!request.url.startsWith('http')) return;

  // 2. SECURITY: Always bypass cache for sensitive API/auth endpoints
  const isBypassDomain = BYPASS_PATTERNS.some((pattern) =>
    url.hostname.includes(pattern) || url.href.includes(pattern)
  );
  if (isBypassDomain) {
    // Pass directly to network — no caching whatsoever
    return;
  }

  // 3. SECURITY: Never cache non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 4. Navigation requests (HTML pages) — Network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (_err) {
          // Offline: return cached index.html for SPA routing
          const cached = await caches.match(OFFLINE_URL);
          if (cached) return cached;
          // Ultimate fallback
          return new Response('<html><body><h1>GrowPet is offline</h1><p>Please check your internet connection and try again.</p></body></html>', {
            headers: { 'Content-Type': 'text/html' },
          });
        }
      })()
    );
    return;
  }

  // 5. Google Fonts — stale-while-revalidate (safe to cache, non-sensitive)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            const cache_p = caches.open(CACHE_NAME);
            cache_p.then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
        return cached || networkFetch;
      })()
    );
    return;
  }

  // 6. Unsplash / external images (pet photos, etc.) — stale-while-revalidate
  if (
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'www.gstatic.com'
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (_err) {
          return new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // 7. Same-origin static assets (JS, CSS, icons, etc.) — Cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (_err) {
          // Return offline placeholder for failed asset loads
          return new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // 8. All other cross-origin requests — network only, no caching
});

// ===================== MESSAGE HANDLING =====================
// Support SKIP_WAITING from update prompts
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
