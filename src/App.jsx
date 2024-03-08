import React from "react";
import { AuthProvider } from "./Context/AuthContext";
import Rotas from "./Routers";
import { FirestoreProvider } from "./Context/FirestoreContext";

function App() {
  return (
    <React.StrictMode>
      <FirestoreProvider>
        <AuthProvider>
          <Rotas />
        </AuthProvider>
      </FirestoreProvider>
    </React.StrictMode>
  );
}

export default App;
