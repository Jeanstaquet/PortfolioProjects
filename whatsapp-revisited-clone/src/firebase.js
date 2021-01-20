import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAetezyzd_TAHEUZlwBR7FgJKY7vieoebY",
  authDomain: "whatsappclone-46523.firebaseapp.com",
  databaseURL: "https://whatsappclone-46523-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whatsappclone-46523",
  storageBucket: "whatsappclone-46523.appspot.com",
  messagingSenderId: "272957554470",
  appId: "1:272957554470:web:1a306e6788a8c366044be7",
  measurementId: "G-N99EH26459"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export {auth, provider, storage};
export default db