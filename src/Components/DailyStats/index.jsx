// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NoCrashRoundedIcon from "@mui/icons-material/NoCrashRounded";
import CarCrashRoundedIcon from "@mui/icons-material/CarCrashRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";

// eslint-disable-next-line react/prop-types
const DailyStatus = ({ services, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const servicesTotal = services;
  const deliveredCount = servicesTotal.filter(
    (item) => item.status === "Entregue"
  ).length;
  const totalPriceForDelivered = servicesTotal
    .filter((item) => item.status === "Entregue")
    .reduce((acc, item) => acc + item.price, 0);
  const scheduledWashes = servicesTotal.filter(
    (item) => item.status !== "Cancelado"
  ).length;
  return (
    <Box
      sx={{
        width: "95%",
        height: isMobile ? "17rem" : "7rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        background: "#F9F8FF",
        borderRadius: 6,
        p: 1.4,
        gap: 1,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: isMobile ? "100%" : "33%",
          px: 2,
          py: 1,
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
        }}
      >
        <SavingsRoundedIcon
          sx={{
            position: "absolute",
            left: "-10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 80,
            color: "#FFFFFF",
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#FFFFFF",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Box>
            {loading ? (
              <Skeleton variant="text" width={80} height={30} />
            ) : (
              <Typography variant="h6" fontSize={26} fontWeight={600}>
                R$ {totalPriceForDelivered}
              </Typography>
            )}
            <Typography variant="subtitle1">Recebido nesse dia</Typography>
          </Box>
          {!isMobile && (
            <Tooltip title="Valor recebido no dia selecionado">
              <InfoRoundedIcon />
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: isMobile ? "100%" : "33%",
          px: 2,
          py: 1,
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
        }}
      >
        <NoCrashRoundedIcon
          sx={{
            position: "absolute",
            left: "-10px",
            top: "45%",
            transform: "translateY(-50%)",
            fontSize: 70,
            color: "#FFFFFF",
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#FFFFFF",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Box>
            {loading ? (
              <Skeleton variant="text" width={40} height={30} />
            ) : (
              <Typography variant="h6" fontSize={26} fontWeight={600}>
                {deliveredCount}
              </Typography>
            )}
            <Typography variant="subtitle1">
              Lavagens finalizadas nesse dia
            </Typography>
          </Box>
          {!isMobile && (
            <Tooltip title="Total de lavagens finalizadas no dia selecionado">
              <InfoRoundedIcon />
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: isMobile ? "100%" : "33%",
          px: 2,
          py: 1,
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
        }}
      >
        <CarCrashRoundedIcon
          sx={{
            position: "absolute",
            left: "-10px",
            top: "55%",
            transform: "translateY(-50%)",
            fontSize: 70,
            color: "#FFFFFF",
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#FFFFFF",
            width: "100%",
            zIndex: 1,
          }}
        >
          <Box>
            {loading ? (
              <Skeleton variant="text" width={40} height={30} />
            ) : (
              <Typography variant="h6" fontSize={26} fontWeight={600}>
                {scheduledWashes}
              </Typography>
            )}
            <Typography variant="subtitle1">
              Lavagens totais nesse dia
            </Typography>
          </Box>
          {!isMobile && (
            <Tooltip title="Total de lavagens agendadas no dia selecionado">
              <InfoRoundedIcon />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DailyStatus;
