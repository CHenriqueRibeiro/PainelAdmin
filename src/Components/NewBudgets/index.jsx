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
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
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

dayjs.extend(isSameOrAfter);

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
  dateValidate: yup
    .string()
    .required("Campo obrigatório")
    .test(
      "is-after-date",
      "Validade não pode ser menor que a data do orçamento",
      function (value) {
        const { date } = this.parent;
        if (!value || !date) return true;
        return dayjs(value).isSameOrAfter(dayjs(date), "day");
      }
    ),
  deliveryDate: yup
    .string()
    .required("Campo obrigatório")
    .test(
      "is-after-date",
      "Entrega não pode ser menor que a data do orçamento",
      function (value) {
        const { date } = this.parent;
        if (!value || !date) return true;
        return dayjs(value).isSameOrAfter(dayjs(date), "day");
      }
    ),
  observation: yup.string(),
  address: yup.string().required("Campo obrigatório"),
  referencePoint: yup.string(),
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
}) => {
  const totalAmount = services.reduce(
    (acc, item) => acc + parseFloat(item.value || 0),
    0
  );

  return (
    <Document>
      <Page
        size="A4"
        style={{
          padding: 40,
          fontFamily: "Helvetica",
          fontSize: 10,
          lineHeight: 1.4,
          position: "relative",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            {establishmentName}
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Cliente: </Text>
            {clientName}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Telefone: </Text>
            {phone}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Endereço: </Text>
            {address}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Ponto de referência: </Text>
            {referencePoint ? referencePoint : "Não informado"}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Veículo: </Text>
            {plate} | {brand} | {model} | {year}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Entrega do serviço: </Text>
            {dayjs(deliveryDate).format("DD/MM/YYYY")}
          </Text>
        </View>

        <View style={{ marginTop: 10, borderWidth: 1, borderColor: "#ccc" }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#f5f5f5",
              padding: 5,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ width: "10%", fontWeight: "bold" }}>Nº</Text>
            <Text style={{ width: "55%", fontWeight: "bold" }}>Descrição</Text>
            <Text
              style={{ width: "35%", fontWeight: "bold", textAlign: "right" }}
            >
              Valor
            </Text>
          </View>

          {services.map((s, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                padding: 5,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text style={{ width: "10%" }}>{i + 1}</Text>
              <Text style={{ width: "55%" }}>
                {s.name}
                {s.observation ? ` - ${s.observation}` : ""}
              </Text>
              <Text style={{ width: "35%", textAlign: "right" }}>
                R$ {Number(s.value).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {observation && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Observações:</Text>
            {serviceDescription && <Text>{serviceDescription}</Text>}
            {observation && <Text>{observation}</Text>}
          </View>
        )}

        <View style={{ marginTop: 10, alignItems: "flex-end" }}>
          <View
            style={{
              backgroundColor: "#000",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "#fff" }}>
              Total: R$ {totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 100,
            left: 40,
            right: 40,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10, marginBottom: 10 }}>
            ___________________________________________
          </Text>
          <Text style={{ fontSize: 10 }}>Assinatura do Cliente</Text>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            right: 40,
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 1,
              backgroundColor: "#000",
              width: "100%",
              marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 9 }}>
            Este orçamento foi criado em {dayjs(date).format("DD/MM/YYYY")} e é
            válido até {dayjs(dateValidate).format("DD/MM/YYYY")}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const NewBudgets = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [dateValidate, setDateValidate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [deliveryDate, setDeliveryDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [services, setServices] = useState([
    { id: uuidv4(), name: "", value: "", observation: "" },
  ]);
  const [value, setValue] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const establishmentName = dataEstablishment[0]?.nameEstablishment;
  const handleServiceChange = (index, field, fieldValue) => {
    const updated = [...services];
    updated[index][field] = field === "value" ? Number(fieldValue) : fieldValue;
    setServices(updated);
    setFormValue("services", updated, { shouldValidate: true });
    const total = updated.reduce((sum, s) => sum + Number(s.value || 0), 0);
    setValue(total);
  };
  const {
    control,
    handleSubmit,
    setValue: setFormValue,
    reset,
    formState: { errors },
    getValues,
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
  const formValues = getValues();
  const handleAddService = () => {
    const updated = [
      ...services,
      { id: uuidv4(), name: "", value: "", observation: "" },
    ];
    setServices(updated);
    setFormValue("services", updated, { shouldValidate: true });
  };

  const handleRemoveService = (id) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    setFormValue("services", updated, { shouldValidate: true });
  };
  const onSubmit = async (data, blob) => {
    setIsLoadingButton(true);
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
      setIsLoadingButton(false);
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
          maxHeight: isMobile ? "110rem" : "60rem",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#AC42F7">
          Novo Orçamento
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid2 container spacing={1.5}>
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
                      const formatted =
                        newValue && newValue.isValid()
                          ? newValue.format("YYYY-MM-DD")
                          : "";
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
                      const formatted =
                        newValue && newValue.isValid()
                          ? newValue.format("YYYY-MM-DD")
                          : "";
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
                      const formatted =
                        newValue && newValue.isValid()
                          ? newValue.format("YYYY-MM-DD")
                          : "";
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
                <InputMask
                  mask="9999"
                  value={field.value || ""}
                  onChange={field.onChange}
                  maskChar={null}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      type="text"
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
                </InputMask>
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
                  <Grid2 size={{ xs: 12, sm: 3 }}>
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
                  <Grid2 size={{ xs: 12, sm: 1.5 }}>
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
                  <Grid2 size={{ xs: 12, sm: services.length > 1 ? 5 : 7.5 }}>
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
                    <Grid2 sx={{ pt: 4 }} size={{ xs: 12, sm: 2 }}>
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
                phone={formValues.phone}
                clientName={formValues.clientName}
                date={formValues.date}
                dateValidate={formValues.dateValidate}
                deliveryDate={formValues.deliveryDate}
                description={formValues.serviceDescription}
                services={formValues.services}
                total={formValues.value}
                address={formValues.address}
                referencePoint={formValues.referencePoint}
                plate={formValues.plate}
                brand={formValues.brand}
                model={formValues.model}
                year={formValues.year}
                observation={formValues.observation}
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
                <LoadingButton
                  loading={isLoadingButton}
                  variant="contained"
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
                    "&:hover": { background: "#9a2dcf" },
                  }}
                >
                  Salvar
                </LoadingButton>
              </>
            )}
          </BlobProvider>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewBudgets;
