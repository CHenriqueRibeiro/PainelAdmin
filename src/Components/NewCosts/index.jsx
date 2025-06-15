/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Button,
  TextField,
  Grid2,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as yup from "yup";

const costSchema = yup.object().shape({
  type: yup.string().required("Tipo é obrigatório"),
  value: yup
    .number()
    .required("Valor é obrigatório")
    .positive("Valor deve ser maior que zero")
    .typeError("Valor deve ser um número"),
  date: yup
    .mixed()
    .required("Data é obrigatória")
    .test("is-valid-date", "Data inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    })
    .test("is-future-date", "Data não pode ser futura", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date <= new Date();
    }),
  description: yup.string().required("Descrição é obrigatória"),
  observation: yup.string().optional(),
});

const NewCosts = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const token = localStorage.getItem("authToken");
  const [costValue, setCostValue] = useState("");
  const [costType, setCostType] = useState("");
  const [costDate, setCostDate] = useState("");
  const [costDescription, setCostDescription] = useState("");
  const [costObservation, setCostObservation] = useState("");
  const [isLoadingCostSave, setIsLoadingCostSave] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formErrors, setFormErrors] = useState({});

  const validateField = async (field, value) => {
    try {
      if (field === "date" && !value) {
        setFormErrors(prev => ({ ...prev, [field]: "Data é obrigatória" }));
        return;
      }
      await costSchema.validateAt(field, { [field]: value });
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    } catch (err) {
      setFormErrors(prev => ({ ...prev, [field]: err.message }));
    }
  };

  const handleFieldChange = async (field, value, setter) => {
    setter(value);
    await validateField(field, value);
  };

  const handleCreateCost = async () => {
    try {
      const costData = {
        type: costType,
        value: parseFloat(costValue),
        date: costDate,
        description: costDescription,
        observation: costObservation,
      };

      await costSchema.validate(costData, { abortEarly: false });
      
      setIsLoadingCostSave(true);
      const response = await fetch("https://lavaja.up.railway.app/api/cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...costData,
          establishmentId: dataEstablishment[0]._id,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar custo");

      setEstablishment((prev) => !prev);
      setCostValue("");
      setCostType("");
      setCostDate("");
      setCostDescription("");
      setCostObservation("");
      setFormErrors({});
      setSnackbarSeverity("success");
      setSnackbarMessage("Custo criado com sucesso");
      setOpenSnackbar(true);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
        setSnackbarMessage("Por favor, corrija os erros no formulário");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Erro ao criar custo");
        setOpenSnackbar(true);
      }
    } finally {
      setIsLoadingCostSave(false);
    }
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
      <Paper sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#AC42F7">
            Novo Custo
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Grid2 container spacing={3} sx={{ mt: 2, mb: 3 }}>
          <Grid2 size={{ xs: 12, sm: 2 }}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={
                ptBR.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <InputLabel
                sx={{ color: "#ac42f7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
              >
                Data
              </InputLabel>
              <DatePicker
                placeholder="Data"
                format="DD/MM/YYYY"
                value={costDate ? dayjs(costDate) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    handleFieldChange("date", newValue.format("YYYY-MM-DD"), setCostDate);
                  } else {
                    handleFieldChange("date", "", setCostDate);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    error: !!formErrors.date,
                    helperText: formErrors.date,
                    sx: {
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                            "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#ff8ba7",
                              },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          },
                  },
                  day: {
                    sx: {
                      "&.Mui-selected": {
                        backgroundColor: "#6b21a8",
                        color: "#FFFFFF",
                      },
                      "&:hover": {
                        backgroundColor: "#6b21a8",
                        color: "#FFFFFF",
                      },
                    },
                  },
                  popper: {
                    sx: {
                      "& .MuiPaper-root": {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 10 }}>
            <InputLabel
              sx={{ color: "#ac42f7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Tipo
            </InputLabel>
            <TextField
              select
              fullWidth
              size="small"
              name="tipo"
              value={costType}
              onChange={(e) => handleFieldChange("type", e.target.value, setCostType)}
              error={!!formErrors.type}
              helperText={formErrors.type}
              variant="outlined"
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
              {[
                "Itens de limpeza",
                "Material de trabalho",
                "Água",
                "Energia elétrica",
                "Internet",
                "Salário de funcionário",
                "Manutenção de equipamentos",
                "Equipamentos de proteção",
                "Aluguel",
                "Marketing/Publicidade",
                "Taxas bancárias",
                "Outros",
              ].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 2 }}>
            <InputLabel
              sx={{ color: "#ac42f7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Valor
            </InputLabel>
            <TextField
              type="number"
              size="small"
              fullWidth
              name="valor"
              value={costValue}
              onChange={(e) => handleFieldChange("value", e.target.value, setCostValue)}
              error={!!formErrors.value}
              helperText={formErrors.value}
              variant="outlined"
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
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 10 }}>
            <InputLabel
              sx={{ color: "#ac42f7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Descrição
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: Material de trabalho, Água, Equipamento e etc."
              name="descricao"
              value={costDescription}
              onChange={(e) => handleFieldChange("description", e.target.value, setCostDescription)}
              error={!!formErrors.description}
              helperText={formErrors.description}
              variant="outlined"
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
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel
              sx={{ color: "#ac42f7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Observação
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              name="comprovante"
              value={costObservation}
              onChange={(e) => handleFieldChange("observation", e.target.value, setCostObservation)}
              variant="outlined"
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
          </Grid2>
        </Grid2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 2,
            width: "100%",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#ac42f7",
              borderRadius: 3,
              fontSize: "0.8rem",
              padding: "8px 24px",
            }}
            onClick={() => {
              setCostValue("");
              setCostType("");
              setCostDate("");
              setCostDescription("");
              setCostObservation("");
              setFormErrors({});
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            loading={isLoadingCostSave}
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
            onClick={handleCreateCost}
          >
            Salvar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewCosts;
