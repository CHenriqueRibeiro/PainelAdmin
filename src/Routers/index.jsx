// Rotas.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Update from "../Screens/Update";
import Home from "../Screens/Home";
const Rotas = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Update />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default Rotas;
