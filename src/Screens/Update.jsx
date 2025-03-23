import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

import BackgroundImage from "../../public/background.png";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Logo from "../../public/logosemfundo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Update = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [nomeDoCliente, setNomeDoCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const { cadastrarUsuario } = useAuth();
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleTelefoneChange = (e) => {
    const formattedTelefone = e.target.value.replace(/\D/g, "");
    setTelefone(formattedTelefone);
  };

  const handleUpdate = async (e) => {
    const telefoneNumero = Number(telefone);
    e.preventDefault();
    try {
      await cadastrarUsuario(email, senha, nomeDoCliente, telefoneNumero);

      setEmail("");
      setSenha("");
      setNomeDoCliente("");
      setTelefone("");

      navigate("/estabelecimento");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar usuário. Tente novamente.");
      setPasswordError(true);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #d3c2fb 0%, #945bf2 100%, #f4f4fe 100%)",
          height: "100vh",
          width: isMobile ? "100dvw" : "30dvw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pb: isMobile ? "7rem" : 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            pl: 1,
          }}
        >
          <IconButton
            onClick={handleBack}
            color="#945bf2"
            sx={{ color: " #4E0090 ", gap: 2 }}
          >
            <ArrowBackIcon />
            <Typography variant="h6">Voltar</Typography>
          </IconButton>
        </Box>
        <Box>
          <img
            src={Logo}
            alt="logo"
            style={{
              width: "100%",
              height: "25dvh",
            }}
          />
        </Box>
        <Typography variant="h4" color={"#FFFFFF"} gutterBottom>
          Cadastro
        </Typography>
        <Box
          component="form"
          onSubmit={handleUpdate}
          sx={{
            height: "40rem",
            width: "100%",
            maxWidth: "40rem",
            padding: "20px",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <OutlinedInput
              type="text"
              value={nomeDoCliente}
              placeholder="Nome"
              variant="outlined"
              onChange={(e) => setNomeDoCliente(e.target.value)}
              fullWidth
              sx={{
                width: "100%",
                borderRadius: 3,
                background: "#FFFFFF",
                boxShadow: 5,
                "& fieldset": {
                  border: "none",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <PersonIcon />
                </InputAdornment>
              }
              required
            />
            <OutlinedInput
              type="text"
              placeholder="Telefone"
              variant="outlined"
              required
              fullWidth
              sx={{
                width: "100%",
                borderRadius: 3,
                background: "#FFFFFF",
                boxShadow: 5,
                "& fieldset": {
                  border: "none",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <PhoneIphoneIcon />
                </InputAdornment>
              }
              inputComponent={InputMask}
              inputProps={{
                mask: "(99)9 99999999",
                maskChar: null,
                value: telefone,
                onChange: handleTelefoneChange,
                required: true,
              }}
              mb={2}
            />

            <OutlinedInput
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{
                width: "100%",
                borderRadius: 3,
                background: "#FFFFFF",
                boxShadow: 5,
                "& fieldset": {
                  border: "none",
                },
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <EmailIcon />
                </InputAdornment>
              }
              required
            />

            <OutlinedInput
              type="password"
              value={senha}
              placeholder="Senha"
              variant="outlined"
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              sx={{
                borderRadius: 3,
                background: "#FFFFFF",
                boxShadow: 5,
                "& fieldset": {
                  border: "none",
                },
              }}
              required
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 1 }}>
                  <KeyIcon />
                </InputAdornment>
              }
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="outlined"
            disabled={error || !email || !senha || !nomeDoCliente || !telefone}
            sx={{
              width: "75%",
              height: "3rem",
              mb: isMobile ? 0 : 8,
              borderRadius: 2,
              textTransform: "capitalize",
              background: "#6F00BF",
              color: "#FFFFFF",
              borderColor: "#6F00BF",
              transition: "transform 0.3s",
              ":active": {
                transform: "scale(0.95)",
                background:
                  "linear-gradient(180deg, #8C4AF2 100%, #f4f4fe 100%)",
                color: "#6F00BF",
                borderColor: "#6F00BF",
              },
              ":hover": {
                background: "#FFFFFF",
                color: "#6F00BF",
                borderColor: "#6F00BF",
              },
            }}
            onClick={handleUpdate}
          >
            Finalizar Cadastro
          </Button>
        </Box>
      </Box>
      {passwordError && error && (
        <Stack
          sx={{
            position: "fixed",
            bottom: isMobile ? 20 : 50,
            left: "50%",
            transform: "translateX(-50%)",
            width: isMobile ? "90%" : "25rem",
            zIndex: 1300,
          }}
          spacing={2}
        >
          <Alert
            severity="error"
            onClose={() => setPasswordError(false)}
            sx={{
              borderRadius: 3,
            }}
          >
            {error}
          </Alert>
        </Stack>
      )}
    </Box>
  );
};

export default Update;
