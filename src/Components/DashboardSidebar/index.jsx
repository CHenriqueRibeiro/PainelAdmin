/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import { io } from "socket.io-client";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import ChatPopUpIA from "../ChatPopUpIA";
import WhatsAppConnectionPopUp from "../WhatsAppConnectionPopUp";
import { useAuth } from "../../Context/AuthContext";

const getNavigation = () => [
  {
    segment: "Home",
    title: "Agendamentos",
    icon: <UpdateRoundedIcon sx={{ color: "#009688", fontSize: 28 }} />,
  },
  {
    segment: "Estabelecimento",
    icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} />,
  },
  {
    segment: "Relatorios",
    icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    onClick: () => Navigate("/relatorios"),
  },
  {
    segment: "Gestão",
    title: "Gestão",
    icon: <DonutSmallRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    children: [
      {
        segment: "Custos",
        icon: <QueryStatsRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
      {
        segment: "Orcamentos",
        icon: (
          <DescriptionRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />
        ),
      },
      {
        segment: "Estoque",
        icon: <InventoryRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
    ],
  },
];

const demoTheme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

function SidebarFooter() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Tooltip title="Sair">
        <IconButton
          onClick={handleLogout}
          sx={{ color: "#6A1B9A", px: 2, py: 2 }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 29 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ToolbarActions({ onToggleIA, onOpenWhatsApp, connectionStatus }) {
  const isConnected = connectionStatus === "open";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 2 }}>
      <Box
        onClick={onToggleIA}
        sx={{
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "all 0.2s",
          "&:hover": { background: "#AC42F7" },
        }}
      >
        JáIA 💡
      </Box>
      <Box
        onClick={onOpenWhatsApp}
        sx={{
          background: isConnected ? "#0DC143" : "#6A1B9A", // muda aqui
          color: "#fff",
          px: 1,
          py: 1,
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          transition: "width 0.3s ease-in-out, padding 0.3s ease-in-out",
          width: 40,
          "&:hover": { width: 120, px: 1 },
        }}
      >
        <QrCode2RoundedIcon sx={{ fontSize: 24 }} />
        <Box
          component="span"
          sx={{
            ml: 0.9,
            opacity: 1,
            whiteSpace: "nowrap",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          Conexão
        </Box>
      </Box>
    </Box>
  );
}


export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;
  const [showIA, setShowIA] = React.useState(false);
  const token = localStorage.getItem("authToken");
  const [showWhatsAppModal, setShowWhatsAppModal] = React.useState(false);
  const [instanceName, setInstanceName] = React.useState("");
  const [qrCode, setQrCode] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState("");
  const [countdown, setCountdown] = React.useState(0);
  const [hasQrBeenGenerated, setHasQrBeenGenerated] = React.useState(false);
  const userRaw = localStorage.getItem("user");
  const user = JSON.parse(userRaw);
  const ownerId = user?.id;

  const socketRef = React.useRef(null);

  const handleCheckAndProceed = React.useCallback(() => {
    setLoading(true);
    setError("");
    setShowWhatsAppModal(true);
    socketRef.current.emit("consult_instance", { ownerId });
  }, [ownerId]);

  const handleReconnect = React.useCallback(() => {
    setLoading(true);
    setError("");
    setShowWhatsAppModal(true);
    socketRef.current.emit("consult_instance", { ownerId });
  }, [ownerId]);

  const handleEmitInstance = React.useCallback(() => {
    setLoading(true);
    setError("");
    setShowWhatsAppModal(true);
    socketRef.current.emit("create_instance", { ownerId });
  }, [ownerId]);

  React.useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("whatsapp_qrcode", (data) => {
      if (data.qrcode) {
        setQrCode(typeof data.qrcode === "string" ? data.qrcode : data.qrcode.base64);
        setLoading(false);
        setHasQrBeenGenerated(true);
        setCountdown(30);
        setConnectionStatus("");
      }
      if (data.error) {
        setError(data.error);
        setLoading(false);
      }
    });

    socketRef.current.on("whatsapp_connection_status", (data) => {
  if (
    data?.instance?.toString().trim() === instanceName.toString().trim() || !instanceName
  ) {
    const status = data.status || "desconhecido";
    setConnectionStatus(status);
    setLoading(false);

    if (status === "open") {
      setHasQrBeenGenerated(false);
      setQrCode(null);
    } else if (status === "connecting" || status === "close") {
      if (data.qrcode?.base64) {
        setQrCode(data.qrcode.base64);
        setHasQrBeenGenerated(true);
        setCountdown(30);
      }
    }
  }

  if (data.error) {
    setError(data.error);
    setLoading(false);
  }
});


    socketRef.current.on("whatsapp_error", (data) => {
      setError(data.error || "Erro desconhecido");
      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [instanceName]);

  React.useEffect(() => {
    if (!qrCode) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQrCode(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qrCode]);

  return (
    <AppProvider
      navigation={getNavigation()}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        sidebarExpandedWidth={230}
        slots={{
          appTitle: () => (
            <Box sx={{ pl: 2, fontWeight: "bold", color: "#6A1B9A" }}></Box>
          ),
          toolbarActions: () => (
            <ToolbarActions
  onOpenWhatsApp={handleCheckAndProceed}
  onToggleIA={() => setShowIA((prev) => !prev)}
  connectionStatus={connectionStatus} // <--- adicione isso
/>

          ),
          sidebarFooter: SidebarFooter,
        }}
        sx={{
          "& .MuiAppBar-root": {
            height: "4rem",
            background: "#F9F8FF",
            display: "flex",
            justifyContent: "center",
            border: 0,
          },
          "& .MuiDrawer-paper": {
            pt: 2,
            borderColor: "#F1EEFF",
            background: "#F9F8FF",
          },
          "& .MuiListItemText-root.MuiTypography-root.MuiTypography-body1": {
            color: "#AC42F7",
          },
          "& .MuiListItemIcon-root svg": { color: "#6A1B9A", fontSize: "28px" },
          "& .MuiIconButton-root.MuiIconButton-sizeMedium": {
            color: "#6A1B9A",
          },
        }}
      >
        <Outlet />
        <ChatPopUpIA
          open={showIA}
          onClose={() => setShowIA(false)}
          token={token}
        />
        <WhatsAppConnectionPopUp
          open={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          onCreate={handleEmitInstance}
          onReconnect={handleReconnect}
          instanceName={instanceName}
          setInstanceName={setInstanceName}
          qrCode={qrCode}
          error={error}
          loading={loading}
          connectionStatus={connectionStatus}
          countdown={countdown}
          hasQrBeenGenerated={hasQrBeenGenerated}
          setHasQrBeenGenerated={setHasQrBeenGenerated}
        />
      </DashboardLayout>
    </AppProvider>
  );
}
