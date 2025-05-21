/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

function ChatPopUpIA({ token }) {
  const [mensagem, setMensagem] = useState("");
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const buscarMensagem = async () => {
    setCarregando(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/ia/prever-consumo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setMensagem(
        data.resposta || "Não foi possível obter a resposta da JáIA."
      );
    } catch (err) {
      console.error("Erro ao consultar a IA:", err);
      setMensagem("Erro ao consultar a JáIA.");
    } finally {
      setCarregando(false);
    }
  };

  const togglePopup = () => {
    if (!aberto) buscarMensagem();
    setAberto(!aberto);
  };

  return (
    <>
      <div
        onClick={togglePopup}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#AC42F7",
          color: "white",
          padding: "12px 16px",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 9999,
        }}
      >
        {aberto ? "Fechar JáIA" : "Abrir JáIA"}
      </div>

      {aberto && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "300px",
            maxHeight: "400px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            padding: "16px",
            overflowY: "auto",
            whiteSpace: "pre-line",
            zIndex: 9998,
            fontFamily: "sans-serif",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#AC42F7",
            }}
          >
            💡 JáIA Analisou:
          </div>
          {carregando ? "Analisando consumo..." : mensagem}
        </div>
      )}
    </>
  );
}

export default ChatPopUpIA;
