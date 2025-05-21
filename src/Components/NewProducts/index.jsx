/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Componente NewProducts ajustado para opcionalmente atrelar produtos a serviços, lendo serviços do dataEstablishment
import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  IconButton,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const unidadeOptions = ["mL", "L", "g", "unidade"];

const NewProducts = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [name, setName] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [unidade, setUnidade] = useState("mL");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [vincularServicos, setVincularServicos] = useState(false);
  const [servicosVinculados, setServicosVinculados] = useState([
    { service: "", consumoPorServico: "" },
  ]);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    if (vincularServicos && dataEstablishment?.[0]?.services) {
      setServicesList(dataEstablishment[0].services);
    }
  }, [vincularServicos, dataEstablishment]);

  const handleCreateProduct = async () => {
    if (!name || !quantidadeAtual) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Preencha todos os campos obrigatórios");
      setOpenSnackbar(true);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/establishments/${dataEstablishment[0]._id}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            preco: Number(preco),
            unidade,
            quantidadeAtual: parseFloat(quantidadeAtual),
            servicos: vincularServicos
              ? servicosVinculados.filter(
                  (s) => s.service && s.consumoPorServico
                )
              : [],
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao criar produto");

      setSnackbarSeverity("success");
      setSnackbarMessage("Produto criado com sucesso");
      setOpenSnackbar(true);
      setName("");
      setPreco("");
      setQuantidadeAtual("");
      setUnidade("mL");
      setServicosVinculados([{ service: "", consumoPorServico: "" }]);
      setVincularServicos(false);
      setEstablishment((prev) => !prev);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao criar produto");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicoChange = (index, field, value) => {
    const updated = [...servicosVinculados];
    updated[index][field] = value;
    setServicosVinculados(updated);
  };

  const addNovoServico = () => {
    setServicosVinculados((prev) => [
      ...prev,
      { service: "", consumoPorServico: "" },
    ]);
  };

  const removerServico = (index) => {
    setServicosVinculados((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ width: "95%", mt: 5, mb: 3 }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#f9f5ff",
          maxHeight: isMobile ? "60rem" : "45rem",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#AC42F7">
          Novo Produto
        </Typography>
        <Divider sx={{ my: 2 }} />
        <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600 }}>
          Nome do Produto
        </InputLabel>
        <TextField
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            mt: 1,
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "30%",
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600 }}>
              Valor
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                mt: 1,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "45%",
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600 }}>
              Quantidade
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={quantidadeAtual}
              onChange={(e) => setQuantidadeAtual(e.target.value)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                mt: 1,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </Box>
          <Box
            sx={{
              width: isMobile ? "100%" : "25%",
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600 }}>
              Unidade
            </InputLabel>
            <TextField
              fullWidth
              select
              size="small"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                mt: 1,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            >
              {unidadeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={vincularServicos}
              onChange={(e) => setVincularServicos(e.target.checked)}
            />
          }
          label="Atribuir este produto a um ou mais serviços"
          sx={{ mt: 1, color: "#ac42f7" }}
        />

        {vincularServicos && (
          <Box
            sx={{
              maxHeight: isMobile ? 350 : 190,
              overflowY: "auto",
              pr: 1,
              width: "100%",
            }}
          >
            {servicosVinculados.map((item, index) => (
              <>
                <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600 }}>
                  Serviço
                </InputLabel>
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 1,
                    mb: 2,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    select
                    value={item.service}
                    onChange={(e) =>
                      handleServicoChange(index, "service", e.target.value)
                    }
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      mt: 1,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  >
                    {servicesList.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    placeholder="Consumo por Serviço"
                    type="number"
                    size="small"
                    value={item.consumoPorServico}
                    onChange={(e) =>
                      handleServicoChange(
                        index,
                        "consumoPorServico",
                        e.target.value
                      )
                    }
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      mt: 1,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />

                  {servicosVinculados.length > 1 && (
                    <IconButton onClick={() => removerServico(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Box>
              </>
            ))}
          </Box>
        )}
        {vincularServicos && (
          <Button
            size="small"
            variant="outlined"
            onClick={addNovoServico}
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "0.5rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
          >
            Adicionar serviço
          </Button>
        )}
        <Box mt={3} textAlign="right">
          <Button
            variant="contained"
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              "& .MuiCircularProgress-root": {
                color: "#ffffff",
              },
            }}
            onClick={handleCreateProduct}
            disabled={isLoading}
          >
            Salvar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewProducts;
