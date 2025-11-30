import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA4780QbAjFPc9udbabWw2Mt-lDReELm8M',
  authDomain: 'chargeback-8df08.firebaseapp.com',
  projectId: 'chargeback-8df08',
  storageBucket: 'chargeback-8df08.firebasestorage.app',
  messagingSenderId: '400256012486',
  appId: '1:400256012486:web:4966fa42915f2512e847c7',
  measurementId: 'G-LJKZHZVZGD',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
