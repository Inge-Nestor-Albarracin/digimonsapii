import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCbocQaXyc537hMaDD-3TZiypDOSwUQwQM",
  authDomain: "digimon-b5dc5.firebaseapp.com",
  projectId: "digimon-b5dc5",
  storageBucket: "digimon-b5dc5.firebasestorage.app",
  messagingSenderId: "676739725457",
  appId: "1:676739725457:web:d9f4aa59f6438042156730",
  measurementId: "G-P5EM76G8D8"

};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);