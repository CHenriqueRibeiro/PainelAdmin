import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Update from "../Screens/Update";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import Screen404 from "../Screens/Screen404";
import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";

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
      </Routes>
    </Router>
  );
};

export default Rotas;
