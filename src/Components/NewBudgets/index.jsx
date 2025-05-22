/* eslint-disable react/prop-types */
import React, { useState } from "react";
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

const BudgetDocument = ({
  establishmentName,
  title,
  clientName,
  phone,
  date,
  dateValidate,
  deliveryDate,
  description,
  services,
  total,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>{establishmentName}</Text>
        <Text style={styles.titleRight}>Orçamento {title}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.section}>Cliente: {clientName}</Text>
        <Text style={styles.section}>Telefone: {phone}</Text>
        <Text style={styles.section}>
          Data: {dayjs(date).format("DD/MM/YYYY")}
        </Text>
        <Text style={styles.section}>
          Validade do orçamento: {dayjs(dateValidate).format("DD/MM/YYYY")}
        </Text>
        <Text style={styles.section}>
          Entrega prevista: {dayjs(deliveryDate).format("DD/MM/YYYY")}
        </Text>
        <Text style={styles.section}>Observações gerais: {description}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColDesc}>Descrição</Text>
          <Text style={styles.tableColValue}>Valor</Text>
        </View>
        {services.map((s, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableColDesc}>
              {s.name}
              {s.observation ? ` - ${s.observation}` : ""}
            </Text>
            <Text style={styles.tableColValue}>
              R$ {Number(s.value).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.totalBlock}>
        Total: R$ {Number(total).toFixed(2)}
      </Text>

      <Text style={styles.footer}>
        * Este orçamento possui uma validade descrita acima. Em caso de
        alterações poderá haver custos adicionais.
      </Text>
    </Page>
  </Document>
);

const NewBudgets = ({ dataEstablishment, setEstablishment = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("authToken");
  const [title, setTitle] = useState("");
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
    { name: "", value: "", observation: "" },
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

  const handleAddService = () => {
    setServices([...services, { name: "", value: "", observation: "" }]);
  };

  const handleRemoveService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
    const total = updated.reduce((sum, s) => sum + Number(s.value || 0), 0);
    setValue(total);
  };

  const handleSubmit = async (blob) => {
    const payload = {
      phone,
      title,
      clientName,
      date,
      dateValidate,
      deliveryDate,
      value,
      services,
      serviceDescription,
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

      setTitle("");
      setPhone("");
      setClientName("");
      setDate(dayjs().format("YYYY-MM-DD"));
      setDeliveryDate(dayjs().format("YYYY-MM-DD"));
      setDateValidate(dayjs().format("YYYY-MM-DD"));
      setServiceDescription("");
      setServices([{ name: "", value: "", observation: "" }]);
      setValue(0);
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
          maxHeight: isMobile ? "80rem" : "45rem",
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
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={
                ptBR.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                format="DD/MM/YYYY"
                value={dayjs(date)}
                onChange={(newValue) =>
                  newValue && setDate(newValue.format("YYYY-MM-DD"))
                }
                sx={{ background: "#FFFFFF" }}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Validade do orçamento
            </InputLabel>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={
                ptBR.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                format="DD/MM/YYYY"
                value={dayjs(dateValidate)}
                onChange={(newValue) =>
                  newValue && setDateValidate(newValue.format("YYYY-MM-DD"))
                }
                sx={{ background: "#FFFFFF" }}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Entrega do serviço
            </InputLabel>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
              localeText={
                ptBR.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                format="DD/MM/YYYY"
                value={dayjs(deliveryDate)}
                onChange={(newValue) =>
                  newValue && setDeliveryDate(newValue.format("YYYY-MM-DD"))
                }
                sx={{ background: "#FFFFFF" }}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Cliente
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Tefefone
            </InputLabel>

            <InputMask
              mask="(99) 99999-9999"
              value={phone}
              maskChar={null}
              onChange={(e) => setPhone(e.target.value)}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
              )}
            </InputMask>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Título
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <InputLabel
              sx={{ color: "#AC42F7", pb: 0.5, pl: 0.3, fontWeight: 600 }}
            >
              Observação Geral
            </InputLabel>
            <TextField
              fullWidth
              size="small"
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
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
              <React.Fragment key={index}>
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
                    <TextField
                      fullWidth
                      type="number"
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                      value={service.value}
                      onChange={(e) =>
                        handleServiceChange(index, "value", e.target.value)
                      }
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
                    <TextField
                      select
                      fullWidth
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                      value={service.name}
                      onChange={(e) => {
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
                    <TextField
                      fullWidth
                      size="small"
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                      value={service.observation}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "observation",
                          e.target.value
                        )
                      }
                    />
                  </Grid2>
                  {services.length > 1 && (
                    <Grid2 sx={{ pt: 4 }} size={{ xs: 12, sm: 4 }}>
                      <Button
                        color="error"
                        size="small"
                        variant="outlined"
                        onClick={() => handleRemoveService(index)}
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
                title={title}
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
                  onClick={() => handleSubmit(blob)}
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
