import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db, messaging } from "../api/config";
import { User } from "../types";
import { getToken } from "firebase/messaging";

const UserContext = createContext<User | null>(null);

const useUser = () => {
  return useContext(UserContext);
};

interface Props {
  children: React.ReactNode;
}

const UserProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser: Unsubscribe | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribeUser?.();

      if (user) {
        const userDoc = doc(db, "users", user.uid);
        unsubscribeUser = onSnapshot(userDoc, (snapshot) => {
          const userData = {
            id: user.uid,
            ...snapshot.data(),
          } as User;

          // @ts-ignore
          if (!user.token) {
            getToken(messaging, {
              vapidKey:
                "BHl7GK5grEYe84CHazk1ijKMHd6JxY05MJKK-0KCyYih6TOeq5V8m2NGwbDKani0E4xK5Is9eGRBedr35WwGW3M",
            })
              .then(async (currentToken) => {
                if (currentToken) {
                  console.log(currentToken);

                  const id = auth.currentUser?.uid;

                  if (id) {
                    const userDoc = doc(db, "users", id);
                    await updateDoc(userDoc, {
                      token: currentToken,
                    });
                  }
                } else {
                  // Show permission request UI
                  console.log(
                    "No registration token available. Request permission to generate one."
                  );
                  // ...
                }
              })
              .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
                // ...
              });
          }

          setUser(userData);
          setLoading(false);
        });

        return;
      }

      setUser(null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={user}>{!loading && children}</UserContext.Provider>;
};

export { useUser, UserProvider };
