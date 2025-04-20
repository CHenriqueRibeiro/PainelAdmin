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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const EstablishmentServices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const { isTokenValid } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));

  const [openDialog, setOpenDialog] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");

  const [availability, setAvailability] = useState([
    {
      day: "Segunda",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Terça",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Quarta",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Quinta",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Sexta",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Sábado",
      availableHours: [{ start: "", end: "" }],
    },
    {
      day: "Domingo",
      availableHours: [{ start: "", end: "" }],
    },
  ]);

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
  console.log(dataEstablishment);
  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setServiceName("");
    setPrice("");
    setDuration("");
    setDescription("");
    setDailyLimit("");
    setAvailability(
      availability.map((day) => ({
        ...day,
        availableHours: [{ start: "", end: "" }],
      }))
    );
  };

  const handleCreateService = async () => {
    try {
      const establishment = dataEstablishment[0];
      const response = await fetch(
        `https://backlavaja.onrender.com/api/services/establishment/${establishment._id}/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: serviceName,
            price: Number(price),
            duration: Number(duration),
            description,
            dailyLimit: Number(dailyLimit),
            availability,
            establishment_id: establishment._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar serviço");
      }

      handleCloseDialog();
      alert("Serviço criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar serviço");
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
          Serviços
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
            Serviços
          </Typography>
          <Tooltip title="Adicionar serviço">
            <IconButton onClick={handleOpenDialog}>
              <AddRoundedIcon sx={{ color: "#AC42F7" }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ my: 2 }} />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Criar novo serviço</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nome do serviço"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            label="Preço (R$)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Duração (min)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
          />
          <TextField
            label="Limite diário"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            fullWidth
          />

          <Divider />
          <Typography variant="subtitle1" fontWeight={600}>
            Disponibilidade por dia
          </Typography>

          {availability.map((day, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 2, alignItems: "center" }}
            >
              <Typography width={90}>{day.day}</Typography>
              <TextField
                label="Início"
                type="time"
                value={day.availableHours[0].start}
                onChange={(e) => {
                  const updated = [...availability];
                  updated[index].availableHours[0].start = e.target.value;
                  setAvailability(updated);
                }}
              />
              <TextField
                label="Fim"
                type="time"
                value={day.availableHours[0].end}
                onChange={(e) => {
                  const updated = [...availability];
                  updated[index].availableHours[0].end = e.target.value;
                  setAvailability(updated);
                }}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateService}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstablishmentServices;
