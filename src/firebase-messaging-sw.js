importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
    new RegExp('https://firebasestorage.googleapis.com/v0/b/attendit.appspot.com/.*'),
    workbox.strategies.staleWhileRevalidate()
);

firebase.initializeApp({
    'messagingSenderId': '1046000319716'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'App Updated!';
    const notificationOptions = {
    //   body: 'New Message.',
      icon: '../public/96x96.png'
    };
  
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
  });