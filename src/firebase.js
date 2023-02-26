import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-qGGeY2RN6l8mk9MbEW0ThDkLRn0Ixjc",
  authDomain: "bobtube-f2e60.firebaseapp.com",
  projectId: "bobtube-f2e60",
  storageBucket: "bobtube-f2e60.appspot.com",
  messagingSenderId: "62418483924",
  appId: "1:62418483924:web:db0b40fc87a147749a9941"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;