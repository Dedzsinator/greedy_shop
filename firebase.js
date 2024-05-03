// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAK83oh6t3mzXIsLoQ3_-l-KTkZJI2K7GM",
  authDomain: "greedy-shop.firebaseapp.com",
  projectId: "greedy-shop",
  storageBucket: "greedy-shop.appspot.com",
  messagingSenderId: "1091798060691",
  appId: "1:1091798060691:web:bebd5e3bca72d56e158766",
  measurementId: "G-B22E6T6WPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// firebase.js
export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
