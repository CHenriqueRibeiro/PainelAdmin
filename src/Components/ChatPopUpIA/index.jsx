/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  LinearProgress,
  Box,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../Context/AuthContext";

export default function ChatPopUpIA({ open, onClose, token }) {
  const { establishments } = useAuth();
  const idEstabelecimento = establishments[0]?._id;

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const rotas = [
    {
      titulo: "Análise de Consumo de Produtos",
      rota: `/api/ia/prever-consumo/${idEstabelecimento}`,
    },
    {
      titulo: "Análise Financeira com Serviços",
      rota: `/api/ia/analise-com-servicos/${idEstabelecimento}`,
    },
    {
      titulo: "Clientes Mais Frequentes",
      rota: `/api/ia/mais-frequentes/${idEstabelecimento}`,
    },
  ];

  const simularProgresso = () => {
    let prog = 0;
    let buff = 10;
    setProgress(0);
    setBuffer(10);
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

  const buscarMensagem = async (rota) => {
    if (!idEstabelecimento) {
      setMensagem("É necessário cadastrar um estabelecimento e pelo menos um serviço para realizar consultas com a JáIA.");
      return;
    }

    setCarregando(true);
    setMensagem("");
    simularProgresso();
    try {
      const response = await fetch(`https://lavaja.up.railway.app${rota}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        <Stack spacing={2} mb={2}>
          {rotas.map((topico, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => buscarMensagem(topico.rota)}
              sx={{
                color: "#AC42F7",
                borderColor: "#AC42F7",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 3,
              }}
            >
              {topico.titulo}
            </Button>
          ))}
        </Stack>

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
          mensagem && (
            <Typography
              component="div"
              sx={{ 
                whiteSpace: "pre-line", 
                fontSize: 14,
                color: !idEstabelecimento ? "#B26A00" : "inherit"
              }}
              dangerouslySetInnerHTML={{
                __html: mensagem
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong style='color:#AC42F7'>$1</strong>"
                  )
                  .replace(/\n/g, "<br>"),
              }}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
