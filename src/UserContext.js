import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importe AsyncStorage

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDoc, setUserDoc] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [retiradaDate, setRetiradaDate] = useState(new Date());
  const [entregaDate, setEntregaDate] = useState(new Date());


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const fetchUserDoc = async () => {
    try {
      const docRef = doc(collection(db, "users"), auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserDoc(userData);

        // Salvar o documento do usuário no AsyncStorage
        await AsyncStorage.setItem("userDoc", JSON.stringify(userData));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  const updateUserDoc = async () => {
    try {
      const savedUserDoc = await AsyncStorage.getItem("userDoc");
      if (savedUserDoc) {
        setUserDoc(JSON.parse(savedUserDoc));
      }

      const user = auth.currentUser;
      if (user) {
        await fetchUserDoc();
      }
    } catch (error) {
      console.error("Erro ao atualizar o documento do usuário:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userDoc,
        updateUserDoc,
        isLoggedIn,
        showAccount,
        setShowAccount,
        retiradaDate,
        setRetiradaDate,
        entregaDate,
        setEntregaDate
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
