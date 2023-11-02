import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import { enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBa0FLLRPKNO_-tBoET5Ju7ZzGEAEfj9xM",
  authDomain: "rooms-5dd25.firebaseapp.com",
  projectId: "rooms-5dd25",
  storageBucket: "rooms-5dd25.appspot.com",
  messagingSenderId: "770160537933",
  appId: "1:770160537933:web:35471ca3873bdd7c64c704",
  measurementId: "G-CDQM01S1FN"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const messaging = getMessaging(app);

const storage = getStorage(app);

const analytics = getAnalytics(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code === "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});
// Subsequent queries will use persistence, if it was enabled successfully

export { auth, db, messaging, storage };
