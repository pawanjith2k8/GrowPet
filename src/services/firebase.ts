import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyAgU6rj0Kh-lOKuBNLxUlLGi9g_7vags0Q",
  authDomain: "edunova-b432b.firebaseapp.com",
  databaseURL: "https://edunova-b432b-default-rtdb.firebaseio.com",
  projectId: "edunova-b432b",
  storageBucket: "edunova-b432b.firebasestorage.app",
  messagingSenderId: "252690113889",
  appId: "1:252690113889:web:d4d0d33e5b963eea009120",
  measurementId: "G-BSEKPLLEHM"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

try {
  setPersistence(auth, browserLocalPersistence);
} catch (e) {
  console.warn('Firebase persistence warning:', e);
}

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch (e) {
        console.warn('Analytics init warning:', e);
      }
    }
  });
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage };