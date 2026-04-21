import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPvl2nFW5EdKirbKTD-hhEF1QyV0c_JAM",
  authDomain: "the-family-legacy-roots.firebaseapp.com",
  projectId: "the-family-legacy-roots",
  storageBucket: "the-family-legacy-roots.firebasestorage.app",
  messagingSenderId: "823144866980",
  appId: "1:823144866980:web:d87aa109ea79128dad7231"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
