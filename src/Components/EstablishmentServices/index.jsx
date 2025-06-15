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
  MenuItem,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function getServiceSchema(openingHours) {
  let validIntervals = [];
  if (openingHours?.hasLunchBreak) {
    validIntervals.push({
      start: openingHours?.intervalOpen,
      end: openingHours?.intervalClose,
    });
  } else {
    validIntervals.push({
      start: openingHours?.open,
      end: openingHours?.close,
    });
  }

  function isInValidInterval(time) {
    return validIntervals.some(
      (interval) => time >= interval.start && time <= interval.end
    );
  }

  return yup.object().shape({
    name: yup.string().required("Nome do serviço é obrigatório"),
    description: yup.string().required("Descrição do serviço é obrigatória"),
    price: yup
      .number()
      .typeError("Preço deve ser um número")
      .required("Preço é obrigatório")
      .min(0, "Preço não pode ser negativo"),
    duration: yup
      .number()
      .typeError("Duração deve ser um número")
      .required("Duração é obrigatória")
      .min(1, "Duração deve ser maior que 0"),
    permitirAtendimentoSimultaneo: yup.boolean(),
    quantidadeAtendimentosSimultaneos: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .when("permitirAtendimentoSimultaneo", {
        is: true,
        then: (schema) =>
          schema
            .typeError("Quantidade deve ser um número")
            .required("Quantidade de atendimentos simultâneos é obrigatória")
            .min(1, "Deve ser pelo menos 1"),
        otherwise: (schema) => schema.notRequired(),
      }),
    availability: yup
      .array()
      .of(
        yup.object().shape({
          day: yup.string().required("Dia é obrigatório"),
          availableHours: yup
            .array()
            .of(
              yup.object().shape({
                start: yup
                  .string()
                  .required("Horário de início é obrigatório")
                  .test(
                    "dentro-do-funcionamento",
                    "Horário de início fora do funcionamento",
                    function (value) {
                      if (!value) return true;
                      return isInValidInterval(value);
                    }
                  )
                  .test(
                    "inicio-menor-que-fim",
                    "Horário de início deve ser menor que o horário de fim",
                    function (value) {
                      const { end } = this.parent;
                      if (!value || !end) return true;
                      return value < end;
                    }
                  ),
                end: yup
                  .string()
                  .required("Horário de fim é obrigatório")
                  .test(
                    "dentro-do-funcionamento",
                    "Horário de fim fora do funcionamento",
                    function (value) {
                      if (!value) return true;
                      return isInValidInterval(value);
                    }
                  )
                  .test(
                    "fim-maior-que-inicio",
                    "Horário de fim deve ser maior que o horário de início",
                    function (value) {
                      const { start } = this.parent;
                      if (!value || !start) return true;
                      return value > start;
                    }
                  ),
              })
            )
        })
      )
      .test(
        "pelo-menos-um-dia-com-horario",
        "Selecione pelo menos um dia e cadastre pelo menos um horário válido",
        (availability) => {
          if (!availability) return false;
          return availability.some(
            (day) =>
              Array.isArray(day.availableHours) &&
              day.availableHours.some(
                (h) => h.start && h.end
              )
          );
        }
      ),
  });
}

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
  //const [dailyLimit, setDailyLimit] = useState("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [availability, setAvailability] = useState([]);
  const [availabilityEdit, setAvailabilityEdit] = useState([]);

  const openingHours = dataEstablishment[0]?.openingHours;
  const serviceSchema = getServiceSchema(openingHours);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "",
      permitirAtendimentoSimultaneo: false,
      quantidadeAtendimentosSimultaneos: "",
      availability: availability.map(day => ({
        day: day.day,
        availableHours: [{ start: "", end: "" }]
      }))
    },
  });

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

    reset({
      name: "",
      description: "",
      price: "",
      duration: "",
      permitirAtendimentoSimultaneo: false,
      quantidadeAtendimentosSimultaneos: "",
      availability: mappedAvailability
    });
  }, [dataEstablishment, reset]);

  const [expandedService, setExpandedService] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseDialog();
  reset({
    name: "",
    description: "",
    price: "",
    duration: "",
    permitirAtendimentoSimultaneo: false,
    quantidadeAtendimentosSimultaneos: "",
    availability: availability.map(day => ({
      day: day.day,
      availableHours: [{ start: "", end: "" }]
    }))
  });
};

