// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZDt-6OXvlchj6iZMVTus3FjxOiSOpKqs",
  authDomain: "lavajaapp-41d64.firebaseapp.com",
  databaseURL: "https://lavajaapp-41d64-default-rtdb.firebaseio.com",
  projectId: "lavajaapp-41d64",
  storageBucket: "lavajaapp-41d64.appspot.com",
  messagingSenderId: "758673059930",
  appId: "1:758673059930:web:0910c461492f48845b2863",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
