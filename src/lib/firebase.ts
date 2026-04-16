import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqDs3H5DGxa27ZTOvRfgYq1c24M4QrTIk",
  authDomain: "familylegacyroots.firebaseapp.com",
  projectId: "familylegacyroots",
  storageBucket: "familylegacyroots.firebasestorage.app",
  messagingSenderId: "929808717275",
  appId: "1:929808717275:web:f9792ce33f56296fe483fe"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
