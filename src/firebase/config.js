// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Firebase config - يتم تحميل القيم من متغيرات البيئة
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    'AIzaSyAXZThlQXYl9z5CmYLdfsN0tVT3LaH4OyA',
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'pupg-65067.firebaseapp.com',
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    'https://pupg-65067.firebaseio.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'pupg-65067',
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    'pupg-65067.firebasestorage.app',
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '746165283450',
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    '1:746165283450:web:095a5643503cf6bef0e9c3',
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-QVTQ4HGV0K',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
