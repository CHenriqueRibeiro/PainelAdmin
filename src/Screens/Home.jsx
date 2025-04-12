import { Box } from "@mui/material";
import "react-perfect-scrollbar/dist/css/styles.css";
import DailyStatus from "../Components/DailyStats";
import ScheduledServices from "../Components/ScheduledServices";

export default function Home() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F1EEFF",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          pt: 4,
        }}
      >
        <DailyStatus />
        <ScheduledServices />
      </Box>
    </Box>
  );
}
