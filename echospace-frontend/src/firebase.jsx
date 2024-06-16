import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6h2k2xQ_n37mibgmQNVC8c9oS7J_j9nM",
  authDomain: "spyne-49665.firebaseapp.com",
  projectId: "spyne-49665",
  storageBucket: "spyne-49665.appspot.com",
  messagingSenderId: "420868171936",
  appId: "1:420868171936:web:e8c7c982d36612c97b81c5",
  measurementId: "G-0CLGGG9YHH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
