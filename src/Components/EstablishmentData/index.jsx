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
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import InputMask from "react-input-mask";
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

  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));
  const [nameEstablishment, setNameEstablishment] = useState("");
  const [lunchStart, setLunchStart] = useState("");
  const [lunchEnd, setLunchEnd] = useState("");

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
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [hasLunchBreak, setHasLunchBreak] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  const handleEditEstablishment = (establishment) => {
    setIsEditing(true);
    setEditEstablishmentId(establishment._id);
    setNameEstablishment(establishment.nameEstablishment || "");
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
    setOpeningTime(establishment.openingHours?.open || "");
    setClosingTime(establishment.openingHours?.close || "");
    setHasLunchBreak(establishment.openingHours?.hasLunchBreak || false);
    setLunchStart(establishment.openingHours?.intervalOpen || "");
    setLunchEnd(establishment.openingHours?.intervalClose || "");
    setPaymentMethods(establishment.paymentMethods || []);

    setOpenDialog(true);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setIsEditing(false);
    setEditEstablishmentId(null);
    setNameEstablishment("");
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
    setOpeningTime("");
    setClosingTime("");
    setHasLunchBreak(false);
    setLunchStart("");
    setLunchEnd("");
    setPaymentMethods([]);
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
      setAddressData({
        cep: data.cep || "",
        street: data.street || "",
        number: "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        latitude: data.location?.coordinates?.latitude || "",
        longitude: data.location?.coordinates?.longitude || "",
      });
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };
  if (isLoading) {
    return <Box sx={{ width: "95%", mt: 5, mb: 3 }}>{renderSkeleton()}</Box>;
  }
  const handleSaveEstablishment = async () => {
    let latitude = addressData.latitude;
    let longitude = addressData.longitude;

    if (addressData.cep !== originalCep) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cep/v2/${addressData.cep}`
        );
        if (response.ok) {
          const data = await response.json();
          latitude = data.location?.coordinates?.latitude || "";
          longitude = data.location?.coordinates?.longitude || "";
        } else {
          console.error("Erro ao buscar localização pelo novo CEP");
        }
      } catch (error) {
        console.error("Erro ao buscar novo CEP:", error);
      }
    }

    const establishmentData = {
      nameEstablishment,
      address: {
        ...addressData,
        latitude,
        longitude,
      },
      openingHours: {
        open: openingTime,
        close: closingTime,
        hasLunchBreak: hasLunchBreak,
        intervalOpen: lunchStart,
        intervalClose: lunchEnd,
      },
      paymentMethods,
      workingDays,
      owner: OwnerUser.id,
    };

    try {
      const url = isEditing
        ? `https://backlavaja.onrender.com/api/establishment/establishment/${editEstablishmentId}`
        : "https://backlavaja.onrender.com/api/establishment/create";

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

      handleCloseDialog();
    } catch (error) {
      console.error("Erro:", error);
    }
  };
  const handleDeleteEstablishment = async () => {
    try {
      const url = `https://backlavaja.onrender.com/api/establishment/establishment/${editEstablishmentId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar estabelecimento");

      setOpenDialog(false);
      setEstablishment((prev) => !prev);
      setService((prev) => !prev);
      handleCloseDialog();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const establishment = dataEstablishment[0];

  return (
    <Box sx={{ width: "95%", mt: 5, mb: 3 }}>
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
          <Typography color="textSecondary">
            Cadastre um estabelecimento para começar a receber agendamentos.
          </Typography>
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

        <DialogContent>
          <Grid2 container spacing={1.5} sx={{ mt: 2 }}>
            <Grid2 size={{ xs: 12 }}>
              <InputLabel
                sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
              >
                Nome do Estabelecimento
              </InputLabel>
              <TextField
                fullWidth
                size="small"
                value={nameEstablishment}
                onChange={(e) => setNameEstablishment(e.target.value)}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                select
                fullWidth
                size="small"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                select
                fullWidth
                size="small"
                value={paymentMethods}
                onChange={(e) => setPaymentMethods(e.target.value)}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                sx={{
                  color: "#FFFFFF",
                  pb: 0.5,
                  pl: 0.3,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Endereço
              </InputLabel>
              <Grid2 container spacing={2}>
                <Grid2 size={8}>
                  <InputMask
                    mask="99999-999"
                    value={addressData.cep}
                    maskChar={null}
                    onChange={(e) =>
                      setAddressData({ ...addressData, cep: e.target.value })
                    }
                    onBlur={handleSearchCep}
                  >
                    {(inputProps) => (
                      <TextField
                        label="CEP"
                        {...inputProps}
                        size="small"
                        fullWidth
                        sx={{
                          bgcolor: "#fff",
                          borderRadius: 2,
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
                      height: "100%",
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

            <Grid2 size={{ xs: 8 }}>
              <TextField
                label="Rua"
                fullWidth
                size="small"
                value={addressData.street}
                onChange={(e) =>
                  setAddressData({ ...addressData, street: e.target.value })
                }
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 4 }}>
              <TextField
                label="Número"
                fullWidth
                size="small"
                value={addressData.number}
                onChange={(e) =>
                  setAddressData({ ...addressData, number: e.target.value })
                }
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 8 }}>
              <TextField
                label="Complemento"
                fullWidth
                size="small"
                value={addressData.complement}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    complement: e.target.value,
                  })
                }
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 4 }}>
              <TextField
                label="Bairro"
                fullWidth
                size="small"
                value={addressData.neighborhood}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    neighborhood: e.target.value,
                  })
                }
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 8 }}>
              <TextField
                label="Cidade"
                fullWidth
                size="small"
                value={addressData.city}
                onChange={(e) =>
                  setAddressData({ ...addressData, city: e.target.value })
                }
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 4 }}>
              <TextField
                label="Estado"
                fullWidth
                size="small"
                value={addressData.state}
                onChange={(e) =>
                  setAddressData({ ...addressData, state: e.target.value })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 6 }}>
              <InputLabel
                sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
              >
                Horário de Abertura
              </InputLabel>
              <TextField
                type="time"
                fullWidth
                size="small"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 6 }}>
              <InputLabel
                sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
              >
                Horário de Fechamento
              </InputLabel>
              <TextField
                type="time"
                fullWidth
                size="small"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 container alignItems="center" size={{ xs: 12 }} pl={1}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={hasLunchBreak}
                    onChange={(e) => setHasLunchBreak(e.target.checked)}
                  />
                }
                label="Possui intervalo entre horario de funcionamento?"
              />
            </Grid2>

            {hasLunchBreak && (
              <>
                <Grid2 size={{ xs: 6 }}>
                  <InputLabel
                    sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                  >
                    Início do Intervalo
                  </InputLabel>
                  <TextField
                    type="time"
                    fullWidth
                    size="small"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6 }}>
                  <InputLabel
                    sx={{ color: "#FFFFFF", pb: 0.5, pl: 0.3, fontWeight: 600 }}
                  >
                    Fim do Intervalo
                  </InputLabel>
                  <TextField
                    type="time"
                    fullWidth
                    size="small"
                    value={lunchEnd}
                    onChange={(e) => setLunchEnd(e.target.value)}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
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
              borderColor: "#AC42F7",
              color: "#AC42F7",
              "&:hover": { borderColor: "#8a2be2", background: "#f9f5ff" },
            }}
          >
            Cancelar
          </Button>
          {isEditing && (
            <Button
              variant="contained"
              onClick={handleDeleteEstablishment}
              color="error"
            >
              Excluir
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSaveEstablishment}
            sx={{
              background: "#AC42F7",
              color: "#fff",
              "&:hover": { background: "#8a2be2" },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledData;
