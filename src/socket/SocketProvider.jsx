// src/socket/SocketProvider.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta?.env?.VITE_SOCKET_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000`;

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  // cria a instância UMA vez e não auto-conecta
  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  useEffect(() => {
    const s = socketRef.current;
    if (!s.connected) s.connect();     // conecta só uma vez na vida do app
    // não desconecta no unmount — queremos conexão estável
    return () => {};
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
