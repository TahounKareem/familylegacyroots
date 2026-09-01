const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const app = initializeApp({
  apiKey: "AIzaSyDPvl2nFW5EdKirbKTD-hhEF1QyV0c_JAM",
  authDomain: "the-family-legacy-roots.firebaseapp.com",
  projectId: "the-family-legacy-roots"
});
const auth = getAuth(app);
signInWithEmailAndPassword(auth, "kareem.tahoun@adamresearchcenter.net", "admin1234").then(async (userCredential) => {
  const token = await userCredential.user.getIdToken();
  console.log("TOKEN=" + token);
}).catch(console.error);
