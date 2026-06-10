/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyDPvl2nFW5EdKirbKTD-hhEF1QyV0c_JAM",
  authDomain: "the-family-legacy-roots.firebaseapp.com",
  projectId: "the-family-legacy-roots",
  storageBucket: "the-family-legacy-roots.firebasestorage.app",
  messagingSenderId: "823144866980",
  appId: "1:823144866980:web:d87aa109ea79128dad7231"
};

export const app = initializeApp(firebaseConfig);

try {
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY;
  if (recaptchaKey && typeof window !== "undefined") {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaKey),
      isTokenAutoRefreshEnabled: true
    });
  }
} catch (e) {
  console.warn("Failed to initialize Firebase App Check. Verify Recaptcha Key.", e);
}

export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
export const storage = getStorage(app);
