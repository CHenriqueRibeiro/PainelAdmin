/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
  ClickAwayListener,
  FormControlLabel,
  Checkbox,
  Modal,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputMask from "react-input-mask";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseIcon from "@mui/icons-material/Close";
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

const schema = yup.object().shape({
  clientName: yup.string().required("Nome é obrigatório"),
  clientPhone: yup
    .string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
    .required("Telefone é obrigatório"),
  veiculo: yup.string().required("Veículo é obrigatório"),
  date: yup.string().required("Data é obrigatória"),
  service: yup.string().required("Serviço é obrigatório"),
  selectedSlot: yup.string().required("Horário é obrigatório"),
  statusCreateNew: yup.string().required("Status é obrigatório"),
  price: yup.number().required("Preço é obrigatório"),
});
const editSchema = yup.object().shape({
  veiculo: yup.string().required("Veículo é obrigatório"),
  selectedDate: yup.string().required("Data é obrigatória"),
  selectedService: yup.string().required("Serviço é obrigatório"),
  selectedSlot: yup.string().required("Horário é obrigatório"),
  price: yup.number().required("Preço é obrigatório"),
});
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
  const [reminderWhatsapp, setReminderWhatsapp] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogData, setOpenDialogData] = useState(false);
  const [openDialogScheduling, setOpenDialogScheduling] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { isTokenValid } = useAuth();
  const [openDialogStatus, setOpenDialogStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
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
  const [appointmentSlot, setAppointmentSlot] = useState("");
  const [currentSchema, setCurrentSchema] = useState(schema);
  const open = Boolean(anchorElDate);
  const dateServices = dayjs();
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [addPhotos, setAddPhotos] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openZoom, setOpenZoom] = useState(false);
const [zoomImage, setZoomImage] = useState(null);
const [cameraOpen, setCameraOpen] = useState(false);
const videoRef = React.useRef();
  const canvasRef = React.useRef();
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
const [zoomPhotoData, setZoomPhotoData] = useState({ url: "", idx: -1 });
const [appointmentPhotoId, setAppointmentPhotoId] = useState(null);
const [existingPhotos, setExistingPhotos] = useState([]);


const isMobileOrTablet = () => /android|iphone|ipad|mobile/i.test(navigator.userAgent);

const user = JSON.parse(localStorage.getItem("user"));
const plan = user?.plan || "teste";

const maxPhotosByPlan = {
  "teste": 2,
  "simples": 2,
  "profissional": 5,
  "completo": 10,
};
const maxPhotos = maxPhotosByPlan[plan] ?? 2;

const handleAddFiles = (files) => {
  let filesArray = Array.from(files);

  const restante = maxPhotos - existingPhotos.length - selectedFiles.length;

  if (restante <= 0) return;

  if (filesArray.length > restante) {
    filesArray = filesArray.slice(0, restante);
  }

  setSelectedFiles((prev) => [...prev, ...filesArray]);
};


const canAddMorePhotos = selectedFiles.length < maxPhotos;

const handleOpenCamera = async () => {
  setCameraOpen(true);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
    });
    if (videoRef.current) videoRef.current.srcObject = stream;
  } catch {
    alert("Erro ao acessar a câmera.");
    setCameraOpen(false);
  }
};

const handleCapturePhoto = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `foto-veiculo-${Date.now()}.jpg`, { type: "image/jpeg" });
      setSelectedFiles((prev) => [...prev, file]);
    }
  }, "image/jpeg", 0.85);
  let tracks = video.srcObject?.getTracks();
  tracks && tracks.forEach((t) => t.stop());
  setCameraOpen(false);
};

