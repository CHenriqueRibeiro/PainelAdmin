// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ResetPassword from "../Screens/ResetPassword";
import ForgotPassword from "../Screens/ForgotPassword";
import Home from "../Screens/Home";
import Login from "../Screens/Login";
import Screen401 from "../Screens/Screen401";
import Reports from "../Screens/Reports";
import Establishment from "../Screens/Establishment";
import { useAuth } from "../Context/AuthContext";

import DashboardLayoutBasic from "../Components/DashboardSidebar";
import Costs from "../Screens/Costs";
import Products from "../Screens/Products";
import Budgets from "../Screens/Budgets";
import PublicBudgetPage from "../Screens/PublicBudgetPage";
import AgendamentoPublico from "../Screens/PublicScheduling";

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
        <Route path="/" element={user ? <Navigate to="/Home" /> : <Login />} />

        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha/:token" element={<ResetPassword />} />

        <Route path="/acessoNegado" element={<Screen401 />} />
        <Route path="/orcamento" element={<PublicBudgetPage />} />
<Route
          path="/agendamento/:establishmentId"
          element={<AgendamentoPublico />}
        />
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
        <Route
          path="gestão/custos"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Costs />} />
        </Route>
        <Route
          path="gestão/orcamentos"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Budgets />} />
        </Route>
        <Route
          path="gestão/estoque"
          element={<ProtectedRoute element={<DashboardLayoutBasic />} />}
        >
          <Route index element={<Products />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Rotas;
