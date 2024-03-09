// Importe as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZDt-6OXvlchj6iZMVTus3FjxOiSOpKqs",
  authDomain: "lavajaapp-41d64.firebaseapp.com",
  databaseURL: "https://lavajaapp-41d64-default-rtdb.firebaseio.com",
  projectId: "lavajaapp-41d64",
  storageBucket: "lavajaapp-41d64.appspot.com",
  messagingSenderId: "758673059930",
  appId: "1:758673059930:web:0910c461492f48845b2863",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configuração da persistência local
setPersistence(auth, browserLocalPersistence);

export { app, auth };
