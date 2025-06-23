/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid2,
  Switch,
  FormControlLabel,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import InputMask from "react-input-mask";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// eslint-disable-next-line react/prop-types
const ScheduledData = ({
  dataEstablishment,
  isLoading,
  setService = () => {},
  setEstablishment = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editEstablishmentId, setEditEstablishmentId] = useState("");
  const [originalCep, setOriginalCep] = useState("");
  const [originalData, setOriginalData] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  const schema = yup.object().shape({
    nameEstablishment: yup
      .string()
      .required("Nome do estabelecimento é obrigatório"),
    workingDays: yup
      .array()
      .of(yup.string())
      .min(1, "Selecione pelo menos um dia de funcionamento")
      .required("Dias de funcionamento são obrigatórios"),
    paymentMethods: yup
      .array()
      .of(yup.string())
      .min(1, "Selecione pelo menos uma forma de pagamento")
      .required("Formas de pagamento são obrigatórias"),
    address: yup.object().shape({
      cep: yup.string().required("CEP é obrigatório"),
      street: yup.string().required("Rua é obrigatória"),
      number: yup
        .string()
        .required("Número é obrigatório")
        .matches(/^[0-9A-Za-z\s]+$/, "Digite um número válido"),

      neighborhood: yup.string().required("Bairro é obrigatório"),
      city: yup.string().required("Cidade é obrigatória"),
      state: yup.string().required("Estado é obrigatório"),
    }),
    openingHours: yup.object().shape({
      open: yup
        .string()
        .required("Horário de abertura é obrigatório")
        .test(
          "open-before-close",
          "Horário de abertura deve ser menor ao horário de fechamento",
          function (value) {
            const { close } = this.parent;
            if (!value || !close) return true;
            return value <= close;
          }
        ),
      close: yup
        .string()
        .required("Horário de fechamento é obrigatório")
        .test(
          "close-after-open",
          "Horário de fechamento deve ser maior ao horário de abertura",
          function (value) {
            const { open } = this.parent;
            if (!value || !open) return true;
            return value >= open;
          }
        ),
      hasLunchBreak: yup.boolean(),
      intervalOpen: yup.string().when("hasLunchBreak", {
        is: true,
        then: (schema) =>
          schema
            .required("Início do intervalo é obrigatório")
            .test(
              "intervalOpen-valid",
              "Início do intervalo deve ser maior ou igual ao horário de abertura e menor ou igual ao horário de fechamento",
              function (value) {
                const { open, close } = this.parent;
                if (!value || !open || !close) return true;
                return value >= open && value <= close;
              }
            ),
      }),
      intervalClose: yup
        .string()
        .when(["hasLunchBreak", "intervalOpen", "open", "close"], {
          is: (hasLunchBreak) => hasLunchBreak,
          then: (schema) =>
            schema
              .required("Fim do intervalo é obrigatório")
              .test(
                "intervalClose-valid",
                "Fim do intervalo deve ser maior ou igual ao início do intervalo e ao horário de abertura, e menor ou igual ao horário de fechamento",
                function (value) {
                  const { open, close, intervalOpen } = this.parent;
                  if (!value || !open || !close || !intervalOpen) return true;
                  return (
                    value >= open && value >= intervalOpen && value <= close
                  );
                }
              ),
        }),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      nameEstablishment: "",
      workingDays: [],
      paymentMethods: [],
      address: {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
      openingHours: {
        open: "",
        close: "",
        hasLunchBreak: false,
        intervalOpen: "",
        intervalClose: "",
      },
    },
  });

  const hasLunchBreak = watch("openingHours.hasLunchBreak");

  const handleEditEstablishment = (establishment) => {
    setIsEditing(true);
    setEditEstablishmentId(establishment._id);
    setOriginalData(establishment);
    setValue("nameEstablishment", establishment.nameEstablishment || "");
    setValue("workingDays", establishment.workingDays || []);
    setValue("paymentMethods", establishment.paymentMethods || []);
    setValue("openingHours.open", establishment.openingHours?.open || "");
    setValue("openingHours.close", establishment.openingHours?.close || "");
    setValue(
      "openingHours.hasLunchBreak",
      establishment.openingHours?.hasLunchBreak == true
    );
    setValue(
      "openingHours.intervalOpen",
      establishment.openingHours?.intervalOpen || ""
    );
    setValue(
      "openingHours.intervalClose",
      establishment.openingHours?.intervalClose || ""
    );
    setValue("address.cep", establishment.address?.cep || "");
    setValue("address.street", establishment.address?.street || "");
    setValue("address.number", establishment.address?.number || "");
    setValue("address.complement", establishment.address?.complement || "");
    setValue("address.neighborhood", establishment.address?.neighborhood || "");
    setValue("address.city", establishment.address?.city || "");
    setValue("address.state", establishment.address?.state || "");

    setAddressData({
      cep: establishment.address?.cep || "",
      street: establishment.address?.street || "",
      number: establishment.address?.number || "",
      complement: establishment.address?.complement || "",
      neighborhood: establishment.address?.neighborhood || "",
      city: establishment.address?.city || "",
      state: establishment.address?.state || "",
      latitude: establishment.location?.coordinates[1] || "",
      longitude: establishment.location?.coordinates[0] || "",
    });
    setOriginalCep(establishment.address?.cep || "");

    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
    setEditEstablishmentId(null);
    reset();
    setAddressData({
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
    });
    setOpenDialog(false);
  };

  const renderSkeleton = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#AC42F7">
          Estabelecimento
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Grid2 container spacing={3} sx={{ mt: 2 }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 3 }}>
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" width="80%" height={25} />
          </Grid2>
        ))}
        <Grid2 size={{ xs: 12 }}>
          <Skeleton variant="text" height={30} width="30%" sx={{ mb: 1 }} />
        </Grid2>
      </Grid2>
    </Paper>
  );

  const handleSearchCep = async () => {
    try {
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v2/${addressData.cep}`
      );
      if (!response.ok) {
        console.error("Erro ao buscar CEP");
        return;
      }
      const data = await response.json();
      const newAddressData = {
        cep: data.cep || "",
        street: data.street || "",
        number: addressData.number || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        latitude: data.location?.coordinates?.latitude || "-00.000000",
        longitude: data.location?.coordinates?.longitude || "0.000000",
      };
      setAddressData(newAddressData);

      setValue("address.cep", newAddressData.cep);
      setValue("address.street", newAddressData.street);
      setValue("address.number", newAddressData.number);
      setValue("address.neighborhood", newAddressData.neighborhood);
      setValue("address.city", newAddressData.city);
      setValue("address.state", newAddressData.state);
      trigger([
        "address.cep",
        "address.street",
        "address.number",
        "address.neighborhood",
        "address.city",
        "address.state",
      ]);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };
  if (isLoading) {
    return <Box sx={{ width: "95%", mt: 5, mb: 3 }}>{renderSkeleton()}</Box>;
  }
  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const cleanEstablishment = (est) => ({
    nameEstablishment: est.nameEstablishment,
    address: {
      cep: est.address?.cep || "",
      street: est.address?.street || "",
      number: est.address?.number || "",
      complement: est.address?.complement || "",
      neighborhood: est.address?.neighborhood || "",
      city: est.address?.city || "",
      state: est.address?.state || "",
    },
    openingHours: {
      open: est.openingHours?.open || "",
      close: est.openingHours?.close || "",
      hasLunchBreak: est.openingHours?.hasLunchBreak || false,
      intervalOpen: est.openingHours?.intervalOpen || "",
      intervalClose: est.openingHours?.intervalClose || "",
    },
    paymentMethods: est.paymentMethods || [],
    workingDays: est.workingDays || [],
  });
  const handleSaveEstablishment = async (data) => {
    if (isEditing && originalData) {
      const compareData = cleanEstablishment(data);
      const compareOriginal = cleanEstablishment(originalData);
      if (deepEqual(compareData, compareOriginal)) {
        setOpenDialog(false);
        return;
      }
    }
    let latitude = addressData.latitude;
    let longitude = addressData.longitude;

    if (addressData.cep !== originalCep) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cep/v2/${addressData.cep}`
        );
        if (response.ok) {
          const data = await response.json();
          latitude = data.location?.coordinates?.latitude || "-00.000000";
          longitude = data.location?.coordinates?.longitude || "0.000000";
        } else {
          console.error("Erro ao buscar localização pelo novo CEP");
        }
      } catch (error) {
        console.error("Erro ao buscar novo CEP:", error);
      }
    }

    const establishmentData = {
      nameEstablishment: data.nameEstablishment,
      address: {
        ...data.address,
        latitude,
        longitude,
      },
      openingHours: {
        open: data.openingHours.open,
        close: data.openingHours.close,
        hasLunchBreak: data.openingHours.hasLunchBreak,
        intervalOpen: data.openingHours.intervalOpen,
        intervalClose: data.openingHours.intervalClose,
      },
      paymentMethods: data.paymentMethods,
      workingDays: data.workingDays,
      owner: OwnerUser.id,
    };

    try {
      setIsLoadingButtonSave(true);

      const url = isEditing
        ? `https://lavaja.up.railway.app/api/establishment/establishment/${editEstablishmentId}`
        : "https://lavaja.up.railway.app/api/establishment/create";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(establishmentData),
      });

      if (!response.ok) throw new Error("Erro ao salvar estabelecimento");
      setOpenDialog(false);
      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      setSnackbarMessage(
        isEditing
          ? "Alteração salva com sucesso!"
          : "Estabelecimento cadastrado com sucesso!"
      );
      setSnackbarSeverity("success");
      handleCloseDialog();
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarMessage(
        isEditing
          ? "É necessario preencher todos os campos"
          : "Erro ao cadastrar estabelecimento"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButtonSave(false);
    }
  };
  const handleDeleteEstablishment = async () => {
    try {
      setIsLoadingButton(true);
      const url = `https://lavaja.up.railway.app/api/establishment/establishment/${editEstablishmentId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar estabelecimento");

      setOpenDialog(false);
      setIsLoadingButton(false);
      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialog();
      setSnackbarMessage("Sucesso ao deletar estabelecimento");
      setSnackbarSeverity("success");
      handleCloseDialog();
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro:", error);
      setSnackbarMessage("Erro ao deletar estabelecimento");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const establishment = dataEstablishment[0];

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
      <Paper sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#AC42F7">
            Estabelecimento
          </Typography>
          {dataEstablishment.length > 0 ? (
            <Tooltip title="Editar Estabelecimento">
              <IconButton
                onClick={() => handleEditEstablishment(establishment)}
              >
                <ModeEditRoundedIcon sx={{ color: "#AC42F7" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Adicionar Estabelecimento">
              <IconButton onClick={handleOpenDialog}>
                <AddRoundedIcon sx={{ color: "#AC42F7" }} size="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {dataEstablishment.length > 0 ? (
          <>
            <Divider sx={{ my: 1 }} />
            <Grid2 container spacing={3} sx={{ mt: 2 }}>
              {[
                { label: "Nome", value: establishment.nameEstablishment },
                { label: "CEP", value: establishment.address.cep },
                { label: "Endereço", value: establishment.address.street },
                { label: "Número", value: establishment.address.number },
                {
                  label: "Complemento",
                  value: establishment.address.complement,
                },
                { label: "Bairro", value: establishment.address.neighborhood },
                { label: "Cidade", value: establishment.address.city },
                { label: "Estado", value: establishment.address.state },
                {
                  label: "Hora de Abertura",
                  value: establishment.openingHours.open,
                },
                ...(establishment.openingHours?.hasLunchBreak
                  ? [
                      {
                        label: "Início do Intervalo",
                        value: establishment.openingHours.intervalOpen,
                      },
                      {
                        label: "Final do Intervalo",
                        value: establishment.openingHours.intervalClose,
                      },
                    ]
                  : []),
                {
                  label: "Hora de Encerramento",
                  value: establishment.openingHours.close,
                },
              ].map((item, index) => (
                <Grid2 key={index} size={{ xs: 12, sm: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ color: "#AC42F7" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color="textPrimary"
                  >
                    {item.value || "-"}
                  </Typography>
                </Grid2>
              ))}
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#AC42F7" }}
                >
                  Dias de Funcionamento
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {establishment.workingDays?.length > 0 ? (
                    establishment.workingDays.map((method, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2,
                          py: 0.5,
                          backgroundColor: "#E9D5FF",
                          color: "#6B21A8",
                          borderRadius: 2,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {method}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Nenhum dia cadastrado
                    </Typography>
                  )}
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#AC42F7" }}
                >
                  Formas de Pagamento
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {establishment.paymentMethods?.length > 0 ? (
                    establishment.paymentMethods.map((method, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2,
                          py: 0.5,
                          backgroundColor: "#E9D5FF",
                          color: "#6B21A8",
                          borderRadius: 2,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {method}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Nenhuma forma de pagamento cadastrada
                    </Typography>
                  )}
                </Box>
              </Grid2>
            </Grid2>
          </>
        ) : (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography color="textSecondary">
              Cadastre um estabelecimento para depois cadastrar os serviços.
            </Typography>
          </>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          {isEditing ? "Editar Estabelecimento" : "Novo Estabelecimento"}
        </DialogTitle>

        <form onSubmit={handleSubmit(handleSaveEstablishment)}>
          <DialogContent>
            <Grid2 container spacing={1.5} sx={{ mt: 2 }}>
              <Grid2 size={{ xs: 12 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Nome do Estabelecimento
                </InputLabel>
                <TextField
                  placeholder="Digite o nome do estabelecimento"
                  fullWidth
                  {...register("nameEstablishment")}
                  error={!!errors.nameEstablishment}
                  helperText={errors.nameEstablishment?.message}
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
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Dias de funcionamento
                </InputLabel>
                <TextField
                  placeholder="Selecione os dias"
                  select
                  fullWidth
                  size="small"
                  value={watch("workingDays") || []}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (typeof value === "string") {
                      value = value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);
                    }
                    setValue("workingDays", value);
                    trigger("workingDays");
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text");
                    const arr = paste
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean);
                    setValue("workingDays", arr);
                    trigger("workingDays");
                  }}
                  error={!!errors.workingDays}
                  helperText={errors.workingDays?.message}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => selected.join(", "),
                  }}
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
                  {[
                    "Domingo",
                    "Segunda",
                    "Terça",
                    "Quarta",
                    "Quinta",
                    "Sexta",
                    "Sábado",
                  ].map((payment) => (
                    <MenuItem key={payment} value={payment}>
                      {payment}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Formas de pagamento
                </InputLabel>
                <TextField
                  placeholder="Selecione as formas de pagamento"
                  select
                  fullWidth
                  size="small"
                  value={watch("paymentMethods") || []}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (typeof value === "string") {
                      value = value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);
                    }
                    setValue("paymentMethods", value);
                    trigger("paymentMethods");
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text");
                    const arr = paste
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean);
                    setValue("paymentMethods", arr);
                    trigger("paymentMethods");
                  }}
                  error={!!errors.paymentMethods}
                  helperText={errors.paymentMethods?.message}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => selected.join(", "),
                  }}
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
                  {[
                    "Pix",
                    "Cartão de Crédito",
                    "Cartão de Débito",
                    "Dinheiro",
                  ].map((payment) => (
                    <MenuItem key={payment} value={payment}>
                      {payment}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  CEP
                </InputLabel>
                <Grid2 container spacing={2}>
                  <Grid2 size={8}>
                    <InputMask
                      mask="99999-999"
                      maskChar={null}
                      value={watch("address.cep") || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("address.cep", value);
                        setAddressData((prev) => ({ ...prev, cep: value }));
                      }}
                      onBlur={handleSearchCep}
                    >
                      {(inputProps) => (
                        <TextField
                          placeholder="Digite o CEP"
                          {...inputProps}
                          error={!!errors.address?.cep}
                          helperText={errors.address?.cep?.message}
                          size="small"
                          fullWidth
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
                      )}
                    </InputMask>
                  </Grid2>
                  <Grid2 size={4}>
                    <Button
                      onClick={handleSearchCep}
                      variant="outlined"
                      fullWidth
                      sx={{
                        height: "2.5rem",
                        borderRadius: 2,
                        borderColor: "#AC42F7",
                        color: "#AC42F7",
                        "&:hover": {
                          borderColor: "#8a2be2",
                          background: "#f9f5ff",
                        },
                      }}
                    >
                      Buscar
                    </Button>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Endereço
                </InputLabel>
                <TextField
                  placeholder="Digite o nome da rua"
                  fullWidth
                  size="small"
                  {...register("address.street")}
                  error={!!errors.address?.street}
                  helperText={errors.address?.street?.message}
                  disabled={isEditing}
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
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Nº
                </InputLabel>
                <TextField
                  placeholder="Digite o número"
                  fullWidth
                  size="small"
                  {...register("address.number")}
                  error={!!errors.address?.number}
                  helperText={errors.address?.number?.message}
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
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Complemento
                </InputLabel>
                <TextField
                  placeholder="Digite o complemento"
                  fullWidth
                  size="small"
                  {...register("address.complement")}
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
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Bairro
                </InputLabel>
                <TextField
                  placeholder="Digite o bairro"
                  fullWidth
                  size="small"
                  {...register("address.neighborhood")}
                  error={!!errors.address?.neighborhood}
                  helperText={errors.address?.neighborhood?.message}
                  disabled={isEditing}
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
              <Grid2 size={{ xs: 12, sm: 8 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Cidade
                </InputLabel>
                <TextField
                  placeholder="Digite a cidade"
                  fullWidth
                  size="small"
                  {...register("address.city")}
                  error={!!errors.address?.city}
                  helperText={errors.address?.city?.message}
                  disabled={isEditing}
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
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Estado
                </InputLabel>
                <TextField
                  placeholder="Digite o estado"
                  fullWidth
                  size="small"
                  {...register("address.state")}
                  error={!!errors.address?.state}
                  helperText={errors.address?.state?.message}
                  disabled={isEditing}
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
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Horário de Abertura
                </InputLabel>
                <TextField
                  type="time"
                  fullWidth
                  size="small"
                  {...register("openingHours.open")}
                  error={!!errors.openingHours?.open}
                  helperText={errors.openingHours?.open?.message}
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
                <InputLabel
                  sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                >
                  Horário de Fechamento
                </InputLabel>
                <TextField
                  type="time"
                  fullWidth
                  size="small"
                  {...register("openingHours.close")}
                  error={!!errors.openingHours?.close}
                  helperText={errors.openingHours?.close?.message}
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
              <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
                <Controller
                  name="openingHours.hasLunchBreak"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          size="small"
                        />
                      }
                      label="Possui intervalo entre horario de funcionamento?"
                    />
                  )}
                />
              </Grid2>
              {hasLunchBreak && (
                <>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InputLabel
                      sx={{
                        color: "#FFFFFF",
                        pb: 0.5,
                        pl: 0.3,
                        fontWeight: 600,
                      }}
                    >
                      Início do Intervalo
                    </InputLabel>
                    <TextField
                      type="time"
                      fullWidth
                      size="small"
                      {...register("openingHours.intervalOpen")}
                      error={!!errors.openingHours?.intervalOpen}
                      helperText={errors.openingHours?.intervalOpen?.message}
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
                    <InputLabel
                      sx={{
                        color: "#FFFFFF",
                        pb: 0.5,
                        pl: 0.3,
                        fontWeight: 600,
                      }}
                    >
                      Fim do Intervalo
                    </InputLabel>
                    <TextField
                      type="time"
                      fullWidth
                      size="small"
                      {...register("openingHours.intervalClose")}
                      error={!!errors.openingHours?.intervalClose}
                      helperText={errors.openingHours?.intervalClose?.message}
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
                </>
              )}
            </Grid2>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "end", pb: 2, gap: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{
                background: "#FFF",
                color: "#ac42f7",
                borderColor: "#FFF",
                borderRadius: 3,
                fontSize: "1rem",
                padding: "8px 24px",
              }}
            >
              Cancelar
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                onClick={handleDeleteEstablishment}
                loading={isLoadingButton}
                color="error"
                sx={{
                  color: "#FFF",
                  borderColor: "#FFF",
                  borderRadius: 3,
                  padding: "8px 24px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "& .MuiCircularProgress-root": {
                    color: "#ffffff",
                  },
                }}
              >
                Excluir
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              loading={isLoadingButtonSave}
              sx={{
                background: "#ac42f7",
                color: "#FFF",
                borderColor: "#FFF",
                borderRadius: 3,
                padding: "8px 24px",
                fontSize: "1rem",
                fontWeight: "bold",
                "& .MuiCircularProgress-root": {
                  color: "#ffffff",
                },
              }}
            >
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ScheduledData;
