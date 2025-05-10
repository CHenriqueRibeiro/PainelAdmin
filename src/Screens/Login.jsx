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
import Logo from "../../public/logosemfundonovo.png";
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
      setError(error.message || "Usuário não cadastrado ou senha incorreta.");
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
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
          <OutlinedInput
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange();
            }}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            }
            fullWidth
            sx={{
              borderRadius: 3,
              background: "#FFFFFF",
              boxShadow: 1,
              marginBottom: "1rem",
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
                <IconButton onClick={handleTogglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#6F00BF",
              color: "white",
              textTransform: "none",
              padding: "0.75rem",
              borderRadius: "8px",
              ":hover": { backgroundColor: "#5a00a3" },
            }}
          >
            Entrar
          </Button>
        </Box>
        <Typography mt={2} color="white">
          Não tem conta?{" "}
          <Link
            to="/cadastro"
            style={{ color: "#FFF", textDecoration: "none" }}
          >
            Criar conta
          </Link>
        </Typography>
      </Box>
      {passwordError && error && (
        <Stack
          sx={{
            position: "fixed",
            bottom: 20,
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
            sx={{ borderRadius: 3 }}
          >
            {error}
          </Alert>
        </Stack>
      )}
    </Box>
  );
};

export default Login;
