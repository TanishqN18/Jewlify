import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAW3w8Wgekgiga6lOTWOEVJkRdoEASkD28',
  authDomain: 'jewelify-d0f1f.firebaseapp.com',
  projectId: 'jewelify-d0f1f',
  storageBucket: 'jewelify-d0f1f.firebasestorage.app',
  messagingSenderId: '1050591496283',
  appId: '1:1050591496283:web:b7f0805c987b962e61977e',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
