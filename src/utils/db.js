import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export async function readFileCidMapping(hashedFileCid) {
  console.log(`readFileCidMapping(${hashedFileCid})`);
  try {
    const dbRef = ref(database, `mappings/${hashedFileCid}`);
    const snapshot = await get(child(dbRef, `mappings/${hashedFileCid}`));
    console.log({ snapshot });
    console.log("after get");
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("null value");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function writeFileCidMapping(hashedFileCid, fileCid, metadataCid ) {
  console.log(`writeFileCidMapping(${hashedFileCid}, ${fileCid}, ${metadataCid})`);
  const dbRef = ref(database, `mappings/${hashedFileCid}`);
  const res = await set(
    dbRef, 
    {
      fileCid: fileCid,
      metadataCid: metadataCid
    }
    );
  console.log({ res });
  return res;
}
