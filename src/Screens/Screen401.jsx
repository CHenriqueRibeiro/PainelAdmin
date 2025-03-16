import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Screen401 = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/", { replace: true });
  };
  return (
    <Box
      sx={{
        width: "100dvw",
        height: "100dvh",
        background: "linear-gradient(0deg, #a13fad 0%, #9211bb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h5"
          height={"10%"}
          color={"#FFFFFF"}
          display={"flex"}
          alignItems={"center"}
        >
          Acesso não autorizado (401)
        </Typography>
        <iframe
          src="https://lottie.host/embed/72de7370-44aa-4f19-aa4d-9a7e5b218593/8gp4TjaK4w.json"
          title="401 Animation"
          width={"100%"}
          height={"50%"}
          style={{ border: "none" }}
        ></iframe>
        <Button
          variant="outline"
          sx={{
            width: "13rem",
            borderRadius: 3,
            background: "#9A6CDB",
            color: "#FFFFFF",
            ":active": {
              background: "#FFFFFF",
              color: "#9A6CDB",
            },
            ":hover": {
              background: "#FFFFFF",
              color: "#9A6CDB",
            },
          }}
          onClick={handleBack}
        >
          Fazer login
        </Button>
      </Box>
    </Box>
  );
};

export default Screen401;
