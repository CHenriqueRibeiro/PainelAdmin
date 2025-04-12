// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import HourglassFullRoundedIcon from "@mui/icons-material/HourglassFullRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LocalCarWashRoundedIcon from "@mui/icons-material/LocalCarWashRounded";
const mockAppointments = [
  {
    id: 1,
    clientName: "João Silva",
    time: "09:30",
    vehicle: "Fiat Uno - ABC1D23",
    status: "Entregue",
    service: "Combo simples",
    value: 50,
  },
  {
    id: 2,
    clientName: "Maria Oliveira",
    time: "11:00",
    vehicle: "Honda Civic - XYZ4E56",
    service: "Combo simples",
    status: "Aguardando cliente",
    value: 70,
  },
  {
    id: 3,
    clientName: "Carlos Lima",
    time: "13:45",
    vehicle: "Ford Ka - GHI7J89",
    service: "Lavagem completa",
    status: "Iniciado",
    value: 40,
  },
  {
    id: 4,
    clientName: "Henrique",
    time: "13:00",
    vehicle: "Ford Focus- FHK7L99",
    service: "Lavagem simples",
    status: "Cancelado",
    value: 40,
  },
  {
    id: 5,
    clientName: "Ana",
    time: "16:00",
    vehicle: "Ford Ranger- FHK7L99",
    service: "Combo completo",
    status: "Na fila",
    value: 40,
  },
];
const ScheduledServices = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [newSelectedStatus, setNewSelectedStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const handleChipClick = (status) => {
    setCurrentStatus(status);
    setNewSelectedStatus("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      case "Na fila":
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
    if (!sortKey) return mockAppointments;

    return [...mockAppointments].sort((a, b) => {
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
        mt: 5,
        background: "#f9f5ff",
        borderRadius: 5,
        p: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2} color="#AC42F7">
        Agendamentos
      </Typography>
      {!isMobile && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 2fr 1.5fr 1.5fr 1fr",
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
        </Box>
      )}

      {sortedAppointments.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1fr 1fr 2fr 1.5fr 1.5fr 1fr",
            alignItems: "center",
            py: 1,
            borderBottom: isMobile
              ? "2px solid #6a1b9a"
              : " 1.5px   solid #f0f0f0",
            color: "#6a1b9a",
            textAlign: isMobile ? "left" : "center",
          }}
        >
          {isMobile ? (
            <>
              <Box
                gap={1.2}
                display="flex"
                flexDirection="column"
                alignItems="start"
              >
                <Typography variant="body2" fontWeight={500}>
                  Nome: {item.clientName}
                </Typography>
                <Typography variant="body2">Hora: {item.time}</Typography>
                <Typography variant="body2">Veículo: {item.vehicle}</Typography>
                <Typography variant="body2">Serviço: {item.service}</Typography>
                <Typography variant="body2">
                  Status:{" "}
                  <Chip
                    size="small"
                    label={item.status}
                    color={getStatusColor(item.status)}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleChipClick(item.status)}
                  />
                </Typography>
                <Typography variant="body2">
                  Valor: R$ {item.value.toFixed(2).replace(".", ",")}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ textAlign: "left" }}
              >
                {item.clientName}
              </Typography>
              <Typography variant="body2">{item.time}</Typography>
              <Typography variant="body2">{item.vehicle}</Typography>
              <Typography variant="body2">{item.service}</Typography>
              <Tooltip title="Clique para alterar o status" arrow>
                <Chip
                  size="small"
                  label={item.status}
                  color={getStatusColor(item.status)}
                  sx={{ justifySelf: "center", cursor: "pointer" }}
                  onClick={() => handleChipClick(item.status)}
                />
              </Tooltip>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ textAlign: "right", pr: 2 }}
              >
                R$ {item.value.toFixed(2).replace(".", ",")}
              </Typography>
            </>
          )}
        </Box>
      ))}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
              "Na fila",
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
            onClick={handleCloseDialog}
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
            onClick={() => setOpenDialog(false)}
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
    </Box>
  );
};

export default ScheduledServices;
