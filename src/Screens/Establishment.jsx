import { Box } from "@mui/material";
import "react-perfect-scrollbar/dist/css/styles.css";
import EstablishmentData from "../Components/EstablishmentData";
import EstablishmentServices from "../Components/EstablishmentServices";
export default function Establishment() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          alignItems: "center",
          background: "#F1EEFF",
        }}
      >
        <EstablishmentData />
        <EstablishmentServices />
      </Box>
    </>
  );
}
