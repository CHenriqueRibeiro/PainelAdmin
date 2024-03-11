import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Components/Header";
import DashboardSidebar from "../Components/DashboardSidebar";

export default function Reports() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          width: isMobile ? "100dvw" : "80dvw",
          marginLeft: isMobile ? "0" : "20dvw",
          height: "100dvh",
          background: "#EDEDED",
        }}
      >
        <Navbar />
        <Typography>Relatorios</Typography>
        {!isMobile && <DashboardSidebar />}
      </Box>
    </>
  );
}
