// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// eslint-disable-next-line react/prop-types
export default function ChatPopUpIA({ open, onClose, token }) {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  useEffect(() => {
    if (open) {
      buscarMensagem();
      simularProgresso();
    }
  }, [open]);

  const buscarMensagem = async () => {
    setCarregando(true);
    try {
      const response = await fetch(
        "https://lavaja.up.railway.app/api/ia/prever-consumo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMensagem(
        data.resposta || "Não foi possível obter a resposta da JáIA."
      );
    } catch (err) {
      setMensagem("Erro ao consultar a JáIA.");
    } finally {
      setCarregando(false);
    }
  };

  const simularProgresso = () => {
    let prog = 0;
    let buff = 10;
    const interval = setInterval(() => {
      if (prog >= 100) {
        clearInterval(interval);
      } else {
        prog += Math.random() * 10;
        buff = prog + Math.random() * 10;
        setProgress(Math.min(prog, 100));
        setBuffer(Math.min(buff, 100));
      }
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "#F9F8FF",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#6A1B9A",
          fontWeight: "bold",
        }}
      >
        JáIA 💡
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {carregando ? (
          <Box sx={{ my: 4 }}>
            <Typography
              align="center"
              fontWeight="bold"
              sx={{ color: "#AC42F7", mb: 1 }}
            >
              Analisando...
            </Typography>
            <LinearProgress
              variant="buffer"
              value={progress}
              valueBuffer={buffer}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#E1D3F9",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#AC42F7",
                },
                "& .MuiLinearProgress-barBuffer": {
                  backgroundColor: "#D1A4F7",
                },
              }}
            />
          </Box>
        ) : (
          <Typography
            component="div"
            sx={{ whiteSpace: "pre-line", fontSize: 14 }}
            dangerouslySetInnerHTML={{
              __html: mensagem
                .replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong style='color:#AC42F7'>$1</strong>"
                )
                .replace(/\n/g, "<br>"),
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
