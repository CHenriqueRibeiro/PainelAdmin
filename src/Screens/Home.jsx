// Home.tsx
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
  const fetchAppointments = async () => {
    const response = await fetch(
      "https://backlavaja.onrender.com/api/appointments/appointments/67d64cec87b9bd7f27e2dd8c",
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
    setLoading(false);
  };

  const teste = async () => {
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
    setLoading(false);
  };

  useEffect(() => {
    teste();
    fetchAppointments();
  }, []);

  const handleServiceUpdated = () => {
    fetchAppointments();
  };
  console.log(owner?.establishments[0]._id);
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
