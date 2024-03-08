import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "../Context/AuthContext";
import { useFirestore } from "../Context/FirestoreContext";
import { useNavigate } from "react-router-dom";
import { buscarCep, obterCoordenadas } from "../Api/index";
import InputMask from "react-input-mask";
const Update = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [numeroLocal, setNumeroLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const { cadastrarUsuario } = useAuth();
  const { cadastrarEstabelecimento } = useFirestore();
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        background: "#5a1299",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{
          height: "40rem",
          width: "20rem",
          padding: "20px",
          borderRadius: "8px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflow: "auto",
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" fontSize={20} mb={2}>
          Cadastro
        </Typography>
        <TextField
          type="email"
          value={email}
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          mb={2}
        />
        <TextField
          type="password"
          value={senha}
          label="Senha"
          variant="outlined"
          onChange={(e) => setSenha(e.target.value)}
          required
          fullWidth
          mb={2}
        />
        <TextField
          type="text"
          value={nomeEmpresa}
          label="Nome da Empresa"
          variant="outlined"
          onChange={(e) => setNomeEmpresa(e.target.value)}
          required
          fullWidth
          mb={2}
        />
        <TextField
          type="text"
          label="CEP"
          variant="outlined"
          InputProps={{
            inputComponent: InputMask,
            inputProps: {
              mask: "99999-999",
              maskChar: null,
              value: cep,
              onChange: (e) => setCep(e.target.value),
              onBlur: handleCepBlur,
              required: true,
            },
          }}
          fullWidth
          mb={2}
        />

        <TextField
          type="text"
          value={endereco}
          label="Rua / Av"
          variant="outlined"
          onChange={(e) => setEndereco(e.target.value)}
          required
          fullWidth
          mb={2}
          disabled={!!cep}
        />
        <TextField
          type="number"
          value={numeroLocal}
          label="Nº"
          variant="outlined"
          onChange={(e) => setNumeroLocal(e.target.value)}
          required
          fullWidth
          mb={2}
        />
        <TextField
          type="text"
          value={bairro}
          label="Bairro"
          variant="outlined"
          onChange={(e) => setBairro(e.target.value)}
          required
          fullWidth
          mb={2}
          disabled={!!cep}
        />
        <TextField
          type="text"
          label="Telefone"
          variant="outlined"
          InputProps={{
            inputComponent: InputMask,
            inputProps: {
              mask: "(99)999999999",
              maskChar: null,
              value: telefone,
              onChange: (e) => setTelefone(e.target.value),
              required: true,
            },
          }}
          fullWidth
          mb={2}
        />
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
      </Box>
    </Box>
  );
};

export default Update;
