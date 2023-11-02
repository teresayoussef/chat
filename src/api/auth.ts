import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  AuthErrorCodes,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "./config";
import { getUser, updateUser } from "./user";

interface SignUpUserData {
  name: string;
  email: string;
  password: string;
}

interface LogInUserData {
  email: string;
  password: string;
}

export const signUp = async ({ name, email, password }: SignUpUserData) => {

  const language = navigator.language.substring(0,2);

  if(name !== ""){
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
      });
  
      return null;
    } catch (error) {
  
      let errorMessage = language === "es" ? "Error desconocido" : "Unknown error";
  
      if (error instanceof FirebaseError) {
        console.log(error.code)
        switch (error.code) {
          case AuthErrorCodes.INVALID_EMAIL:
          case "auth/missing-email":
            errorMessage = language === "es" ? "Email inválido" : "Invalid email";
            break;
          case AuthErrorCodes.INTERNAL_ERROR:
            errorMessage = language === "es" ? "Ingrese su contraseña" : "Enter your password";
            break;
          case AuthErrorCodes.EMAIL_EXISTS:
            errorMessage = language === "es" ? "El email ingresado ya está en uso" : "The email entered is already in use";
            break;
          default:
            errorMessage = language === "es" ? "Error desconocido" : "Unknown error";
            break;
        }
      }
      return errorMessage;
    }
  } else {
    return language === "es" ? "Ingrese su nombre" : "Enter your name";
  }
};

export const logIn = async ({ email, password }: LogInUserData) => {

  const language = navigator.language.substring(0,2);

  try {
    await signInWithEmailAndPassword(auth, email, password);

    return null;
  } catch (error) {
    let errorMessage = language === "es" ? "Error desconocido" : "Unknown error";

    if (error instanceof FirebaseError) {
      console.log(error.code)
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
        case "auth/missing-email":
          errorMessage = language === "es" ? "Email inválido" : "Invalid email";
          break;
        case AuthErrorCodes.INTERNAL_ERROR:
          errorMessage = language === "es" ? "Ingrese su contraseña" : "Enter your password";
          break;
        case AuthErrorCodes.USER_DELETED:
        case AuthErrorCodes.INVALID_PASSWORD:
          errorMessage = language === "es" ? "Email o contraseña incorrectos" : "Wrong email or password";
          break;
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          errorMessage = language === "es" ? "Cuenta bloqueada temporalmente" : "Account temporarily blocked";
          break;
        default:
          errorMessage = language === "es" ? "Error desconocido" : "Unknown error";
          break;
      }
    }
    return errorMessage;
  }
};

export const GoogleUser = async (userData: any, uid: string, photo: any) => {
  try {
    const user = await getUser(uid);
    if (!user) {
      await setDoc(doc(db, "users", uid), userData);
      await updateUser(uid, { image: photo });
    }
  } catch(error) {
    return null;
  }
}

export const GoogleAuth = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const credentials = await signInWithPopup(auth, provider);
    console.log(credentials);

    auth.onAuthStateChanged((user) => {
      if (user) {
        
        const userData = {
          name: credentials.user.displayName!,
          email: credentials.user.email!,
        };

        GoogleUser(userData, user.uid, user.photoURL)

      }
    });

  } catch(error) {
    console.log(error)
  }
}

export const signOut = async () => {
  const language = navigator.language.substring(0,2);
  try {
    await firebaseSignOut(auth);
    return null;
  } catch (error) {
    return language === "es" ? "Error desconocido" : "Unknown error";
  }
};
