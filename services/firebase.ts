import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHRbXdsk26O8fWLRDPTrUr3dqTGWVfuhY",
  authDomain: "venoxy-portfolio.firebaseapp.com",
  projectId: "venoxy-portfolio",
  storageBucket: "venoxy-portfolio.firebasestorage.app",
  messagingSenderId: "364313149502",
  appId: "1:364313149502:web:565cca420d82866f7c516f",
  measurementId: "G-R2R9Y8KKFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
