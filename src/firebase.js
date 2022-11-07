
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,

  authDomain: "wordcloud-9c2ff.firebaseapp.com",
  databaseURL: "https://wordcloud-9c2ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wordcloud-9c2ff",
  storageBucket: "wordcloud-9c2ff.appspot.com",
  messagingSenderId: "572064076511",
  appId: "1:572064076511:web:80941a38c704ae40d7cf6a",
  measurementId: "G-WR3E6VGMM7"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);