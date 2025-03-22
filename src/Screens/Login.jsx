import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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
import Logo from "../../public/logosemfundo.png";
import BackgroundImage from "../../public/background.png";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      navigate("/estabelecimento", { replace: true });
    } catch (error) {
      console.error("Erro ao logar:", error);
      setError(
        error.message.message || "Usuário não cadastrado ou senha incorreta."
      );
      setPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = () => {
    setError(null);
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
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1300 }}
      >
        {loading && (
          <LinearProgress
            sx={{
              backgroundColor: "#D3C2FB",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#6F00BF",
              },
            }}
          />
        )}
      </Box>
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
          pb: isMobile ? "7rem" : 27,
        }}
      >
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
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: "80%",
            maxWidth: "40rem",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            overflow: "auto",
          }}
        >
          <OutlinedInput
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            startAdornment={
              <InputAdornment position="start" sx={{ pl: 1 }}>
                <PersonIcon />
              </InputAdornment>
            }
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
          />

          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={senha}
            placeholder="Senha"
            onChange={(e) => {
              setSenha(e.target.value);
              handleInputChange();
            }}
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
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              pl: 1,
              gap: 2,
            }}
          >
            <Typography>Não tem conta? </Typography>

            <Link
              to="/cadastro"
              color="inherit"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography sx={{ color: "#FFFFFF", textDecoration: "none" }}>
                Criar conta
              </Typography>
            </Link>
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
            sx={{
              width: "70%",
              height: "3rem",
              mt: 4,
              borderRadius: 2,
              background: "#6F00BF",
              color: "#FFFFFF",
              textTransform: "capitalize",
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
            Entrar
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

export default Login;
