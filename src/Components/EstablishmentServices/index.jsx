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
  InputLabel,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
// eslint-disable-next-line react/prop-types
const EstablishmentServices = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
  setService = () => {},
}) => {
  const token = localStorage.getItem("authToken");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [concurrentService, setConcurrentService] = useState(false);
  const [concurrentServiceValue, setConcurrentServiceValue] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [availability, setAvailability] = useState([]);
  const [availabilityEdit, setAvailabilityEdit] = useState([]);

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
    setAvailabilityEdit(mappedAvailability);
  }, [dataEstablishment, setAvailability]);

  const [expandedService, setExpandedService] = useState(null);

  const handleOpenDialog = () => {
    handleCloseDialog();
    setOpenDialog(true);
  };
  const handleOpenDialogEdit = (service) => {
    setServiceName(service.name);
    setPrice(String(service.price));
    setDuration(String(service.duration));
    setDescription(service.description);
    setDailyLimit(String(service.dailyLimit));
    setConcurrentService(service.concurrentService);
    setConcurrentServiceValue(
      service.concurrentServiceValue
        ? Number(service.concurrentServiceValue)
        : ""
    );

    setAvailabilityEdit(service.availability);
    setExpandedService(service._id);
    setOpenDialogEdit(true);
  };

  const handleUpdateService = async () => {
    if (!serviceName || !price || !duration || !description) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Preencha todos os campos");
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsLoadingButtonSave(true);
      const response = await fetch(
        `http://localhost:3000/api/services/establishment/${dataEstablishment[0]._id}/service/${expandedService}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: serviceName,
            price: Number(price),
            duration: Number(duration),
            description,
            //dailyLimit: Number(dailyLimit),
            availability,
            concurrentService,
            concurrentServiceValue: Number(concurrentServiceValue),
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar serviço");
      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialogEdit();
      setSnackbarSeverity("success");
      setSnackbarMessage("Serviço atualizado com sucesso");
      setOpenSnackbar(true);
    } catch {
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao atualizar serviço");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButtonSave(false);
    }
  };

  const handleCloseDialog = () => {
    setConcurrentService(false);
    setConcurrentServiceValue("");
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
  const handleCloseDialogEdit = () => {
    setConcurrentService(false);
    setConcurrentServiceValue("");
    setServiceName("");
    setPrice("");
    setDuration("");
    setDescription("");
    setDailyLimit("");
    setAvailabilityEdit(
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
    if (
      !serviceName ||
      !price ||
      !duration ||
      !description /*|| !dailyLimit*/
    ) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Preencha todos os campos");
      setOpenSnackbar(true);
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
      setIsLoadingButtonSave(true);
      const response = await fetch(
        `http://localhost:3000/api/services/establishment/${dataEstablishment[0]._id}/service`,
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
            //dailyLimit: Number(dailyLimit),
            availability: filteredAvailability,
            establishment_id: dataEstablishment[0]._id,
            concurrentService,
            concurrentServiceValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar serviço");
      }

      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      //handleCloseDialog();
      setOpenDialog(false);
      setSnackbarSeverity("success");
      setSnackbarMessage("Serviço criado com sucesso");
      setOpenSnackbar(true);
    } catch (error) {
      alert("Erro ao criar serviço");
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao criar serviço");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButtonSave(false);
    }
  };
  const handleDeleteService = async (serviceIdToDelete) => {
    try {
      setIsLoadingButton(true);
      const response = await fetch(
        `http://localhost:3000/api/services/establishment/${dataEstablishment[0]._id}/service/${serviceIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao excluir serviço");

      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialogEdit();
      setOpenDialogEdit(false);
      setSnackbarSeverity("success");
      setSnackbarMessage("Serviço excluído com sucesso");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao excluir serviço");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const toggleExpandService = (serviceId) => {
    setExpandedService((prev) => (prev === serviceId ? null : serviceId));
  };

  const addAvailableHour = (dayIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours.push({ start: "", end: "" });
    setAvailability(newAvailability);
    setAvailabilityEdit(newAvailability);
  };

  const removeAvailableHour = (dayIndex, hourIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours.splice(hourIndex, 1);
    setAvailability(newAvailability);
    setAvailabilityEdit(newAvailability);
  };

  const handleHourChange = (dayIndex, hourIndex, field, value) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours[hourIndex][field] = value;
    setAvailability(newAvailability);
    setAvailabilityEdit(newAvailability);
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
                        backgroundColor: "#F1EEFF",
                        padding: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={"#AC42F7"}
                      >
                        {service.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          width: isMobile ? "20%" : "8%",
                        }}
                      >
                        {expandedService === service._id ? (
                          <Tooltip title="Fechar detalhes">
                            <ArrowDropUpRoundedIcon
                              sx={{ color: "#AC42F7" }}
                              onClick={() => toggleExpandService(service._id)}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Abrir detalhes">
                            <ArrowDropDownRoundedIcon
                              sx={{ color: "#AC42F7" }}
                              onClick={() => toggleExpandService(service._id)}
                            />
                          </Tooltip>
                        )}
                        <Divider orientation="vertical" flexItem />
                        <Tooltip
                          title="Editar serviço"
                          onClick={() => handleOpenDialogEdit(service)}
                        >
                          <EditRoundedIcon sx={{ color: "#AC42F7" }} />
                        </Tooltip>
                      </Box>
                    </Box>
                    <Collapse in={expandedService === service._id}>
                      <Box sx={{ padding: 2 }}>
                        <Grid2 container spacing={2}>
                          <Grid2
                            size={{
                              xs: 12,
                              sm: 6,
                              md: service.concurrentService ? 4 : 6,
                            }}
                          >
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
                              Serviço simultâneo?
                            </Typography>
                            <Typography variant="body2">
                              {/*{service.dailyLimit}*/}
                              Sim
                            </Typography>
                          </Grid2>
                          {/*<Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Typography
                              variant="caption"
                              color={"#AC42F7"}
                              fontWeight={600}
                            >
                              Qtd. por dia
                            </Typography>
                            <Typography variant="body2">
                              {service.dailyLimit}
                            </Typography>
                          </Grid2>*/}
                          {service.concurrentService && (
                            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                              <Typography
                                variant="caption"
                                color={"#AC42F7"}
                                fontWeight={600}
                              >
                                Qtd de Lavagem simultânea
                              </Typography>
                              <Typography variant="body2">
                                {service.concurrentServiceValue}
                              </Typography>
                            </Grid2>
                          )}
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
                              flexWrap: "wrap",
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
        <DialogContent>
          <Grid2 container spacing={1.5} sx={{ mt: 2 }}>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Nome do serviço
              </InputLabel>
              <TextField
                fullWidth
                onChange={(e) => setServiceName(e.target.value)}
                value={serviceName}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição do serviço
              </InputLabel>
              <TextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Preço do serviço (R$)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Tempo do serviço (min)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            {/*<Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Quantidade de serviço por dia
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>*/}
            <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={concurrentService}
                    onChange={(e) => setConcurrentService(e.target.checked)}
                  />
                }
                label="Permitir atendimentos simultâneos?"
              />
            </Grid2>
            {concurrentService && (
              <>
                <Grid2 size={{ xs: 12 }}>
                  <InputLabel
                    sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                  >
                    Quantos atendimentos simultâneos?
                  </InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    value={concurrentServiceValue}
                    onChange={(e) => setConcurrentServiceValue(e.target.value)}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </Grid2>
              </>
            )}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="caption" fontSize={18} fontWeight={600}>
                Horários
              </Typography>
            </Grid2>

            <Grid2
              size={{ xs: 12 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {availability.map((day, dayIndex) => (
                <Grid2 size={{ xs: 12 }} key={day.day}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 17 }}
                  >
                    {day.day}
                  </Typography>

                  {day.availableHours.length === 0 ? (
                    <Tooltip title="Adicionar horário">
                      <IconButton onClick={() => addAvailableHour(dayIndex)}>
                        <AddRoundedIcon sx={{ color: "#AC42F7" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    day.availableHours.map((hour, hourIndex) => (
                      <Grid2
                        key={hourIndex}
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 1,
                          alignItems: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "35%",
                          }}
                        >
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Início
                          </InputLabel>
                          <TextField
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
                            sx={{ bgcolor: "#fff", borderRadius: 2 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "35%",
                          }}
                        >
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Fim
                          </InputLabel>
                          <TextField
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
                            sx={{ bgcolor: "#fff", borderRadius: 2 }}
                          />
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Tooltip title="Adicionar horário">
                            <IconButton
                              onClick={() => addAvailableHour(dayIndex)}
                            >
                              <AddRoundedIcon sx={{ color: "#AC42F7" }} />
                            </IconButton>
                          </Tooltip>
                          <Divider orientation="vertical" flexItem />
                          <Tooltip title="Remover horário">
                            <IconButton
                              onClick={() =>
                                removeAvailableHour(dayIndex, hourIndex)
                              }
                            >
                              <DeleteRoundedIcon sx={{ color: "#AC42F7" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid2>
                    ))
                  )}
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "1rem",
              padding: "8px 24px",
            }}
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            loading={isLoadingButtonSave}
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
            onClick={handleCreateService}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogEdit}
        onClose={handleCloseDialogEdit}
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
          Editar serviço
        </DialogTitle>
        <DialogContent>
          <Grid2 container spacing={1.5} sx={{ mt: 2 }}>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Nome do serviço
              </InputLabel>
              <TextField
                fullWidth
                onChange={(e) => setServiceName(e.target.value)}
                value={serviceName}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição do serviço
              </InputLabel>
              <TextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Preço do serviço (R$)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Tempo do serviço (min)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Quantidade de serviço por dia
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={concurrentService}
                    onChange={(e) => setConcurrentService(e.target.checked)}
                  />
                }
                label="Permitir atendimentos simultâneos?"
              />
            </Grid2>
            {concurrentService && (
              <>
                <Grid2 size={{ xs: 12 }}>
                  <InputLabel
                    sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                  >
                    Quantos atendimentos simultâneos?
                  </InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    value={concurrentServiceValue}
                    onChange={(e) => setConcurrentServiceValue(e.target.value)}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </Grid2>
              </>
            )}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="caption" fontSize={18} fontWeight={600}>
                Horários
              </Typography>
            </Grid2>

            <Grid2
              size={{ xs: 12 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {availabilityEdit.map((day, dayIndex) => (
                <Grid2 size={{ xs: 12 }} key={day.day}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 17 }}
                  >
                    {day.day}
                  </Typography>

                  {day.availableHours.length === 0 ? (
                    <Tooltip title="Adicionar horário">
                      <IconButton onClick={() => addAvailableHour(dayIndex)}>
                        <AddRoundedIcon sx={{ color: "#AC42F7" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    day.availableHours.map((hour, hourIndex) => (
                      <Grid2
                        key={hourIndex}
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 1,
                          alignItems: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "35%",
                          }}
                        >
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Início
                          </InputLabel>
                          <TextField
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
                            sx={{ bgcolor: "#fff", borderRadius: 2 }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "35%",
                          }}
                        >
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Fim
                          </InputLabel>
                          <TextField
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
                            sx={{ bgcolor: "#fff", borderRadius: 2 }}
                          />
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Tooltip title="Adicionar horário">
                            <IconButton
                              onClick={() => addAvailableHour(dayIndex)}
                            >
                              <AddRoundedIcon sx={{ color: "#AC42F7" }} />
                            </IconButton>
                          </Tooltip>
                          <Divider orientation="vertical" flexItem />
                          <Tooltip title="Remover horário">
                            <IconButton
                              onClick={() =>
                                removeAvailableHour(dayIndex, hourIndex)
                              }
                            >
                              <DeleteRoundedIcon sx={{ color: "#AC42F7" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid2>
                    ))
                  )}
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "1rem",
              padding: "8px 24px",
            }}
            onClick={() => setOpenDialogEdit(false)}
          >
            Cancelar
          </Button>
          <Button
            loading={isLoadingButton}
            variant="contained"
            color="error"
            sx={{
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
            onClick={() => handleDeleteService(expandedService)}
          >
            Excluir
          </Button>
          <Button
            variant="contained"
            loading={isLoadingButtonSave}
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
            onClick={handleUpdateService}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstablishmentServices;
