import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAmstxqUCCIMgi6R9vDFbk-XaSMc5Zo9Q",
  authDomain: "codify-14f7c.firebaseapp.com",
  projectId: "codify-14f7c",
  storageBucket: "codify-14f7c.firebasestorage.app",
  messagingSenderId: "1084405677217",
  appId: "1:1084405677217:web:dd68729b9c1be758e884e0",
  measurementId: "G-ER6YSNMK0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, analytics, auth, db };
