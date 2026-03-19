/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDAXVQL_NX21EVPv22fuJuSROa_8v3UbQM',
  authDomain: 'reclaim-38744.firebaseapp.com',
  projectId: 'reclaim-38744',
  storageBucket: 'reclaim-38744.firebasestorage.app',
  messagingSenderId: '25440715803',
  appId: '1:25440715803:web:fdfdb0e5d41b579be8e4be',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  if (title) {
    self.registration.showNotification(title, {
      body,
      icon: '/favicon-96x96.png',
    });
  }
});
