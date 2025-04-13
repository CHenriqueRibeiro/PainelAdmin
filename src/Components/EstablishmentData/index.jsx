// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Skeleton,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const ScheduledData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const { isTokenValid } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEstablishments();
  }, []);

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
        `https://backlavaja.onrender.com/api/establishment/owner/${ownerId}`,
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
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkeleton = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#AC42F7">
          Estabelecimento
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid2 container spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Grid2 key={index} xs={12} sm={4}>
            <Skeleton variant="text" width="80%" height={25} />
          </Grid2>
        ))}
      </Grid2>
    </Paper>
  );

  if (isLoading) {
    return <Box sx={{ width: "95%", mt: 5, mb: 3 }}>{renderSkeleton()}</Box>;
  }

  if (!dataEstablishment.length) return null;

  const establishment = dataEstablishment[0];

  return (
    <Box sx={{ width: "95%", mt: 5, mb: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#AC42F7">
            Estabelecimento
          </Typography>
          {dataEstablishment.length <= 0 && (
            <Tooltip title="Adicionar Estabelecimento">
              <IconButton>
                <AddRoundedIcon sx={{ color: "#AC42F7" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />

        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6}>
            <Typography color="#AC42F7">
              <strong>Nome:</strong> {establishment.nameEstablishment}
            </Typography>
          </Grid2>

          <Grid2 xs={12} sm={6}>
            <Typography color="#AC42F7">
              <strong>Endereço:</strong> {establishment.address.street}
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Typography color="#AC42F7">
              <strong>Número:</strong> {establishment.address.number}
            </Typography>
          </Grid2>

          <Grid2 xs={12} sm={4}>
            <Typography color="#AC42F7">
              <strong>Bairro:</strong> {establishment.address.neighborhood}
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Typography color="#AC42F7">
              <strong>Cidade:</strong> {establishment.address.city}
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Typography color="#AC42F7">
              <strong>Estado:</strong> {establishment.address.state}
            </Typography>
          </Grid2>

          <Grid2 xs={12} sm={6}>
            <Typography color="#AC42F7">
              <strong>Hora de abertura:</strong>{" "}
              {establishment.openingHours.open}
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Typography color="#AC42F7">
              <strong>Hora de encerramento:</strong>{" "}
              {establishment.openingHours.close}
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default ScheduledData;
