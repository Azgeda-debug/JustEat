import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAoZd8f1bSu7ICcdCykMEfhncB0q24Rf6A",
    authDomain: "justeat-38f52.firebaseapp.com",
    databaseURL: "https://justeat-38f52-default-rtdb.firebaseio.com",
    projectId: "justeat-38f52",
    storageBucket: "justeat-38f52.appspot.com",
    messagingSenderId: "307738848378",
    appId: "1:307738848378:web:8ba8b5531a7250e0f19fc3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db }