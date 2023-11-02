import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
import { enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBM2WFEPzgH9V-PYUl7cCcFGYpSFIbRvkQ",
  authDomain: "chat-distri.firebaseapp.com",
  projectId: "chat-distri",
  storageBucket: "chat-distri.appspot.com",
  messagingSenderId: "632055324249",
  appId: "1:632055324249:web:a326df518ae1ce635cdb48"
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
