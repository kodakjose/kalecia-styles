// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBrLc_-Wx-O_fNHMSs3DVlJZEzg4uB1Aag",
  authDomain: "kalecia-styles-cc166.firebaseapp.com",
  projectId: "kalecia-styles-cc166",
  storageBucket: "kalecia-styles-cc166.firebasestorage.app",
  messagingSenderId: "198539229477",
  appId: "1:198539229477:web:3fe876a73f893b27f082cc",
  measurementId: "G-EL1KTB504W"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
