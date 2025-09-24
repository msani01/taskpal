"use client"
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.AUTH_FIREBASE_API_KEY,
  authDomain: "taskpal-d1776.firebaseapp.com",
  projectId: "taskpal-d1776",
  storageBucket: "taskpal-d1776.appspot.com",
  messagingSenderId: "171872066433",
  appId: "1:171872066433:web:3d0be1b5f24f92f585e680",
  measurementId: "G-7DPN8F1M92"
};

// Prevent multiple Firebase initializations
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
