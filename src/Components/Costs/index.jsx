/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Grid2,
  InputLabel,
  Snackbar,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";

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

const Costs = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
}) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [expandedType, setExpandedType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = async (field, value) => {
    try {
      if (field === "date" && !value) {
        setFormErrors((prev) => ({ ...prev, [field]: "Data é obrigatória" }));
        return;
      }
      await costSchema.validateAt(field, { [field]: value });
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);
    validateField(field, value);
  };

  const handleDelete = async (costId) => {
    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/cost/cost/${costId}/${dataEstablishment[0]._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar custo");

      setSnackbarMessage("Custo deletado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEstablishment((prev) => !prev);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Erro ao deletar custo");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await costSchema.validate(selectedCost);
      const response = await fetch(
        `https://lavaja.up.railway.app/api/cost/cost/${selectedCost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...selectedCost,
            establishmentId: dataEstablishment[0]._id,
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar custo");
      setSnackbarMessage("Custo atualizado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setDialogOpen(false);
      setEstablishment((prev) => !prev);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (cost) => {
    setSelectedCost(cost);
    setFormErrors({});
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "95%", mt: 5, mb: 3 }}>
        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}
        >
          <Typography>Carregando...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!dataEstablishment.length) return null;

  const groupedCosts = dataEstablishment[0].costs?.reduce((acc, cost) => {
    acc[cost.type] = acc[cost.type] || [];
    acc[cost.type].push(cost);
    return acc;
  }, {});
  const getTotalByType = (costs) => {
    return costs
      .reduce((sum, cost) => sum + parseFloat(cost.value), 0)
      .toFixed(2);
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
        elevation={3}
        sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}
      >
        <Typography variant="h6" fontWeight={600} color="#AC42F7" mb={2}>
          Custos
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {groupedCosts && Object.keys(groupedCosts).length > 0 ? (
          Object.entries(groupedCosts).map(([type, costs]) => (
            <Box key={type} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "#f1eeff",
                  p: 1.5,
                  borderRadius: 2,
                }}
                onClick={() =>
                  setExpandedType((prev) => (prev === type ? null : type))
                }
              >
                <Typography fontWeight={700} color="#AC42F7">
                  {type} | R$ {getTotalByType(costs)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {expandedType === type ? (
                    <ArrowDropUpRoundedIcon sx={{ color: "#AC42F7" }} />
                  ) : (
                    <ArrowDropDownRoundedIcon sx={{ color: "#AC42F7" }} />
                  )}
                </Box>
              </Box>
              <Collapse in={expandedType === type}>
                {costs.map((cost) => (
                  <Box
                    key={cost._id}
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Grid2 container spacing={2} width={"90%"}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >
                          Valor (R$)
                        </Typography>
                        <Typography variant="subtitle2">
                          R$ {parseFloat(cost.value).toFixed(2)}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >
                          Data
                        </Typography>
                        <Typography variant="subtitle2">
                          {new Date(cost.date).toLocaleDateString()}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >
                          Descrição
                        </Typography>
                        <Typography variant="subtitle2">
                          {cost.description || "-"}
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >
                          Observação
                        </Typography>
                        <Typography variant="subtitle2">
                          {cost.observation || "-"}
                        </Typography>
                      </Grid2>
                    </Grid2>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        width: "10%",
                      }}
                    >
                      <Tooltip title="Editar custo">
                        <IconButton onClick={() => handleOpenEditDialog(cost)}>
                          <EditRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="Excluir custo">
                        <IconButton
                          onClick={() => handleDelete(cost._id)}
                          color="error"
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Collapse>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">
            Nenhum custo cadastrado.
          </Typography>
        )}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
            color: "#fff",
            padding: 2,
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "center" }}
        >
          Editar Custo
        </DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12, sm: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Tipo
              </InputLabel>
              <TextField
                select
                fullWidth
                value={selectedCost?.type || ""}
                onChange={(e) =>
                  handleFieldChange("type", e.target.value, (value) =>
                    setSelectedCost((prev) => ({ ...prev, type: value }))
                  )
                }
                error={!!formErrors.type}
                helperText={formErrors.type}
                size="small"
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Valor (R$)
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                value={selectedCost?.value || ""}
                onChange={(e) =>
                  handleFieldChange("value", e.target.value, (value) =>
                    setSelectedCost((prev) => ({ ...prev, value: value }))
                  )
                }
                error={!!formErrors.value}
                helperText={formErrors.value}
                size="small"
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
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Data
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  placeholder="Data"
                  format="DD/MM/YYYY"
                  value={selectedCost?.date ? dayjs(selectedCost.date) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      handleFieldChange(
                        "date",
                        newValue.format("YYYY-MM-DD"),
                        (value) =>
                          setSelectedCost((prev) => ({ ...prev, date: value }))
                      );
                    } else {
                      handleFieldChange("date", "", (value) =>
                        setSelectedCost((prev) => ({ ...prev, date: value }))
                      );
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!formErrors.date,
                      helperText: formErrors.date,
                      InputProps: {
                        sx: {
                          bgcolor: "#fff",
                          borderRadius: 2,
                        },
                      },
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
                  }}
                />
              </LocalizationProvider>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição
              </InputLabel>
              <TextField
                fullWidth
                value={selectedCost?.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value, (value) =>
                    setSelectedCost((prev) => ({ ...prev, description: value }))
                  )
                }
                error={!!formErrors.description}
                helperText={formErrors.description}
                size="small"
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
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Observação
              </InputLabel>
              <TextField
                fullWidth
                value={selectedCost?.observation || ""}
                onChange={(e) =>
                  handleFieldChange("observation", e.target.value, (value) =>
                    setSelectedCost((prev) => ({ ...prev, observation: value }))
                  )
                }
                error={!!formErrors.observation}
                helperText={formErrors.observation}
                size="small"
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
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setFormErrors({});
            }}
            color="secondary"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              color: "#AC42F7",
              borderColor: "#AC42F7",
              mr: 1,
              "&:hover": {
                background: "#f3e8ff",
                borderColor: "#AC42F7",
              },
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleUpdate}
            loading={loading}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              background: "#AC42F7",
              color: "#fff",
              boxShadow: "none",
              "&:hover": {
                background: "#8f2fc9",
              },
            }}
            disabled={loading}
          >
            Salvar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Costs;
