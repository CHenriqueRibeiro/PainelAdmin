import { Box, Snackbar, Alert } from "@mui/material";
import DailyStatus from "../Components/DailyStats";
import ScheduledServices from "../Components/ScheduledServices";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import WelcomeModal from "../Components/WelcomeModal";
import { io } from "socket.io-client";

export default function Home() {
  const ownerUser = JSON.parse(localStorage.getItem("user"));
  const ownerId = ownerUser.id;
  const token = localStorage.getItem("authToken");
  const day = dayjs().format("YYYY-MM-DD");
  const [daySelect, setDaySelect] = useState(day);
  const [services, setServices] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const fetchAppointments = async (establishmentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/appointments/${establishmentId}?date=${daySelect}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const establishmentSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOwner(data);
    } catch (err) {
      console.error("Erro ao buscar estabelecimentos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    establishmentSearch();
  }, []);

  useEffect(() => {
    if (owner) {
      const steps = owner.onboardingSteps;
      const precisaMostrarOnboarding = !(steps?.estabelecimento && steps?.servico);

      function isDataLimiteExpirada() {
        if (!owner.dataLimite) return false;
        const agora = new Date();
        let limite;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(owner.dataLimite)) {
          const [dia, mes, ano] = owner.dataLimite.split("/");
          limite = new Date(`${ano}-${mes}-${dia}T23:59:59`);
        } else {
          limite = new Date(owner.dataLimite);
        }
        return agora > limite;
      }

      const expirado = isDataLimiteExpirada();
      setShowWelcomeModal(precisaMostrarOnboarding || expirado);
    }
  }, [owner]);

  useEffect(() => {
    if (owner?.establishments?.[0]?._id) {
      fetchAppointments(owner.establishments[0]._id);
    } else if (owner && (!owner.establishments || owner.establishments.length === 0)) {
      setLoading(false);
    }
  }, [owner]);
  useEffect(() => {
    if (owner?.establishments?.[0]?._id && daySelect) {
      fetchAppointments(owner.establishments[0]._id);
    }
  }, [daySelect]);

 useEffect(() => {
  if (owner?.establishments?.[0]?._id) {
    const establishmentId = owner?.establishments?.[0]?._id;

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      socket.emit("join_establishment_room", establishmentId);
    });

    socket.on("novo_agendamento", (data) => {
      console.log("📣 Novo agendamento recebido via WebSocket:", data);
      setShowNotification(true);
      fetchAppointments(owner?.establishments[0]?._id);
    });

    socket.on("disconnect", () => {
      console.warn("🔌 Desconectado do WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erro na conexão WebSocket:", err.message);
    });

    return () => {
      socket.disconnect();
      console.log("🛑 Socket desconectado");
    };
  }
}, [owner]);

  const handleServiceUpdated = () => {
    if (owner?.establishments?.[0]?._id) {
      fetchAppointments(owner.establishments[0]._id);
    }
  };

  if (owner?.dataLimiteTeste) {
    const data = new Date(owner.dataLimiteTeste);
    dataLimiteFormatada = data.toLocaleDateString("pt-BR");
  }

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F1EEFF",
      }}
    >
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        statusConta={owner?.statusConta}
        dataLimite={owner?.dataLimite}
        onboardingSteps={owner?.onboardingSteps}
      />

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 4,
        }}
      >
        <DailyStatus services={services} loading={loading} />
        <ScheduledServices
          services={services}
          onUpdateService={handleServiceUpdated}
          loading={loading}
          owner={owner}
          daySelect={daySelect}
          setDaySelect={setDaySelect}
        />
      </Box>

      {/* Notificação de novo agendamento */}
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Novo agendamento recebido!
        </Alert>
      </Snackbar>
    </Box>
  );
}
