/* eslint-disable react/prop-types */
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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

// eslint-disable-next-line react/prop-types
const EstablishmentServices = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
  setService = () => {},
}) => {
  const token = localStorage.getItem("authToken");

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

  useEffect(() => {
    if (!dataEstablishment?.length) return;

    const establishment = dataEstablishment[0];

    const allDays = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];

    const availableDays = Array.isArray(establishment.workingDays)
      ? allDays.filter((day) => establishment.workingDays.includes(day))
      : [];

    const service = establishment.services?.[0];

    const mappedAvailability = availableDays.map((day) => {
      const serviceDay = service?.availability?.find((d) => d.day === day);
      return {
        day,
        availableHours: serviceDay?.availableHours || [{ start: "", end: "" }],
      };
    });

    setAvailability(mappedAvailability);
  }, [dataEstablishment]);

  const [expandedService, setExpandedService] = useState(null);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
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

  const formatDay = (day) => {
    const daysOfWeek = {
      Monday: "Segunda-feira",
      Tuesday: "Terça-feira",
      Wednesday: "Quarta-feira",
      Thursday: "Quinta-feira",
      Friday: "Sexta-feira",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };

    return daysOfWeek[day] || day;
  };

  const formatHourRange = (start, end) => {
    const format = (time) => {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    };
    return `${format(start)} - ${format(end)}`;
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
      const response = await fetch(
        `https://backlavaja.onrender.com/api/services/establishment/${dataEstablishment[0]._id}/service`,
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
            establishment_id: dataEstablishment[0]._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar serviço");
      }

      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialog();
      setOpenDialog(false);
    } catch (error) {
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
        {[...Array(1)].map((_, index) => (
          <Grid2 key={index} size={{ xs: 12 }}>
            <Skeleton variant="text" width="100%" height={80} />
          </Grid2>
        ))}
      </Grid2>
    </Paper>
  );

  if (isLoading) {
    return <Box sx={{ width: "95%", mt: 5, mb: 3 }}>{renderSkeleton()}</Box>;
  }

  // eslint-disable-next-line react/prop-types
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
        {dataEstablishment[0].services.length === 0 ? (
          <Typography color="textSecondary">
            Cadastre serviço(s) para começar a receber agendamentos.
          </Typography>
        ) : (
          <>
            {dataEstablishment.map((establishment) => (
              <Box
                key={dataEstablishment[0]._id}
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
                        {expandedService === service._id
                          ? "Fechar"
                          : "Ver mais"}
                      </Typography>
                    </Box>
                    <Collapse in={expandedService === service._id}>
                      <Box sx={{ padding: 2 }}>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography
                              variant="caption"
                              color={"#AC42F7"}
                              fontWeight={600}
                            >
                              Descrição
                            </Typography>
                            <Typography variant="body2">
                              {service.description}
                            </Typography>
                          </Grid2>

                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Typography
                              variant="caption"
                              color={"#AC42F7"}
                              fontWeight={600}
                            >
                              Preço
                            </Typography>
                            <Typography variant="body2">
                              R$ {service.price}
                            </Typography>
                          </Grid2>

                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Typography
                              variant="caption"
                              color={"#AC42F7"}
                              fontWeight={600}
                            >
                              Duração
                            </Typography>
                            <Typography variant="body2">
                              {service.duration} minutos
                            </Typography>
                          </Grid2>

                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Typography
                              variant="caption"
                              color={"#AC42F7"}
                              fontWeight={600}
                            >
                              Limite Diário
                            </Typography>
                            <Typography variant="body2">
                              {service.dailyLimit}
                            </Typography>
                          </Grid2>
                          <Typography
                            variant="caption"
                            color="#AC42F7"
                            fontWeight={600}
                          >
                            Disponibilidade
                          </Typography>
                          <Grid2
                            size={{ xs: 12, sm: 6, md: 12 }}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 2,
                            }}
                          >
                            {service.availability.map((day) => (
                              <Box
                                key={day._id}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  color="#AC42F7"
                                >
                                  {formatDay(day.day)}{" "}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  {day.availableHours.map((hour, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        px: 2,
                                        py: 0.5,
                                        backgroundColor: "#E9D5FF",
                                        color: "#6B21A8",
                                        borderRadius: 2,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {formatHourRange(
                                        hour.start,
                                        hour.end
                                      )}{" "}
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            ))}
                          </Grid2>
                        </Grid2>
                      </Box>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
            color: "#fff",
            padding: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "center" }}
        >
          Criar novo serviço
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            onChange={(e) => setServiceName(e.target.value)}
            value={serviceName}
            label="Nome do serviço"
            size="small"
            sx={{
              mt: 2,
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <TextField
            label="Preço (R$)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <TextField
            label="Duração (min)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <TextField
            label="Limite diário"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />

          <Typography variant="caption" fontSize={18} fontWeight={600}>
            Horarios
          </Typography>

          <Grid2
            size={{ xs: 12, sm: 6, md: 12 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {availability.map((day, dayIndex) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 12 }} key={day.day}>
                <Typography variant="body2" fontWeight={500}>
                  {day.day}
                </Typography>
                {day.availableHours.map((hour, hourIndex) => (
                  <Grid2
                    key={hourIndex}
                    sx={{ display: "flex", gap: 1, mt: 0.5 }}
                  >
                    <TextField
                      label="Início"
                      type="time"
                      value={hour.start}
                      onChange={(e) =>
                        handleHourChange(
                          dayIndex,
                          hourIndex,
                          "start",
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{ bgcolor: "#fff", borderRadius: 2, width: "40%" }}
                    />
                    <TextField
                      label="Fim"
                      type="time"
                      value={hour.end}
                      onChange={(e) =>
                        handleHourChange(
                          dayIndex,
                          hourIndex,
                          "end",
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{ bgcolor: "#fff", borderRadius: 2, width: "40%" }}
                    />
                    <IconButton onClick={() => addAvailableHour(dayIndex)}>
                      <AddRoundedIcon sx={{ color: "#AC42F7" }} />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton
                      onClick={() => removeAvailableHour(dayIndex, hourIndex)}
                    >
                      <DeleteRoundedIcon sx={{ color: "#AC42F7" }} />
                    </IconButton>
                  </Grid2>
                ))}
              </Grid2>
            ))}
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#AC42F7",
              color: "#AC42F7",
              "&:hover": { borderColor: "#8a2be2", background: "#f9f5ff" },
            }}
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "#AC42F7",
              color: "#fff",
              "&:hover": { background: "#8a2be2" },
            }}
            onClick={handleCreateService}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstablishmentServices;
