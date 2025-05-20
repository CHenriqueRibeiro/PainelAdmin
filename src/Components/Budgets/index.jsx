/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Grid2,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

const Budgets = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
}) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [expandedType, setExpandedType] = useState(null);
  const handleDelete = async (index) => {
    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/budget/budget/${dataEstablishment[0]._id}/${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar orçamento");

      setSnackbarMessage("Orçamento deletado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEstablishment((prev) => !prev);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Erro ao deletar orçamento");
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

  const budgets = dataEstablishment[0]?.budgets || [];

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
          Orçamentos
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {budgets.length > 0 ? (
          Object.entries(
            budgets.reduce((acc, budget) => {
              const date = new Date(budget.date).toLocaleDateString();
              if (!acc[date]) acc[date] = [];
              acc[date].push(budget);
              return acc;
            }, {})
          ).map(([date, groupedBudgets]) => (
            <Box key={date} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f1eeff",
                  p: 1.5,
                  borderRadius: 2,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpandedType((prev) => (prev === date ? null : date))
                }
              >
                <Typography fontWeight={700} color="#AC42F7">
                  {date} | Total: R${" "}
                  {groupedBudgets
                    .reduce((sum, b) => sum + Number(b.value), 0)
                    .toFixed(2)}
                </Typography>
                {expandedType === date ? (
                  <ArrowDropUpRoundedIcon sx={{ color: "#AC42F7" }} />
                ) : (
                  <ArrowDropDownRoundedIcon sx={{ color: "#AC42F7" }} />
                )}
              </Box>

              <Collapse in={expandedType === date}>
                {groupedBudgets.map((budget, index) => (
                  <Box
                    key={index}
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
                      <Grid2 size={{xs:12, sm:6}}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >Cliente</Typography>
                        <Typography variant="subtitle2">{budget.clientName}</Typography>
                      </Grid2>
                      <Grid2 size={{xs:12, sm:6}}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >Telefone</Typography>
                        <Typography variant="subtitle2">{budget.phone}</Typography>
                      </Grid2>
                      <Grid2 size={{xs:12, sm:6}}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >Título</Typography>
                        <Typography variant="subtitle2">{budget.title}</Typography>
                      </Grid2>
                      <Grid2 size={{xs:12, sm:6}}>
                        <Typography
                          variant="caption"
                          color="#AC42F7"
                          fontWeight={600}
                        >Valor</Typography>
                        <Typography variant="subtitle2">
                          R$ {parseFloat(budget.value).toFixed(2)}
                        </Typography>
                      </Grid2>
                    </Grid2>

                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        width: "10%",
                      }}>
                      <Tooltip title="Visualizar orçamento">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            window.open(budget.documentUrl, "_blank")
                          }
                        >
                          <PictureAsPdfRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="Excluir orçamento">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(budget._id)}
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
            Nenhum orçamento cadastrado.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Budgets;
