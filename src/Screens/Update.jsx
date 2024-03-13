import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { useAuth } from "../Context/AuthContext";
import { useFirestore } from "../Context/FirestoreContext";
import { useNavigate } from "react-router-dom";
import { buscarCep, obterCoordenadas } from "../Api/index";
import InputMask from "react-input-mask";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
const Update = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [numeroLocal, setNumeroLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const { cadastrarUsuario } = useAuth();
  const { cadastrarEstabelecimento } = useFirestore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    const preencherEndereco = async () => {
      try {
        const infoCep = await buscarCep(cep);

        if (infoCep && !infoCep.erro) {
          setEndereco(infoCep.logradouro);
          setBairro(infoCep.bairro);
        } else {
          console.error("CEP inválido ou não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar informações do CEP:", error.message);
      }
    };

    if (cep) {
      preencherEndereco();
    }
  }, [cep]);

  const handleCepBlur = async () => {
    try {
      const infoCep = await buscarCep(cep);

      if (infoCep && !infoCep.erro) {
        setEndereco(infoCep.logradouro);
        setBairro(infoCep.bairro);
      } else {
        console.error("CEP inválido ou não encontrado");
        setError("CEP inválido ou não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar informações do CEP:", error.message);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const coordenadas = await obterCoordenadas(endereco);

      const userCredential = await cadastrarUsuario(email, senha);

      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;

        const dadosEstabelecimento = {
          DadosDaEmpresa: {
            NomeEmpresa: nomeEmpresa,
            Endereco: endereco,
            numeroLocal,
            Bairro: bairro,
            Telefone: telefone,
          },
          Geolocalizacao: [
            coordenadas.results[0]?.geometry.lat || null,
            coordenadas.results[0]?.geometry.lng || null,
          ],
        };

        await cadastrarEstabelecimento(userId, dadosEstabelecimento);

        setEmail("");
        setSenha("");
        setNomeEmpresa("");
        setCep("");
        setTelefone("");
        setNumeroLocal("");
        setEndereco("");
        setBairro("");
      }
      navigate("/Home", { replace: true });
    } catch (error) {
      console.error(
        "Erro ao cadastrar usuário e estabelecimento:",
        error.message
      );
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleCepChange = () => {
    if (error) {
      setError("");
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
            value={nomeEmpresa}
            placeholder="Nome da Empresa*"
            variant="outlined"
            onChange={(e) => setNomeEmpresa(e.target.value)}
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
              onChange: (e) => setTelefone(e.target.value),
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
            type="text"
            placeholder="CEP*"
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
              mask: "99999-999",
              maskChar: null,
              value: cep,
              onChange: (e) => {
                setCep(e.target.value);
                handleCepChange();
              },
              onBlur: handleCepBlur,
              required: true,
            }}
            mb={2}
          />

          <OutlinedInput
            type="text"
            value={endereco}
            placeholder="Rua / Av*"
            variant="outlined"
            onChange={(e) => setEndereco(e.target.value)}
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
            disabled
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
            type="number"
            value={numeroLocal}
            placeholder="Nº*"
            variant="outlined"
            onChange={(e) => setNumeroLocal(e.target.value)}
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
          <OutlinedInput
            type="text"
            value={bairro}
            placeholder="Bairro*"
            variant="outlined"
            onChange={(e) => setBairro(e.target.value)}
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
            disabled
          />
        </Box>
        {error && <Typography color={"#FFFFFF"}>{error}</Typography>}
        <Button
          type="submit"
          variant="outline"
          disabled={
            error ||
            !email ||
            !senha ||
            !nomeEmpresa ||
            !telefone ||
            !cep ||
            !endereco ||
            !numeroLocal ||
            !bairro
          }
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
        >
          Finalizar Cadastro
        </Button>

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
          Voltar
        </Button>
      </Box>
    </Box>
  );
};

export default Update;
