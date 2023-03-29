import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEueTfPTL4o5qcSVJ4vAaLXxi_9Dpc1Jc",
  authDomain: "gvmsg-d88c0.firebaseapp.com",
  projectId: "gvmsg-d88c0",
  storageBucket: "gvmsg-d88c0.appspot.com",
  messagingSenderId: "850608850448",
  appId: "1:850608850448:web:b686da95dd2313f9c76c95",
};

// initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
