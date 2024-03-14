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
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await userLogin(email, senha);
      navigate("/Home", { replace: true });
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
        background:
          " linear-gradient(to top, #5a1299, #6220a5, #6b2cb0, #7337bc, #7b42c8, #824bce, #8853d3, #8f5cd9, #9565da, #9b6ddb, #a076db, #a67edc);",
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
          placeholder="Nome*"
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
            to="/Cadastro"
            color="inherit"
            style={{
              textDecoration: "none",
              color: "inherit",
              "&:visited": {
                color: "inherit",
              },
            }}
          >
            <Typography sx={{ color: "#FFFFFF", textDecoration: "none" }}>
              Criar conta
            </Typography>
          </Link>
        </Box>
        <Button
          type="submit"
          variant="outline"
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
