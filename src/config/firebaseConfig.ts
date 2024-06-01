// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAizpG6i12UBqtHCaXBq5fv_akujHG4hUo",
  authDomain: "authenctication-ecommerce.firebaseapp.com",
  projectId: "authenctication-ecommerce",
  storageBucket: "authenctication-ecommerce.appspot.com",
  messagingSenderId: "937835489824",
  appId: "1:937835489824:web:73a8ebbe3e2b860f59ea45",
};

// Initialize Firebase
const firebaseInitialization = initializeApp(firebaseConfig);

export const auth = getAuth();

export default firebaseInitialization;
