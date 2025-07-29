// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwC_s-f83v9H_2g8kPteOwumWp597XY-g",
  authDomain: "taskpal-d1776.firebaseapp.com",
  projectId: "taskpal-d1776",
  storageBucket: "taskpal-d1776.firebasestorage.app",
  messagingSenderId: "171872066433",
  appId: "1:171872066433:web:3d0be1b5f24f92f585e680",
  measurementId: "G-7DPN8F1M92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);