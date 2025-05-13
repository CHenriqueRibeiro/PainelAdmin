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
  Menu,
  Snackbar,
  Alert,
  Popper,
  Paper,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputMask from "react-input-mask";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
///import Alert from "@mui/material/Alert";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

// eslint-disable-next-line react/prop-types
const ScheduledServices = ({
  services,
  onUpdateService,
  loading,
  owner,
  setDaySelect = () => {},
  daySelect,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogData, setOpenDialogData] = useState(false);
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
  const establishmentId = owner?.establishments[0]?._id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorElStatus, setAnchorElStatus] = useState(null);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [anchorElDate, setAnchorElDate] = useState(null);
  const servicesEstablishment = owner?.establishments[0]?.services.length;
  const open = Boolean(anchorElDate);
  const dateServices = dayjs();
  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  const handleClickMenu = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElStatus(null);
  };
  const statusCreate = [
    "Agendado",
    "Entregue",
    "Aguardando cliente",
    "Cancelado",
    "Iniciado",
  ];
  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setAnchorEl(null);
    setOpenDialog(true);
  };
  const handleEditClickData = (appointment) => {
    setSelectedAppointment(appointment);
    setAnchorEl(null);
    setOpenDialogData(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    //setSelectedAppointment(null);
    //setSelectedDate("");
    //setSelectedService("");
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
  const handleCloseData = () => {
    setOpenDialogData(false);
  };
  useEffect(() => {
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setLoadingServices(true);
      fetch(
        `http://localhost:3000/api/availability/${establishmentId}?date=${date}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableServices(data.services);
          setLoadingServices(false);
        })
        .catch(() => {
          setLoadingServices(false);
          alert("Erro ao buscar serviços.");
        });
    }
  }, [date]);
  useEffect(() => {
    if (service && date) {
      setLoadingSlots(true);

      fetch(
        `http://localhost:3000/api/availability/${establishmentId}?date=${date}`
      )
        .then((res) => res.json())
        .then((data) => {
          const serviceData = data.services.find(
            (s) => s.serviceId === service
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
  }, [service, date]);
  useEffect(() => {
    if (selectedDate) {
      setLoadingServices(true);

      fetch(
        `http://localhost:3000/api/availability/${establishmentId}?date=${selectedDate}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableServices(data.services);
          setSelectedService("");
          setAvailableSlots([]);
          setAvailableHours([]);
          setLoadingServices(false);
        })
        .catch(() => {
          setLoadingServices(false);
          alert("Erro ao buscar serviços.");
        });
    }
  }, [selectedDate]);
  useEffect(() => {
    if (selectedDate && selectedService) {
      setLoadingSlots(true);

      fetch(
        `http://localhost:3000/api/availability/${establishmentId}?date=${selectedDate}`
      )
        .then((res) => res.json())
        .then((data) => {
          const serviceData = data.services.find(
            (s) => s.serviceId === selectedService
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
  }, [selectedDate, selectedService]);

  const handleSave = async () => {
    if (!selectedAppointment) return;

    try {
      setIsLoadingButtonSave(true);

      const response = await fetch(
        `http://localhost:3000/api/appointments/appointments/${selectedAppointment._id}`,
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

      if (!response.ok) {
        throw new Error("Erro ao atualizar agendamento");
      }

      setOpenDialog(false);
      setOpenDialogData(false);
      setSnackbarMessage("Alteração salva com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setSelectedAppointment(null);
      onUpdateService();
      setSelectedDate("");
      setSelectedService("");
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarMessage("Erro ao atualizar agendamento.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButtonSave(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    try {
      setIsLoadingButton(true);

      const response = await fetch(
        `http://localhost:3000/api/appointments/appointments/${selectedAppointment._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar agendamento");
      }

      setOpenDialog(false);
      setOpenDialogData(false);
      setSelectedAppointment(null);
      onUpdateService();
      setSelectedDate("");
      setSelectedService("");
      setSnackbarMessage("Agendamento deletado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarMessage("Erro ao deletar agendamento.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const newScheduling = async () => {
    try {
      setIsLoadingButtonSave(true);
      if (!selectedSlot) {
        setSnackbarSeverity("error");
        setSnackbarMessage("É preciso preencher os dados");
        setOpenSnackbar(true);
        return;
      }

      const [startHourRaw, endHourRaw] = selectedSlot.split(" - ");
      const [startHourH, startHourM] = startHourRaw.split(":").map(Number);
      const [endHourH, endHourM] = endHourRaw.split(":").map(Number);

      const startHour = `${String(startHourH).padStart(2, "0")}:${String(startHourM).padStart(2, "0")}`;
      const endHourDate = new Date();
      endHourDate.setHours(endHourH, endHourM - 1);
      const endTime = `${String(endHourDate.getHours()).padStart(2, "0")}:${String(endHourDate.getMinutes()).padStart(2, "0")}`;

      const selectedService = availableServices.find(
        (s) => s.serviceId === service
      );

      const response = await fetch(
        `http://localhost:3000/api/appointments/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      setSnackbarSeverity("success");
      setSnackbarMessage("Agendamento salvo com sucesso!");
      setOpenSnackbar(true);
      setOpenDialogScheduling(false);
      setSelectedAppointment(null);
      onUpdateService();
      setClientName("");
      setClientPhone("");
      setVeiculo("");
      setDate("");
      setSelectedDate("");
      setService("");
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao criar agendamento.");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButtonSave(false);
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
  useEffect(() => {
    if (openDialog && selectedAppointment) {
      setSelectedDate(selectedAppointment.date);
    }
  }, [openDialog, selectedAppointment]);

  const handleIconClick = (e) => {
    setAnchorElDate(open ? null : e.currentTarget);
  };

  const handleDateChange = (newDate) => {
    if (newDate && newDate.isValid()) {
      const str = newDate.format("YYYY-MM-DD");
      setDaySelect(str);
    }
    setAnchorElDate(null);
  };

  return (
    <Box
      sx={{
        width: "95%",
        height: "auto",
        maxHeight: "35rem",
        overflow: "hidden",
        mt: 5,
        background: "#f9f5ff",
        borderRadius: 5,
        p: 2,
        mb: 3,
        boxShadow: 3,
      }}
    >
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            borderRadius: 2,
            gap: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#AC42F7">
            Agendamentos
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#AC42F7",
              borderRadius: 2,
              width: "10rem",
              height: "1.8rem",
              gap: 1,
            }}
          >
            <Tooltip title="Selecionar data" arrow>
              <IconButton onClick={handleIconClick}>
                <CalendarMonthRoundedIcon sx={{ color: "#FFFFFF" }} />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Typography
              variant="body2"
              fontWeight={500}
              color="#FFFFFF"
              sx={{ p: 1 }}
            >
              {dayjs(daySelect).format("DD/MM/YYYY")}
            </Typography>
          </Box>

          <Popper
            open={open}
            anchorEl={anchorElDate}
            placement="bottom-start"
            sx={{ zIndex: 1300 }}
          >
            <Paper sx={{ mt: 1, borderRadius: 2, boxShadow: 3 }}>
              <LocalizationProvider
                adapterLocale="pt-br"
                localeText={
                  ptBR.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
                dateAdapter={AdapterDayjs}
              >
                <DateCalendar
                  value={dateServices}
                  onChange={handleDateChange}
                  sx={{
                    "& .MuiPickersDay-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#6B21A8",
                        color: "#fff",
                      },
                      "&:hover": {
                        backgroundColor: "#6B21A8",
                        color: "#fff",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Popper>
        </Box>

        {servicesEstablishment === 0 || servicesEstablishment === undefined ? (
          <Tooltip
            title="Para realizar agendamentos e necessário cadastrar serviços"
            arrow
          >
            <IconButton>
              <AddRoundedIcon color="#D49EF5" disabled />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Adicionar agendamento" arrow>
            <IconButton onClick={handleOpenDialogScheduling}>
              <AddRoundedIcon color="#D49EF5" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {!isMobile && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "0.4fr 0.7fr 0.4fr 0.65fr 0.9fr 0.45fr  0.12fr",
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
          {/*<Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="start"
          >
            <Typography variant="body2">Responsável</Typography>
          </Box>*/}
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
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
          maxHeight: isMobile ? "30rem" : "30rem",
          pb: 5,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "0.4fr 0.7fr 0.4fr 0.65fr 0.9fr 0.45fr  0.12fr",
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
            Nenhum agendamento para esse dia
          </Typography>
        ) : (
          sortedAppointments.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "0.4fr 0.7fr 0.4fr 0.65fr 0.9fr 0.45fr  0.12fr",
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
                      {/*<Typography variant="body2">
                        Responsável: Luizinho
                      </Typography>*/}
                      <Typography variant="body2">
                        Valor: R$ {item?.price}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{ color: "#AC42F7" }}
                    >
                      <Tooltip title="Opções" arrow>
                        <MoreVertRoundedIcon />
                      </Tooltip>
                    </IconButton>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          minWidth: "5rem",
                          background: "#f1eeff",
                        },
                      }}
                    >
                      <MenuItem
                        sx={{
                          fontSize: "10px",
                          padding: "8px 16px",
                        }}
                        onClick={() => handleEditClickData(item)}
                      >
                        Alterar dados
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "10px", padding: "8px 16px" }}
                        onClick={() => handleEditClick(item)}
                      >
                        Alterar agendamento
                      </MenuItem>
                    </Menu>
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
                  {/*<Typography variant="body2" fontWeight={500}>
                    Luizinho
                  </Typography>*/}
                  <Typography variant="body2" fontWeight={500}>
                    R$ {item?.price}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, item)}
                    sx={{ color: "#AC42F7" }}
                  >
                    <Tooltip title="Opções" arrow>
                      <MoreVertRoundedIcon />
                    </Tooltip>
                  </IconButton>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    sx={{
                      "& .MuiPaper-root": {
                        minWidth: "5rem",
                        background: "#f1eeff",
                      },
                    }}
                  >
                    <MenuItem
                      sx={{ fontSize: "10px", padding: "8px 16px" }}
                      onClick={() => {
                        handleEditClickData(selectedItem);
                        handleMenuClose();
                      }}
                    >
                      Alterar dados
                    </MenuItem>
                    <MenuItem
                      sx={{ fontSize: "10px", padding: "8px 16px" }}
                      onClick={() => {
                        handleEditClick(selectedItem);
                        handleMenuClose();
                      }}
                    >
                      Alterar agendamento
                    </MenuItem>
                  </Menu>
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
            borderRadius: 5,
            p: 3,
            color: "#FFFFFF",
            width: "600px",
            maxWidth: "90vw",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Atualizar status
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "1rem",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            De: <strong>{currentStatus}</strong>
          </Typography>
          <Divider sx={{ my: 2, background: "#FFFFFF" }} />
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Para:
          </Typography>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={handleClickMenu}
              sx={{
                background: "#FFF",
                color: "#ac42f7",
                borderColor: "#FFF",
                borderRadius: 2,
                padding: "8px 24px",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {newSelectedStatus || "Selecione um Status"}
            </Button>
            <Menu
              anchorEl={anchorElStatus}
              open={Boolean(anchorElStatus)}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: {
                  width: "15rem",
                  color: "#ac42f7",
                  borderRadius: 2,
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {[
                "Entregue",
                "Aguardando cliente",
                "Cancelado",
                "Iniciado",
                "Agendado",
              ]
                .filter((status) => status !== currentStatus)
                .map((status) => (
                  <MenuItem
                    key={status}
                    onClick={() => {
                      setNewSelectedStatus(status);
                      handleCloseMenu();
                    }}
                    sx={{
                      color: getStatusColor(status),
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {status}
                  </MenuItem>
                ))}
            </Menu>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={handleCloseDialogStatus}
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "1rem",
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            size="large"
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
            onClick={async () => {
              if (!newSelectedStatus || !selectedServiceId) return;
              try {
                setIsLoadingButtonSave(true);

                const response = await fetch(
                  `http://localhost:3000/api/appointments/appointments/${selectedServiceId}`,
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

                setSnackbarMessage("Status alterado com sucesso!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
              } catch (error) {
                console.error("Erro ao atualizar status:", error);
                setSnackbarMessage("Erro ao atualizar status.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
              } finally {
                setIsLoadingButtonSave(false);
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
                  value={selectedDate ? dayjs(selectedDate) : null}
                  format="DD/MM/YYYY"
                  onChange={(newDate) => {
                    const parsedDate = dayjs(newDate);

                    if (parsedDate.isValid()) {
                      const formatted = parsedDate.format("YYYY-MM-DD");
                      setSelectedDate(formatted);
                      setSelectedService("");
                    }
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
                  {availableServices?.map((service) => (
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
                  {availableHours?.map((slot, index) => (
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
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "1rem",
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
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
          >
            Excluir
          </Button>
          <Button
            loading={isLoadingButtonSave}
            onClick={handleSave}
            variant="contained"
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
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogData}
        onClose={handleCloseData}
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
          Editar dados do agendamento
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
                  disabled
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

              <TextField
                label="Serviço"
                fullWidth
                disabled
                size="small"
                value={selectedAppointment.serviceName}
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              <TextField
                label="Horário"
                fullWidth
                disabled
                size="small"
                value={selectedAppointment.startTime}
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
              {/*<TextField
                size="small"
                fullWidth
                label="Responsável"
                disabled="true"
                value="Luizinho"
                //onChange={(e) =>
                //setSelectedAppointment({
                //...selectedAppointment,
                //price: e.target.value,
                //})
                //}
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />*/}
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
            onClick={handleCloseData}
            variant="outlined"
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "1rem",
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            loading={isLoadingButton}
            onClick={handleDelete}
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
          >
            Excluir
          </Button>
          <Button
            loading={isLoadingButtonSave}
            onClick={handleSave}
            variant="contained"
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
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Nome do Cliente
                </InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <InputLabel
                  sx={{
                    color: "#FFFFFF",
                    pb: 0.5,
                    pl: 0.3,
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Nº Telefone
                </InputLabel>
                <InputMask
                  mask="(99) 99999-9999"
                  value={clientPhone}
                  maskChar={null}
                  onChange={(e) => setClientPhone(e.target.value)}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      size="small"
                      fullWidth
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                </InputMask>
                <InputLabel
                  sx={{
                    color: "#FFFFFF",
                    pb: 0.5,
                    pl: 0.3,
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Veiculo
                </InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  sx={{
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
                          mt: 3,
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
                    ) : availableServices && availableServices.length > 0 ? (
                      <>
                        <InputLabel
                          sx={{
                            color: "#FFFFFF",
                            pb: 0.5,
                            pl: 0.3,
                            fontWeight: 600,
                          }}
                        >
                          Serviço
                        </InputLabel>
                        <FormControl
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ mb: 2, background: "#FFFFFF", borderRadius: 2 }}
                        >
                          <InputLabel>Escolha uma opção</InputLabel>
                          <Select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
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
                        {loadingSlots ? (
                          <CircularProgress
                            sx={{ display: "block", margin: "auto" }}
                          />
                        ) : (
                          service &&
                          availableSlots.length > 0 && (
                            <>
                              <InputLabel
                                sx={{
                                  color: "#FFFFFF",
                                  pb: 0.5,
                                  pl: 0.3,
                                  fontWeight: 600,
                                }}
                              >
                                Horário
                              </InputLabel>
                              <FormControl
                                fullWidth
                                size="small"
                                sx={{
                                  mb: 2,
                                  borderRadius: 2,
                                  background: "#FFFFFF",
                                }}
                              >
                                <InputLabel>Escolha uma opção</InputLabel>
                                <Select
                                  value={selectedSlot}
                                  onChange={(e) =>
                                    setSelectedSlot(e.target.value)
                                  }
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
                            </>
                          )
                        )}
                        <InputLabel
                          sx={{
                            color: "#FFFFFF",
                            pb: 0.5,
                            pl: 0.3,
                            fontWeight: 600,
                          }}
                        >
                          Preço
                        </InputLabel>
                        <TextField
                          fullWidth
                          size="small"
                          value={
                            service
                              ? `R$ ${
                                  availableServices.find(
                                    (s) => s.serviceId === service
                                  )?.price || 0
                                }`
                              : ""
                          }
                          disabled
                          sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                        <InputLabel
                          sx={{
                            color: "#FFFFFF",
                            mt: 1,
                            pb: 0.5,
                            pl: 0.3,
                            fontWeight: 600,
                          }}
                        >
                          Status
                        </InputLabel>
                        <FormControl
                          fullWidth
                          size="small"
                          variant="outlined"
                          sx={{ background: "#FFFFFF", borderRadius: 2 }}
                        >
                          <InputLabel>Escolha uma opção</InputLabel>
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
                    ) : (
                      <Typography
                        sx={{
                          color: "#fff",
                          textAlign: "center",
                          mt: 2,
                          fontWeight: "bold",
                        }}
                      >
                        Não há serviços disponíveis para a data selecionada.
                      </Typography>
                    )}
                  </>
                )}
              </>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialogScheduling}
                variant="contained"
                color="error"
                sx={{
                  background: "#FFF",
                  color: "#ac42f7",
                  borderColor: "#FFF",
                  borderRadius: 3,
                  fontSize: "1rem",
                  padding: "8px 24px",
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={newScheduling}
                loading={isLoadingButtonSave}
                variant="contained"
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
