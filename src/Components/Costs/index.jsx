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

  const handleDelete = async (costId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cost/cost/${costId}/${dataEstablishment[0]._id}`,
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
      const response = await fetch(
        `http://localhost:3000/api/cost/cost/${selectedCost._id}`,
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
      console.error(err);
      setSnackbarMessage("Erro ao atualizar custo");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
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
                        <IconButton
                          onClick={() => {
                            setSelectedCost(cost);
                            setDialogOpen(true);
                          }}
                        >
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
                  setSelectedCost((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
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
                  setSelectedCost((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Data
              </InputLabel>
              <TextField
                fullWidth
                type="date"
                value={selectedCost?.date?.slice(0, 10) || ""}
                onChange={(e) =>
                  setSelectedCost((prev) => ({ ...prev, date: e.target.value }))
                }
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel sx={{ color: "#FFFFFF", pl: 0.3, fontWeight: 600 }}>
                Descrição
              </InputLabel>
              <TextField
                fullWidth
                value={selectedCost?.description || ""}
                onChange={(e) =>
                  setSelectedCost((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                  setSelectedCost((prev) => ({
                    ...prev,
                    observation: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Costs;
