var CACHE_NAME = 'jorge-valle-v4';
var urlsToCache = [
  '/',
  '/front/assets/styles/styles.css',
  '/front/assets/bundle.js',
  '/front/assets/images/jorge-valle.jpg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});