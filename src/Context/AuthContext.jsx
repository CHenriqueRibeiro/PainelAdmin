// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const cadastrarUsuario = async (email, senha, nomeDoCliente, telefone) => {
    const userData = {
      name: nomeDoCliente,
      email: email,
      phone: telefone,
      password: senha,
    };

    try {
      const response = await fetch(
        "https://backlavaja.onrender.com/api/owner/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const result = await response.json();
      setUser(result.owner);
      const token = result.token;
      const expirationTime = new Date().getTime() + 60 * 60 * 1000;

      localStorage.setItem("authToken", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("user", JSON.stringify(result.owner));

      console.log("Usuário criado:", result);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const login = async (email, senha) => {
    const userData = {
      email: email,
      password: senha,
    };

    try {
      const response = await fetch(
        "https://backlavaja.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      const result = await response.json();
      setUser(result.owner);
      const token = result.token;
      const expirationTime = new Date().getTime() + 60 * 60 * 1000;

      localStorage.setItem("authToken", token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("user", JSON.stringify(result.owner));

      console.log("Login realizado com sucesso:", result);
    } catch (error) {
      console.error("Erro ao logar:", error);
    }
  };

  const isTokenValid = () => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();

    if (tokenExpiration && currentTime < parseInt(tokenExpiration)) {
      return true;
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    return false;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const authContextValue = {
    user,
    cadastrarUsuario,
    login,
    isTokenValid,
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
