import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPvl2nFW5EdKirbKTD-hhEF1QyV0c_JAM",
  authDomain: "the-family-legacy-roots.firebaseapp.com",
  projectId: "the-family-legacy-roots",
  storageBucket: "the-family-legacy-roots.firebasestorage.app",
  messagingSenderId: "823144866980",
  appId: "1:823144866980:web:d87aa109ea79128dad7231"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName: string) {
  console.log(`Clearing ${collectionName}...`);
  const snapshot = await getDocs(collection(db, collectionName));
  let count = 0;
  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, collectionName, docSnapshot.id));
    count++;
  }
  console.log(`Deleted ${count} documents from ${collectionName}`);
}

async function main() {
  try {
    await clearCollection('legal_contracts');
    await clearCollection('audit_logs');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

main();
