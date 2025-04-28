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
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const ScheduledData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataEstablishment, setDataEstablishment] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const { isTokenValid } = useAuth();
  const navigate = useNavigate();
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
  useEffect(() => {
    fetchEstablishments();
  }, []);

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [isTokenValid]);

  const fetchEstablishments = async () => {
    const ownerId = OwnerUser.id;
    if (!ownerId || !token) return;

    try {
      const response = await fetch(
        `https://backlavaja.onrender.com/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar estabelecimentos");

      const data = await response.json();
      setDataEstablishment(data.establishments);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const renderSkeleton = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#AC42F7">
          Estabelecimento
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid2 container spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Grid2 key={index} xs={12} sm={4}>
            <Skeleton variant="text" width="80%" height={25} />
          </Grid2>
        ))}
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
    const establishmentData = {
      nameEstablishment,
      address: addressData,
      openingHours: {
        open: openingTime,
        close: closingTime,
      },
      paymentMethods,
      hasLunchBreak,
      owner: OwnerUser.id,
    };

    try {
      const response = await fetch(
        "https://backlavaja.onrender.com/api/establishment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(establishmentData),
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar estabelecimento");

      const data = await response.json();
      console.log("Estabelecimento salvo com sucesso:", data);
      handleCloseDialog();
      fetchEstablishments();
    } catch (error) {
      console.error("Erro:", error);
    }
  };
  const establishment = dataEstablishment[0];

  return (
    <Box sx={{ width: "95%", mt: 5, mb: 3 }}>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 4, background: "#f9f5ff" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#AC42F7">
            Estabelecimento
          </Typography>

          <Tooltip title="Adicionar Estabelecimento">
            <IconButton onClick={handleOpenDialog}>
              <AddRoundedIcon sx={{ color: "#AC42F7" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {dataEstablishment.length > 0 ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={6}>
                <Typography color="#AC42F7">
                  <strong>Nome:</strong> {establishment.nameEstablishment}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Typography color="#AC42F7">
                  <strong>Endereço:</strong> {establishment.address.street}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Typography color="#AC42F7">
                  <strong>Número:</strong> {establishment.address.number}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={4}>
                <Typography color="#AC42F7">
                  <strong>Bairro:</strong> {establishment.address.neighborhood}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={4}>
                <Typography color="#AC42F7">
                  <strong>Cidade:</strong> {establishment.address.city}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={4}>
                <Typography color="#AC42F7">
                  <strong>Estado:</strong> {establishment.address.state}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Typography color="#AC42F7">
                  <strong>Hora de abertura:</strong>{" "}
                  {establishment.openingHours.open}
                </Typography>
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <Typography color="#AC42F7">
                  <strong>Hora de encerramento:</strong>{" "}
                  {establishment.openingHours.close}
                </Typography>
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
          Novo Estabelecimento
        </DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Nome do Estabelecimento"
                fullWidth
                size="small"
                value={nameEstablishment}
                onChange={(e) => setNameEstablishment(e.target.value)}
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Formas de Pagamento"
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
                  mb: 2,
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
            <Grid2 size={{ xs: 8 }}>
              <TextField
                label="CEP"
                fullWidth
                size="small"
                value={addressData.cep}
                onChange={(e) =>
                  setAddressData({ ...addressData, cep: e.target.value })
                }
                onBlur={handleSearchCep}
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 4 }}>
              <Button
                onClick={handleSearchCep}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#AC42F7",
                  color: "#AC42F7",
                  height: "40px",
                  "&:hover": { borderColor: "#8a2be2", background: "#f9f5ff" },
                }}
              >
                Buscar CEP
              </Button>
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
                  mb: 2,
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
                  mb: 2,
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
                  mb: 2,
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
                  mb: 2,
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
                  mb: 2,
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
              <TextField
                label="Horário de Abertura"
                type="time"
                fullWidth
                size="small"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 6 }}>
              <TextField
                label="Horário de Encerramento"
                type="time"
                fullWidth
                size="small"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hasLunchBreak}
                    onChange={(e) => setHasLunchBreak(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#AC42F7",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#AC42F7",
                        },
                    }}
                  />
                }
                label="Intervalo de Almoço"
                sx={{ color: "#AC42F7" }}
              />
            </Grid2>

            {hasLunchBreak && (
              <>
                <Grid2 size={{ xs: 6 }}>
                  <TextField
                    label="Início do Almoço"
                    type="time"
                    fullWidth
                    size="small"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      mb: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6 }}>
                  <TextField
                    label="Fim do Almoço"
                    type="time"
                    fullWidth
                    size="small"
                    value={lunchEnd}
                    onChange={(e) => setLunchEnd(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      mb: 2,
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

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: "#AC42F7",
              color: "#AC42F7",
              "&:hover": { borderColor: "#8a2be2", background: "#f9f5ff" },
            }}
          >
            Cancelar
          </Button>
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
