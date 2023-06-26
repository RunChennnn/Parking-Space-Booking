// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApBdX_ouOp0E9Bez09PtHyMa4UL-qDYBo",
  authDomain: "room-e5563.firebaseapp.com",
  databaseURL: "https://room-e5563-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "room-e5563",
  storageBucket: "room-e5563.appspot.com",
  messagingSenderId: "665563320009",
  appId: "1:665563320009:web:2bff29562834fdf4bac718",
  measurementId: "G-1NXQ4FX22V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);