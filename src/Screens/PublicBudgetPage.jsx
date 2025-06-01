/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import SignatureCanvas from "react-signature-canvas";

const PublicBudgetPage = () => {
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoadingSignature, setIsLoadingSignature] = useState(false);
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
      setIsLoadingSignature(true);
      const response = await fetch(
        `https://lavaja.up.railway.app/api/budget/budget/sign/${budgetId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erro ao enviar assinatura");

      const data = await response.json();
      setBudget((prev) => ({
        ...prev,
        signatureUrl: data.signatureUrl,
        signedDocumentUrl: data.signedDocumentUrl,
      }));
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
    } finally {
      setIsLoadingSignature(false);
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
      <Typography
        variant="h5"
        fontWeight={700}
        color="#AC42F7"
        textAlign="center"
        gutterBottom
      >
        Assinatura de Orçamento
      </Typography>

      <Typography
        variant="h6"
        fontWeight={600}
        color="#AC42F7"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Orçamento de {budget.clientName}
      </Typography>

      {/* Telefone e Valor */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "#f9f5ff",
            borderRadius: 2,
            border: "1px solid #AC42F7",
            p: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#AC42F7" }}>
            Telefone:
          </Typography>
          <Typography fontWeight={600}>{budget.phone}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: "#f9f5ff",
            borderRadius: 2,
            border: "1px solid #AC42F7",
            p: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#AC42F7" }}>
            Valor Total:
          </Typography>
          <Typography fontWeight={600}>
            R$ {Number(budget.value).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box mt={2}>
        <Typography variant="h6" fontWeight={600} color="#AC42F7">
          Serviços:
        </Typography>
        {budget.services && budget.services.length > 0 ? (
          <Box
            sx={{
              mt: 1,
              p: 2,
              background: "#f9f5ff",
              borderRadius: 2,
              border: "1px solid #AC42F7",
              boxShadow: "0 2px 4px rgba(172, 66, 247, 0.1)",
            }}
          >
            {budget.services.map((service, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: index !== budget.services.length - 1 ? 1 : 0,
                  borderBottom:
                    index !== budget.services.length - 1
                      ? "1px solid #ddd"
                      : "none",
                  pb: index !== budget.services.length - 1 ? 1 : 0,
                }}
              >
                <Typography>{service.name}</Typography>
                <Typography fontWeight={600}>
                  R$ {Number(service.value).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="textSecondary">Nenhum serviço listado.</Typography>
        )}
      </Box>
      {!budget.signatureUrl && (
        <Box mt={3} mb={4} sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            href={budget.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderRadius: 3,
              padding: "8px 24px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(172, 66, 247, 0.3)",
              "&:hover": { background: "#9a2dcf" },
            }}
          >
            Visualizar PDF do Orçamento
          </Button>
        </Box>
      )}

      {budget.signatureUrl ? (
        <Box mt={4}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="green"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Este orçamento já foi assinado!
          </Typography>

          <Box mt={2} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              href={budget.signedDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: "#ac42f7",
                color: "#FFF",
                borderRadius: 3,
                padding: "8px 24px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(172, 66, 247, 0.3)",
                "&:hover": { background: "#9a2dcf" },
              }}
            >
              Visualizar Documento Assinado
            </Button>
          </Box>
        </Box>
      ) : (
        <Box mt={4}>
          <Typography variant="h6" fontWeight={600}>
            Assine abaixo:
          </Typography>
          <Box
            sx={{
              mt: 1,
              p: 2,
              background: "#f9f5ff",
              borderRadius: 2,
              border: "1px solid #AC42F7",
            }}
          >
            <Typography variant="body2" color="#AC42F7" fontWeight={500}>
              <strong>Importante:</strong> Ao assinar este orçamento, você
              autoriza a execução dos serviços descritos acima. Se tiver alguma
              dúvida, entre em contato com nossa equipe.
            </Typography>
          </Box>

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
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => signaturePadRef.current.clear()}
              sx={{
                background: "#fff",
                color: "#AC42F7",
                borderColor: "#AC42F7",
                borderRadius: 3,
                padding: "8px 24px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "#f5f5f5",
                },
              }}
            >
              Limpar
            </Button>
            <LoadingButton
              variant="contained"
              color="secondary"
              onClick={handleSignatureUpload}
              loading={isLoadingSignature}
              sx={{
                background: "#ac42f7",
                color: "#FFF",
                borderRadius: 3,
                padding: "8px 24px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(172, 66, 247, 0.3)",
                "&:hover": { background: "#9a2dcf" },
              }}
            >
              Enviar Assinatura
            </LoadingButton>
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
