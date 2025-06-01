// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";

const PublicBudgetPage = () => {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const signaturePadRef = useRef(null);

  const budgetId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    if (budgetId) {
      fetch(
        `https://lavaja.up.railway.app/api/budget/budget/public/${budgetId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBudget(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar orçamento:", err);
          setSnackbar({
            open: true,
            message: "Erro ao carregar orçamento.",
            severity: "error",
          });
          setIsLoading(false);
        });
    }
  }, [budgetId]);

  const handleSignatureUpload = async () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setSnackbar({
        open: true,
        message: "Por favor, faça a assinatura antes de enviar.",
        severity: "warning",
      });
      return;
    }

    const signatureDataUrl = signaturePadRef.current.toDataURL("image/png");
    const blob = await (await fetch(signatureDataUrl)).blob();
    const formData = new FormData();
    formData.append("file", blob, "assinatura.png");

    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/budget/budget/sign/${budgetId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erro ao enviar assinatura");

      const data = await response.json();
      setBudget((prev) => ({ ...prev, signatureUrl: data.signatureUrl }));
      setSnackbar({
        open: true,
        message: "Assinatura enviada com sucesso.",
        severity: "success",
      });
      signaturePadRef.current.clear();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erro ao enviar assinatura.",
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="subtitle1" mt={2}>
          Carregando orçamento...
        </Typography>
      </Box>
    );
  }

  if (!budget) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Orçamento não encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Typography variant="h5" fontWeight={600} color="#AC42F7" gutterBottom>
        Orçamento de {budget.clientName}
      </Typography>
      <Typography>
        <strong>Telefone:</strong> {budget.phone}
      </Typography>
      <Typography>
        <strong>Valor:</strong> R$ {Number(budget.value).toFixed(2)}
      </Typography>
      <Typography mt={2}>
        <strong>Serviços:</strong>
      </Typography>
      {budget.services && budget.services.length > 0 ? (
        <ul>
          {budget.services.map((service, index) => (
            <li key={index}>
              {service.name} — R$ {Number(service.value).toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <Typography color="textSecondary">Nenhum serviço listado.</Typography>
      )}

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          href={budget.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visualizar PDF do Orçamento
        </Button>
      </Box>

      {budget.signatureUrl ? (
        <Box mt={4}>
          <Typography variant="h6" color="#4caf50">
            Este orçamento já foi assinado!
          </Typography>
          <Typography>
            Você pode visualizar o documento assinado abaixo:
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              href={budget.signedDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visualizar Documento Assinado
            </Button>
          </Box>
          <Box
            component="img"
            src={budget.signatureUrl}
            alt="Assinatura do Cliente"
            sx={{
              width: "100%",
              maxWidth: 400,
              border: "1px solid #ddd",
              borderRadius: 2,
              mt: 2,
            }}
          />
        </Box>
      ) : (
        <Box mt={4}>
          <Typography variant="h6">Assine abaixo:</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              mt: 2,
              width: "100%",
              height: 200,
            }}
          >
            <SignatureCanvas
              ref={signaturePadRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "signatureCanvas",
              }}
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => signaturePadRef.current.clear()}
            >
              Limpar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSignatureUpload}
            >
              Enviar Assinatura
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicBudgetPage;
