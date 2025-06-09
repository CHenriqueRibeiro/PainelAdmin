// ResetPassword.jsx
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Logo from "../../public/logosemfundonovo.png";
import BackgroundImage from "../../public/background.png";
import { useNavigate } from "react-router";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate("/");
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
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <img
          src={Logo}
          alt="LavaJá"
          style={{ width: "50%", marginBottom: 20 }}
        />
        <Typography variant="h5" color="white" gutterBottom>
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

          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              mt: 2,
              backgroundColor: "#6F00BF",
              color: "#fff",
              ":hover": { backgroundColor: "#8C4AF2" },
            }}
            fullWidth
          >
            Voltar
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
export default ResetPassword;
