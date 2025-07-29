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
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
const purple = "#8B5CF6";
const accentPurple = "#A855F7";

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
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F1E7FF 0%, #E8D5FF 100%)"
      }}>
        <CircularProgress sx={{ color: purple }} size={50} />
      </Box>
    );
  }
  if (!establishment) {
    return (
      <Box sx={{ 
        textAlign: "center", 
        mt: 8,
        background: "linear-gradient(135deg, #F1E7FF 0%, #E8D5FF 100%)",
        minHeight: "100vh",
        pt: 10
      }}>
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
    <Box sx={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F1E7FF 0%, #E8D5FF 100%)",
      py: 4
    }}>
      <Box sx={{ maxWidth: 600, width: "90%", mx: "auto" }}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
            mb: 4,
            p: 3,
            color: "white",
            border: "none",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 2, textAlign: "center", letterSpacing: 1 }}
          >
            {establishment.name}
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />
          
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box>
                    <LocationOnRoundedIcon/>
              </Box>
            <Box>
    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: "#FFFFFF" }}>
      Endereço
    </Typography>
      <Typography fontSize={14}>
        {address ? `${address.street}, ${address.number} - ${address.neighborhood}` : ""}<br />
        {address ? `${address.city} - ${address.state}` : ""}
        {address && address.cep && <><br />CEP: {address.cep}</>}
      </Typography>
          </Box>
          </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Box>
      <CalendarMonthRoundedIcon sx={{ color: "#FFFFFF" }} />
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: "#FFFFFF" }}>
        Funcionamento
      </Typography>
      <Typography fontSize={14}>{workingDays || "--"}</Typography>
    </Box>
  </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Box>
      <AccessTimeRoundedIcon sx={{ color: "#FFFFFF" }} />
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: "#FFFFFF"}}>
        Horário
      </Typography>
      <Typography fontSize={14}>{openH ? `${openH.open} às ${openH.close}` : "--"}</Typography>
    </Box>
  </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box>
      <CreditCardRoundedIcon sx={{ color: "#FFFFFF" }} />
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: "#FFFFFF" }}>
        Pagamento
      </Typography>
      <Typography fontSize={14}>{(establishment.paymentMethods || []).join(", ")}</Typography>
    </Box>
  </Box>
