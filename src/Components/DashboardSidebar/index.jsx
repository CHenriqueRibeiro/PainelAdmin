import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import LinkIcon from "@mui/icons-material/Link";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import ChatPopUpIA from "../ChatPopUpIA";
import { useAuth } from "../../Context/AuthContext";
import { useSocket } from "../../socket/SocketProvider";

// ===========================
const NAVIGATION = [
  { segment: "Home", title: "Agendamentos", icon: <UpdateRoundedIcon sx={{ color: "#009688", fontSize: 28 }} /> },
  { segment: "Estabelecimento", icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} /> },
  { segment: "Relatorios", icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} /> },
  {
    segment: "Gestão",
    title: "Gestão",
    icon: <DonutSmallRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    children: [
      { segment: "Custos", icon: <QueryStatsRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} /> },
      { segment: "Orcamentos", icon: <DescriptionRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} /> },
      { segment: "Estoque", icon: <InventoryRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} /> },
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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Tooltip title="Sair">
        <IconButton onClick={handleLogout} sx={{ color: "#6A1B9A", minWidth: "auto", px: 2, py: 2 }}>
          <LogoutRoundedIcon sx={{ fontSize: 29 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/** Dialog que checa status, inicia sessão se precisar e exibe o QR via WebSocket */
function WhatsAppQRDialog({ open, onClose, establishmentId }) {
  const socket = useSocket();
  const lastRoomRef = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [state, setState] = React.useState("");
  const [error, setError] = React.useState("");

  const sessionName = establishmentId ? `estab_${establishmentId}` : "estab_sem_id";
  const roomId = establishmentId || sessionName;

  const normalizeB64 = (b64) => (b64?.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`);

  React.useEffect(() => {
    if (!open || !socket) return;

    setError("");
    setQrDataUrl(null);
    setStatus("");
    setState("");
    setLoading(true);

    // join na room apenas se mudou
    if (lastRoomRef.current !== roomId) {
      socket.emit("join_establishment_room", roomId);
      lastRoomRef.current = roomId;
    }

    const onQR = (payload) => {
      if (payload?.sessionName !== sessionName) return;
      setQrDataUrl(normalizeB64(payload.base64Qr));
      setLoading(false);
    };
    const onStatus = (payload) => {
      if (payload?.sessionName !== sessionName) return;
      setStatus(payload.status || "");
      if ((payload.status || "").toLowerCase().includes("islogged")) {
        setLoading(false);
        setQrDataUrl(null);
        setTimeout(onClose, 600);
      }
    };
    const onState = (payload) => {
      if (payload?.sessionName !== sessionName) return;
      setState(payload.state || "");
      if ((payload.state || "").toUpperCase() === "CONNECTED") {
        setLoading(false);
        setQrDataUrl(null);
        setTimeout(onClose, 600);
      }
    };
    const onClosed = (payload) => {
      if (payload?.sessionName !== sessionName) return;
      setQrDataUrl(null);
      setStatus("CLOSED");
      setState("");
    };

    socket.on("whatsapp:qr", onQR);
    socket.on("whatsapp:status", onStatus);
    socket.on("whatsapp:state", onState);
    socket.on("whatsapp:closed", onClosed);

    // 1) Checa status primeiro; se já estiver conectado, não pede create-instance
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/whatsapp/status?sessionName=${encodeURIComponent(sessionName)}&t=${Date.now()}`, { cache: "no-store" });
        const info = await res.json();
        setStatus(info.status || "");
        setState(info.state || "");

        const connected = !!info.logged || (info.state || "").toUpperCase() === "CONNECTED";
        if (connected) {
          setLoading(false);
          setQrDataUrl(null);
          return;
        }

        // 2) Não conectado: idempotente
        await fetch(`http://localhost:3000/api/whatsapp/create-instance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionName, establishmentId }),
        });
      } catch (e) {
        console.error(e);
        setError("Falha ao consultar/iniciar sessão.");
        setLoading(false);
      }
    })();

    const onReconnect = () => {
      socket.emit("join_establishment_room", roomId);
    };
    socket.io.on("reconnect", onReconnect);

    return () => {
      socket.off("whatsapp:qr", onQR);
      socket.off("whatsapp:status", onStatus);
      socket.off("whatsapp:state", onState);
      socket.off("whatsapp:closed", onClosed);
      socket.io.off("reconnect", onReconnect);
    };
  }, [open, roomId, sessionName, establishmentId, onClose, socket]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Conectar WhatsApp</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", py: 2 }}>
        {error && <MuiAlert severity="error">{error}</MuiAlert>}

        <Stack direction="row" spacing={1}>
          {!!status && <Chip size="small" label={`status: ${status}`} />}
          {!!state && (
            <Chip
              size="small"
              label={`state: ${state}`}
              color={String(state).toUpperCase() === "CONNECTED" ? "success" : "default"}
            />
          )}
        </Stack>

        {loading && !qrDataUrl && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 3 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Aguardando QR Code...
            </Typography>
          </Box>
        )}

        {qrDataUrl && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <img
              src={qrDataUrl}
              alt="QR WhatsApp"
              style={{ width: 260, height: 260, borderRadius: 8, border: "1px solid #eee" }}
            />
            <Typography variant="caption" color="text.secondary">
              Aponte a câmera do celular para conectar.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button onClick={onClose}>Fechar</Button>
          <Button
            onClick={() => {
              setQrDataUrl(null);
              setLoading(true);
              fetch(`http://localhost:3000/api/whatsapp/create-instance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionName, establishmentId }),
              }).catch(() => setLoading(false));
            }}
          >
            Gerar novo QR
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function ToolbarActionsIA({ onToggleIA }) {
  const socket = useSocket();
  const lastRoomRef = React.useRef(null);

  const { establishments } = useAuth();
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackOpenDefault, setSnackOpenDefault] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);

  // null = desconhecido; true/false = conhecido
  const [connected, setConnected] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const currentEstablishment = establishments?.[0];
  const establishmentId = currentEstablishment?._id;
  const sessionName = establishmentId ? `estab_${establishmentId}` : "estab_sem_id";
  const roomId = establishmentId || sessionName;
  const hasServices = currentEstablishment?.services?.length > 0;

  const decideConnected = React.useCallback((info) => {
    const state = String(info?.state || "").toUpperCase();
    const status = String(info?.status || "").toLowerCase();
    const logged = info?.logged === true;
    const connectedStates = ["CONNECTED"];
    const connectedStatuses = ["islogged", "inchat", "qrreadsuccess"];
    return logged || connectedStates.includes(state) || connectedStatuses.some((s) => status.includes(s));
  }, []);

  React.useEffect(() => {
    if (!socket || !roomId || !sessionName) return;

    // hidrata com cache para já renderizar sem flicker
    const cacheKey = `wa:connected:${sessionName}`;
    if (connected === null) {
      const cached = localStorage.getItem(cacheKey);
      if (cached !== null) setConnected(cached === "true");
    }

    // entra na sala só se mudou
    if (lastRoomRef.current !== roomId) {
      socket.emit("join_establishment_room", roomId);
      lastRoomRef.current = roomId;
    }

    const applyAndCache = (info) => {
      const isConn = decideConnected(info);
      setConnected(isConn);
      localStorage.setItem(cacheKey, String(isConn));
    };

    const onStatus = (p) => {
      if (p?.sessionName !== sessionName) return;
      applyAndCache(p);
      setReady(true);
    };
    const onState = (p) => {
      if (p?.sessionName !== sessionName) return;
      applyAndCache(p);
      setReady(true);
    };

    socket.on("whatsapp:status", onStatus);
    socket.on("whatsapp:state", onState);

    // status inicial
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/whatsapp/status?sessionName=${encodeURIComponent(sessionName)}&t=${Date.now()}`,
          { cache: "no-store" }
        );
        const info = await res.json();
        applyAndCache(info);
      } catch {
        // ignore
      } finally {
        setReady(true);
      }
    })();

    const rejoin = () => {
      socket.emit("join_establishment_room", roomId);
      fetch(
        `http://localhost:3000/api/whatsapp/status?sessionName=${encodeURIComponent(sessionName)}&t=${Date.now()}`,
        { cache: "no-store" }
      )
        .then((r) => r.json())
        .then(applyAndCache)
        .catch(() => {});
    };
    socket.io.on("reconnect", rejoin);

    return () => {
      socket.off("whatsapp:status", onStatus);
      socket.off("whatsapp:state", onState);
      socket.io.off("reconnect", rejoin);
    };
  }, [socket, roomId, sessionName, decideConnected, connected]);

  const publicLink = establishmentId
    ? `${window.location.origin}/agendamento/${establishmentId}`
    : "";

  const handleCopyLink = async () => {
    if (publicLink) {
      await navigator.clipboard.writeText(publicLink);
      setSnackOpen(true);
    }
  };

  const linkBtn = hasServices ? (
    <Tooltip title="Copiar link de agendamento">
      <Box
        onClick={handleCopyLink}
        sx={{
          display: "flex",
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
        <LinkIcon />
      </Box>
    </Tooltip>
  ) : (
    <Tooltip title="É necessário cadastrar pelo menos um serviço para gerar o link de agendamento">
      <Box
        onClick={() => setSnackOpenDefault(true)}
        sx={{
          display: "flex",
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 4,
          cursor: "default",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "all 0.2s",
          "&:hover": { background: "#AC42F7" },
        }}
      >
        <LinkIcon />
      </Box>
    </Tooltip>
  );

  const qrBg = connected ? "#2e7d32" : "#6A1B9A";
  const showButton = ready || connected !== null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2, gap: 1 }}>
      {linkBtn}

      {showButton ? (
        <Tooltip title={connected ? "WhatsApp conectado" : "Conectar WhatsApp (QR Code)"}>
          <Box
            onClick={() => setQrOpen(true)}
            sx={{
              display: "flex",
              background: qrBg,
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem",
              transition: "background-color .2s ease",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <QrCode2RoundedIcon />
          </Box>
        </Tooltip>
      ) : (
        <Box sx={{ width: 40, height: 36 }} />
      )}

      <Box
        onClick={onToggleIA}
        sx={{
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          mr: 0.6,
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

      <Snackbar
        open={snackOpenDefault}
        autoHideDuration={4000}
        onClose={() => setSnackOpenDefault(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert elevation={6} color="warning">
          Cadastre ao menos um serviço para gerar o link de agendamento
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert elevation={6}>Link copiado!</MuiAlert>
      </Snackbar>

      <WhatsAppQRDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        establishmentId={establishmentId}
      />
    </Box>
  );
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;
  const [showIA, setShowIA] = React.useState(false);
  const token = localStorage.getItem("authToken");

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={demoWindow}>
      <DashboardLayout
        sidebarExpandedWidth={230}
        slots={{
          appTitle: () => <Box sx={{ pl: 2, fontWeight: "bold", color: "#6A1B9A" }}></Box>,
          toolbarActions: () => (
            <ToolbarActionsIA onToggleIA={() => setShowIA((prev) => !prev)} />
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
          "& .MuiListItemIcon-root svg": {
            color: "#6A1B9A",
            fontSize: "28px",
          },
          "& .MuiIconButton-root.MuiIconButton-sizeMedium": {
            color: "#6A1B9A",
          },
        }}
      >
        <Outlet />
        <ChatPopUpIA open={showIA} onClose={() => setShowIA(false)} token={token} />
      </DashboardLayout>
    </AppProvider>
  );
}
