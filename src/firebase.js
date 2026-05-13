import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcwJ42hyb75hxKixUHUW97e5o0FHpNL7c",
  authDomain: "cineplex-c07e8.firebaseapp.com",
  projectId:  "cineplex-c07e8",
  storageBucket: "cineplex-c07e8.firebasestorage.app",
  messagingSenderId: "984248689359",
  appId:  "1:984248689359:web:b8186c982939149ea90dba",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
