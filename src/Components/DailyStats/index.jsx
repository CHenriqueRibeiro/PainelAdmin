// eslint-disable-next-line no-unused-vars
import React from "react";
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NoCrashRoundedIcon from "@mui/icons-material/NoCrashRounded";
import CarCrashRoundedIcon from "@mui/icons-material/CarCrashRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";

const DailyStatus = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "95%",
        height: isMobile ? "20rem" : "7rem",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        background: "#F9F8FF",
        borderRadius: 6,
        p: 1.4,
        gap: 1,
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
            <Typography variant="h6" fontSize={26} fontWeight={600}>
              50,00
            </Typography>
            <Typography variant="subtitle1">Recebido hoje</Typography>
          </Box>
          <Tooltip title="Valor recebido no dia">
            <InfoRoundedIcon />
          </Tooltip>
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
            <Typography variant="h6" fontSize={26} fontWeight={600}>
              5
            </Typography>
            <Typography variant="subtitle1">Lavagens</Typography>
          </Box>
          <Tooltip title="Total de lavagens do dia">
            <InfoRoundedIcon />
          </Tooltip>
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
            <Typography variant="h6" fontSize={26} fontWeight={600}>
              2
            </Typography>
            <Typography variant="subtitle1">Lavagens pendentes</Typography>
          </Box>
          <Tooltip title="Total de lavagens pedentes do dia">
            <InfoRoundedIcon />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyStatus;
