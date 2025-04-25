import { Box } from "@mui/material";
import DailyStatus from "../Components/DailyStats";
import ScheduledServices from "../Components/ScheduledServices";
import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const ownerUser = JSON.parse(localStorage.getItem("user"));
  const ownerId = ownerUser.id;

  const fetchAppointments = async (establishmentId) => {
    try {
      const response = await fetch(
        `https://backlavaja.onrender.com/api/appointments/appointments/${establishmentId}`,
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
        `https://backlavaja.onrender.com/api/establishment/owner/${ownerId}`,
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
    if (owner?.establishments?.[0]?._id) {
      fetchAppointments(owner.establishments[0]._id);
    } else if (
      owner &&
      (!owner.establishments || owner.establishments.length === 0)
    ) {
      setLoading(false);
    }
  }, [owner]);

  const handleServiceUpdated = () => {
    if (owner?.establishments?.[0]?._id) {
      fetchAppointments(owner.establishments[0]._id);
    }
  };

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
        />
      </Box>
    </Box>
  );
}
