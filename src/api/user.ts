import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db, storage } from "./config";
import { User } from "../types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore";

export const updateUser = async (id: string, field: any) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, field);
    } catch (error) {
      return error;
    }
  };
  
  export const uploadFiles = async (uid: any, files: any) => {
    try {
      const imageRef = ref(storage, `users/${uid}`);
      const resUpload = await uploadBytes(imageRef, files);
      const url = await getDownloadURL(resUpload.ref);
      await updateUser(uid, { image: url });
  
      return url;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getUser = async (id: string) => {
    try {
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        return null;
      }
  
      const user = { ...userDoc.data(), id } as User;
  
      return user;
    } catch (error) {
      return null;
    }
  };

  export const getUserByEmail = async (email: string) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email.toLowerCase()));

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs[0].data();

    } catch (error) {
      return null;
    }
  };