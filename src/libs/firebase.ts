import { initializeApp } from "firebase/app"; 
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC2fmStlyqaPy8pLnBq18v4e7S4lY3pSJg",
    authDomain: "chicken-tracker-83ef8.firebaseapp.com",
    projectId: "chicken-tracker-83ef8",
    storageBucket: "chicken-tracker-83ef8.appspot.com",
    messagingSenderId: "239230240951",
    appId: "1:239230240951:web:065e7eb9def74836a4e532",
    measurementId: "G-ZNETT8P31V"
};

// let firebaseApp;

if (!firebaseApp) {
    var firebaseApp = initializeApp(firebaseConfig)
}

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();