import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDncSbmyat6egfSBtJuyoAu66_GktdvCAE',
  authDomain: 'chargebacknew.firebaseapp.com',
  projectId: 'chargebacknew',
  storageBucket: 'chargebacknew.firebasestorage.app',
  messagingSenderId: '387108468290',
  appId: '1:387108468290:web:63a114705ce9a156fedfdb',
  measurementId: 'G-7EW1E2C8WR',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
