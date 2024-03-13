import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { useAuth } from "../Context/AuthContext";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { userLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await userLogin(email, senha);
      navigate("/Home", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
    }
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
        <OutlinedInput
          type="email"
          value={email}
          label="Email"
          placeholder="Nome*"
          onChange={(e) => setEmail(e.target.value)}
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
          type="password"
          value={senha}
          label="Senha"
          placeholder="Senha*"
          variant="outlined"
          onChange={(e) => setSenha(e.target.value)}
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
            ":active": {
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
