/* eslint-disable react/prop-types */
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
  Collapse,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../Context/AuthContext";

export default function ChatPopUpIA({ open, onClose, token }) {
  const { establishments } = useAuth();
  const idEstabelecimento = establishments[0]?._id;

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const [mostrarPrecificacao, setMostrarPrecificacao] = useState(false);
  const [mostrarSimuladorManual, setMostrarSimuladorManual] = useState(false);
  const [modoPrecificacao, setModoPrecificacao] = useState(null);
  const [lucroDesejadoIA, setLucroDesejadoIA] = useState("");

  const [resumo, setResumo] = useState(null);
  const [tempoHoras, setTempoHoras] = useState("");
  const [lucroDesejado, setLucroDesejado] = useState("");
  const [custosFixos, setCustosFixos] = useState([{ nome: "", valor: "" }]);
  const [custosVariaveis, setCustosVariaveis] = useState([{ nome: "", valor: "" }]);

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

  const buscarMensagem = async (rota, body = null) => {
    setMostrarPrecificacao(false);
    setMostrarSimuladorManual(false);
    setModoPrecificacao(null);
    setResumo(null);

    if (!idEstabelecimento) {
      setMensagem("É necessário cadastrar um estabelecimento e pelo menos um serviço para realizar consultas com a JáIA.");
      return;
    }

    setCarregando(true);
    setMensagem("");
    simularProgresso();

    try {
     const response = await fetch(`https://lavaja.up.railway.app${rota}`, {
  method: body ? "POST" : "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  ...(body && { body: JSON.stringify(body) }),
});


      const data = await response.json();

      setMensagem(data.resposta || "Não foi possível obter a resposta da JáIA.");
      setResumo(data.resumo || null);
    } catch (err) {
      setMensagem("Erro ao consultar a JáIA.");
    } finally {
      setCarregando(false);
    }
  };

  const handleChangeCustoFixo = (index, field, value) => {
    const updated = [...custosFixos];
    updated[index][field] = value;
    setCustosFixos(updated);
  };

  const handleChangeCustoVariavel = (index, field, value) => {
    const updated = [...custosVariaveis];
    updated[index][field] = value;
    setCustosVariaveis(updated);
  };

  const handleAddCustoFixo = () => {
    setCustosFixos([...custosFixos, { nome: "", valor: "" }]);
  };

  const handleAddCustoVariavel = () => {
    setCustosVariaveis([...custosVariaveis, { nome: "", valor: "" }]);
  };

  const handleRemoveCustoFixo = (index) => {
    const updated = [...custosFixos];
    updated.splice(index, 1);
    setCustosFixos(updated);
  };

  const handleRemoveCustoVariavel = (index) => {
    const updated = [...custosVariaveis];
    updated.splice(index, 1);
    setCustosVariaveis(updated);
  };

  const calcularSimulacaoManual = () => {
    const tempo = parseFloat(tempoHoras);
    const lucro = parseFloat(lucroDesejado);

    if (!tempo || !lucro) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    const totalFixos = custosFixos.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0);
    const totalVariaveis = custosVariaveis.reduce((sum, item) => sum + parseFloat(item.valor || 0), 0);
    const custoTotal = totalFixos + totalVariaveis;

    const custoPorHora = custoTotal / tempo;
    const precoSugerido = custoPorHora * (1 + lucro / 100);
    const faturamentoNecessario = precoSugerido * tempo;

    setMensagem(
      `**Resumo da Precificação Manual**\n\n` +
        `🕒 Horas trabalhadas: ${tempo}\n` +
        `📈 Lucro desejado: ${lucro}%\n` +
        `💰 Custos fixos: R$ ${totalFixos.toFixed(2)}\n` +
        `💸 Custos variáveis: R$ ${totalVariaveis.toFixed(2)}\n\n` +
        `📊 Faturamento necessário para atingir o lucro desejado: R$ ${faturamentoNecessario.toFixed(2)}\n` +
        `💵 **Preço por hora sugerido**: R$ ${precoSugerido.toFixed(2)}`
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, backgroundColor: "#F9F8FF" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6A1B9A", fontWeight: "bold" }}>
        JáIA 💡
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mb={2}>
          {rotas.map((topico, index) => (
            <Button key={index} variant="outlined" onClick={() => buscarMensagem(topico.rota)} sx={{ color: "#AC42F7", borderColor: "#AC42F7", fontWeight: "bold", textTransform: "none", borderRadius: 3 }}>
              {topico.titulo}
            </Button>
          ))}

          <Button variant="outlined" onClick={() => setMostrarPrecificacao((prev) => !prev)} endIcon={mostrarPrecificacao ? <ExpandLessIcon /> : <ExpandMoreIcon />} sx={{ color: "#AC42F7", borderColor: "#AC42F7", fontWeight: "bold", textTransform: "none", borderRadius: 3 }}>
            Precificação
          </Button>

          <Collapse in={mostrarPrecificacao} timeout="auto">
            <Stack spacing={1.5}>
  <Stack direction="row" spacing={1}>
    <Button
      variant={modoPrecificacao === "ia" ? "contained" : "outlined"}
      onClick={() => setModoPrecificacao("ia")}
      sx={{
        flex: 1,
         backgroundImage: "linear-gradient(90deg, #FC466B 0%, #3F5EFB 100%)",
        color:"#fff",
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: 3,
      }}
    >
      Precificação com dados reais
    </Button>
    <Button
      variant={modoPrecificacao === "manual" ? "contained" : "outlined"}
      onClick={() => setModoPrecificacao("manual")}
      sx={{
        flex: 1,
        backgroundColor: "#36C193",
        color:"#fff",
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: 3,
      }}
    >
      Simulação Manual
    </Button>
  </Stack>

  {modoPrecificacao === "ia" && (
    <>
      <TextField
        label="% de lucro desejado"
        value={lucroDesejadoIA}
        onChange={(e) => setLucroDesejadoIA(e.target.value)}
        fullWidth
        size="small"
        type="number"
        sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
      />

      <Button
        variant="contained"
        onClick={() =>
          buscarMensagem(`/api/ia/precificacao/${idEstabelecimento}`, {
            margemLucro: parseFloat(lucroDesejadoIA || 0),
          })
        }
        sx={{
          mt: 1,
          backgroundColor: "#0EC143",
          color: "#fff",
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: 3,
        }}
      >
        Calcular
      </Button>
    </>
  )}

  {modoPrecificacao === "manual" && (
    <><Collapse in={true} timeout="auto">
                  <Typography fontWeight="bold" mt={2}>Preencha os dados da simulação:</Typography>
                  <TextField label="Horas trabalhadas no mês" value={tempoHoras} onChange={(e) => setTempoHoras(e.target.value)} fullWidth size="small" type="number" sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                  <TextField label="% de lucro desejado" value={lucroDesejado} onChange={(e) => setLucroDesejado(e.target.value)} fullWidth size="small" type="number" sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

                  <Typography mt={2} fontWeight="bold">Custos Fixos</Typography>
                  {custosFixos.map((item, index) => (
                    <Box key={index} display="flex" gap={1} alignItems="center">
                      <TextField placeholder="Nome" value={item.nome} onChange={(e) => handleChangeCustoFixo(index, "nome", e.target.value)} size="small" fullWidth sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                      <TextField placeholder="Valor" type="number" value={item.valor} onChange={(e) => handleChangeCustoFixo(index, "valor", e.target.value)} size="small" fullWidth sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                      <IconButton onClick={() => handleRemoveCustoFixo(index)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  ))}
                  <Button onClick={handleAddCustoFixo} sx={{ fontSize: 13, textTransform: "none", color: "#6A1B9A" }}>+ Adicionar custo fixo</Button>

                  <Typography mt={2} fontWeight="bold">Custos Variáveis</Typography>
                  {custosVariaveis.map((item, index) => (
                    <Box key={index} display="flex" gap={1} alignItems="center">
                      <TextField placeholder="Nome" value={item.nome} onChange={(e) => handleChangeCustoVariavel(index, "nome", e.target.value)} size="small" fullWidth sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                      <TextField placeholder="Valor" type="number" value={item.valor} onChange={(e) => handleChangeCustoVariavel(index, "valor", e.target.value)} size="small" fullWidth sx={{ mt: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
                      <IconButton onClick={() => handleRemoveCustoVariavel(index)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  ))}
                  <Button onClick={handleAddCustoVariavel} sx={{ fontSize: 13, textTransform: "none", color: "#6A1B9A" }}>+ Adicionar custo variável</Button>


                </Collapse><Button variant="contained" onClick={calcularSimulacaoManual} sx={{
                  mt: 1,
                  backgroundColor: "#0EC143",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 3,
                }}>Calcular</Button></>
  )}
</Stack>

          </Collapse>
        </Stack>

        {carregando ? (
          <Box sx={{ my: 4 }}>
            <Typography align="center" fontWeight="bold" sx={{ color: "#AC42F7", mb: 1 }}>
              Analisando...
            </Typography>
            <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} sx={{ height: 8, borderRadius: 5, backgroundColor: "#E1D3F9", "& .MuiLinearProgress-bar": { backgroundColor: "#AC42F7" }, "& .MuiLinearProgress-barBuffer": { backgroundColor: "#D1A4F7" } }} />
          </Box>
        ) : (
          <>
            {mensagem && (
              <Typography component="div" sx={{ whiteSpace: "pre-line", fontSize: 14, color: !idEstabelecimento ? "#B26A00" : "inherit" }}
                dangerouslySetInnerHTML={{
                  __html: mensagem.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#AC42F7'>$1</strong>").replace(/\n/g, "<br>")
                }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
