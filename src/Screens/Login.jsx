import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../Context/AuthContext";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await login(email, senha);
      navigate("/estabelecimento", { replace: true });
    } catch (error) {
      setError("Usuário não cadastrado ou senha incorreta.");
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
        background: "linear-gradient(0deg, #a13fad 0%, #9211bb 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PersonPinRoundedIcon
        sx={{ width: "8rem", height: "8rem", color: "#FFFFFF" }}
      />
      <Typography variant="h5" color={"#FFFFFF"}>
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
          gap: 2,
          overflow: "auto",
        }}
      >
        {error && <Typography sx={{ color: "#FFFFFF" }}>{error}</Typography>}
        <OutlinedInput
          type="email"
          value={email}
          label="Email"
          placeholder="Email*"
          onChange={(e) => {
            setEmail(e.target.value);
            handleInputChange();
          }}
          fullWidth
          sx={{
            borderRadius: "18px",
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
          label="Senha"
          placeholder="Senha*"
          variant="outlined"
          onChange={(e) => {
            setSenha(e.target.value);
            handleInputChange();
          }}
          fullWidth
          sx={{
            borderRadius: "18px",
            background: "#FFFFFF",
            boxShadow: 5,
            "& fieldset": {
              border: "none",
            },
          }}
          required
          endAdornment={
            <IconButton
              onClick={handleTogglePasswordVisibility}
              edge="end"
              sx={{ color: "#000000" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
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
        <Button
          type="submit"
          variant="outlined"
          sx={{
            width: "15rem",
            mt: 2,
            borderRadius: 3,
            background: "#9A6CDB",
            color: "#FFFFFF",
            transition: "transform 0.3s",
            ":active": {
              transform: "scale(0.95)",
              background: "#FFFFFF",
              color: "#9A6CDB",
            },
            ":hover": {
              background: "#FFFFFF",
              color: "#9A6CDB",
            },
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
