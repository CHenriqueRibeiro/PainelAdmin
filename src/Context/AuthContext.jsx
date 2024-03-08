/* eslint-disable react-refresh/only-export-components */
// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../FirebaseConfig/Firebase";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const cadastrarUsuario = async (email, senha) => {
    try {
      const auth = getAuth(app);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      return userCredential;
    } catch (error) {
      console.error("Erro ao cadastrar:", error.message);
    }
  };

  const authContextValue = {
    cadastrarUsuario,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
