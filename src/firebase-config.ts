import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASEAPI,
  authDomain: "bivy-7a6b7.firebaseapp.com",
  projectId: "bivy-7a6b7",
  storageBucket: "bivy-7a6b7.appspot.com",
  messagingSenderId: "727607526599",
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: "G-FT93ZRFEYF",
};

export const app = initializeApp(firebaseConfig);
