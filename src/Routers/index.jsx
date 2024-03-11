import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Update from "../Screens/Update";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import Screen404 from "../Screens/Screen401";
import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import Reports from "../Screens/Reports";
import Establishment from "../Screens/Establishment";

const Rotas = () => {
  const { user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return null;
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/Home" /> : <Login />} />
        <Route path="/Cadastro" element={<Update />} />
        <Route path="/AcessoNegado" element={<Screen404 />} />
        <Route
          path="/Home"
          element={user !== null ? <Home /> : <Navigate to="/AcessoNegado" />}
        />
        <Route
          path="/Relatorios"
          element={
            user !== null ? <Reports /> : <Navigate to="/AcessoNegado" />
          }
        />
        <Route
          path="/Estabelecimento"
          element={
            user !== null ? <Establishment /> : <Navigate to="/AcessoNegado" />
          }
        />
      </Routes>
    </Router>
  );
};

export default Rotas;
