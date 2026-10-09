const CACHE_NAME = 'flappy-bird-offline-v1';
const APP_FILES = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './app-icon.svg',
    './playcanvas-stable.min.js',
    './__settings__.js',
    './__start__.js',
    './__loading__.js',
    './__modules__.js',
    './__game-scripts.js',
    './config.json',
    './2616462.json',
    './logo.png',
    './files/assets/310579139/1/sfx_point.mp3',
    './files/assets/310579142/1/sfx_die.mp3',
    './files/assets/310579143/1/sfx_wing.mp3',
    './files/assets/310579153/1/sfx_swooshing.mp3',
    './files/assets/310579156/1/sfx_hit.mp3',
    './files/assets/310579201/1/spritesheet.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(request).catch(() => {
                if (request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                throw new Error('Offline resource is not cached');
            });
        })
    );
});