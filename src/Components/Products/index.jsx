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
  Menu,
} from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import * as yup from "yup";

const unidadeOptions = ["mL", "L", "g", "unidade"];

const reporSchema = yup.object().shape({
  quantidade: yup
    .number()
    .typeError("Quantidade é obrigatória")
    .required("Quantidade é obrigatória")
    .positive("Quantidade deve ser maior que zero"),
  precoUnitario: yup
    .number()
    .typeError("Preço é obrigatório")
    .required("Preço é obrigatório")
    .min(0, "Preço não pode ser negativo"),
  observacao: yup.string(), // opcional
});

const editProductSchema = yup.object().shape({
  name: yup.string().required("Nome do produto é obrigatório"),
  quantidadeAtual: yup
    .number()
    .typeError("Quantidade é obrigatória")
    .required("Quantidade é obrigatória")
    .positive("Quantidade deve ser maior que zero"),
  unidade: yup.string().required("Unidade é obrigatória"),
  preco: yup
    .number()
    .typeError("Valor é obrigatório")
    .required("Valor é obrigatório")
    .min(0, "Valor não pode ser negativo"),
  servicos: yup.array().when("vincularServicos", {
    is: true,
    then: (schema) =>
      schema.of(
        yup.object().shape({
          service: yup.string().required("Serviço é obrigatório"),
          consumoPorServico: yup
            .number()
            .typeError("Consumo é obrigatório")
            .required("Consumo é obrigatório"),
          unidadeConsumo: yup.string().required("Unidade é obrigatória"),
        })
      ),
    otherwise: (schema) => schema,
  }),
});

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
  const [reporDialogOpen, setReporDialogOpen] = useState(false);
  const [quantidadeReposicao, setQuantidadeReposicao] = useState("");
  const [precoReposicao, setPrecoReposicao] = useState("");
  const [observacaoReposicao, setObservacaoReposicao] = useState("");
  const [unidadeReposicao, setUnidadeReposicao] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);
  const [formErrorsRepor, setFormErrorsRepor] = useState({});
  const [formErrorsEdit, setFormErrorsEdit] = useState({});

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setMenuProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProduct(null);
  };
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
  const handleReporEstoque = async () => {
    const data = {
      quantidade:
        quantidadeReposicao === "" ? undefined : Number(quantidadeReposicao),
      precoUnitario: precoReposicao === "" ? undefined : Number(precoReposicao),
      unidade: unidadeReposicao || selectedProduct?.unidade,
      observacao: observacaoReposicao,
    };

    try {
      // Validação Yup
      await reporSchema.validate(data, { abortEarly: false });

      // Se passou na validação, limpa erros
      setFormErrorsRepor({});

      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/products/${selectedProduct._id}/repor`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao repor estoque");
      }

      setSnackbarMessage("Reposição realizada com sucesso!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setReporDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.log(error);
      // Validação Yup
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          if (err.path && err.path.startsWith("servicos")) {
            const match = err.path.match(/servicos\[(\d+)\]\.(\w+)/);
            if (match) {
              const idx = match[1];
              const field = match[2];
              if (!errors.servicos) errors.servicos = [];
              if (!errors.servicos[idx]) errors.servicos[idx] = {};
              errors.servicos[idx][field] = err.message;
            }
          } else if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setFormErrorsRepor(errors);
      } else {
        // Se for erro na requisição
        setSnackbarMessage("Erro ao repor estoque");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

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
    updated[index][field] =
      field === "consumoPorServico" && value !== "" ? Number(value) : value;
    setSelectedProduct((prev) => ({ ...prev, servicos: updated }));
  };

  const addNovoServico = () => {
    setSelectedProduct((prev) => ({
      ...prev,
      servicos: [
        ...(prev.servicos || []),
        {
          service: "",
          consumoPorServico: "",
          unidadeConsumo: prev.unidade || "mL",
        },
      ],
    }));
  };

  const removeServico = (index) => {
    const updated = selectedProduct.servicos.filter((_, i) => i !== index);
    setSelectedProduct((prev) => ({ ...prev, servicos: updated }));
  };

  const handleEditDialogOpen = (product) => {
    const servicos =
      product.servicos?.map((s) => ({
        service: s.service?._id || s.service || "",
        consumoPorServico: s.consumoPorServico ?? "",
        unidadeConsumo: s.unidadeConsumo ?? product.unidade,
      })) || [];
    const vincular = product.servicos?.length > 0;
    // Se for para vincular e não houver serviços, adiciona um serviço vazio
    const servicosFinal =
      vincular && servicos.length === 0
        ? [
            {
              service: "",
              consumoPorServico: "",
              unidadeConsumo: product.unidade || "mL",
            },
          ]
        : servicos;
    setSelectedProduct({
      ...product,
      preco: product.preco ?? "",
      quantidadeAtual: product.quantidadeAtual ?? "",
      unidade: product.unidade || "mL",
      servicos: servicosFinal,
    });
    setVincularServicos(vincular);
    setFormErrorsEdit({});
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    const data = {
      ...selectedProduct,
      preco:
        selectedProduct.preco === ""
          ? undefined
          : Number(selectedProduct.preco),
      quantidadeAtual:
        selectedProduct.quantidadeAtual === ""
          ? undefined
          : Number(selectedProduct.quantidadeAtual),
      servicos: vincularServicos ? selectedProduct.servicos : [],
      vincularServicos,
      unidade: selectedProduct.unidade || "mL",
    };
    try {
      await editProductSchema.validate(data, { abortEarly: false });
      setFormErrorsEdit({});
      const response = await fetch(
        `https://lavaja.up.railway.app/api/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto");
      setSnackbarMessage("Produto atualizado com sucesso");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.log(error);
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          if (err.path && err.path.startsWith("servicos")) {
            const match = err.path.match(/servicos\[(\d+)\]\.(\w+)/);
            if (match) {
              const idx = match[1];
              const field = match[2];
              if (!errors.servicos) errors.servicos = [];
              if (!errors.servicos[idx]) errors.servicos[idx] = {};
              errors.servicos[idx][field] = err.message;
            }
          } else if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setFormErrorsEdit(errors);
      } else {
        setSnackbarMessage("Erro ao atualizar produto");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
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
                      sx={{ color: "#AC42F7", cursor: "pointer" }}
                      onClick={() =>
                        setExpandedProductId((prev) =>
                          prev === product._id ? null : product._id
                        )
                      }
                    />
                  ) : (
                    <ArrowDropDownRoundedIcon
                      sx={{ color: "#AC42F7", cursor: "pointer" }}
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
                              {s.consumoPorServico} {s.unidadeConsumo}/serviço
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
                      <Tooltip title="Mais ações">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, product)}
                          color="inherit"
                        >
                          <MoreVertRoundedIcon />
                        </IconButton>
                      </Tooltip>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                          "& .MuiPaper-root": {
                            minWidth: "6rem",
                            background: "#f1eeff",
                          },
                        }}
                      >
                        <MenuItem
                          sx={{ fontSize: "12px", padding: "8px 16px" }}
                          onClick={() => {
                            setSelectedProduct(menuProduct);
                            setQuantidadeReposicao("");
                            setPrecoReposicao("");
                            setObservacaoReposicao("");
                            setUnidadeReposicao("");
                            setFormErrorsRepor({});
                            setReporDialogOpen(true);
                            handleMenuClose();
                          }}
                        >
                          Repor Estoque
                        </MenuItem>
                        <MenuItem
                          sx={{ fontSize: "12px", padding: "8px 16px" }}
                          onClick={() => {
                            handleEditDialogOpen(menuProduct);
                            handleMenuClose();
                          }}
                        >
                          Editar
                        </MenuItem>
                        <MenuItem
                          sx={{
                            fontSize: "12px",
                            padding: "8px 16px",
                            color: "red",
                          }}
                          onClick={() => {
                            handleDelete(menuProduct._id);
                            handleMenuClose();
                          }}
                        >
                          Excluir
                        </MenuItem>
                      </Menu>
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
                              handleEditDialogOpen(product);
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
            onChange={(e) => {
              setSelectedProduct((prev) => ({ ...prev, name: e.target.value }));
              setFormErrorsEdit((prev) => ({ ...prev, name: undefined }));
            }}
            error={!!formErrorsEdit.name}
            helperText={formErrorsEdit.name}
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
            onChange={(e) => {
              setSelectedProduct((prev) => ({
                ...prev,
                preco: e.target.value,
              }));
              setFormErrorsEdit((prev) => ({ ...prev, preco: undefined }));
            }}
            error={!!formErrorsEdit.preco}
            helperText={formErrorsEdit.preco}
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
            onChange={(e) => {
              setSelectedProduct((prev) => ({
                ...prev,
                quantidadeAtual: e.target.value,
              }));
              setFormErrorsEdit((prev) => ({
                ...prev,
                quantidadeAtual: undefined,
              }));
            }}
            error={!!formErrorsEdit.quantidadeAtual}
            helperText={formErrorsEdit.quantidadeAtual}
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
            value={selectedProduct?.unidade || "mL"}
            onChange={(e) => {
              setSelectedProduct((prev) => ({
                ...prev,
                unidade: e.target.value,
              }));
              setFormErrorsEdit((prev) => ({ ...prev, unidade: undefined }));
            }}
            error={!!formErrorsEdit.unidade}
            helperText={formErrorsEdit.unidade}
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
                onChange={(e) => {
                  setVincularServicos(e.target.checked);
                  if (
                    e.target.checked &&
                    selectedProduct.servicos.length === 0
                  ) {
                    setSelectedProduct((prev) => ({
                      ...prev,
                      servicos: [
                        {
                          service: "",
                          consumoPorServico: "",
                          unidadeConsumo: prev.unidade || "mL",
                        },
                      ],
                    }));
                  }
                }}
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
                      error={!!formErrorsEdit.servicos?.[index]?.service}
                      helperText={formErrorsEdit.servicos?.[index]?.service}
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
                    >
                      {servicesList.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
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
                        error={
                          !!formErrorsEdit.servicos?.[index]?.consumoPorServico
                        }
                        helperText={
                          formErrorsEdit.servicos?.[index]?.consumoPorServico
                        }
                        size="small"
                        sx={{
                          width: "70%",
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                          "& .MuiInputBase-root.Mui-error": {
                            bgcolor: "#fff",
                          },
                        }}
                      />

                      <TextField
                        select
                        size="small"
                        value={
                          item.unidadeConsumo ||
                          selectedProduct?.unidade ||
                          "mL"
                        }
                        onChange={(e) =>
                          handleServicoChange(
                            index,
                            "unidadeConsumo",
                            e.target.value
                          )
                        }
                        sx={{
                          width: "30%",
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                          "& .MuiInputBase-root.Mui-error": {
                            bgcolor: "#fff",
                          },
                        }}
                      >
                        {unidadeOptions
                          .filter((option) => {
                            const base = selectedProduct?.unidade;
                            if (base === "L")
                              return option === "L" || option === "mL";
                            if (base === "mL") return option === "mL";
                            if (base === "g") return option === "g";
                            if (base === "unidade") return option === "unidade";
                            return false;
                          })
                          .map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>

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

      <Dialog
        open={reporDialogOpen}
        onClose={() => setReporDialogOpen(false)}
        maxWidth="xs"
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
          Repor Estoque
        </DialogTitle>
        <DialogContent>
          <InputLabel sx={{ mt: 1 }}>Quantidade a adicionar</InputLabel>
          <TextField
            fullWidth
            type="number"
            value={quantidadeReposicao}
            onChange={(e) => {
              setQuantidadeReposicao(e.target.value);
              setFormErrorsRepor((prev) => ({
                ...prev,
                quantidade: undefined,
              }));
            }}
            error={!!formErrorsRepor.quantidade}
            helperText={formErrorsRepor.quantidade}
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

          <InputLabel sx={{ mt: 2 }}>Unidade</InputLabel>
          <TextField
            select
            fullWidth
            value={unidadeReposicao || selectedProduct?.unidade || "mL"}
            onChange={(e) => setUnidadeReposicao(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          >
            {unidadeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <InputLabel sx={{ mt: 2 }}>Preço pago por unidade</InputLabel>
          <TextField
            fullWidth
            type="number"
            value={precoReposicao}
            onChange={(e) => {
              setPrecoReposicao(e.target.value);
              setFormErrorsRepor((prev) => ({
                ...prev,
                precoUnitario: undefined,
              }));
            }}
            error={!!formErrorsRepor.precoUnitario}
            helperText={formErrorsRepor.precoUnitario}
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

          <InputLabel sx={{ mt: 2, color: "#FFFFFF", fontWeight: 600 }}>
            Observação (opcional)
          </InputLabel>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={observacaoReposicao}
            onChange={(e) => setObservacaoReposicao(e.target.value)}
            size="small"
            error={!!formErrorsRepor.observacao}
            helperText={formErrorsRepor.observacao}
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              mt: 1,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ mb: 2, px: 3 }}>
          <Button
            onClick={() => setReporDialogOpen(false)}
            sx={{
              background: "#fff",
              color: "#AC42F7",
              fontWeight: "bold",
              borderRadius: 3,
              padding: "8px 24px",
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleReporEstoque}
            sx={{
              background: "#AC42F7",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 3,
              padding: "8px 24px",
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
