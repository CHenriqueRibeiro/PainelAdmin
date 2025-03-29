// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Update from "../Screens/Update";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import Screen401 from "../Screens/Screen401";
import Reports from "../Screens/Reports";
import Establishment from "../Screens/Establishment";
import { useAuth } from "../Context/AuthContext";

// Layout com menu
import DashboardLayoutBasic from "../Components/DashboardSidebar"; // Importar o layout que inclui o menu

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  const { isTokenValid } = useAuth();
  return isTokenValid() ? element : <Navigate to="/" />;
};

const Rotas = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const { isTokenValid } = useAuth();

  useEffect(() => {
    if (isTokenValid()) {
      setUser(localStorage.getItem("user"));
    } else {
      setUser(null);
    }
    setAuthChecked(true);
  }, [isTokenValid]);

  if (!authChecked) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/cadastro" element={<Update />} />
        <Route path="/acessoNegado" element={<Screen401 />} />

        <Route
          path="/home"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Home />} />
        </Route>
        <Route
          path="/relatorios"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Reports />} />
        </Route>
        <Route
          path="/estabelecimento"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Establishment />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Rotas;
