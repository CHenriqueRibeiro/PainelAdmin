// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
  Skeleton,
  TextField,
  IconButton,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import HourglassFullRoundedIcon from "@mui/icons-material/HourglassFullRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LocalCarWashRoundedIcon from "@mui/icons-material/LocalCarWashRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";

const ScheduledServices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogStatus, setOpenDialogStatus] = useState(false);
  const [openDialogScheduling, setOpenDialogScheduling] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newSelectedStatus, setNewSelectedStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem("authToken");
  //const OwnerUser = JSON.parse(localStorage.getItem("user"));
  const fetchEstablishments = async () => {
    try {
      const response = await fetch(
        "https://backlavaja.onrender.com/api/appointments/appointments/67d64cec87b9bd7f27e2dd8c",
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
      console.log(data);
      setDataEstablishment(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEstablishments();
  }, [loading]);
  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };
  const handleOpenDialogStatus = () => {
    setOpenDialogStatus(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };
  const handleCloseDialogStatus = () => {
    setOpenDialogStatus(false);
  };
  const handleCloseDialogScheduling = () => {
    setOpenDialogScheduling(false);
  };
  const handleOpenDialogScheduling = () => {
    setOpenDialogScheduling(true);
  };
  const handleSave = () => {
    console.log("Salvar alterações para o agendamento", selectedAppointment);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [isTokenValid]);

  const handleChipClick = (status) => {
    setCurrentStatus(status);
    setNewSelectedStatus("");
    setOpenDialogStatus(true);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Entregue":
        return "success";
      case "Aguardando cliente":
        return "warning";
      case "Cancelado":
        return "error";
      case "Iniciado":
        return "info";
      case "Agendado":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedAppointments = useMemo(() => {
    if (!sortKey) return dataEstablishment;

    return [...dataEstablishment].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [sortKey, sortOrder]);

  return (
    <Box
      sx={{
        width: "95%",
        height: "auto",
        maxHeight: "35rem",
        mt: 5,
        background: "#f9f5ff",
        borderRadius: 5,
        p: 2,
        mb: 3,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
          pr: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#AC42F7">
          Agendamentos
        </Typography>
        <Tooltip title="Adicionar agendamento" arrow>
          <IconButton onClick={handleOpenDialogScheduling}>
            <AddRoundedIcon color="#D49EF5" />
          </IconButton>
        </Tooltip>
      </Box>

      {!isMobile && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1fr 1fr 1.5fr 1fr 0.5fr 0.46fr",
            alignItems: "center",
            pb: 1,
            borderBottom: "1px solid #ddd",
            color: "#ac42f7",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="start"
          >
            <AccountCircleRoundedIcon fontSize="small" />
            <Typography variant="body2">Nome</Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSort("time")}
          >
            <WatchLaterRoundedIcon fontSize="small" />
            <Typography variant="body2">Hora</Typography>
            {sortKey === "time" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <DriveEtaRoundedIcon fontSize="small" />
            <Typography variant="body2">Veículo</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <LocalCarWashRoundedIcon fontSize="small" />
            <Typography variant="body2">Serviço</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSort("status")}
          >
            <HourglassFullRoundedIcon fontSize="small" />
            <Typography variant="body2">Status</Typography>
            {sortKey === "status" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="end"
            sx={{ cursor: "pointer", pr: 2 }}
            onClick={() => handleSort("value")}
          >
            <MonetizationOnRoundedIcon fontSize="small" />
            <Typography variant="body2">Valor</Typography>
            {sortKey === "value" &&
              (sortOrder === "asc" ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              ))}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            justifyContent="center"
          >
            <SettingsRoundedIcon fontSize="small" />
          </Box>
        </Box>
      )}
      <Box
        sx={{
          overflow: "auto",
          maxHeight: isMobile ? "30rem" : "40rem",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "0.6fr 0fr 1fr 0.4fr 0.8fr 0.6fr 0.4fr",
              alignItems: "center",
              py: 1,
              borderBottom: "1px solid #f0f0f0",
              color: "#6a1b9a",
              textAlign: isMobile ? "left" : "center",
            }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="100%" />
          </Box>
        ) : (
          sortedAppointments.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "0.8fr 1fr 1fr 1.5fr 1fr 0.44fr 0.46fr",
                alignItems: "center",
                py: 1,
                borderBottom: isMobile
                  ? "3px solid #f0f0f0"
                  : "1px solid #f0f0f0",
                color: "#6a1b9a",
                textAlign: isMobile ? "left" : "center",
              }}
            >
              {isMobile ? (
                <>
                  <Box
                    gap={1.2}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      gap={1.2}
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      width={"75%"}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        Nome: {item?.clientName}
                      </Typography>
                      <Typography variant="body2">
                        Hora: {item?.startTime}
                      </Typography>
                      <Typography variant="body2">
                        Veículo: {item?.veiculo}
                      </Typography>
                      <Typography variant="body2">
                        Serviço: {item?.service}
                      </Typography>
                      <Typography variant="body2">
                        Status:{" "}
                        <Chip
                          variant="outlined"
                          size="small"
                          label={item.status}
                          color={getStatusColor(item.status)}
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleChipClick(item.status)}
                        />
                      </Typography>
                      <Typography variant="body2">
                        Valor: R$ {item?.price}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{ color: "#AC42F7", pr: 3 }}
                    >
                      <Tooltip title="Editar agendamento" arrow>
                        <MoreVertRoundedIcon />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    textAlign={"start"}
                  >
                    {item?.clientName}
                  </Typography>
                  <Typography variant="body2">{item?.startTime}</Typography>
                  <Typography variant="body2">{item?.veiculo}</Typography>
                  <Typography variant="body2">{item?.serviceName}</Typography>
                  <Chip
                    variant="outlined"
                    size="small"
                    label={item?.status}
                    color={getStatusColor(item?.status)}
                    onClick={() => handleOpenDialogStatus(item?.status)}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    R$ {item?.price}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(item)}
                    sx={{ color: "#AC42F7" }}
                  >
                    <Tooltip title="Editar agendamento" arrow>
                      <MoreVertRoundedIcon />
                    </Tooltip>
                  </IconButton>
                </>
              )}
            </Box>
          ))
        )}
      </Box>

      <Dialog
        open={openDialogStatus}
        onClose={handleCloseDialogStatus}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
            borderRadius: 3,
            p: 1,
            color: "#FFFFFF",
          },
        }}
      >
        <DialogTitle>Atualizar status</DialogTitle>
        <DialogContent>
          <Typography>
            De: <strong>{currentStatus}</strong>
          </Typography>
          <Divider sx={{ my: 1, background: "#FFFFFF" }} />
          <Typography>Para:</Typography>
          <Box sx={{ mt: 2 }}>
            {[
              "Entregue",
              "Aguardando cliente",
              "Cancelado",
              "Iniciado",
              "Agendado",
            ]
              .filter((status) => status !== currentStatus)
              .map((status) => (
                <Chip
                  key={status}
                  label={status}
                  color={getStatusColor(status)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    cursor: "pointer",
                    border:
                      newSelectedStatus === status ? "2px solid #FFF" : "none",
                  }}
                  onClick={() => setNewSelectedStatus(status)}
                />
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCloseDialogStatus}
            sx={{
              background: "#FFF",
              color: "#ac42f7",
              borderColor: "#FFF",
            }}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenDialogStatus(false)}
            sx={{
              color: "#FFF",
              background: "#ac42f7",
              borderColor: "#ac42f7",
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
        >
          Editar Agendamento
        </DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <>
              <TextField
                size="small"
                fullWidth
                label="Nome do Cliente"
                value={selectedAppointment.clientName}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    clientName: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  mt: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                size="small"
                fullWidth
                label="Hora"
                value={selectedAppointment.startTime}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    startTime: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                size="small"
                fullWidth
                label="Veículo"
                value={selectedAppointment.veiculo}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    veiculo: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                size="small"
                fullWidth
                label="Serviço"
                value={selectedAppointment.serviceName}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    serviceName: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                size="small"
                fullWidth
                label="Valor"
                value={selectedAppointment.price}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    price: e.target.value,
                  })
                }
                sx={{
                  mb: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#red",
              },
            }}
          >
            Excluir agendamento
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#7209b7",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#5a0990",
              },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogScheduling}
        onClose={handleCloseDialogScheduling}
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
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
        >
          Cadastrar Agendamento
        </DialogTitle>
        <DialogContent>
          <>
            <TextField
              size="small"
              fullWidth
              label="Nome do Cliente"
              sx={{
                mb: 2,
                mt: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              size="small"
              fullWidth
              label="Hora"
              sx={{
                mb: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              size="small"
              fullWidth
              label="Veículo"
              sx={{
                mb: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              size="small"
              fullWidth
              label="Serviço"
              sx={{
                mb: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              size="small"
              fullWidth
              label="Valor"
              sx={{
                mb: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialogScheduling}
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCloseDialogScheduling}
            variant="contained"
            sx={{
              backgroundColor: "#7209b7",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#5a0990",
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

export default ScheduledServices;