</Box>
        </Card>

        <Typography variant="h5" fontWeight={700} color={purple} sx={{ mb: 3, textAlign: "center" }}>
          Nossos Serviços
        </Typography>

        {(establishment.services || []).map((srv) => (
          <Card
            sx={{
              mb: 3,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
            }}
            key={srv.id}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700} color={purple} sx={{ mb: 1 }}>
                    {srv.name}
                  </Typography>
                  <Typography fontSize={14} color="#64748B" sx={{ mb: 2, lineHeight: 1.5 }}>
                    {srv.description}
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography fontSize={13} color={purple} fontWeight={600}>
                         R$ {Number(srv.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography fontSize={13} color={purple} fontWeight={600}>
                        {srv.duration} min
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: `linear-gradient(135deg, ${purple} 0%, ${accentPurple} 100%)`,
                  color: "#fff",
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 16,
                  boxShadow: `0 8px 20px rgba(139, 92, 246, 0.3)`,
                  ":hover": { 
                    background: `linear-gradient(135deg, ${accentPurple} 0%, ${purple} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 30px rgba(139, 92, 246, 0.4)`,
                  },
                }}
                onClick={() => handleOpenModal(srv)}
              >
                Agendar Serviço
              </Button>
            </CardContent>
          </Card>
        ))}

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
                background: `linear-gradient(135deg, ${purple} 0%, ${accentPurple} 100%)`,
                borderRadius: 4,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                p: 4,
                minWidth: 330,
                width: "93%",
                maxWidth: 600,
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#FFFFFF", mb: 3, fontWeight: 700, textAlign: "center" }}
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
                      sx: {
                        mb: 3,
                        "& .MuiInputBase-input": { color: "#fff", borderColor: "#fff" },
                        "& .MuiInputLabel-root": { color: "#fff", borderColor: "#fff" },
                        "& .MuiSvgIcon-root": { color: "#fff", borderColor: "#fff" },
                        "& .MuiPickersOutlinedInput-notchedOutline ": { color: "#fff", borderColor: "#fff" },
                                            "& .MuiOutlinedInput-root": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: 2,
                          color: "#fff",
                          borderColor: "#fff !important" ,
                          "& fieldset": { borderColor: "#fff !important" },
                          "&:hover fieldset": { borderColor: "#fff !important" },
                          "&.Mui-focused fieldset": { borderColor: "#fff !important" },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              
              {selectedDate && (
                <>
                  <Typography sx={{ mb: 2, color: "#fff", fontWeight: 600, fontSize: 16 }}>
                    Selecione o horário:
                  </Typography>
                  {loadingSlots ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                      <CircularProgress size={30} sx={{ color: "#fff" }} />
                    </Box>
                  ) : slots.length > 0 ? (
                    <Box sx={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", 
                      gap: 1.5, 
                      mb: 3,
                      maxHeight: 300,
                      overflow: "auto",
                      p: 1
                    }}>
                      {slots.map((h, idx) => (
                        <Chip
                          key={h + idx}
                          label={h}
                          clickable
                          onClick={() => setSelectedSlot(h)}
                          sx={{
                            fontWeight: 600,
                            fontSize: 14,
                            py: 2,
                            bgcolor: selectedSlot === h ? "#fff" : "rgba(255, 255, 255, 0.1)",
                            color: selectedSlot === h ? purple : "#fff",
                            border: selectedSlot === h ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
                            ":hover": {
                              bgcolor: selectedSlot === h ? "#f8f9fa" : "rgba(255, 255, 255, 0.2)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography color="#fff" sx={{ fontSize: 15, textAlign: "center", py: 2 }}>
                      Nenhum horário disponível para esse dia.
                    </Typography>
                  )}
                </>
              )}
              
              <Box sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                mt: 3,
              }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    ":hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    flex: 1,
                  }}
                  onClick={handleCloseModal}
                >
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#fff",
                    color: purple,
                    ":hover": { bgcolor: "#f8f9fa" },
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    flex: 1,
                  }}
                  disabled={!selectedSlot}
                  onClick={handleConfirmSlot}
                >
                  CONFIRMAR
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
                background: `linear-gradient(135deg, ${purple} 0%, ${accentPurple} 100%)`,
                borderRadius: 4,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                p: 4,
                minWidth: 330,
                width: "93%",
                maxWidth: 600,
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#fff", mb: 3, fontWeight: 700, textAlign: "center" }}
              >
                Finalizar Agendamento
              </Typography>
              
              <form onSubmit={handleSubmit(handleBook)}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1, fontSize: 15 }}>
                        Nome Completo
                      </Typography>
                      <TextField
                        {...field}
                        placeholder="Digite seu nome completo"
                        fullWidth
                        sx={{
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
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1, fontSize: 15 }}>
                        Telefone
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
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1, fontSize: 15 }}>
                        Veículo
                      </Typography>
                      <TextField
                        {...field}
                        placeholder="Modelo, placa, etc"
                        fullWidth
                        sx={{
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
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMsg}
                  </Alert>
                )}
                {successMsg && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMsg}
                  </Alert>
                )}
                
                <Box sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      ":hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 700,
                      flex: 1,
                    }}
                    onClick={handleCloseBookingModal}
                    disabled={bookingLoading}
                    type="button"
                  >
                    VOLTAR
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#fff",
                      color: purple,
                      ":hover": { bgcolor: "#f8f9fa" },
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 700,
                      flex: 1,
                    }}
                    disabled={bookingLoading}
                    type="submit"
                  >
                    {bookingLoading ? "AGENDANDO..." : "AGENDAR"}
                  </Button>
                </Box>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}