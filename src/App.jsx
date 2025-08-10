import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import Rotas from "./Routers";
import { SocketProvider } from "./socket/SocketProvider";

function App() {
  return (
    <React.StrictMode>
       <SocketProvider>
      <AuthProvider>
        <Rotas />
        </AuthProvider>
        </SocketProvider>
    </React.StrictMode>
  );
}

export default App;
