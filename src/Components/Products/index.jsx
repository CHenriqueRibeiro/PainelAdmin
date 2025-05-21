/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// Componente Products ajustado para exibir os produtos com colapsos por nome do produto
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Collapse,
} from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";

// eslint-disable-next-line react/prop-types
const Products = ({ dataEstablishment, isLoading }) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://lavaja.up.railway.app/api/products/establishments/${dataEstablishment[0]._id}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setSnackbarMessage("Erro ao buscar produtos");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    if (dataEstablishment.length > 0) fetchProducts();
  }, [dataEstablishment]);

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
          Produtos Cadastrados
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {products.length > 0 ? (
          products.map((product) => (
            <Box key={product._id} sx={{ mb: 2 }}>
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
              >
                <Typography fontWeight={700} color="#AC42F7">
                  {product.name} | {product.quantidadeAtual} {product.unidade}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {expandedProductId === product._id ? (
                    <ArrowDropUpRoundedIcon
                      sx={{ color: "#AC42F7" }}
                      onClick={() =>
                        setExpandedProductId((prev) =>
                          prev === product._id ? null : product._id
                        )
                      }
                    />
                  ) : (
                    <ArrowDropDownRoundedIcon
                      sx={{ color: "#AC42F7" }}
                      onClick={() =>
                        setExpandedProductId((prev) =>
                          prev === product._id ? null : product._id
                        )
                      }
                    />
                  )}
                </Box>
              </Box>
              <Collapse in={expandedProductId === product._id}>
                <Box sx={{ mt: 1, p: 2, borderRadius: 2 }}>
                  {product.servicos && product.servicos.length > 0 ? (
                    <>
                      <Typography fontWeight={600} color="#AC42F7">
                        Serviços vinculados:
                      </Typography>
                      {product.servicos.map((s, idx) => (
                        <Typography key={idx} variant="body2">
                          - {s.service?.name || s.service} | Consumo:{" "}
                          {s.consumoPorServico} {product.unidade}/serviço
                        </Typography>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Nenhum serviço vinculado.
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">
            Nenhum produto cadastrado.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Products;
