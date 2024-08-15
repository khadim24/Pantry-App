// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMARGwSgvR79b2TZFUEP0TcUa456iZUq0",
  authDomain: "ktpantryapp.firebaseapp.com",
  projectId: "ktpantryapp",
  storageBucket: "ktpantryapp.appspot.com",
  messagingSenderId: "469571516587",
  appId: "1:469571516587:web:b3a23845080737436e5fee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{app, firestore}