const handleCloseCamera = () => {
  let tracks = videoRef.current?.srcObject?.getTracks();
  tracks && tracks.forEach((t) => t.stop());
  setCameraOpen(false);
};


  const {
  handleSubmit,
  control,
  reset,
  getValues,
  setValue,
  formState: { errors },
} = useForm({
  resolver: yupResolver(currentSchema),
});


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
  const handleOpenDialogConfirm = (appointment) => {
    setAppointmentToDelete(appointment);
    setOpenDialogConfirm(true);
  };
  const handleCloseDialogConfirm = () => {
    setOpenDialogConfirm(false);
    setAppointmentToDelete(null);
  };

  const statusCreate = ["Agendado", "Iniciado"];
  const handleEditClick = async (appointment) => {
    setCurrentSchema(editSchema);
    setSelectedAppointment(appointment);
    setOpenDialog(true);
    setLoadingServices(true);

    const response = await fetch(
      `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${appointment.date}`
    );
    const data = await response.json();
    setAvailableServices(data.services);

    const serviceData = data.services.find(
      (s) => s.serviceName === appointment.serviceName
    );
    const serviceId = serviceData?.serviceId || "";

    const slot = `${appointment.startTime} - ${appointment.endTime}`;
    setAppointmentSlot(slot);

    let slotsArray = serviceData?.availableSlots || [];

    if (!slotsArray.includes(slot)) {
      slotsArray = [slot, ...slotsArray];
    }
    setAvailableHours(slotsArray);

    await new Promise((resolve) => setTimeout(resolve, 0));

    reset({
      veiculo: appointment.veiculo || "",
      selectedDate: appointment.date || "",
      selectedService: serviceId,
      selectedSlot: slot,
    });

    setLoadingServices(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
const handleOpenPhotoDialog = (agendamento) => {
  setAppointmentPhotoId(agendamento._id);
  setExistingPhotos(agendamento.fotos || []);
  setSelectedFiles([]);
  setOpenPhotoDialog(true);
};
  const handleCloseDialogScheduling = () => {
    reset();
  setAddPhotos(false);
  setSelectedFiles([]);
  setOpenDialogScheduling(false);
  };
  const handleOpenDialogScheduling = () => {
    setCurrentSchema(schema);
    setSelectedAppointment(null);
    reset(
      {
        clientName: "",
        clientPhone: "",
        veiculo: "",
        date: "",
        service: "",
        selectedSlot: "",
        statusCreateNew: "",
      },
      { keepErrors: false, keepDirty: false, keepTouched: false }
    );
    setOpenDialogScheduling(true);
    setDate("");
    setService("");
    setReminderWhatsapp(false);
  };

  useEffect(() => {
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setLoadingServices(true);
      fetch(
        `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${date}`
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
    if (selectedAppointment) {
      reset({
        veiculo: selectedAppointment.veiculo || "",
        selectedDate: selectedAppointment.date || "",
        selectedService: selectedAppointment.serviceId || "",
        selectedSlot:
          `${selectedAppointment.startTime} - ${selectedAppointment.endTime}` ||
          "",
      });
    }
  }, [selectedAppointment, reset]);
  useEffect(() => {
    if (service && date) {
      setLoadingSlots(true);

      fetch(
        `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${date}`
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
    if (selectedDate && openDialog && !selectedAppointment) {
      setLoadingServices(true);

      fetch(
        `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${selectedDate}`
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
  }, [selectedDate, openDialog, selectedAppointment]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setLoadingSlots(true);

      fetch(
        `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${selectedDate}`
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
  useEffect(() => {
    if (openDialog && selectedAppointment) {
      setLoadingServices(true);

      fetch(
        `https://lavaja.up.railway.app/api/availability/${establishmentId}?date=${selectedAppointment.date}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAvailableServices(data.services);
          const serviceData = data.services.find(
            (s) => s.serviceName === selectedAppointment.serviceName
          );
          const slot = `${selectedAppointment.startTime} - ${selectedAppointment.endTime}`;
          let slotsArray = serviceData?.availableSlots || [];
          if (!slotsArray.includes(slot)) {
            slotsArray = [slot, ...slotsArray];
          }
          setAvailableHours(slotsArray);
          setLoadingServices(false);
        })
        .catch(() => {
          setLoadingServices(false);
          alert("Erro ao buscar serviços.");
        });
    }
  }, [openDialog, selectedAppointment]);

  const onEditSubmit = async (formData) => {
    try {
      setIsLoadingButtonSave(true);

      if (!formData.selectedSlot || !formData.selectedSlot.includes(" - ")) {
        throw new Error("Horário inválido selecionado");
      }

      const [startHourRaw, endHourRaw] = formData.selectedSlot.split(" - ");

      const startTime = startHourRaw;
      const endTime = endHourRaw;

      const selectedServiceObj = availableServices.find(
        (s) => s.serviceId === formData.selectedService
      );

      const response = await fetch(
        `https://lavaja.up.railway.app/api/appointments/appointments/${selectedAppointment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startTime,
            endTime,
            veiculo: formData.veiculo,
            date: formData.selectedDate,
            serviceId: formData.selectedService,
            serviceName: selectedServiceObj?.serviceName,
            price: selectedServiceObj?.price,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar agendamento");

      setSnackbarMessage("Agendamento atualizado!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);
      onUpdateService();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Erro ao salvar");
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
        `https://lavaja.up.railway.app/api/appointments/appointments/${selectedAppointment._id}`,
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
  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      setIsLoadingButton(true);

      const response = await fetch(
        `https://lavaja.up.railway.app/api/appointments/appointments/${appointmentToDelete._id}`,
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

      setSnackbarMessage("Agendamento deletado com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      onUpdateService();
      setOpenDialogConfirm(false);
      setAppointmentToDelete(null);
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarMessage("Erro ao deletar agendamento.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButton(false);
    }
  };

 const newScheduling = async (formData) => {
  try {
    setIsLoadingButtonSave(true);
    const {
      clientName,
      clientPhone,
      veiculo,
      date,
      service,
      selectedSlot,
      statusCreateNew,
    } = formData;

    const [startHourRaw, endHourRaw] = selectedSlot.split(" - ");
    const [startHourH, startHourM] = startHourRaw.split(":").map(Number);
    const [endHourH, endHourM] = endHourRaw.split(":").map(Number);

    const startHour = `${String(startHourH).padStart(2, "0")}:${String(startHourM).padStart(2, "0")}`;
    const endHourDate = new Date();
    endHourDate.setHours(endHourH, endHourM - 1);
    const endTime = `${String(endHourDate.getHours()).padStart(2, "0")}:${String(endHourDate.getMinutes()).padStart(2, "0")}`;

    const selectedServiceObj = availableServices.find(
      (s) => s.serviceId === service
    );

    const fd = new FormData();
    fd.append('clientName', clientName);
    fd.append('clientPhone', clientPhone);
    fd.append('veiculo', veiculo);
    fd.append('serviceId', service);
    fd.append('date', date);
    fd.append('serviceName', selectedServiceObj?.serviceName);
    fd.append('establishmentId', establishmentId);
    fd.append('startTime', startHour);
    fd.append('endTime', endTime);
    fd.append('price', formData.price);

    fd.append('status', statusCreateNew);
    fd.append('reminderWhatsapp', reminderWhatsapp);

    selectedFiles.forEach((file) => {
      fd.append('fotos', file);
    });

    const response = await fetch(
      `https://lavaja.up.railway.app/api/appointments/appointments`,
      {
        method: "POST",
        body: fd,
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
    reset();
    setReminderWhatsapp(false);
    setSelectedSlot("");
    setSelectedFiles([]);
    setAddPhotos(false);
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
const handleClosePhotoDialog = () => {
  setOpenPhotoDialog(false);
  setExistingPhotos([]);
  setSelectedFiles([]);
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
  useEffect(() => {
    if (selectedAppointment) {
      reset({
        veiculo: selectedAppointment.veiculo || "",
        selectedDate: selectedAppointment.date || "",
        selectedService: selectedAppointment.serviceId || "",
        selectedSlot:
          `${selectedAppointment.startTime} - ${selectedAppointment.endTime}` ||
          "",
      });

      setSelectedDate(selectedAppointment.date || "");
      setSelectedService(selectedAppointment.serviceId || "");
    }
  }, [selectedAppointment]);
  const isSameService =
    selectedAppointment &&
    selectedAppointment.serviceName ===
      (availableServices.find((s) => s.serviceId === selectedService)
        ?.serviceName || "");
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
            flexDirection: isMobile ? "column" : "row",
            borderRadius: 2,
            gap: isMobile ? 1 : 3,
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
            open={Boolean(anchorElDate)}
            anchorEl={anchorElDate}
            placement="bottom-start"
            sx={{ zIndex: 1300 }}
          >
            <ClickAwayListener onClickAway={() => setAnchorElDate(null)}>
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
            </ClickAwayListener>
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
    overflowY: "auto",
    maxHeight: isMobile ? "100%" : "30rem",
    pb: isMobile ? 10 : 5,
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
                          onClick={() => {
                            if (item.status !== "Entregue") {
                              handleOpenDialogStatus(item.status, item._id);
                            } else if (item.status == "Entregue") {
                              setSnackbarSeverity("error");
                              setSnackbarMessage("Veiculo já foi entregue.");
                              setOpenSnackbar(true);
                            }
                          }}
                        />
                      </Typography>
                      {/*<Typography variant="body2">
                        Responsável: Luizinho
                      </Typography>*/}
                      <Typography variant="body2">
                        Valor: R$ {item?.price}
                      </Typography>
                    </Box>
                    {item.status === "Entregue" ? (
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialogConfirm(item)}
                        sx={{ color: "#AC42F7" }}
                      >
                        <Tooltip title="Deletar" arrow>
                          <DeleteRoundedIcon />
                        </Tooltip>
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, item)}
                        sx={{ color: "#AC42F7" }}
                      >
                        <Tooltip title="Opções" arrow>
                          <MoreVertRoundedIcon />
                        </Tooltip>
                      </IconButton>
                    )}

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
                      {/*<MenuItem
                        sx={{
                          fontSize: "10px",
                          padding: "8px 16px",
                        }}
                        onClick={() => handleEditClickData(item)}
                      >
                        Alterar dados
                      </MenuItem>*/}
                      <MenuItem
                        sx={{ fontSize: "10px", padding: "8px 16px" }}
                        onClick={() => {
                          handleEditClick(selectedItem);
                          handleMenuClose();
                        }}
                      >
                        Alterar agendamento
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "10px", padding: "8px 16px" }}
  onClick={() => {
    handleOpenPhotoDialog(selectedItem);
    handleMenuClose();
  }}
>
  Fotos do veículo
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
                    onClick={() => {
                      if (item.status !== "Entregue") {
                        handleOpenDialogStatus(item.status, item._id);
                      } else {
                        setSnackbarSeverity("error");
                        setSnackbarMessage("Veiculo já foi entregue.");
                        setOpenSnackbar(true);
                      }
                    }}
                  />
                  {/*<Typography variant="body2" fontWeight={500}>
                    Luizinho
                  </Typography>*/}
                  <Typography variant="body2" fontWeight={500}>
                    R$ {item?.price}
                  </Typography>

                  {item.status === "Entregue" ? (
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialogConfirm(item)}
                      sx={{ color: "#AC42F7" }}
                    >
                      <Tooltip title="Deletar" arrow>
                        <DeleteRoundedIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, item)}
                      sx={{ color: "#AC42F7" }}
                    >
                      <Tooltip title="Opções" arrow>
                        <MoreVertRoundedIcon />
                      </Tooltip>
                    </IconButton>
                  )}
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
                    {/*<MenuItem
                      sx={{ fontSize: "10px", padding: "8px 16px" }}
                      onClick={() => {
                        handleEditClickData(selectedItem);
                        handleMenuClose();
                      }}
                    >
                      Alterar dados
                    </MenuItem>*/}
                    <MenuItem
                      sx={{ fontSize: "10px", padding: "8px 16px" }}
                      onClick={() => {
                        handleEditClick(selectedItem);
                        handleMenuClose();
                      }}
                    >
                      Alterar agendamento
                    </MenuItem>
                      <MenuItem
                        sx={{ fontSize: "10px", padding: "8px 16px" }}
  onClick={() => {
    handleOpenPhotoDialog(selectedItem);
    handleMenuClose();
  }}
>
  Fotos do veículo
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
                  `https://lavaja.up.railway.app/api/appointments/appointments/${selectedServiceId}`,
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
            <form onSubmit={handleSubmit(onEditSubmit)}>
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

              <Controller
                name="selectedDate"
                control={control}
                render={({ field }) => (
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
                      value={field.value ? dayjs(field.value) : null}
                      format="DD/MM/YYYY"
                      onChange={(newDate) => {
                        const val = newDate?.format("YYYY-MM-DD") || "";
                        field.onChange(val);
                        setSelectedDate(val);
                        setSelectedService("");
                        setAvailableHours([]);
                        reset({
                          ...getValues(),
                          selectedService: "",
                          selectedSlot: "",
                        });
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.date,
                          helperText: errors.date?.message,
                          InputProps: {
                            sx: {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                          },
                          sx: {
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                            "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#ff8ba7",
                              },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />

              {selectedDate && (
                <Controller
                  name="selectedService"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Serviço"
                      select
                      fullWidth
                      size="small"
                      error={!!errors.selectedService}
                      helperText={errors.selectedService?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedService(e.target.value);
                        reset({ ...getValues(), selectedSlot: "" });
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                    >
                      {availableServices?.map((service) => (
                        <MenuItem
                          key={service.serviceId}
                          value={service.serviceId}
                        >
                          {service.serviceName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              {availableHours?.length > 0 && (
                <Controller
                  name="selectedSlot"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Horário"
                      select
                      fullWidth
                      size="small"
                      error={!!errors.selectedSlot}
                      helperText={errors.selectedSlot?.message}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                    >
                      {appointmentSlot &&
                        isSameService &&
                        !availableHours.includes(appointmentSlot) && (
                          <MenuItem value={appointmentSlot}>
                            {appointmentSlot}
                          </MenuItem>
                        )}
                      {availableHours.map((slot, index) => (
                        <MenuItem key={index} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              <Controller
                name="veiculo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    label="Veículo"
                    error={!!errors.veiculo}
                    helperText={errors.veiculo?.message}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              <TextField
                size="small"
                fullWidth
                label="Valor"
                disabled
                value={selectedAppointment.price}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fff",
                    borderRadius: 2,
                  },
                }}
              />
            </form>
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
            type="submit"
            form="editForm"
            onClick={handleSubmit(onEditSubmit)}
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
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        "& .MuiInputBase-root.Mui-error": {
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  )}
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
                <Controller
                  name="clientPhone"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      {...field}
                      mask="(99) 99999-9999"
                      maskChar={null}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          fullWidth
                          size="small"
                          error={!!errors.clientPhone}
                          helperText={errors.clientPhone?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          }}
                        />
                      )}
                    </InputMask>
                  )}
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
                  Veiculo
                </InputLabel>
                <Controller
                  name="veiculo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.veiculo}
                      helperText={errors.veiculo?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        "& .MuiInputBase-root.Mui-error": {
                          bgcolor: "#fff",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="pt-br"
                    >
                      <DatePicker
                        label="Data"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          const formatted =
                            newValue?.format("YYYY-MM-DD") || "";
                          field.onChange(formatted);
                          setDate(formatted);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.date,
                            helperText: errors.date?.message,
                            InputProps: {
                              sx: {
                                bgcolor: "#fff",
                                borderRadius: 2,
                              },
                            },
                            sx: {
                              mt: 3,
                              mb: 2,
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "#fff",
                                borderRadius: 2,
                              },
                              "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#ff8ba7",
                                },
                              "& .MuiInputBase-root.Mui-error": {
                                bgcolor: "#fff",
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />

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
                        <Controller
                          name="service"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.service}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "#fff",
                                  borderRadius: 2,
                                },
                                "& .MuiInputBase-root.Mui-error": {
                                  bgcolor: "#fff",
                                },
                              }}
                            >
                              <Select
                                {...field}
                                onChange={(e) => {
  field.onChange(e.target.value);
  const selectedService = availableServices.find(
    (s) => s.serviceId === e.target.value
  );
  setService(e.target.value);
 const currentPrice = getValues("price");

if (!currentPrice || currentPrice === "" || currentPrice === "0") {
  setValue("price", selectedService?.price || "");
}
}}

                                label="Serviço"
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
                              {errors.service && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ mt: 0.5 }}
                                >
                                  {errors.service.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
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
                                  mt: 2,
                                }}
                              >
                                Horário
                              </InputLabel>
                              <Controller
                                name="selectedSlot"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    fullWidth
                                    size="small"
                                    error={!!errors.selectedSlot}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        bgcolor: "#fff",
                                        borderRadius: 2,
                                      },
                                      "& .MuiInputBase-root.Mui-error": {
                                        bgcolor: "#fff",
                                      },
                                    }}
                                  >
                                    <Select
                                      {...field}
                                      label="Horário"
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setSelectedSlot(e.target.value);
                                      }}
                                    >
                                      {availableSlots.map((slot, index) => (
                                        <MenuItem key={index} value={slot}>
                                          {slot}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {errors.selectedSlot && (
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 0.5 }}
                                      >
                                        {errors.selectedSlot.message}
                                      </Typography>
                                    )}
                                  </FormControl>
                                )}
                              />
                            </>
                          )
                        )}
                        <InputLabel
  sx={{
    color: "#FFFFFF",
    pb: 0.5,
    pl: 0.3,
    fontWeight: 600,
    mt: 2,
  }}
>
  Preço
</InputLabel>
<Controller
  name="price"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      fullWidth
      size="small"
      type="number"
      error={!!errors.price}
      helperText={errors.price?.message}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: "#fff",
          borderRadius: 2,
        },
        "& .MuiInputBase-root.Mui-error": {
          bgcolor: "#fff",
        },
      }}
    />
  )}
/>

                        <InputLabel
                          sx={{
                            color: "#FFFFFF",
                            mt: 2,
                            pb: 0.5,
                            pl: 0.3,
                            fontWeight: 600,
                          }}
                        >
                          Status
                        </InputLabel>
                        <Controller
                          name="statusCreateNew"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.statusCreateNew}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "#fff",
                                  borderRadius: 2,
                                },
                                "& .MuiInputBase-root.Mui-error": {
                                  bgcolor: "#fff",
                                },
                              }}
                            >
                              <InputLabel>Escolha uma opção</InputLabel>
                              <Select
                                {...field}
                                label="Status"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  setStatusCreateNew(e.target.value);
                                }}
                              >
                                {statusCreate.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.statusCreateNew && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ mt: 0.5 }}
                                >
                                  {errors.statusCreateNew.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                        {/*{statusCreateNew === "Agendado" && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={reminderWhatsapp}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setReminderWhatsapp(checked);
                                  }}
                                />
                              }
                              label="Enviar lembrete por WhatsApp?"
                              sx={{
                                color: "#FFFFFF",
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        )}*/}
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
                    {availableServices && availableServices.length > 0 && <Box sx={{ mt: 2 }}>
  <FormControlLabel
  control={
    <Checkbox
      checked={addPhotos}
      onChange={(e) => {
        setAddPhotos(e.target.checked);
        if (!e.target.checked) setSelectedFiles([]);
      }}
      sx={{ color: "#AC42F7 !important" }}
    />
  }
  label="Adicionar fotos do veículo"
  sx={{ color: "#FFFFFF", fontWeight: 600 }}
/>

</Box>}
                    

{addPhotos && (
  <Box sx={{ mt: 2 }}>
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {/* Botão Carregar fotos */}
      <Button
        variant="outlined"
        color="secondary"
        component="label"
        sx={{
          background: "#ac42f7",
          color: "#FFF",
          borderColor: "#ac42f7",
          borderRadius: 3,
          padding: "8px 24px",
          fontSize: isMobile ? "0.6rem" :"0.8rem",
          fontWeight: "bold",
        }}
        disabled={!canAddMorePhotos}
      >
        Carregar fotos
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          disabled={!canAddMorePhotos}
          onChange={(e) => {
            handleAddFiles(e.target.files);
            e.target.value = null;
          }}
        />
      </Button>
      {isMobileOrTablet() && (
        <Button
          variant="contained"
          color="secondary"
          sx={{
            background: "#AC42F7",
            color: "#FFF",
            borderRadius: 3,
            padding: "8px 24px",
            fontSize: isMobile ? "0.6rem" :"0.8rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          disabled={!canAddMorePhotos}
          onClick={handleOpenCamera}
        >
          Tirar foto
        </Button>
      )}
    </Box>


    {selectedFiles.length >= maxPhotos && (
      <Typography color="error" sx={{ mt: 1 }}>
        Seu plano tem o limite de {maxPhotos} fotos por agendamento.
      </Typography>
    )}

    {/* Preview das imagens com lupa */}
    {selectedFiles.length > 0 && (
      <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap", width:"100%"}}>
        {selectedFiles.map((file, idx) => {
          return (
            <Box key={idx} sx={{ width:"100%", display: "flex", justifyContent:'center', alignItems:"center", flexDirection:"column" }}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                width="100%"
                style={{ borderRadius: 8, boxShadow: "0 1px 6px #bbb", marginBottom: 6, cursor: "pointer" }}
                onClick={() => {
                  setZoomImage({
                    url: URL.createObjectURL(file),
                    idx: idx,
                  });
                  setOpenZoom(true);
                }}
              />
              <Typography color="#FFF" fontSize={12} textAlign="center" sx={{ maxWidth: 120, overflowWrap: "anywhere" }}>
                {file.name}
              </Typography>
            </Box>
          );
        })}
      </Box>
    )}

    {/* Modal de zoom */}
    <Modal open={openZoom} onClose={() => setOpenZoom(false)}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#222",
          borderRadius: 3,
          outline: "none",
          p: 2,
          boxShadow: 10,
          maxWidth: "95vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={zoomImage?.url}
          alt="Zoom"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            borderRadius: 12,
            boxShadow: "0 2px 12px #000",
          }}
        />
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            onClick={() => setOpenZoom(false)}
            sx={{
              color: "#fff",
              background: "#ac42f7",
              "&:hover": { background: "#8030d7" },
            }}
          >
            Fechar
          </Button>
          <Button
            color="error"
            sx={{
              background: "#ff3333",
              color: "#fff",
              "&:hover": { background: "#ff5555" },
            }}
            onClick={() => {
              setSelectedFiles(prev =>
                prev.filter((_, i) => i !== zoomImage.idx)
              );
              setOpenZoom(false);
            }}
          >
            Excluir
          </Button>
        </Box>
      </Box>
    </Modal>


    <Modal open={cameraOpen} onClose={handleCloseCamera}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#2e1065",
          borderRadius: 3,
          outline: "none",
          p: 2,
          boxShadow: 10,
          width: "85%",
          height: "85%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "98%", height:"80%",borderRadius: 12, background: "#000" }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Button
          onClick={handleCapturePhoto}
          variant="contained"
          sx={{
            mt:"1rem",
            background: "#ac42f7",
            color: "#FFF",
            borderRadius: 3,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
          disabled={!canAddMorePhotos}
        >
          Capturar Foto
        </Button>
        <Button
          onClick={handleCloseCamera}
          sx={{
            mt:"1rem",
            background: "#fff",
            color: "#ac42f7",
            borderRadius: 3,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Modal>
  </Box>
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
                onClick={handleSubmit(newScheduling)}
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

      <Dialog
        open={openDialogConfirm}
        onClose={handleCloseDialogConfirm}
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
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja deletar este agendamento?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogConfirm}
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "0.8rem",
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            loading={isLoadingButton}
            variant="contained"
            color="error"
            sx={{
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>


     <Dialog
  open={openPhotoDialog}
  onClose={handleClosePhotoDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: { borderRadius: 4, background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)", color: "#6B21A8", minHeight: 340 }
  }}
>
  <DialogTitle sx={{ fontWeight: 700, color: "#FFFFFF", textAlign:"center" }}>
    Fotos do Veículo
  </DialogTitle>
  <DialogContent sx={{display:existingPhotos?.length > 0 ? "auto" : "flex", alignItems:existingPhotos?.length > 0 ? "auto" : "center", justifyContent:existingPhotos?.length > 0 ? "auto" : "center"}}>
  {(existingPhotos?.length > 0) ? (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mt: 2,
        justifyContent: "center",
      }}
    >
      {existingPhotos.map((url, idx) => (
        <Box
          key={idx}
          sx={{
            position: "relative",
            width: isMobile && existingPhotos?.length > 0 ? "100%" : "45%",
            mb: isMobile ? 2 : 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={url}
            alt={`foto ${idx + 1}`}
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              borderRadius: 10,
              boxShadow: "0 1px 6px #bbb",
              cursor: "pointer",
            }}
            onClick={() => setZoomPhotoData({ url, idx })}
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              background: "#fff",
              color: "#AC42F7",
              p: "3px",
              zIndex: 2,
            }}
            onClick={async () => {
              const newPhotos = existingPhotos.filter((_, i) => i !== idx);
              const resp = await fetch(
                `https://lavaja.up.railway.app/api/appointments/appointments/${appointmentPhotoId}/photos`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fotos: newPhotos }),
                }
              );
              if (resp.ok) {
  const data = await resp.json();
  setExistingPhotos(data.appointment.fotos || []);
  if (typeof onUpdateService === "function") onUpdateService();
  setSelectedFiles([]);
  setOpenPhotoDialog(false);
  setSnackbarMessage("Fotos enviadas com sucesso!");
  setOpenSnackbar(true);
} else {
  setSnackbarMessage("Erro ao enviar fotos!");
  setOpenSnackbar(true);
}


            }}
          >
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
          ) : (<>
              <Box sx={{display:selectedFiles.length > 0 ? "none":"flex", alignItems:"center",justifyContent:"center"}}>
    <Typography sx={{ color: "#FFFFFF", mt: 2 }}>
      Nenhuma foto cadastrada para este agendamento.
    </Typography>
              </Box>
              </>

  )}

  {selectedFiles.length > 0 && (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      mt: 2,
      justifyContent: "center",
    }}
  >
    {selectedFiles.map((file, idx) => (
      <Box
        key={idx}
        sx={{
          position: "relative",
          width: isMobile ? "100%" : "45%",
          mb: isMobile ? 2 : 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={`foto nova ${idx + 1}`}
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            borderRadius: 10,
            boxShadow: "0 1px 6px #bbb",
            cursor: "pointer",
          }}
          onClick={() => setZoomPhotoData({ url: URL.createObjectURL(file), idx: -1 })}
        />
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            background: "#fff",
            color: "#AC42F7",
            p: "3px",
            zIndex: 2,
          }}
          onClick={() => {
            setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    ))}
  </Box>
)}

</DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <Box sx={{width:"75%", background:"#FFFFFF", borderRadius:1.5}}><Typography sx={{ textAlign:"center",color: "#ac42f7", fontSize: 13}}>
    Limite do seu plano: {maxPhotos} fotos por agendamento.<br />

  </Typography></Box>
           
  </Box>
 
        <DialogActions
          sx={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    pt: isMobile? 1 : 2,
    pb: isMobile ? 1 : 2,
  }}
        >
         {existingPhotos.length + selectedFiles.length < maxPhotos && (
  <Button
    variant="outlined"
    component="label"
              sx={{
      width: isMobile ? "100%" : "auto",
      background: "#ac42f7",
      color: "#FFF",
      borderRadius: 3,
      fontSize:"0.8rem",
      fontWeight: "bold",
      padding: "8px 24px",
      borderColor:"#ac42f7"
    }}
  >
    Adicionar fotos
    <input
      type="file"
      hidden
      accept="image/*"
      multiple
      onChange={(e) => {
        handleAddFiles(e.target.files);
        e.target.value = null;
      }}
    />
  </Button>
          )}
          {existingPhotos.length + selectedFiles.length < maxPhotos && isMobileOrTablet() && (
  <Button
    variant="contained"
    color="secondary"
              sx={{
      width: isMobile ? "100%" : "auto",
      background: "#AC42F7",
      color: "#FFF",
                borderRadius: 3,
      ml:"0 !important",
      padding: "8px 24px",
      fontWeight: "bold",
      fontSize:"0.8rem"
    }}
    onClick={handleOpenCamera}
  >
    Tirar foto
  </Button>
)}
   
    {selectedFiles.length > 0 && (
  <Button
    variant="contained"
              sx={{
                ml:"0 !important",
      width: isMobile ? "100%" : "auto",
      background: "#ac42f7",
      color: "#FFF",
                borderRadius: 3,
      padding: "8px 24px",
      fontWeight: "bold",
      fontSize:"0.8rem"
    }}
   onClick={async () => {
  if (!appointmentPhotoId) return;
  const fd = new FormData();

  existingPhotos.forEach((url) => fd.append("fotos", url));

  selectedFiles.forEach((file) => fd.append("fotos", file));

  try {
    const resp = await fetch(
      `https://lavaja.up.railway.app/api/appointments/appointments/${appointmentPhotoId}/photos`,
      { method: "PUT", body: fd }
    );
    if (resp.ok) {
      const agendamentoResp = await fetch(
        `https://lavaja.up.railway.app/api/appointments/appointments/${appointmentPhotoId}`
      );
      if (agendamentoResp.ok) {
        const agendamento = await agendamentoResp.json();
        setExistingPhotos(agendamento.fotos || []);
      }
      if (typeof onUpdateService === "function") onUpdateService();
      setSelectedFiles([]);
      setOpenPhotoDialog(false);
      setSnackbarMessage("Fotos enviadas com sucesso!");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Erro ao enviar fotos!");
      setOpenSnackbar(true);
    }
  } catch (e) {
    setSnackbarMessage("Erro ao enviar fotos!");
    setOpenSnackbar(true);
  }
}}

  >
    Salvar fotos
  </Button>
)}
 <Button
      onClick={handleClosePhotoDialog}
            sx={{
              ml:"0 !important",
        width: isMobile ? "100%" : "auto",
        background: "#FFF",
        color: "#ac42f7",
        borderRadius: 3,
        padding: "8px 24px",
        fontWeight: "bold",
      fontSize:"0.8rem"
      }}
    >
      Fechar
    </Button>
  </DialogActions>

  <Dialog
  open={Boolean(zoomPhotoData.url)}
  onClose={() => setZoomPhotoData({ url: "", idx: -1 })}
  PaperProps={{
    sx: isMobile
      ? {
          background: "#18151c",
          width: "100vw !important",
          maxWidth: "100vw !important",
          minHeight: "100vh",
          m: 0,
          p: 0,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }
      : {
          background: "rgba(24, 21, 28, 0.95)",
          width: "85vw !important",
          maxWidth: "100%",
          height: "90vh",
          boxShadow: 24,
          borderRadius: 5,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
  }}
>
  <IconButton
    onClick={() => setZoomPhotoData({ url: "", idx: -1 })}
    sx={{
      position: "absolute",
      right: 16,
      top: "3rem",
      color: "#fff",
      zIndex: 2,
    }}
  >
    <CloseIcon />
  </IconButton>
  <Box
    sx={
      isMobile
        ? {
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowX: "auto",
            overflowY: "auto",
          }
        : {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }
    }
  >
    <img
      src={zoomPhotoData.url}
      alt="Zoom"
      style={
        isMobile
          ? {
              objectFit: "contain",
              minWidth: "85vw",
              minHeight: "80vh",
              maxWidth: "80vw",
              maxHeight: "none",
              borderRadius: 0,
            }
          : {
              objectFit: "contain",
              width: "90%",
              height: "90%",
              borderRadius: 10,
              boxShadow: "0 2px 18px #222",
            }
      }
    />
  </Box>
  {zoomPhotoData.idx !== -1 && (
    <Button
      variant="contained"
      color="error"
      sx={{
        mb: 1,
        mb:isMobile ? 5 : 0,
        background: "#ff3333",
        color: "#fff",
        borderRadius: 3,
        fontWeight: "bold",
      }}
      onClick={async () => {
        const idx = zoomPhotoData.idx;
        const newPhotos = existingPhotos.filter((_, i) => i !== idx);
        const resp = await fetch(
          `https://lavaja.up.railway.app/api/appointments/appointments/${appointmentPhotoId}/photos`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fotos: newPhotos }),
          }
        );
        if (resp.ok) {
          setExistingPhotos(newPhotos);
          setZoomPhotoData({ url: "", idx: -1 });
          if (typeof onUpdateService === "function")
          onUpdateService();
          setSnackbarMessage("Foto excluída com sucesso!");
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage("Erro ao excluir foto!");
          setOpenSnackbar(true);
        }
      }}
    >
      Excluir foto
    </Button>
  )}
</Dialog>
</Dialog>

<Modal open={cameraOpen} onClose={handleCloseCamera}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#2e1065",
          borderRadius: 3,
          outline: "none",
          p: 2,
          boxShadow: 10,
          width: "85%",
          height: "85%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "98%", height:"80%",borderRadius: 12, background: "#000" }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Button
          onClick={handleCapturePhoto}
          variant="contained"
          sx={{
            mt:"1rem",
            background: "#ac42f7",
            color: "#FFF",
            borderRadius: 3,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
          disabled={!canAddMorePhotos}
        >
          Capturar Foto
        </Button>
        <Button
          onClick={handleCloseCamera}
          sx={{
            mt:"1rem",
            background: "#fff",
            color: "#ac42f7",
            borderRadius: 3,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Modal>
    </Box>
  );
};

export default ScheduledServices;
