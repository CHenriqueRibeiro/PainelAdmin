/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppConnectionPopUp({
  open,
  onClose,
  onCreate,
  onReconnect,
  loading,
  qrCode,
  error,
  connectionStatus,
  countdown,
  hasQrBeenGenerated,
  setHasQrBeenGenerated,
}) {
  const handleButtonClick = () => {
    if (hasQrBeenGenerated) {
      onReconnect();
    } else {
      onCreate();
      setHasQrBeenGenerated(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 5,
          p: { xs: 2, sm: 4 },
          background: "#f9f8ff",
          boxShadow: 5,
          mx: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A1B9A" }}>
          Conexão com WhatsApp
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 1.5, color: "#5A4B7C", fontSize: "0.95rem" }}>
          Para conectar seu número do WhatsApp ao lavaJá, siga os passos abaixo:
        </Typography>

        <Box sx={{ pl: 1, color: "#6A1B9A", fontSize: "0.92rem", mb: 3 }}>
          <ol style={{ paddingLeft: 16, marginTop: 0 }}>
            <li>Abra o WhatsApp no seu celular</li>
            <li>
              <strong>Vá em Dispositivos conectados</strong>
            </li>
            <li>
              <strong>Toque em Conectar um dispositivo</strong>
            </li>
            <li>Escaneie o QR Code que será gerado aqui</li>
            <li>Aguarde até terminar a sincronização com seu disposisitvo</li>
          </ol>
        </Box>

        {error && (
          <Typography sx={{ color: "red", mb: 2, fontSize: "0.85rem" }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={28} />
          </Box>
        ) : qrCode ? (
          <>
            <Box
              component="img"
              src={qrCode}
              alt="QR Code"
              sx={{
                width: "100%",
                mt: 2,
                borderRadius: 2,
                border: "1px solid #ccc",
                boxShadow: 2,
              }}
            />
            <Typography
              align="center"
              sx={{ mt: 1.5, fontSize: "0.85rem", color: "#555" }}
            >
              QR Code expira em: <strong>{countdown}</strong> segundos
            </Typography>
          </>
        ) : null}

        {connectionStatus === "open" && (
          <Typography color="success.main" textAlign={"center"}>
            WhatsApp conectado!
          </Typography>
        )}
        {connectionStatus === "close" && (
          <Typography color="error.main" textAlign={"center"}>WhatsApp desconectado!</Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, pt: 1, justifyContent: "space-between" }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            background: "#FFF",
            color: "#ac42f7",
            borderColor: "#ac42f7",
            borderRadius: 3,
            fontSize: "1",
            padding: "8px 24px",
          }}
        >
          Fechar
        </Button>
        <Button
          onClick={handleButtonClick}
          disabled={qrCode || loading || connectionStatus === "open"}
          startIcon={<WhatsAppIcon />}
          variant="outlined"
          sx={{
            background: "#0DC143",
            color: "#FFF",
            borderColor: "#0DC143",
            borderRadius: 3,
            fontSize: "1rem",
            padding: "8px 24px",
          }}
        >
          Conectar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
