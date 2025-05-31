/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

const Budgets = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
}) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
          budgets.map((budget) => (
            <Box key={budget._id} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f1eeff",
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight={700} color="#AC42F7">
                  {new Date(budget.date).toLocaleDateString()} |{" "}
                  {budget.clientName} | R$ {Number(budget.value).toFixed(2)}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Visualizar orçamento">
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(budget.documentUrl, "_blank");
                      }}
                    >
                      <PictureAsPdfRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  {budget.signedDocumentUrl && (
                    <Tooltip title="Visualizar assinatura">
                      <IconButton
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(budget.signedDocumentUrl, "_blank");
                        }}
                      >
                        <AssignmentTurnedInRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Excluir orçamento">
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(budget._id);
                      }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
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
