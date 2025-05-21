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
  Collapse,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  InputLabel,
} from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const unidadeOptions = ["mL", "L", "g", "unidade"];

const Products = ({ dataEstablishment, isLoading }) => {
  const token = localStorage.getItem("authToken");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vincularServicos, setVincularServicos] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/establishments/${dataEstablishment[0]._id}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    if (dataEstablishment.length > 0) fetchProducts();
  }, [dataEstablishment]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erro ao deletar produto");
      setSnackbarMessage("Produto deletado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Erro ao deletar produto");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleServicoChange = (index, field, value) => {
    const updated = [...selectedProduct.servicos];
    updated[index][field] = value;
    setSelectedProduct((prev) => ({ ...prev, servicos: updated }));
  };

  const addNovoServico = () => {
    setSelectedProduct((prev) => ({
      ...prev,
      servicos: [
        ...(prev.servicos || []),
        { service: "", consumoPorServico: "" },
      ],
    }));
  };

  const removeServico = (index) => {
    const updated = selectedProduct.servicos.filter((_, i) => i !== index);
    setSelectedProduct((prev) => ({ ...prev, servicos: updated }));
  };

  const handleUpdate = async () => {
    try {
      const body = {
        ...selectedProduct,
        servicos: vincularServicos ? selectedProduct.servicos : [],
      };

      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto");
      setSnackbarMessage("Produto atualizado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEditDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Erro ao atualizar produto");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (isLoading || !dataEstablishment.length) {
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

  const servicesList = dataEstablishment[0].services || [];

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
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {product.servicos && product.servicos.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "90%",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                            gap: 1,
                            height: "100%",
                          }}
                        >
                          <Typography fontWeight={600} color="#AC42F7">
                            Serviços vinculados
                          </Typography>
                          {product.servicos.map((s, idx) => (
                            <Typography key={idx} variant="body2">
                              - {s.service?.name || s.service} | Consumo:{" "}
                              {s.consumoPorServico} {product.unidade}/serviço
                            </Typography>
                          ))}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "90%",
                            gap: 1,
                            height: "100%",
                          }}
                        >
                          <Typography fontWeight={600} color="#AC42F7">
                            Valor do produto
                          </Typography>
                          <Typography variant="body2">
                            R$ {product.preco}
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setVincularServicos(product.servicos?.length > 0);
                            setEditDialogOpen(true);
                          }}
                        >
                          <EditRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Divider orientation="vertical" flexItem />
                      <Tooltip title="Excluir">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product._id);
                          }}
                          color="error"
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Nenhum serviço vinculado.
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          height: "100%",
                        }}
                      >
                        <Typography fontWeight={600} color="#AC42F7">
                          Valor do produto
                        </Typography>
                        <Typography variant="body2">
                          R$ {product.preco}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "10%",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setVincularServicos(product.servicos?.length > 0);
                              setEditDialogOpen(true);
                            }}
                          >
                            <EditRoundedIcon />
                          </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem />
                        <Tooltip title="Excluir">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product._id);
                            }}
                            color="error"
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </>
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

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FFFFFF", fontWeight: "bold", textAlign: "center" }}
        >
          Editar Produto
        </DialogTitle>
        <DialogContent>
          <InputLabel
            sx={{
              color: "#FFFFFF",
              pl: 0.3,
              fontWeight: 600,
            }}
          >
            Nome
          </InputLabel>
          <TextField
            fullWidth
            value={selectedProduct?.name || ""}
            onChange={(e) =>
              setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
            }
            size="small"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <InputLabel
            sx={{
              color: "#FFFFFF",
              pl: 0.3,
              mt: 1,
              fontWeight: 600,
            }}
          >
            Valor
          </InputLabel>
          <TextField
            fullWidth
            type="number"
            value={selectedProduct?.preco || ""}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                preco: Number(e.target.value),
              }))
            }
            size="small"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <InputLabel
            sx={{
              color: "#FFFFFF",
              pl: 0.3,
              mt: 1,
              fontWeight: 600,
            }}
          >
            Quantidade
          </InputLabel>
          <TextField
            fullWidth
            type="number"
            value={selectedProduct?.quantidadeAtual || ""}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                quantidadeAtual: e.target.value,
              }))
            }
            size="small"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />

          <InputLabel
            sx={{
              color: "#FFFFFF",
              pl: 0.3,
              mt: 1,
              fontWeight: 600,
            }}
          >
            Unidade
          </InputLabel>
          <TextField
            fullWidth
            select
            value={selectedProduct?.unidade || ""}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                unidade: e.target.value,
              }))
            }
            size="small"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          >
            {unidadeOptions.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={vincularServicos}
                onChange={(e) => setVincularServicos(e.target.checked)}
              />
            }
            label="Atribuir este produto a um ou mais serviços"
            sx={{ mt: 1 }}
          />

          {vincularServicos && selectedProduct && (
            <>
              {selectedProduct.servicos?.map((item, index) => (
                <>
                  <InputLabel
                    sx={{
                      color: "#FFFFFF",
                      pl: 0.3,
                      mt: 1,
                      fontWeight: 600,
                    }}
                  >
                    Serviço
                  </InputLabel>
                  <Box key={index} sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <TextField
                      fullWidth
                      select
                      value={item.service || ""}
                      onChange={(e) =>
                        handleServicoChange(index, "service", e.target.value)
                      }
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                    >
                      {servicesList.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Consumo por Serviço"
                      type="number"
                      value={item.consumoPorServico || ""}
                      onChange={(e) =>
                        handleServicoChange(
                          index,
                          "consumoPorServico",
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                    />

                    {selectedProduct.servicos.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeServico(index)}
                        sx={{ alignSelf: "center" }}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    )}
                  </Box>
                </>
              ))}

              <Button
                size="small"
                variant="outlined"
                onClick={addNovoServico}
                sx={{
                  background: "#ac42f7",
                  color: "#FFF",
                  borderColor: "#ac42f7",
                  borderRadius: 3,
                  mt: 1,
                  padding: "8px 24px",
                  fontSize: "0.5rem",
                  fontWeight: "bold",
                  "& .MuiCircularProgress-root": {
                    color: "#ffffff",
                  },
                }}
              >
                Adicionar serviço
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ mb: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
              borderRadius: 3,
              fontSize: "0.8rem",
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
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
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
