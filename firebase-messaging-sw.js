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
var CACHE = 'my-site-cache-v1';
var precacheFiles = [
  '/',
  '/index.html',
  '/css/push.css',
  '/js/main_app.js',
  '/js/push.js',
  '/js/init.js',
  '/js/auth.js'
];

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  console.log("[PWA Builder] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Builder] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            console.log("[PWA Builder] Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}