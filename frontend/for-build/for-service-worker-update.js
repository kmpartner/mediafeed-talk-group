// self.addEventListener('fetch', function(event) {
//   console.log('[Service worker] Fetching something ....', event);
//   event.respondWith(fetch(event.request));
// })

self.addEventListener("push", (event) => {
  console.log("Push Notification recieved", event);

  let data = { title: "New!", content: "Something new!", openUrl: "/" };

  if (event.data) {
    data = JSON.parse(event.data.text());
    console.log(data);
  }

  let options = {
    body: data.content,
    //   icon: '/icon-96x96.png',
    //   badge: '/icon-96x96.png',
    icon: "/favicon-32x32.png",
    badge: "/favicon-32x32.png",
    data: {
      url: data.openUrl,
    },
    dir: "ltr",
    lang: "en-US", // BCP 47
    vibrate: [400, 600, 600],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  let notification = event.notification;
  let action = event.action;

  console.log(notification);

  if (action === "confirm") {
    console.log("Confirm was chosen");
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll().then((clis) => {
        let client = clis.find((c) => {
          return c.visibilityState === "visible";
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

//// A waiting service worker can skip waiting and force early
//// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
self.addEventListener('install', function(event) {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
  
    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
});

// self.addEventListener('notificationclick', function(event) {
//   console.log('Push Notification clicked', event);

//   let url = 'https://ud-gqlapi-front.firebaseapp.com/feed/posts';
//   const url = window.location.origin + `${event.notification.}`
//   event.notification.close(); // Android needs explicit close.
//   event.waitUntil(
//       clients.matchAll({type: 'window'}).then( windowClients => {
//           // Check if there is already a window/tab open with the target URL
//           for (var i = 0; i < windowClients.length; i++) {
//               var client = windowClients[i];
//               // If so, just focus it.
//               if (client.url === url && 'focus' in client) {
//                   return client.focus();
//               }
//           }
//           // If not, then open the target URL in a new window/tab.
//           if (clients.openWindow) {
//               return clients.openWindow(url);
//           }
//       })
//   );
// });

//// Removing outdated caches
// self.addEventListener('activate', function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.filter(function(cacheName) {
//             // Return true if you want to remove this cache,
//             // but remember that caches are shared across
//             // the whole origin
//           }).map(function(cacheName) {
//             return caches.delete(cacheName);
//           })
//         );
//       })
//     );
//   });

