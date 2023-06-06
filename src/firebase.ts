import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBq97UTuBzPLtpwcSf2rcuuKUhw4hrqfA",
  authDomain: "discord-clone-6afdb.firebaseapp.com",
  projectId: "discord-clone-6afdb",
  storageBucket: "discord-clone-6afdb.appspot.com",
  messagingSenderId: "629023665682",
  appId: "1:629023665682:web:cf8bf54e498f6d0e2db2cb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, db, storage };
