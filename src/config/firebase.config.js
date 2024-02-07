// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const dotenv = require("dotenv");

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: "afrique-spark",
  storageBucket: process.env.BUCKET_STORAGE,
  messagingSenderId: "30487110043",
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
const bucketStorage = getStorage(app);

module.exports = bucketStorage;
