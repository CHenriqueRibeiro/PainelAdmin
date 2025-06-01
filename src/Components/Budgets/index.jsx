/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import io from "socket.io-client";

const Budgets = ({
  dataEstablishment,
  isLoading,
  setEstablishment = () => {},
}) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [budgets, setBudgets] = useState(dataEstablishment[0]?.budgets || []);

  useEffect(() => {
    const socket = io("https://lavaja.up.railway.app");

    socket.on("budgetSigned", (data) => {
      setBudgets((prevBudgets) =>
        prevBudgets.map((b) =>
          b._id === data.budgetId
            ? {
                ...b,
                signatureUrl: data.signatureUrl,
                signedDocumentUrl: data.signedDocumentUrl,
              }
            : b
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setBudgets(dataEstablishment[0]?.budgets || []);
  }, [dataEstablishment]);
  const handleCopyLink = (url) => {
    if (!url) {
      setSnackbarSeverity("warning");
      setSnackbarMessage("Link não disponível para copiar.");
      setOpenSnackbar(true);
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setSnackbarSeverity("success");
        setSnackbarMessage("Link copiado para a área de transferência!");
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Erro ao copiar link:", err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Erro ao copiar link.");
        setOpenSnackbar(true);
      });
  };

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

        {budgets.length === 0 ? (
          <Typography color="textSecondary">
            Nenhum orçamento cadastrado.
          </Typography>
        ) : (
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: budget.signatureUrl
                        ? "#4caf50"
                        : "#ff9800",
                    }}
                  />
                  <Typography fontWeight={700} color="#AC42F7">
                    {new Date(budget.date).toLocaleDateString()} |{" "}
                    {budget.clientName} | R$ {Number(budget.value).toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {!budget.signatureUrl && (
                    <Tooltip title="Copiar link do orçamento">
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(budget.publicLink);
                        }}
                      >
                        <InsertLinkRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!budget.signatureUrl && (
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
                  )}

                  {budget.signatureUrl && (
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
        )}
      </Paper>
    </Box>
  );
};

export default Budgets;
