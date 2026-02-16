/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
import * as yup from "yup";

const unidadeOptions = ["mL", "L", "g", "unidade"];

const productSchema = yup.object().shape({
  name: yup.string().required("Nome do cliente é obrigatório"),
  telefone: yup
    .number()
    .typeError("Valor inválido")
    .required("Telefone é obrigatório"),
  veiculo: yup
    .number()
    .typeError("Quantidade inválida")
    .required("Veiculo é obrigatório")
});

const NewClients = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [name, setName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});


  const handleCreateProduct = async () => {
    const data = {
      name,
      telefone,
      veiculo
    };
    try {
      await productSchema.validate(data, { abortEarly: false });
      setFormErrors({});
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/clients/establishments/${dataEstablishment[0]._id}/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            telefone,
            veiculo
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao criar cliente");
      setSnackbarSeverity("success");
      setSnackbarMessage("Produto criado com sucesso");
      setOpenSnackbar(true);
      setName("");
      setPreco("");
      setQuantidadeAtual("");
      setUnidade("mL");
      setUnidadeService("mL");
      setServicosVinculados([{ service: "", consumoPorServico: "" }]);
      setVincularServicos(false);
      setEstablishment((prev) => !prev);
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((err) => {
          if (err.path && err.path.startsWith("servicosVinculados")) {
            const match = err.path.match(/servicosVinculados\[(\d+)\]\.(\w+)/);
            if (match) {
              const idx = match[1];
              const field = match[2];
              if (!errors.servicosVinculados) errors.servicosVinculados = [];
              if (!errors.servicosVinculados[idx])
                errors.servicosVinculados[idx] = {};
              errors.servicosVinculados[idx][field] = err.message;
            }
          } else if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Erro ao criar produto");
        setOpenSnackbar(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicoChange = (index, field, value) => {
    const updated = [...servicosVinculados];
    updated[index][field] = value;
    setServicosVinculados(updated);
    setFormErrors((prev) => {
      if (!prev.servicosVinculados) return prev;
      const newErrors = { ...prev };
      if (newErrors.servicosVinculados[index]) {
        newErrors.servicosVinculados = [...newErrors.servicosVinculados];
        newErrors.servicosVinculados[index] = {
          ...newErrors.servicosVinculados[index],
          [field]: undefined,
        };
      }
      return newErrors;
    });
  };

  const addNovoServico = () => {
  setServicosVinculados((prev) => [
    ...prev,
    { service: "", consumoPorServico: "", unidadeConsumo: ajustarUnidadeConsumo(unidade) },
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
         Cadastrar cliente
        </Typography>
        <Divider sx={{ my: 2 }} />
        <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600, mb: 1 }}>
          Nome do Cliente
        </InputLabel>
        <TextField
          fullWidth
          size="small"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setFormErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={!!formErrors.name}
          helperText={formErrors.name}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#fff",
              borderRadius: 2,
            },
            "& .MuiInputBase-root.Mui-error": {
              bgcolor: "#fff",
            },
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
            <InputLabel
              sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600, mb: 1 }}
            >
              Telefone
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                setFormErrors((prev) => ({ ...prev, telefone: undefined }));
              }}
              error={!!formErrors.telefone}
              helperText={formErrors.telefone}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  borderRadius: 2,
                },
                "& .MuiInputBase-root.Mui-error": {
                  bgcolor: "#fff",
                },
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
            <InputLabel
              sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600, mb: 1 }}
            >
              Veiculo
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={veiculo}
              onChange={(e) => {
                setVeiculo(e.target.value);
                setFormErrors((prev) => ({
                  ...prev,
                  veiculo: undefined,
                }));
              }}
              error={!!formErrors.veiculo}
              helperText={formErrors.veiculo}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  borderRadius: 2,
                },
                "& .MuiInputBase-root.Mui-error": {
                  bgcolor: "#fff",
                },
              }}
            />
          </Box>
         
        </Box>
      
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

export default NewClients;
