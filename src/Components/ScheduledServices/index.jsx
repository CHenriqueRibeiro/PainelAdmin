/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
  Skeleton,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// eslint-disable-next-line react/prop-types
const ScheduledServices = ({ services, onUpdateService, loading, owner }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogScheduling, setOpenDialogScheduling] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { isTokenValid } = useAuth();
  const [openDialogStatus, setOpenDialogStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [date, setDate] = useState("");
  const [statusCreateNew, setStatusCreateNew] = useState("");
  const [service, setService] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSelectedStatus, setNewSelectedStatus] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const establishmentId = owner?.establishments[0]._id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  //const OwnerUser = JSON.parse(localStorage.getItem("user"));
  const statusCreate = [
    "Agendado",
    "Entregue",
    "Aguardando cliente",
    "Cancelado",
    "Iniciado",
  ];
  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleCloseDialogScheduling = () => {
    setOpenDialogScheduling(false);
  };
  const handleOpenDialogScheduling = () => {
    setOpenDialogScheduling(true);
    setDate("");
    setService("");
    setDate("");
  };
  useEffect(() => {
    if ((date, selectedDate)) {
      setLoadingServices(true);
      fetch(
        `https://backlavaja.onrender.com/api/availability/67d64cec87b9bd7f27e2dd8c?date=${date || selectedDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAvailableServices(data.services);
          setLoadingServices(false);
        })
        .catch(() => {
          setLoadingServices(false);
          alert("Erro ao buscar serviços.");
        });
    }
  }, [date, selectedDate]);

  useEffect(() => {
    if ((service && date) || (selectedDate && selectedDate)) {
      setLoadingSlots(true);
      fetch(
        `https://backlavaja.onrender.com/api/availability/67d64cec87b9bd7f27e2dd8c?date=${date || selectedDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          const serviceData = data.services.find(
            (s) => s.serviceId === service || s.serviceId === selectedService
          );
          setAvailableSlots(serviceData?.availableSlots || []);
          setAvailableHours(serviceData?.availableSlots || []);
          setLoadingSlots(false);
        })
        .catch(() => {
          setLoadingSlots(false);
          alert("Erro ao buscar horários.");
        });
    }
  }, [service, date, selectedService]);

  const handleSave = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(
        `https://backlavaja.onrender.com/api/appointments/appointments/${selectedAppointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startTime: selectedAppointment.startTime.split(" - ")[0],
            veiculo: selectedAppointment.veiculo,
            serviceName: selectedAppointment.serviceName,
            price: selectedAppointment.price,
          }),
        }
      );
      setOpenDialog(false);

      if (!response.ok) {
        throw new Error("Erro ao atualizar agendamento");
      }
      setSelectedAppointment(null);
      onUpdateService();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(
        `https://backlavaja.onrender.com/api/appointments/appointments/${selectedAppointment._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOpenDialog(false);

      if (!response.ok) {
        throw new Error("Erro ao deletar agendamento");
      }

      setSelectedAppointment(null);
      onUpdateService();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const newScheduling = async () => {
    try {
      if (!selectedSlot) return;

      const [startHourRaw, endHourRaw] = selectedSlot.split(" - ");
      const [startHourH, startHourM] = startHourRaw.split(":").map(Number);
      const [endHourH, endHourM] = endHourRaw.split(":").map(Number);

      const startHour = `${String(startHourH).padStart(2, "0")}:${String(
        startHourM
      ).padStart(2, "0")}`;

      const endHourDate = new Date();
      endHourDate.setHours(endHourH, endHourM - 1);

      const endTime = `${String(endHourDate.getHours()).padStart(2, "0")}:${String(
        endHourDate.getMinutes()
      ).padStart(2, "0")}`;

      const selectedService = availableServices.find(
        (s) => s.serviceId === service
      );

      const response = await fetch(
        `https://backlavaja.onrender.com/api/appointments/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName,
            clientPhone,
            veiculo,
            serviceId: service,
            date,
            serviceName: selectedService?.serviceName,
            establishmentId: establishmentId,
            startTime: startHour,
            endTime: endTime,
            price: selectedService?.price,
            status: statusCreateNew,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar agendamento");
      }
      setOpenDialogScheduling(false);
      setSelectedAppointment(null);
      onUpdateService();
      setClientName("");
      setClientPhone("");
      setVeiculo("");
      setDate("");
      setService("");
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [isTokenValid]);

  const handleOpenDialogStatus = (status, id) => {
    setCurrentStatus(status);
    setSelectedServiceId(id);
    setNewSelectedStatus(null);
    setOpenDialogStatus(true);
  };

  const handleCloseDialogStatus = () => {
    setOpenDialogStatus(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Entregue":
        return "success";
      case "Aguardando cliente":
        return "warning";
      case "Cancelado":
        return "error";
      case "Iniciado":
        return "info";
      case "Agendado":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedAppointments = useMemo(() => {
    if (!sortKey) return services;

    return [...services].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [sortKey, sortOrder, services]);

  return (
    <Box
      sx={{
        width: "95%",
        height: "auto",
        maxHeight: "35rem",
        mt: 5,
        background: "#f9f5ff",
        borderRadius: 5,
        p: 2,
        mb: 3,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
          pr: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#AC42F7">
          Agendamentos
        </Typography>
        <Tooltip title="Adicionar agendamento" arrow>
          <IconButton onClick={handleOpenDialogScheduling}>
            <AddRoundedIcon color="#D49EF5" />
          </IconButton>
        </Tooltip>
      </Box>

      {!isMobile && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1fr 1fr 1.5fr 1fr 0.5fr 0.46fr",
            alignItems: "center",
            pb: 1,
            borderBottom: "1px solid #ddd",
            color: "#ac42f7",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="start"
          >
            <Typography variant="body2">Nome</Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSort("time")}
          >
            <Typography variant="body2">Hora</Typography>
            {sortKey === "time" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <Typography variant="body2">Veículo</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <Typography variant="body2">Serviço</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSort("status")}
          >
            <Typography variant="body2">Status</Typography>
            {sortKey === "status" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="end"
            sx={{ cursor: "pointer", pr: 2 }}
            onClick={() => handleSort("value")}
          >
            <Typography variant="body2">Valor</Typography>
            {sortKey === "value" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <SettingsRoundedIcon fontSize="small" />
          </Box>
        </Box>
      )}
      <Box
        sx={{
          overflow: "auto",
          maxHeight: isMobile ? "30rem" : "40rem",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "0.6fr 0fr 1fr 0.4fr 0.8fr 0.6fr 0.4fr",
              alignItems: "center",
              py: 1,
              borderBottom: "1px solid #f0f0f0",
              color: "#6a1b9a",
              textAlign: isMobile ? "left" : "center",
            }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="100%" />
          </Box>
        ) : sortedAppointments.length === 0 ? (
          <Typography variant="body2" textAlign="center" p={2} color="#6a1b9a">
            Nenhum agendamento para hoje
          </Typography>
        ) : (
          sortedAppointments.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "0.8fr 1fr 1fr 1.5fr 1fr 0.44fr 0.46fr",
                alignItems: "center",
                py: 1,
                borderBottom: isMobile
                  ? "3px solid #f0f0f0"
                  : "1px solid #f0f0f0",
                color: "#6a1b9a",
                textAlign: isMobile ? "left" : "center",
              }}
            >
              {isMobile ? (
                <>
                  <Box
                    gap={1.2}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      gap={1.2}
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      width={"75%"}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        Nome: {item?.clientName}
                      </Typography>
                      <Typography variant="body2">
                        Hora: {item?.startTime}
                      </Typography>
                      <Typography variant="body2">
                        Veículo: {item?.veiculo}
                      </Typography>
                      <Typography variant="body2">
                        Serviço: {item?.serviceName}
                      </Typography>
                      <Typography variant="body2">
                        Status:{" "}
                        <Chip
                          variant="outlined"
                          size="small"
                          label={item.status}
                          color={getStatusColor(item.status)}
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            handleOpenDialogStatus(item.status, item._id)
                          }
                        />
                      </Typography>
                      <Typography variant="body2">
                        Valor: R$ {item?.price}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{ color: "#AC42F7", pr: 3 }}
                    >
                      <Tooltip title="Editar agendamento" arrow>
                        <MoreVertRoundedIcon />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    textAlign={"start"}
                  >
                    {item?.clientName}
                  </Typography>
                  <Typography variant="body2">{item?.startTime}</Typography>
                  <Typography variant="body2">{item?.veiculo}</Typography>
                  <Typography variant="body2">{item?.serviceName}</Typography>
                  <Chip
                    variant="outlined"
                    size="small"
                    label={item?.status}
                    color={getStatusColor(item?.status)}
                    onClick={() =>
                      handleOpenDialogStatus(item.status, item._id)
                    }
                  />
                  <Typography variant="body2" fontWeight={500}>
                    R$ {item?.price}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(item)}
                    sx={{ color: "#AC42F7" }}
                  >
                    <Tooltip title="Editar agendamento" arrow>
                      <MoreVertRoundedIcon />
                    </Tooltip>
                  </IconButton>
                </>
              )}
            </Box>
          ))
        )}
      </Box>

      <Dialog
        open={openDialogStatus}
        onClose={handleCloseDialogStatus}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
            borderRadius: 3,
            p: 1,
            color: "#FFFFFF",
          },
        }}
      >
        <DialogTitle>Atualizar status</DialogTitle>
        <DialogContent>
          <Typography>
            De: <strong>{currentStatus}</strong>
          </Typography>
          <Divider sx={{ my: 1, background: "#FFFFFF" }} />
          <Typography>Para:</Typography>
          <Box sx={{ mt: 2 }}>
            {[
              "Entregue",
              "Aguardando cliente",
              "Cancelado",
              "Iniciado",
              "Agendado",
            ]
              .filter((status) => status !== currentStatus)
              .map((status) => (
                <Chip
                  key={status}
                  label={status}
                  color={getStatusColor(status)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    cursor: "pointer",
                    border:
                      newSelectedStatus === status ? "2px solid #FFF" : "none",
                  }}
                  onClick={() => setNewSelectedStatus(status)}
                />
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCloseDialogStatus}
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
            }}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ background: "#ac42f7" }}
            onClick={async () => {
              if (!newSelectedStatus || !selectedServiceId) return;
              try {
                const response = await fetch(
                  `https://backlavaja.onrender.com/api/appointments/appointments/${selectedServiceId}`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newSelectedStatus }),
                  }
                );

                if (!response.ok) {
                  throw new Error(`Erro na requisição: ${response.statusText}`);
                }
                setOpenDialogStatus(false);
                setNewSelectedStatus(null);
                onUpdateService();
              } catch (error) {
                console.error("Erro ao atualizar status:", error);
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
        >
          Editar Agendamento
        </DialogTitle>

        <DialogContent>
          {selectedAppointment && (
            <>
              <TextField
                size="small"
                fullWidth
                disabled
                label="Nome do Cliente"
                value={selectedAppointment.clientName}
                sx={{
                  mb: 2,
                  mt: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              <LocalizationProvider
                adapterLocale="pt-br"
                localeText={
                  ptBR.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  label="Data"
                  value={selectedDate || dayjs(selectedAppointment.date)}
                  format="DD/MM/YYYY"
                  onChange={(newDate) => {
                    if (newDate && newDate.isSame(selectedDate, "day")) {
                      setSelectedDate(newDate);
                      return;
                    }
                    setSelectedDate(newDate);
                    setSelectedService("");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        mb: 2,
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              {selectedDate && (
                <TextField
                  label="Serviço"
                  select
                  fullWidth
                  size="small"
                  value={selectedService || selectedAppointment.serviceId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedService(value);
                  }}
                  sx={{
                    mb: 2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                >
                  {availableServices.map((service) => (
                    <MenuItem key={service.serviceId} value={service.serviceId}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {selectedService && (
                <TextField
                  label="Horário"
                  select
                  fullWidth
                  size="small"
                  value={
                    availableHours.find((slot) =>
                      slot.startsWith(selectedAppointment.startTime)
                    ) || ""
                  }
                  onChange={(e) =>
                    setSelectedAppointment({
                      ...selectedAppointment,
                      startTime: e.target.value,
                    })
                  }
                  sx={{
                    mb: 2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                >
                  {availableHours.map((slot, index) => (
                    <MenuItem key={index} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                size="small"
                fullWidth
                label="Veículo"
                value={selectedAppointment.veiculo}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    veiculo: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              <TextField
                size="small"
                fullWidth
                label="Valor"
                disabled="true"
                value={selectedAppointment.price}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    price: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Excluir
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#7209b7", color: "#fff" }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogScheduling}
        onClose={handleCloseDialogScheduling}
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
        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Dialog
            open={openDialogScheduling}
            onClose={handleCloseDialogScheduling}
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
              sx={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
            >
              Cadastrar Agendamento
            </DialogTitle>
            <DialogContent>
              <>
                <TextField
                  size="small"
                  fullWidth
                  label="Nome do Cliente"
                  sx={{
                    mt: 2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Nº Telefone"
                  sx={{
                    mt: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
                <TextField
                  size="small"
                  fullWidth
                  label="Veiculo"
                  sx={{
                    mt: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  value={veiculo}
                  onChange={(e) => setVeiculo(e.target.value)}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    label="Data"
                    format="DD/MM/YYYY"
                    value={date ? dayjs(date) : null}
                    onChange={(newValue) => {
                      if (newValue) setDate(newValue.format("YYYY-MM-DD"));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: {
                          mt: 2,
                          mb: 2,
                          bgcolor: "#fff",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        },
                      },
                      day: {
                        sx: {
                          "&.Mui-selected": {
                            backgroundColor: "#6b21a8",
                            color: "#FFFFFF",
                          },
                          "&:hover": {
                            backgroundColor: "#6b21a8",
                            color: "#FFFFFF",
                          },
                        },
                      },
                      popper: {
                        sx: {
                          "& .MuiPaper-root": {
                            borderRadius: 2,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>

                {date && (
                  <>
                    {loadingServices ? (
                      <CircularProgress
                        sx={{ display: "block", margin: "auto" }}
                      />
                    ) : (
                      <FormControl
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ mb: 2, background: "#FFFFFF", borderRadius: 2 }}
                      >
                        <InputLabel>Serviço</InputLabel>
                        <Select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          label="Serviço"
                          sx={{ borderRadius: 2 }}
                        >
                          {availableServices.map((service) => (
                            <MenuItem
                              key={service.serviceId}
                              value={service.serviceId}
                            >
                              {service.serviceName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {loadingSlots ? (
                      <CircularProgress
                        sx={{ display: "block", margin: "auto" }}
                      />
                    ) : (
                      service &&
                      availableSlots.length > 0 && (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ mb: 2, borderRadius: 2, background: "#FFFFFF" }}
                        >
                          <InputLabel>Horário</InputLabel>
                          <Select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            label="Horário"
                            sx={{ borderRadius: 2 }}
                          >
                            {availableSlots.map((slot, index) => (
                              <MenuItem key={index} value={slot}>
                                {slot}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )
                    )}

                    <TextField
                      fullWidth
                      size="small"
                      label="Preço"
                      value={
                        service
                          ? `R$ ${availableServices.find((s) => s.serviceId === service)?.price || 0}`
                          : ""
                      }
                      disabled
                      sx={{
                        mb: 2,
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </>
                )}

                <FormControl
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2, background: "#FFFFFF", borderRadius: 2 }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusCreateNew}
                    onChange={(e) => setStatusCreateNew(e.target.value)}
                    label="Status"
                    sx={{ borderRadius: 2 }}
                  >
                    {statusCreate.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialogScheduling}
                variant="contained"
                color="error"
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={newScheduling}
                variant="contained"
                sx={{
                  backgroundColor: "#7209b7",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5a0990",
                  },
                }}
              >
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledServices;
