// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext } from "react";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { app } from "../FirebaseConfig/Firebase";

const FirestoreContext = createContext();

// eslint-disable-next-line react/prop-types
export const FirestoreProvider = ({ children }) => {
  const firestore = getFirestore(app);

  const cadastrarEstabelecimento = async (userId, dadosEstabelecimento) => {
    try {
      const estabelecimentosRef = collection(firestore, "Estabelecimentos");
      const userDocRef = doc(estabelecimentosRef, userId);
      await setDoc(userDocRef, dadosEstabelecimento);
    } catch (error) {
      console.error("Erro ao cadastrar estabelecimento:", error.message);
    }
  };

  const firestoreContextValue = {
    cadastrarEstabelecimento,
  };

  return (
    <FirestoreContext.Provider value={firestoreContextValue}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error(
      "useFirestore deve ser usado dentro de um FirestoreProvider"
    );
  }
  return context;
};
