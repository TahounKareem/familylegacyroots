import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPORB4oL9rb_Z2zilSjGyW3v6gv5rKIlc",
  authDomain: "family-legacy-47605.firebaseapp.com",
  projectId: "family-legacy-47605",
  storageBucket: "family-legacy-47605.firebasestorage.app",
  messagingSenderId: "164909144094",
  appId: "1:164909144094:web:07faf173fe3f394de0b60f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
