import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  InputAdornment,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Logo from "../../public/logosemfundo.png";
import BackgroundImage from "../../public/background.png";

const Update = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [nomeDoCliente, setNomeDoCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    e.preventDefault();
    setLoading(true);
    try {
      await cadastrarUsuario(email, senha, nomeDoCliente, telefone);
      setEmail("");
      setSenha("");
      setNomeDoCliente("");
      setTelefone("");
      navigate("/estabelecimento");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar usuário. Tente novamente.");
      setPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#6F00BF",
            },
          }}
        />
      )}
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #d3c2fb 0%, #945bf2 100%, #f4f4fe 100%)",
          width: isMobile ? "90%" : "30rem",
          padding: "2rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
        }}
      >
        <img
          src={Logo}
          alt="logo"
          style={{ width: "50%", marginBottom: "1rem" }}
        />
        <Typography variant="h5" color="white" gutterBottom>
          Cadastro
        </Typography>

        <Box component="form" onSubmit={handleUpdate} sx={{ width: "100%" }}>
          <OutlinedInput
            type="text"
            value={nomeDoCliente}
            placeholder="Nome"
            onChange={(e) => setNomeDoCliente(e.target.value)}
            fullWidth
            sx={{
              borderRadius: 3,
              background: "#FFFFFF",
              boxShadow: 1,
              marginBottom: "1rem",
            }}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            }
            required
          />

          <OutlinedInput
            type="text"
            value={telefone}
            placeholder="Telefone"
            onChange={handleTelefoneChange}
            fullWidth
            sx={{
              borderRadius: 3,
              background: "#FFFFFF",
              boxShadow: 1,
              marginBottom: "1rem",
            }}
            startAdornment={
              <InputAdornment position="start">
                <PhoneIphoneIcon />
              </InputAdornment>
            }
            required
          />

          <OutlinedInput
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              borderRadius: 3,
              background: "#FFFFFF",
              boxShadow: 1,
              marginBottom: "1rem",
            }}
            startAdornment={
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            }
            required
          />

          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={senha}
            placeholder="Senha"
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            sx={{
              borderRadius: 3,
              background: "#FFFFFF",
              boxShadow: 1,
              marginBottom: "1rem",
            }}
            required
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <Button
            type="submit"
            variant="outlined"
            disabled={error || !email || !senha || !nomeDoCliente || !telefone}
            sx={{
              width: "100%",
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
          >
            Finalizar Cadastro
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              height: "3rem",
              mt: isMobile ? 2 : -5,
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
            onClick={handleBack}
          >
            Voltar
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
