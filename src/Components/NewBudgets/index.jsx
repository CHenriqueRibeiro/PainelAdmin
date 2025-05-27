/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Grid2,
  InputLabel,
  Paper,
  useMediaQuery,
  useTheme,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import InputMask from "react-input-mask";
import {
  BlobProvider,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#000",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  titleRight: {
    fontSize: 14,
    textAlign: "right",
  },
  section: {
    marginBottom: 5,
  },
  infoBlock: {
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColDesc: {
    width: "70%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableColValue: {
    width: "30%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    textAlign: "right",
  },
  totalBlock: {
    marginTop: 20,
    textAlign: "right",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    borderTop: 1,
    paddingTop: 10,
    color: "#666",
  },
});
const schema = yup.object().shape({
  clientName: yup.string().required("Campo obrigatório"),
  phone: yup.string().required("Campo obrigatório"),
  plate: yup.string().required("Campo obrigatório"),
  brand: yup.string().required("Campo obrigatório"),
  model: yup.string().required("Campo obrigatório"),
  year: yup.string().required("Campo obrigatório"),
  date: yup.string().required("Campo obrigatório"),
  dateValidate: yup.string().required("Campo obrigatório"),
  deliveryDate: yup.string().required("Campo obrigatório"),
  referencePoint: yup.string().required("Campo obrigatório"),
  observation: yup.string(),
  address: yup.string().required("Campo obrigatório"),
  serviceDescription: yup.string(),
  services: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Campo obrigatório"),
        value: yup
          .number()
          .typeError("Valor inválido")
          .required("Campo obrigatório"),
        observation: yup.string(),
      })
    )
    .min(1, "Adicione pelo menos um serviço"),
});
const BudgetDocument = ({
  establishmentName,
  clientName,
  phone,
  plate,
  brand,
  model,
  year,
  referencePoint,
  address,
  observation,
  serviceDescription,
  date,
  dateValidate,
  deliveryDate,
  services,
  total,
}) => (
  <Document>
    <Page size="A4" style={{ padding: 40, fontFamily: "Helvetica" }}>
      {/* Topo */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            {establishmentName}
          </Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={{ fontSize: 10 }}>
            {dayjs(date).format("MMMM, YYYY")}
          </Text>
        </View>
      </View>

      {/* Cliente */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>Cliente:</Text>
        <Text style={{ fontSize: 10 }}>{clientName}</Text>
        <Text style={{ fontSize: 10 }}>Telefone: {phone}</Text>
        <Text style={{ fontSize: 10 }}>{address}</Text>
        <Text style={{ fontSize: 10 }}>
          Ponto de referência: {referencePoint}
        </Text>
        <Text style={{ fontSize: 10 }}>
          Veículo: {plate} | {brand} {model} ({year})
        </Text>
        <Text style={{ fontSize: 10 }}>
          Entrega: {dayjs(deliveryDate).format("DD/MM/YYYY")}
        </Text>
        <Text style={{ fontSize: 10 }}>
          Validade: {dayjs(dateValidate).format("DD/MM/YYYY")}
        </Text>
      </View>

      {/* Tabela */}
      <View
        style={{
          marginTop: 10,
          borderTop: 1,
          borderBottom: 1,
          borderColor: "#ccc",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f5f5f5",
            paddingVertical: 5,
            paddingHorizontal: 8,
            borderBottom: 1,
            borderColor: "#ccc",
          }}
        >
          <Text style={{ width: "10%", fontSize: 9, fontWeight: "bold" }}>
            Nº
          </Text>
          <Text style={{ width: "55%", fontSize: 9, fontWeight: "bold" }}>
            Descrição
          </Text>
          <Text
            style={{
              width: "35%",
              fontSize: 9,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            Valor
          </Text>
        </View>

        {services.map((s, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderBottom: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ width: "10%", fontSize: 9 }}>{i + 1}</Text>
            <Text style={{ width: "55%", fontSize: 9 }}>
              {s.name}
              {s.observation ? ` - ${s.observation}` : ""}
            </Text>
            <Text style={{ width: "35%", fontSize: 9, textAlign: "right" }}>
              R$ {Number(s.value).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Observações */}
      {(observation || serviceDescription) && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>Observações:</Text>
          {serviceDescription && (
            <Text style={{ fontSize: 10 }}>{serviceDescription}</Text>
          )}
          {observation && <Text style={{ fontSize: 10 }}>{observation}</Text>}
        </View>
      )}

      {/* Total */}
      <View style={{ marginTop: 10, alignItems: "flex-end" }}>
        <View
          style={{
            backgroundColor: "#000",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10 }}>
            Total: R$ {Number(total).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Assinatura */}
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 10 }}>
          ___________________________________________
        </Text>
        <Text style={{ fontSize: 10, ml: 5 }}>Assinatura do Cliente</Text>
      </View>

      {/* Rodapé */}
      <View style={{ position: "absolute", bottom: 40, left: 40, right: 40 }}>
        <Text style={{ fontSize: 9, textAlign: "center" }}>
          Rua Exemplo, 123 – Cidade Brasileira
        </Text>
      </View>
    </Page>
  </Document>
);

const NewBudgets = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [dateValidate, setDateValidate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [deliveryDate, setDeliveryDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [serviceDescription, setServiceDescription] = useState("");
  const [services, setServices] = useState([
    { id: uuidv4(), name: "", value: "", observation: "" },
  ]);
  const [value, setValue] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const establishmentName = dataEstablishment[0]?.nameEstablishment;
  const handleServiceChange = (index, field, fieldValue) => {
    const updated = [...services];
    updated[index][field] = fieldValue;
    setServices(updated);
    const total = updated.reduce((sum, s) => sum + Number(s.value || 0), 0);
    setValue(total);
  };
  const {
    control,
    handleSubmit,
    setValue: setFormValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      phone: "",
      plate: "",
      brand: "",
      model: "",
      year: "",
      observation: "",
      referencePoint: "",
      address: "",
      serviceDescription: "",
      services: [{ name: "", value: "", observation: "" }],
    },
    resolver: yupResolver(schema),
  });
  const handleAddService = () => {
    const updated = [
      ...services,
      { id: uuidv4(), name: "", value: "", observation: "" },
    ];
    setServices(updated);
    setFormValue("services", updated, { shouldValidate: true });
    console.log("Serviços após adicionar:", updated);
  };

  const handleRemoveService = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    setFormValue("services", updated, { shouldValidate: true });
    console.log("Serviços após remover:", updated);
  };
  useEffect(() => {
    console.log("Erros do formulário:", errors);
  }, [errors]);
  const onSubmit = async (data, blob) => {
    console.log("Dados enviados no submit:", data);
    const payload = {
      ...data,
      date,
      dateValidate,
      deliveryDate,
      value,
      establishmentId: dataEstablishment[0]._id,
    };

    const formData = new FormData();
    formData.append("file", blob, "orcamento.pdf");
    formData.append("data", JSON.stringify(payload));

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://lavaja.up.railway.app/api/budget/budget",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Erro ao criar orçamento");

      setSnackbarSeverity("success");
      setSnackbarMessage("Orçamento criado com sucesso");
      setOpenSnackbar(true);
      setEstablishment((prev) => !prev);

      // Resetar tudo
      setDate(dayjs().format("YYYY-MM-DD"));
      setDeliveryDate(dayjs().format("YYYY-MM-DD"));
      setDateValidate(dayjs().format("YYYY-MM-DD"));
      setValue(0);
      reset();
      setServices([{ id: uuidv4(), name: "", value: "", observation: "" }]);
    } catch (err) {
      console.error("Erro ao criar orçamento:", err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Erro ao criar orçamento");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
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
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#f9f5ff",
          maxHeight: isMobile ? "80rem" : "60rem",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#AC42F7">
          Novo Orçamento
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Data do orçamento
            </InputLabel>
            <Controller
              name="date"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      const formatted = newValue?.format("YYYY-MM-DD") || "";
                      field.onChange(formatted);
                      setDate(formatted);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.date,
                        helperText: errors.date?.message,
                        InputProps: {
                          sx: {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                        },
                        sx: {
                          mt: 1,
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#ff8ba7",
                            },
                          "& .MuiInputBase-root.Mui-error": {
                            bgcolor: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Validade do orçamento
            </InputLabel>
            <Controller
              name="dateValidate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      const formatted = newValue?.format("YYYY-MM-DD") || "";
                      field.onChange(formatted);
                      setDateValidate(formatted);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.dateValidate,
                        helperText: errors.dateValidate?.message,
                        InputProps: {
                          sx: {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                        },
                        sx: {
                          mt: 1,
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#ff8ba7",
                            },
                          "& .MuiInputBase-root.Mui-error": {
                            bgcolor: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Entrega do serviço
            </InputLabel>
            <Controller
              name="deliveryDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      const formatted = newValue?.format("YYYY-MM-DD") || "";
                      field.onChange(formatted);
                      setDeliveryDate(formatted);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.deliveryDate,
                        helperText: errors.deliveryDate?.message,
                        InputProps: {
                          sx: {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                        },
                        sx: {
                          mt: 1,
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#fff",
                            borderRadius: 2,
                          },
                          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#ff8ba7",
                            },
                          "& .MuiInputBase-root.Mui-error": {
                            bgcolor: "#fff",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Placa
            </InputLabel>
            <Controller
              name="plate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.plate}
                  helperText={errors.plate?.message}
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Marca
            </InputLabel>
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Modelo
            </InputLabel>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.model}
                  helperText={errors.model?.message}
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Ano
            </InputLabel>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.year}
                  helperText={errors.year?.message}
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
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Nome do cliente
            </InputLabel>
            <Controller
              name="clientName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.clientName}
                  helperText={errors.clientName?.message}
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Tefefone
            </InputLabel>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
                  mask="(99) 99999-9999"
                  maskChar={null}
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      size="small"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                    />
                  )}
                </InputMask>
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Endereço
            </InputLabel>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address?.message}
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
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Ponto de referência
            </InputLabel>
            <Controller
              name="referencePoint"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.referencePoint}
                  helperText={errors.referencePoint?.message}
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
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Observação Geral
            </InputLabel>
            <Controller
              name="observation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  error={!!errors.observation}
                  helperText={errors.observation?.message}
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
            />
          </Grid2>
          <Box
            sx={{
              maxHeight: isMobile ? 350 : 190,
              overflowY: "auto",
              pr: 1,
              width: "100%",
            }}
          >
            {services.map((service, index) => (
              <React.Fragment key={service.id}>
                <Grid2 container spacing={2} sx={{ mb: 2 }}>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <InputLabel
                      sx={{
                        color: "#AC42F7",
                        pb: 0.5,
                        pl: 0.3,
                        fontWeight: 600,
                      }}
                    >
                      Valor
                    </InputLabel>
                    <Controller
                      name={`services[${index}].value`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          size="small"
                          error={!!errors?.services?.[index]?.value}
                          helperText={errors?.services?.[index]?.value?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            handleServiceChange(index, "value", e.target.value);
                          }}
                        />
                      )}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 8 }}>
                    <InputLabel
                      sx={{
                        color: "#AC42F7",
                        pb: 0.5,
                        pl: 0.3,
                        fontWeight: 600,
                      }}
                    >
                      Serviço
                    </InputLabel>
                    <Controller
                      name={`services.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={service.name}
                          error={!!errors?.services?.[index]?.name}
                          helperText={errors?.services?.[index]?.name?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#fff",
                              borderRadius: 2,
                            },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            const selected = dataEstablishment[0].services.find(
                              (s) => s.name === e.target.value
                            );
                            handleServiceChange(
                              index,
                              "name",
                              selected?.name || ""
                            );
                            handleServiceChange(
                              index,
                              "value",
                              selected?.price || ""
                            );
                          }}
                        >
                          {dataEstablishment[0]?.services?.map((srv) => (
                            <MenuItem key={srv._id} value={srv.name}>
                              {srv.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: services.length > 1 ? 8 : 12 }}>
                    <InputLabel
                      sx={{
                        color: "#AC42F7",
                        pb: 0.5,
                        pl: 0.3,
                        fontWeight: 600,
                      }}
                    >
                      Observação
                    </InputLabel>
                    <Controller
                      name={`services[${index}].observation`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
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
                          onChange={(e) => {
                            field.onChange(e);
                            handleServiceChange(
                              index,
                              "observation",
                              e.target.value
                            );
                          }}
                        />
                      )}
                    />
                  </Grid2>

                  {services.length > 1 && (
                    <Grid2 sx={{ pt: 4 }} size={{ xs: 12, sm: 4 }}>
                      <Button
                        color="error"
                        size="small"
                        variant="outlined"
                        onClick={() => handleRemoveService(service.id)}
                        sx={{
                          background: "#D32F2F",
                          color: "#FFF",
                          borderColor: "#FFF",
                          borderRadius: 3,
                          padding: "8px 24px",
                          fontSize: "0.5rem",
                          fontWeight: "bold",
                          "& .MuiCircularProgress-root": {
                            color: "#ffffff",
                          },
                        }}
                      >
                        Remover serviço
                      </Button>
                    </Grid2>
                  )}
                </Grid2>
              </React.Fragment>
            ))}
          </Box>
        </Grid2>
        <Grid2
          size={{
            xs: 12,
            sm: 4,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={handleAddService}
            sx={{
              background: "#ac42f7",
              color: "#FFF",
              borderColor: "#FFF",
              borderRadius: 3,
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
        </Grid2>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 5 }}
        >
          <BlobProvider
            document={
              <BudgetDocument
                establishmentName={establishmentName}
                phone={phone}
                clientName={clientName}
                date={date}
                dateValidate={dateValidate}
                deliveryDate={deliveryDate}
                description={serviceDescription}
                services={services}
                total={value}
              />
            }
          >
            {({ blob, url }) => (
              <>
                <Button
                  variant="outlined"
                  onClick={() => window.open(url, "_blank")}
                  sx={{
                    background: "#ffffff",
                    color: "#ac42f7",
                    borderColor: "#ac42f7",
                    borderRadius: 3,
                    padding: "8px 24px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    "& .MuiCircularProgress-root": {
                      color: "#ac42f7",
                    },
                  }}
                >
                  Visualizar orçamento
                </Button>
                <Button
                  variant="contained"
                  isLoading={isLoading}
                  onClick={handleSubmit((data) => onSubmit(data, blob))}
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
              </>
            )}
          </BlobProvider>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewBudgets;
