/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "@mui/material";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [establishments, setEstablishments] = useState([]);
  const [loadingEstablishments, setLoadingEstablishments] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [resetToken, setResetToken] = useState(null);

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
      console.log(data);
      setEstablishments(data.establishments || []);
    } catch (err) {
      console.error("Erro ao buscar estabelecimentos:", err);
      setEstablishments([]);
    } finally {
      setLoadingEstablishments(false);
    }
  };
  console.log(establishments);
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
      if (!response.ok)
        throw new Error(result.message || "Erro ao fazer login");
      if (result.requirePasswordChange) {
        return {
          requirePasswordChange: true,
          token: result.token,
        };
      }

      const userToStore = {
        ...result.owner,
        statusConta: result.statusConta,
        dataLimite: result.dataLimite,
      };
      setUser(userToStore);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("tokenExpiration", Date.now() + 60 * 60 * 1000);
      localStorage.setItem("user", JSON.stringify(userToStore));
      await buscarEstabelecimentos(result.owner?.id);

      return {
        requirePasswordChange: false,
        token: result.token,
      };
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("https://lavaja.up.railway.app/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.warn("Erro ao chamar logout no backend:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setEstablishments([]);
    }
  };

  const isTokenValid = () => {
    return !!localStorage.getItem("authToken");
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
    resetToken,
    requirePasswordChange,
    establishments,
    logout,
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
