// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyD1lrk72djddDJAct0iJw0tlyFoRWb2Sn4",
authDomain: "medicheck-group-project-24b44.firebaseapp.com",
projectId: "medicheck-group-project-24b44",
storageBucket: "medicheck-group-project-24b44.appspot.com",
messagingSenderId: "844456570809",
appId: "1:844456570809:web:b66fc74f80c4cfd9ab9068",
measurementId: "G-VT2PKYZ32F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {firebase}