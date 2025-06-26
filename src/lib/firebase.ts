// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7oqKLn4rAjOhBPgjipgNA37Jk8i7ja3I",
  authDomain: "archivosparanormales-a24a5.firebaseapp.com",
  projectId: "archivosparanormales-a24a5",
  storageBucket: "archivosparanormales-a24a5.firebasestorage.app",
  messagingSenderId: "183699579361",
  appId: "1:183699579361:web:82d578db248f87c6ffb2a0",
  measurementId: "G-9DJSYZQ4RS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
