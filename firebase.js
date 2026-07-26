import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDu_UBpB51qNnn_Wfd3Zlekrufp21GoCoQ",
  authDomain: "falange-811aa.firebaseapp.com",
  projectId: "falange-811aa",
  storageBucket: "falange-811aa.firebasestorage.app",
  messagingSenderId: "314961909967",
  appId: "1:314961909967:web:a9379f1f21fde7de2abfba"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase conectado!", app);
