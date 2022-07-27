import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "DJ7qJWbkf3A5NhuxZvoO2atc0gMxAJtlBLKnrtRp",
  projectId: "ghostshare-40aee",
  databaseURL: "https://ghostshare-40aee-default-rtdb.firebaseio.com",
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