const handleOpenDialogEdit = (service) => {
  setServiceName(service.name);
  setPrice(String(service.price));
  setDuration(String(service.duration));
  setDescription(service.description);
  setConcurrentService(service.concurrentService);
  setConcurrentServiceValue(
    service.concurrentServiceValue ? Number(service.concurrentServiceValue) : ""
  );

  const workingDays = dataEstablishment[0]?.workingDays || [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const daysOrder = {
    "Segunda": 1,
    "Terça": 2,
    "Quarta": 3,
    "Quinta": 4,
    "Sexta": 5,
    "Sábado": 6,
    "Domingo": 7,
  };

  const daysWithHours = service.availability.filter(
    (d) => d.availableHours && d.availableHours.length > 0
  );

  const missingDays = workingDays.filter(
    (day) => !daysWithHours.find((d) => d.day === day)
  );

  const missingDaysMapped = missingDays.map((day) => ({
    day,
    availableHours: [],
  }));

  const mappedAvailability = [...daysWithHours, ...missingDaysMapped].sort(
    (a, b) => daysOrder[a.day] - daysOrder[b.day]
  );

  setAvailability(mappedAvailability);
  setAvailabilityEdit(mappedAvailability);
  setExpandedService(service._id);
  setOpenDialogEdit(true);

  reset({
    name: service.name,
    description: service.description,
    price: String(service.price),
    duration: String(service.duration),
    permitirAtendimentoSimultaneo: service.concurrentService,
    quantidadeAtendimentosSimultaneos: service.concurrentServiceValue
      ? String(service.concurrentServiceValue)
      : "",
    availability: mappedAvailability,
  });
};

  const handleUpdateService = async (data) => {
    try {
      setIsLoadingButtonSave(true);
      const response = await fetch(
        `https://lavaja.up.railway.app/api/services/establishment/${dataEstablishment[0]._id}/service/${expandedService}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            price: Number(data.price),
            duration: Number(data.duration),
            description: data.description,
            availability: data.availability,
            concurrentService: data.permitirAtendimentoSimultaneo,
            concurrentServiceValue: data.quantidadeAtendimentosSimultaneos,
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar serviço");
      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialogEdit();
      reset();
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
    //setDailyLimit("");
    setAvailability(
      availability.map((day) => ({
        ...day,
        availableHours: [{ start: "", end: "" }],
      }))
    );
  };
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
    setConcurrentService(false);
    setConcurrentServiceValue("");
    setServiceName("");
    setPrice("");
    setDuration("");
    setDescription("");
    //setDailyLimit("");
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

  const handleCreateService = async (data) => {
    try {
      setIsLoadingButtonSave(true);
      const response = await fetch(
        `https://lavaja.up.railway.app/api/services/establishment/${dataEstablishment[0]._id}/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            price: Number(data.price),
            duration: Number(data.duration),
            description: data.description,
            availability: data.availability,
            establishment_id: dataEstablishment[0]._id,
            concurrentService: data.permitirAtendimentoSimultaneo,
            concurrentServiceValue: data.quantidadeAtendimentosSimultaneos,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar serviço");
      }

      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      setOpenDialog(false);
      reset();
      setSnackbarSeverity("success");
      setSnackbarMessage("Serviço criado com sucesso");
      setOpenSnackbar(true);
    } catch (error) {
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
        `https://lavaja.up.railway.app/api/services/establishment/${dataEstablishment[0]._id}/service/${serviceIdToDelete}`,
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
    
    setValue('availability', newAvailability);
  };

  const removeAvailableHour = (dayIndex, hourIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].availableHours.splice(hourIndex, 1);
    setAvailability(newAvailability);
    setValue('availability', newAvailability);
  };

  const countDiasComHorarioAfterRemove = (availabilityArr, dayIndex, hourIndex) => {
    return availabilityArr.filter((d, idx) => {
      if (idx === dayIndex) {
        const remainingHours = d.availableHours.filter((_, hIdx) => hIdx !== hourIndex);
        return remainingHours.length > 0;
      }
      return d.availableHours.length > 0;
    }).length;
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
                              {service?.concurrentService ? 'Sim' : 'Não'}
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
                            {service.availability
                              .filter(day => day.availableHours && day.availableHours.length > 0)
                              .map((day) => (
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
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição do serviço
              </InputLabel>
              <TextField
                fullWidth
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Preço do serviço (R$)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Tempo do serviço (min)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
                size="small"
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
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fff",
                      borderRadius: 2,
                    },
                    "& .MuiInputBase-root.Mui-error": {
                      bgcolor: "#fff",
                    },
                  }}
              />
            </Grid2>*/}
            <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
              <FormControlLabel
                control={
                  <Controller
                    name="permitirAtendimentoSimultaneo"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={!!field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        size="small"
                      />
                    )}
                  />
                }
                label="Permitir atendimentos simultâneos?"
              />
            </Grid2>
            {watch("permitirAtendimentoSimultaneo") && (
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
                    {...register("quantidadeAtendimentosSimultaneos")}
                    error={!!errors.quantidadeAtendimentosSimultaneos}
                    helperText={errors.quantidadeAtendimentosSimultaneos?.message}
                    size="small"
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
    alignItems: { xs: "center",
      sm: "flex-end"},
    flexDirection: {
      xs: "column",
      sm: "row"
    },
    width: "100%",
  }}
