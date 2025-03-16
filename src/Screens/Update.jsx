import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

const Update = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [nomeDoCliente, setNomeDoCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const { cadastrarUsuario } = useAuth();
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
      setError("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  const handleBack = () => {
    navigate(-1);
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
      <AccountCircleSharpIcon
        sx={{ width: "8rem", height: "8rem", color: "#FFFFFF" }}
      />
      <Typography variant="h5" color={"#FFFFFF"}>
        Cadastro
      </Typography>
      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{
          height: "40rem",
          width: "80%",
          maxWidth: "40rem",
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            gap: 2,
          }}
        >
          <OutlinedInput
            type="text"
            value={nomeDoCliente}
            placeholder="Nome*"
            variant="outlined"
            onChange={(e) => setNomeDoCliente(e.target.value)}
            fullWidth
            sx={{
              width: isMobile ? "100%" : "70%",
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
            type="text"
            placeholder="Telefone*"
            variant="outlined"
            required
            fullWidth
            sx={{
              width: isMobile ? "100%" : "30%",
              borderRadius: "18px",
              background: "#FFFFFF",
              boxShadow: 5,
              "& fieldset": {
                border: "none",
              },
            }}
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
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            gap: 2,
          }}
        >
          <OutlinedInput
            type="email"
            value={email}
            placeholder="Email*"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              width: isMobile ? "100%" : "70%",
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
            placeholder="Senha*"
            variant="outlined"
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
            sx={{
              width: isMobile ? "100%" : "30%",
              borderRadius: "18px",
              background: "#FFFFFF",
              boxShadow: 5,
              "& fieldset": {
                border: "none",
              },
            }}
            required
          />
        </Box>
        {error && <Typography color={"#FFFFFF"}>{error}</Typography>}
        <Button
          type="submit"
          variant="outlined"
          disabled={error || !email || !senha || !nomeDoCliente || !telefone}
          sx={{
            width: "13rem",
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
          Finalizar Cadastro
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: "13rem",
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
          onClick={handleBack}
        >
          Voltar
        </Button>
      </Box>
    </Box>
  );
};

export default Update;
