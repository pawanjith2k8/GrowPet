/**
 * GrowPet PWA — Service Worker Registration Utility
 */

type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

let swRegistration: ServiceWorkerRegistration | null = null;
let updateCallback: UpdateCallback | null = null;

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  return isStandaloneMedia || isIOSStandalone;
}

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /iP(hone|ad|od)/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iP(hone|ad|od)/.test(ua);
  const isSafari = /WebKit/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
  return isIOS && isSafari;
}

export function isInstalledPWA(): boolean {
  return isStandaloneMode();
}

export function registerServiceWorker(onUpdate?: UpdateCallback): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Skip in Capacitor native context — avoid conflicts with webview handling
  const isCapacitor =
    typeof (window as any).Capacitor !== 'undefined' &&
    (window as any).Capacitor.isNativePlatform?.();
  if (isCapacitor) {
    console.info('[GrowPet SW] Running inside Capacitor — skipping SW registration.');
    return;
  }

  if (onUpdate) {
    updateCallback = onUpdate;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(registration => {
        swRegistration = registration;
        console.log('[GrowPet PWA] Service Worker registered, scope:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60_000);

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[GrowPet PWA] New version available!');
                if (updateCallback) {
                  updateCallback(registration);
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.warn('[GrowPet PWA] Service Worker registration failed:', error);
      });

    // Reload page when SW takes control (after applyUpdate)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

export function applyUpdate(): void {
  if (swRegistration && swRegistration.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}