>
  <Box sx={{ display: "flex", flexDirection: "column", flex: 1 , width: "100%"}}>
    <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
      Início
    </InputLabel>
    <TextField
      type="time"
      {...register(`availability.${dayIndex}.availableHours.${hourIndex}.start`)}
      error={!!errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.start}
      helperText={errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.start?.message}
      size="small"
      sx={{ bgcolor: "#fff", borderRadius: 2 }}
    />
  </Box>

  <Box sx={{ display: "flex", flexDirection: "column", flex: 1 , width: "100%"}}>
    <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
      Fim
    </InputLabel>
    <TextField
      type="time"
      {...register(`availability.${dayIndex}.availableHours.${hourIndex}.end`)}
      error={!!errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.end}
      helperText={errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.end?.message}
      size="small"
      sx={{ bgcolor: "#fff", borderRadius: 2 }}
    />
  </Box>

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      justifyContent: {
        xs: "flex-end",
        sm: "center",
      },
      width: {
        xs: "100%",
        sm: "auto",
      },
    }}
  >
    <Tooltip title="Adicionar horário">
      <IconButton onClick={() => addAvailableHour(dayIndex)}>
        <AddRoundedIcon sx={{ color: "#AC42F7" }} />
      </IconButton>
    </Tooltip>
    <Divider orientation="vertical" flexItem />
    <Tooltip title="Remover horário">
      <IconButton
        onClick={() => removeAvailableHour(dayIndex, hourIndex)}
        disabled={
          countDiasComHorarioAfterRemove(availability, dayIndex, hourIndex) === 0
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
            onClick={handleSubmit(handleCreateService)}
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
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição do serviço
              </InputLabel>
              <TextField
                fullWidth
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Preço do serviço (R$)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
                size="small"
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
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Tempo do serviço (min)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
                size="small"
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
            </Grid2>

            <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
              <FormControlLabel
                control={
                  <Controller
                    name="permitirAtendimentoSimultaneo"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={!!field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        size="small"
                      />
                    )}
                  />
                }
                label="Permitir atendimentos simultâneos?"
              />
            </Grid2>
            {watch("permitirAtendimentoSimultaneo") && (
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
                    {...register("quantidadeAtendimentosSimultaneos")}
                    error={!!errors.quantidadeAtendimentosSimultaneos}
                    helperText={errors.quantidadeAtendimentosSimultaneos?.message}
                    size="small"
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
    alignItems: { xs: "center",
      sm: "flex-end"},
    flexDirection: {
      xs: "column",
      sm: "row"
    },
    width: "100%",
  }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 , width: "100%"}}>
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Início
                          </InputLabel>
                          <TextField
                            type="time"
                            {...register(`availability.${dayIndex}.availableHours.${hourIndex}.start`)}
                            error={!!errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.start}
                            helperText={errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.start?.message}
                            size="small"
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
                        </Box>

<Box sx={{ display: "flex", flexDirection: "column", flex: 1 , width: "100%"}}>
                          <InputLabel sx={{ color: "#FFFFFF", pl: 0.3 }}>
                            Fim
                          </InputLabel>
                          <TextField
                            type="time"
                            {...register(`availability.${dayIndex}.availableHours.${hourIndex}.end`)}
                            error={!!errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.end}
                            helperText={errors.availability?.[dayIndex]?.availableHours?.[hourIndex]?.end?.message}
                            size="small"
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
                        </Box>

                        <Box
                          sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      justifyContent: {
        xs: "flex-end",
        sm: "center",
      },
      width: {
        xs: "100%",
        sm: "auto",
      },
    }}
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
                              onClick={() => removeAvailableHour(dayIndex, hourIndex)}
                              disabled={countDiasComHorarioAfterRemove(availability, dayIndex, hourIndex) === 0}
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
            onClick={handleSubmit(handleUpdateService)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstablishmentServices;
