import { arrayUnion, collection, collectionGroup, doc, FieldPath, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { Message, User } from "../types"
import { db, storage } from "./config"
import { query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const handleSendMessage = async (idSending: User, idReceiving: User, message: string) => {
  const combinedId = idSending.id > idReceiving.id ? idSending.id + idReceiving.id : idReceiving.id + idSending.id;
  try {
    const chatRef = doc(db, "chats", combinedId);
    const chatDoc = await getDoc(chatRef);

    const messageObj: Message = {
      userId: idSending.id,
      content: message,
      read: false,
      date: Timestamp.now(),
      type: "text"
    }

    if (!chatDoc.exists()){

      await setDoc(doc(db, "chats", combinedId), { messages: [messageObj]});

      await setDoc(doc(db, "userChats", idReceiving.id), {
        [combinedId]: {
          userInfo: idSending,
          lastMessage: messageObj.type === "text" ? messageObj.content : "",
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

      await setDoc(doc(db, "userChats", idSending.id), {
        [combinedId]: {
          userInfo: idReceiving,
          lastMessage: messageObj.type === "text" ? messageObj.content : "",
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

    } else {
        await updateDoc(chatRef, {
            messages: arrayUnion(messageObj)
        });

        await setDoc(doc(db, "userChats", idSending.id), {
          [combinedId]: {
            userInfo: idReceiving,
            lastMessage: messageObj.type === "text" ? messageObj.content : "",
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })

        await setDoc(doc(db, "userChats", idReceiving.id), {
          [combinedId]: {
            userInfo: idSending,
            lastMessage: messageObj.type === "text" ? messageObj.content : "",
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })
        
    }

  }
  catch(err) {}
}

export const handleSendImage = async (idSending: User, idReceiving: User, image: any, file: any) => {
  const combinedId = idSending.id > idReceiving.id ? idSending.id + idReceiving.id : idReceiving.id + idSending.id;

  const language = navigator.language.substring(0,2);

  const date = Date.now();

  try {
    const chatRef = doc(db, "chats", combinedId);
    const chatDoc = await getDoc(chatRef);

    const imageRef = ref(storage, `chats/${combinedId + date + idSending.id + file.name}`);
    const metadata = {
      contentType: file.type
    };
    const resUpload = await uploadBytesResumable(imageRef, image, metadata);
    const url = await getDownloadURL(resUpload.ref);

    const messageObj: Message = {
      userId: idSending.id,
      content: url,
      read: false,
      date: Timestamp.now(),
      type: file.type
    }
    
    const lastMessageText = file.type.includes("video") ? "🎥 Video" : language === "es" ? "📸 Imagen" : "📸 Image";

    if (!chatDoc.exists()){

      await setDoc(doc(db, "chats", combinedId), { messages: [messageObj]});

      await setDoc(doc(db, "userChats", idReceiving.id), {
        [combinedId]: {
          userInfo: idSending,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

      await setDoc(doc(db, "userChats", idSending.id), {
        [combinedId]: {
          userInfo: idReceiving,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

    } else {
        await updateDoc(chatRef, {
            messages: arrayUnion(messageObj)
        });

        await setDoc(doc(db, "userChats", idSending.id), {
          [combinedId]: {
            userInfo: idReceiving,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })

        await setDoc(doc(db, "userChats", idReceiving.id), {
          [combinedId]: {
            userInfo: idSending,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })
        
    }

  }
  catch(err) {}

  return null;
}

export const handleSendFile = async (idSending: User, idReceiving: User, dataFile: any, file: any) => {
  const combinedId = idSending.id > idReceiving.id ? idSending.id + idReceiving.id : idReceiving.id + idSending.id;

  const language = navigator.language.substring(0,2);

  const date = Date.now();

  try {
    const chatRef = doc(db, "chats", combinedId);
    const chatDoc = await getDoc(chatRef);

    const imageRef = ref(storage, `chats/${combinedId + date + idSending.id + file.name}`);
    const metadata = {
      contentType: file.type
    };
    const resUpload = await uploadBytesResumable(imageRef, dataFile, metadata);
    const url = await getDownloadURL(resUpload.ref);

    const messageObj: any = {
      userId: idSending.id,
      content: url,
      read: false,
      date: Timestamp.now(),
      type: "file",
      name: file.name
    }
    
    const lastMessageText = language === "es" ? "📁 Archivo" : "📁 File";

    if (!chatDoc.exists()){

      await setDoc(doc(db, "chats", combinedId), { messages: [messageObj]});

      await setDoc(doc(db, "userChats", idReceiving.id), {
        [combinedId]: {
          userInfo: idSending,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

      await setDoc(doc(db, "userChats", idSending.id), {
        [combinedId]: {
          userInfo: idReceiving,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

    } else {
        await updateDoc(chatRef, {
            messages: arrayUnion(messageObj)
        });

        await setDoc(doc(db, "userChats", idSending.id), {
          [combinedId]: {
            userInfo: idReceiving,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })

        await setDoc(doc(db, "userChats", idReceiving.id), {
          [combinedId]: {
            userInfo: idSending,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })
        
    }

  }
  catch(err) {}

  return null;
}

export const getChat = async (myId: string, anotherId: string) => {
  const combinedId = myId > anotherId ? myId + anotherId : anotherId + myId;

  try {
    const chatRef = doc(db, "chats", combinedId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      return null;
    }

    const chat = { ...chatDoc.data() };

    return chat;
  } catch (error) {
    return null;
  }

}

export const handleSendAudio = async (idSending: User, idReceiving: User, audio: any) => {
  const combinedId = idSending.id > idReceiving.id ? idSending.id + idReceiving.id : idReceiving.id + idSending.id;

  const language = navigator.language.substring(0,2);

  const date = Date.now();

  try {
    const chatRef = doc(db, "chats", combinedId);
    const chatDoc = await getDoc(chatRef);

    const name = uuidv4();
    const fileRef = ref(storage, `${combinedId + date + idSending.id + name}`);
    const file = await uploadBytes(fileRef, audio);

    const url = await getDownloadURL(fileRef);

    const messageObj: any = {
      userId: idSending.id,
      content: url,
      read: false,
      date: Timestamp.now(),
      type: "audio"
    }
    
    const lastMessageText = language === "es" ? "🎙️ Nota de voz" : "🎙️ Voice";

    if (!chatDoc.exists()){

      await setDoc(doc(db, "chats", combinedId), { messages: [messageObj]});

      await setDoc(doc(db, "userChats", idReceiving.id), {
        [combinedId]: {
          userInfo: idSending,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

      await setDoc(doc(db, "userChats", idSending.id), {
        [combinedId]: {
          userInfo: idReceiving,
          lastMessage: lastMessageText,
          lastMessageIdUser: idSending.id,
          date: serverTimestamp()
        }
      }, { merge: true })

    } else {
        await updateDoc(chatRef, {
            messages: arrayUnion(messageObj)
        });

        await setDoc(doc(db, "userChats", idSending.id), {
          [combinedId]: {
            userInfo: idReceiving,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })

        await setDoc(doc(db, "userChats", idReceiving.id), {
          [combinedId]: {
            userInfo: idSending,
            lastMessage: lastMessageText,
            lastMessageIdUser: idSending.id,
            date: serverTimestamp()
          }
        }, { merge: true })
        
    }

  }
  catch(err) {}

  return null;
}
