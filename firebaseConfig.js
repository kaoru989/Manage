import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAbaLqHut6RXwC7a3Y8vZODSg4oW1ipPfA",
  authDomain: "mana-5e6f3.firebaseapp.com",
  projectId: "mana-5e6f3",
  storageBucket: "mana-5e6f3.appspot.com",
  messagingSenderId: "1027020152037",
  appId: "1:1027020152037:web:82bfd21f0884d1d9a9080c",
  measurementId: "G-MMWKVGRHTR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);