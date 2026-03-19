/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA4780QbAjFPc9udbabWw2Mt-lDReELm8M',
  authDomain: 'chargeback-8df08.firebaseapp.com',
  projectId: 'chargeback-8df08',
  storageBucket: 'chargeback-8df08.firebasestorage.app',
  messagingSenderId: '400256012486',
  appId: '1:400256012486:web:4966fa42915f2512e847c7',
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
