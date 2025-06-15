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
  name: yup.string().required("Nome do produto é obrigatório"),
  preco: yup
    .number()
    .typeError("Valor inválido")
    .required("Valor é obrigatório")
    .min(0, "Valor não pode ser negativo"),
  quantidadeAtual: yup
    .number()
    .typeError("Quantidade inválida")
    .required("Quantidade é obrigatória"),
  unidade: yup.string().required("Unidade é obrigatória"),
  vincularServicos: yup.boolean(),
  servicosVinculados: yup.array().when("vincularServicos", {
    is: true,
    then: (schema) =>
      schema.of(
        yup.object().shape({
          service: yup.string().required("Serviço é obrigatório"),
          consumoPorServico: yup
            .number()
            .typeError("Consumo é obrigatório")
            .required("Consumo é obrigatório"),
          unidadeConsumo: yup.string().required("Unidade é obrigatória"),
        })
      ),
    otherwise: (schema) => schema,
  }),
});

const NewProducts = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [name, setName] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [unidade, setUnidade] = useState("mL");
  const [unidadeService, setUnidadeService] = useState("mL");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [vincularServicos, setVincularServicos] = useState(false);
  const [servicosVinculados, setServicosVinculados] = useState([
    { service: "", consumoPorServico: "", unidadeConsumo: unidade },
  ]);
  const [servicesList, setServicesList] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (vincularServicos && dataEstablishment?.[0]?.services) {
      setServicesList(dataEstablishment[0].services);
    }
  }, [vincularServicos, dataEstablishment]);

  const handleCreateProduct = async () => {
    const data = {
      name,
      preco: preco === "" ? undefined : Number(preco),
      quantidadeAtual: quantidadeAtual === "" ? undefined : Number(quantidadeAtual),
      unidade,
      vincularServicos,
      servicosVinculados,
    };
    try {
      await productSchema.validate(data, { abortEarly: false });
      setFormErrors({});
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
      setUnidadeService("mL");
      setServicosVinculados([{ service: "", consumoPorServico: "" }]);
      setVincularServicos(false);
      setEstablishment((prev) => !prev);
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((err) => {
          if (err.path && err.path.startsWith("servicosVinculados")) {
            // path: servicosVinculados[0].service
            const match = err.path.match(/servicosVinculados\[(\d+)\]\.(\w+)/);
            if (match) {
              const idx = match[1];
              const field = match[2];
              if (!errors.servicosVinculados) errors.servicosVinculados = [];
              if (!errors.servicosVinculados[idx]) errors.servicosVinculados[idx] = {};
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
      { service: "", consumoPorServico: "", unidadeConsumo: unidade },
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
        <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600,mb:1 }}>
          Nome do Produto
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
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600,mb:1  }}>
              Valor
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={preco}
              onChange={e => {
                setPreco(e.target.value);
                setFormErrors(prev => ({ ...prev, preco: undefined }));
              }}
              error={!!formErrors.preco}
              helperText={formErrors.preco}
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
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600,mb:1  }}>
              Quantidade
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              size="small"
              value={quantidadeAtual}
              onChange={(e) => {
                setQuantidadeAtual(e.target.value === "" ? "" : Number(e.target.value));
                setFormErrors((prev) => ({ ...prev, quantidadeAtual: undefined }));
              }}
              error={!!formErrors.quantidadeAtual}
              helperText={formErrors.quantidadeAtual}
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
              width: isMobile ? "100%" : "25%",
              display: "flex",
              flexDirection: "column",
              mt: 1,
            }}
          >
            <InputLabel sx={{ color: "#ac42f7", pl: 0.3, fontWeight: 600,mb:1  }}>
              Unidade
            </InputLabel>
            <TextField
              fullWidth
              select
              size="small"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              error={!!formErrors.unidade}
              helperText={formErrors.unidade}
             sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        "& .MuiInputBase-root.Mui-error": {
                          bgcolor: "#fff",
                        },
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
                    error={!!formErrors.servicosVinculados?.[index]?.service}
                    helperText={formErrors.servicosVinculados?.[index]?.service}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        "& .MuiInputBase-root.Mui-error": {
                          bgcolor: "#fff",
                        },
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
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    error={!!formErrors.servicosVinculados?.[index]?.consumoPorServico}
                    helperText={formErrors.servicosVinculados?.[index]?.consumoPorServico}
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
                      width: isMobile ? "100%" : "25%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      fullWidth
                      select
                      size="small"
                      value={item.unidadeConsumo || unidade}
                      onChange={(e) =>
                        handleServicoChange(
                          index,
                          "unidadeConsumo",
                          e.target.value
                        )
                      }
                      error={!!formErrors.servicosVinculados?.[index]?.unidadeConsumo}
                      helperText={formErrors.servicosVinculados?.[index]?.unidadeConsumo}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                        "& .MuiInputBase-root.Mui-error": {
                          bgcolor: "#fff",
                        },
                      }}
                    >
                      {unidadeOptions
                        .filter((option) => {
                          if (unidade === "L")
                            return option === "L" || option === "mL";
                          if (unidade === "mL") return option === "mL";
                          if (unidade === "g") return option === "g";
                          if (unidade === "unidade")
                            return option === "unidade";
                          return false;
                        })
                        .map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
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
