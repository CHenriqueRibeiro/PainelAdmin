import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Modal,
  Fade,
  Backdrop,
  Chip,
  Divider,
  Alert,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputMask from "react-input-mask";

const purple = "#6A1B9A";
const lightPurple = "#F1EEFF";

const schema = yup.object().shape({
  clientName: yup.string().required("Nome obrigatório"),
  clientPhone: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido").required("Telefone obrigatório"),
  veiculo: yup.string().required("Campo obrigatório")
});

export default function AgendamentoPublico() {
  const { establishmentId } = useParams();
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceSelected, setServiceSelected] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      clientName: "",
      clientPhone: "",
      veiculo: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    fetch(`https://lavaja.up.railway.app/api/public/establishment/${establishmentId}`)
      .then((res) => res.json())
      .then((data) => {
        setEstablishment(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [establishmentId]);

  useEffect(() => {
  if (!serviceSelected || !selectedDate) {
    setSlots([]);
    return;
  }
  if (dayjs(selectedDate).isBefore(dayjs().startOf('day'))) {
    setSlots([]);
    setSelectedSlot("");
    return;
  }

  setLoadingSlots(true);
  setSlots([]);
  fetch(
    `https://lavaja.up.railway.app/api/public/establishment/${establishmentId}/service/${serviceSelected.id}/slots?date=${selectedDate}`
  )
    .then((res) => res.json())
    .then((data) => {
      let slotsFiltered = data.slots || [];
      if (selectedDate === dayjs().format("YYYY-MM-DD")) {
        const now = dayjs();
        slotsFiltered = slotsFiltered.filter((slot) => {
          const [h, m] = slot.split(":").map(Number);
          return h > now.hour() || (h === now.hour() && m > now.minute());
        });
      }
      setSlots(slotsFiltered);
    })
    .catch(() => setSlots([]))
    .finally(() => setLoadingSlots(false));
}, [serviceSelected, selectedDate, establishmentId]);


  const handleOpenModal = (service) => {
    setServiceSelected(service);
    setModalOpen(true);
    setSelectedDate("");
    setSelectedSlot("");
    setSlots([]);
    setSuccessMsg("");
    setErrorMsg("");
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setServiceSelected(null);
    setSelectedDate("");
    setSelectedSlot("");
    setSlots([]);
    setSuccessMsg("");
    setErrorMsg("");
  };
  const handleConfirmSlot = () => {
    setBookingModalOpen(true);
  };
  const handleCloseBookingModal = () => {
    setBookingModalOpen(false);
    reset();
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleBook = async (data) => {
    setBookingLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(
        `https://lavaja.up.railway.app/api/public/establishment/${establishmentId}/service/${serviceSelected.id}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            veiculo: data.veiculo,
            date: selectedDate,
            startTime: selectedSlot,
          }),
        }
      );
      const resData = await res.json();
      if (res.status === 201) {
        setSuccessMsg("Agendamento criado com sucesso!");
        setTimeout(() => {
          handleCloseBookingModal();
          handleCloseModal();
        }, 1200);
      } else {
        setErrorMsg(resData.message || "Erro ao agendar.");
      }
    } catch (err) {
      setErrorMsg("Erro de conexão.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!establishment) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error">
          Estabelecimento não encontrado.
        </Typography>
      </Box>
    );
  }

  const address = establishment.address;
  const workingDays = establishment.workingDays?.join(", ");
  const openH = establishment.openingHours;

  return (
    <Box sx={{ maxWidth: 600,width: "90%", mx: "auto", pt: 2}}>
      <Box
        sx={{
          background: "rgba(172, 66, 247, 0.16)",
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.11)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          mb: 3,
          p: 3,
          color: "#2e0452",
          border: `1.5px solid ${purple}22`,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color={purple}
          sx={{ mb: 1, textAlign: "center", letterSpacing: 1 }}
        >
          {establishment.name}
        </Typography>
        <Divider sx={{ my: 1, opacity: 0.2 }} />
        <Typography sx={{ mb: 1 }}>
          <b>Endereço:</b>
          <br />
          {address
            ? `${address.street}, ${address.number} - ${address.neighborhood}`
            : ""}
          <br />
          {address ? `${address.city} - ${address.state}` : ""}
          {address && address.cep && (
            <>
              <br />
              CEP: {address.cep}
            </>
          )}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <b>Funcionamento:</b>
          <br />
          {workingDays || "--"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <b>Horário:</b>{" "}
          {openH ? `${openH.open} às ${openH.close}` : "--"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <b>Formas de pagamento:</b>
          <br />
          {(establishment.paymentMethods || []).join(", ")}
        </Typography>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 400 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: purple,
              border: `2.5px solid ${purple}55`,
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              minWidth: 330,
              width: "93%",
              maxWidth: 600,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#FFFFFF", mb: 2, fontWeight: 700, textAlign: "center" }}
            >
              Agendar: {serviceSelected?.name}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <DatePicker
                label="Escolha a data"
                value={selectedDate && selectedDate.length === 10 ? dayjs(selectedDate) : null}
  onChange={(newDate) => {
    const val = newDate && dayjs(newDate).isValid()
      ? newDate.format("YYYY-MM-DD")
      : "";
    setSelectedDate(val);
    setSelectedSlot("");
  }}
                  minDate={dayjs().startOf('day')}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    borderColor: "#fff",
                    sx: {
                      mb: 3,
                      "& .MuiInputBase-input": {
                        color: "#fff",
                        borderColor: "#fff",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#fff",
                        borderColor: "#fff",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#fff",
                        borderColor: "#fff",
                      },
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#7e24be",
                        borderRadius: 2,
                        color: "#fff",
                        borderColor: "#fff",
                        "& fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      "& .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: "#fff",
                        
                      },
                      "& .MuiPickersInputBase-sectionsContainer, & .MuiPickersSectionList-root, & .MuiPickersInputBase-root": {
                        color: "#fff !important",
                        borderColor: "#fff",
                      },
                      "& [contenteditable='false']": {
                        color: "#fff !important",
                        borderColor: "#fff",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            {selectedDate && (
              <>
                <Typography sx={{ mb: 1, color: "#fff", fontWeight: 500 }}>
                  Selecione o horário:
                </Typography>
                {loadingSlots ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={26} sx={{ color: "#fff" }} />
                  </Box>
                ) : slots.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, justifyContent:  {xs: "space-between", sm: "flex-start" }, }}>
                    {slots.map((h, idx) => (
                      <Chip
                        key={h + idx}
                        label={h}
                        color={selectedSlot === h ? "secondary" : "primary"}
                        variant={selectedSlot === h ? "filled" : "outlined"}
                        clickable
                        onClick={() => setSelectedSlot(h)}
                        sx={{
                          fontWeight: 600,
                          fontSize: 15,
                          bgcolor:
                            selectedSlot === h ? "#39b97e"  : `${purple}10`,
                          color:"#fff",
                          border: `1px solid #fff`,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="#fff" sx={{ fontSize: 15 }}>
                    Nenhum horário disponível para esse dia.
                  </Typography>
                )}
              </>
            )}
            <Box sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                mt: 2,
              }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: purple,
                  ":hover": { bgcolor: "#8a43f7", color: "#fff" },
                  borderRadius: 3,
                  px: 4,
                  fontWeight: 700,
                }}
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#39b97e",
                  ":hover": { bgcolor: "#2b9e68" },
                  borderRadius: 3,
                  px: 4,
                  fontWeight: 700,
                }}
                disabled={!selectedSlot}
                onClick={handleConfirmSlot}
              >
                {selectedDate ? "Confirmar" : "Avançar"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={bookingModalOpen}
        onClose={handleCloseBookingModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 400 }}
      >
        <Fade in={bookingModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: purple,
              borderRadius: 4,
              boxShadow: 24,
              p: 1,
              minWidth: 330,
              width: "93%",
              maxWidth: 600
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                width: "100%",
                p: 3,
                boxShadow: "0 2px 18px 0 rgba(31, 38, 135, 0.14)",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                alignItems: "stretch",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#fff", mb: 2, fontWeight: 700, textAlign: "left", pl: 0.5 }}
              >
                Seus dados para agendamento
              </Typography>
              <form onSubmit={handleSubmit(handleBook)}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5, fontSize: 15 }}>
                        Nome do Cliente
                      </Typography>
                      <TextField
                        {...field}
                        placeholder="Digite seu nome completo"
                        fullWidth
                         sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                        error={!!errors.clientName}
                        helperText={errors.clientName?.message}
                      />
                    </Box>
                  )}
                />
                <Controller
                  name="clientPhone"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5, fontSize: 15 }}>
                        Nº Telefone
                      </Typography>
                      <InputMask
                        mask="(99) 99999-9999"
                        maskChar={null}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={false}
                      >
                        {() => (
                          <TextField
                            placeholder="(99) 99999-9999"
                            fullWidth
                            sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                      }}
                            error={!!errors.clientPhone}
                            helperText={errors.clientPhone?.message}
                          />
                        )}
                      </InputMask>
                    </Box>
                  )}
                />
                <Controller
                  name="veiculo"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5, fontSize: 15 }}>
                        Veiculo
                      </Typography>
                      <TextField
                        {...field}
                        placeholder="Modelo, placa, etc"
                        fullWidth
                        sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        }}
                        error={!!errors.veiculo}
                            helperText={errors.veiculo?.message}
                      />
                    </Box>
                  )}
                />
                {errorMsg && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {errorMsg}
                  </Alert>
                )}
                {successMsg && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    {successMsg}
                  </Alert>
                )}
                <Box sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  mt: 2,
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#FFFFFF",
                      ":hover": { bgcolor: "#8a43f7", color:"#fff" },
                      borderRadius: 2,
                      px: 4,
                      color: purple,
                      fontWeight: 700,
                      width: { xs: "100%", sm: "auto" },
                    }}
                    onClick={handleCloseBookingModal}
                    disabled={bookingLoading}
                    type="button"
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#39b97e",
                      ":hover": { bgcolor: "#2b9e68" },
                      borderRadius: 2,
                      px: 4,
                      fontWeight: 700,
                      width: { xs: "100%", sm: "auto" },
                    }}
                    disabled={bookingLoading}
                    type="submit"
                  >
                    {bookingLoading ? "Agendando..." : "Agendar"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {(establishment.services || []).map((srv) => (
        <Card
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            background: lightPurple,
            boxShadow: "none",
            borderRadius: 3,
          }}
          key={srv.id}
        >
          <Box
            sx={{
              ml: 2,
              width: 44,
              height: 44,
              bgcolor: purple,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 18,
              textTransform: "uppercase",
            }}
          >
            {srv.name?.charAt(0) || ""}
          </Box>
          <CardContent sx={{ flex: 1, py: 2 }}>
            <Typography fontWeight={700} fontSize={16} color={purple}>
              {srv.name}
            </Typography>
            <Typography fontSize={13} color="#424242" sx={{ mb: 0.5 }}>
              {srv.description}
            </Typography>
            <Typography fontSize={13} color={purple}>
              <b>Preço:</b> R${Number(srv.price).toFixed(2)} |{" "}
              <b>Duração:</b> {srv.duration} min
            </Typography>
          </CardContent>
          <CardActions sx={{ pr: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: purple,
                color: "#fff",
                borderRadius: 10,
                px: 3,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                ":hover": { bgcolor: "#8a43f7" },
              }}
              onClick={() => handleOpenModal(srv)}
            >
              Agendar
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}
