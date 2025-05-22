import { Box } from "@mui/material";
import "react-perfect-scrollbar/dist/css/styles.css";
import EstablishmentData from "../Components/EstablishmentData";
import EstablishmentServices from "../Components/EstablishmentServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
export default function Establishment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState(true);
  const [establishment, setEstablishment] = useState(true);
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [isTokenValid]);
  const fetchEstablishments = async () => {
    const ownerId = OwnerUser.id;
    if (!ownerId || !token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao buscar estabelecimentos");

      const data = await response.json();
      setDataEstablishment(data.establishments);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, [service, establishment]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          alignItems: "center",
          background: "#F1EEFF",
          overflow: "auto",
        }}
      >
        <EstablishmentData
          dataEstablishment={dataEstablishment}
          isLoading={isLoading}
          setEstablishment={setEstablishment}
        />
        <EstablishmentServices
          dataEstablishment={dataEstablishment}
          isLoading={isLoading}
          setService={setService}
        />
      </Box>
    </>
  );
}
