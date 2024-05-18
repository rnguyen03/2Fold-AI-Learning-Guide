import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHyjRQd4F_q88iFRolUAEbZPFIHSzgD24",
  authDomain: "hd2electric.firebaseapp.com",
  projectId: "hd2electric",
  storageBucket: "hd2electric.appspot.com",
  messagingSenderId: "247382297176",
  appId: "1:247382297176:web:9420188cdc02f22860982d",
  measurementId: "G-M1MQGXNJXQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const DB = getFirestore(app);
