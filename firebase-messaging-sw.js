// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/6.2.0/firebase-app.js');
importScripts('/__/firebase/6.2.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

var messaging = firebase.messaging();

// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// [END background_handler]
//CACHE 
// This is the service worker with the Cache-first network
var CACHE = 'site-cache-v1';
var CACHE_DYNAMIC = 'dynamic-cache-v1';
var precacheFiles = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/push.css',
  '/js/main_app.js',
  '/js/push.js',
  '/js/init.js',
  '/js/auth.js'
];

self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  console.log("Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// fetch from network and put to Cache 
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return fetch(evt.request).then(fetchRes => {
        return caches.open(CACHE_DYNAMIC).then(cache => {
          if (fetchRes.type == 'basic') {
            cache.put(evt.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      }).catch((err) => {
        if (cacheRes)
          return cacheRes;
        else
          return caches.match('/offline.html');
      });
    }).catch(() => {
      return cacheRes;
    })
  );
});