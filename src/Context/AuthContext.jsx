/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [establishments, setEstablishments] = useState([]);
  const [loadingEstablishments, setLoadingEstablishments] = useState(false);
  const buscarEstabelecimentos = async (ownerId) => {
    try {
      setLoadingEstablishments(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://lavaja.up.railway.app/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setEstablishments(data.establishments || []);
    } catch (err) {
      console.error("Erro ao buscar estabelecimentos:", err);
      setEstablishments([]);
    } finally {
      setLoadingEstablishments(false);
    }
  };

  const cadastrarUsuario = async (email, senha, nomeDoCliente, telefone) => {
    const userData = {
      name: nomeDoCliente,
      email,
      phone: telefone,
      password: senha,
    };

    try {
      const response = await fetch(
        "https://lavaja.up.railway.app/api/owner/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Erro ao criar usuário");

      setUser(result.owner);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("tokenExpiration", Date.now() + 60 * 60 * 1000);
      localStorage.setItem("user", JSON.stringify(result.owner));

      await buscarEstabelecimentos(result.owner.id);
    } catch (error) {
      console.error("Erro:", error);
      throw error;
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await fetch(
        "https://lavaja.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: senha }),
        }
      );

      const result = await response.json();
      console.log(result.owner.id);
      if (!response.ok)
        throw new Error(result.message || "Erro ao fazer login");

      setUser(result.owner);
      console.log(user);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("tokenExpiration", Date.now() + 60 * 60 * 1000);
      await buscarEstabelecimentos(result.owner?.id);
      localStorage.setItem("user", JSON.stringify(result.owner));
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  };

  const isTokenValid = () => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = Date.now();
    if (tokenExpiration && currentTime < parseInt(tokenExpiration)) return true;

    localStorage.clear();
    return false;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      buscarEstabelecimentos(parsedUser.id);
    }
  }, []);

  const authContextValue = {
    user,
    cadastrarUsuario,
    login,
    isTokenValid,
    establishments,
    loadingEstablishments,
    buscarEstabelecimentos,
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
