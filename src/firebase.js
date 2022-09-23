// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwGlxCOjBQeegIyBcahNjfqLHyDbMdwDE",
  authDomain: "task-app-aa68c.firebaseapp.com",
  projectId: "task-app-aa68c",
  storageBucket: "task-app-aa68c.appspot.com",
  messagingSenderId: "104898618044",
  appId: "1:104898618044:web:7466d6f1d0d1cc5f1ee6b9",
  measurementId: "G-BRCPV9L26Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);