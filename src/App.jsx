import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import Rotas from "./Routers";

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
