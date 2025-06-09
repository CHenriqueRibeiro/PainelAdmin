import { useState } from "react";
import {
  Box,
  Button,
  OutlinedInput,
  Typography,
  Stack,
  Alert,
  LinearProgress,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Logo from "../../public/logosemfundonovo.png";
import BackgroundImage from "../../public/background.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        "https://lavaja.up.railway.app/api/owner/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao solicitar redefinição.");
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
          }}
        />
      )}
      <Box
        sx={{
          background: "linear-gradient(180deg, #d3c2fb 0%, #945bf2 100%)",
          p: 4,
          borderRadius: 4,
          width: 350,
          textAlign: "center",
        }}
      >
        <img
          src={Logo}
          alt="LavaJá"
          style={{ width: "50%", marginBottom: 20 }}
        />
        <Typography variant="h6" color="white">
          Esqueci Minha Senha
        </Typography>

        <form onSubmit={handleSubmit}>
          <OutlinedInput
            type="email"
            value={email}
            placeholder="Seu e-mail"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              mt: 3,
              background: "#fff",
              borderRadius: 2,
            }}
            startAdornment={
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            }
            required
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#6F00BF",
              color: "#fff",
              ":hover": { backgroundColor: "#8C4AF2" },
            }}
            fullWidth
          >
            Enviar Link de Redefinição
          </Button>
        </form>

        <Stack spacing={2} mt={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">
              E-mail enviado! Verifique sua caixa de entrada.
            </Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
