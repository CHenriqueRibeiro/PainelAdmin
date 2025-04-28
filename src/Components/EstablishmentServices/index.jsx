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
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const EstablishmentServices = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));

  const [openDialog, setOpenDialog] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [availability, setAvailability] = useState([
    { day: "Segunda", availableHours: [{ start: "", end: "" }] },
    { day: "Terça", availableHours: [{ start: "", end: "" }] },
    { day: "Quarta", availableHours: [{ start: "", end: "" }] },
    { day: "Quinta", availableHours: [{ start: "", end: "" }] },
    { day: "Sexta", availableHours: [{ start: "", end: "" }] },
    { day: "Sábado", availableHours: [{ start: "", end: "" }] },
    { day: "Domingo", availableHours: [{ start: "", end: "" }] },
  ]);

  const [expandedService, setExpandedService] = useState(null);

  useEffect(() => {
    fetchEstablishments();
  }, [openDialog]);

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
    if (!serviceName || !price || !duration || !description || !dailyLimit) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const hasInvalidAvailability = availability.some((day) =>
      day.availableHours.some((hours) => hours.start === "" || hours.end === "")
    );
    if (hasInvalidAvailability) {
      alert("Por favor, preencha todos os horários de disponibilidade.");
      return;
    }

    const filteredAvailability = availability.filter((day) =>
      day.availableHours.some((hours) => hours.start && hours.end)
    );

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
            availability: filteredAvailability,
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

  const toggleExpandService = (serviceId) => {
    setExpandedService((prev) => (prev === serviceId ? null : serviceId));
  };

  const addAvailableHour = (dayIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours.push({ start: "", end: "" });
    setAvailability(newAvailability);
  };

  const removeAvailableHour = (dayIndex, hourIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours.splice(hourIndex, 1);
    setAvailability(newAvailability);
  };

  const handleHourChange = (dayIndex, hourIndex, field, value) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours[hourIndex][field] = value;
    setAvailability(newAvailability);
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
        {dataEstablishment.map((establishment) => (
          <Box
            key={establishment._id}
            sx={{ mb: 4, maxHeight: "13rem", overflow: "auto" }}
          >
            {establishment.services.map((service) => (
              <Box key={service._id} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#F1EEFF",
                    padding: 2,
                    borderRadius: 2,
                  }}
                  onClick={() => toggleExpandService(service._id)}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={"#AC42F7"}
                  >
                    {service.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#AC42F7" }}>
                    {expandedService === service._id ? "Fechar" : "Ver mais"}
                  </Typography>
                </Box>
                <Collapse in={expandedService === service._id}>
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="body2">
                      Descrição: {service.description}
                    </Typography>
                    <Typography variant="body2">
                      Preço: R${service.price}
                    </Typography>
                    <Typography variant="body2">
                      Duração: {service.duration} minutos
                    </Typography>
                    <Typography variant="body2">
                      Limite Diário: {service.dailyLimit}
                    </Typography>
                    <Typography variant="body2">
                      Disponibilidade:
                      {service.availability.map((day) => (
                        <Box
                          key={day._id}
                          sx={{ display: "inline-block", mr: 2 }}
                        >
                          <Typography variant="body2">
                            {day.day}:{" "}
                            {day.availableHours.map((hour, index) => (
                              <span key={index}>
                                {hour.start} - {hour.end}
                                {index < day.availableHours.length - 1 && ", "}
                              </span>
                            ))}
                          </Typography>
                        </Box>
                      ))}
                    </Typography>
                  </Box>
                </Collapse>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </Box>
        ))}
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

          {/* Campos de disponibilidade de horário */}
          {availability.map((day, dayIndex) => (
            <Box key={day.day}>
              <Typography variant="body2" fontWeight={600}>
                {day.day}
              </Typography>
              {day.availableHours.map((hour, hourIndex) => (
                <Box key={hourIndex} sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Início"
                    value={hour.start}
                    onChange={(e) =>
                      handleHourChange(
                        dayIndex,
                        hourIndex,
                        "start",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    label="Fim"
                    value={hour.end}
                    onChange={(e) =>
                      handleHourChange(
                        dayIndex,
                        hourIndex,
                        "end",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <Button
                    onClick={() => removeAvailableHour(dayIndex, hourIndex)}
                    color="error"
                  >
                    Remover
                  </Button>
                </Box>
              ))}
              <Button
                onClick={() => addAvailableHour(dayIndex)}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Adicionar horário
              </Button>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleCreateService}>Criar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstablishmentServices;
