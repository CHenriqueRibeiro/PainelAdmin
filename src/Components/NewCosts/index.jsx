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
// eslint-disable-next-line react/prop-types
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

  const handleCreateCost = async () => {
    if (!costDescription || !costValue || !costType || !costDate) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Preencha todos os campos obrigatórios");
      setOpenSnackbar(true);
      return;
    }
    try {
      setIsLoadingCostSave(true);
      const response = await fetch("http://localhost:3000/api/cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: parseFloat(costValue),
          type: costType,
          date: costDate,
          description: costDescription,
          observation: costObservation,
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
      setSnackbarSeverity("success");
      setSnackbarMessage("Custo criado com sucesso");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao criar custo");
      setOpenSnackbar(true);
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
                  if (newValue) setCostDate(newValue.format("YYYY-MM-DD"));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
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

            {/*<TextField
              type="date"
              fullWidth
              size="small"
              name="data"
              value={costDate}
              onChange={(e) => setCostDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />*/}
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
              onChange={(e) => setCostType(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
              onChange={(e) => setCostValue(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
              onChange={(e) => setCostDescription(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
              onChange={(e) => setCostObservation(e.target.value)}
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
            onClick={{}}
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
