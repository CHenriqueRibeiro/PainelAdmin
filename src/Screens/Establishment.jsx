import { Box } from "@mui/material";
import "react-perfect-scrollbar/dist/css/styles.css";
import EstablishmentData from "../Components/EstablishmentData";
export default function Establishment() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          background: "#F1EEFF",
        }}
      >
        <EstablishmentData />
      </Box>
    </>
  );
}
