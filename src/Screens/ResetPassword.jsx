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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import InputVisibilityToggle from "@mui/icons-material/Visibility";
import InputVisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../public/logosemfundonovo.png";
import BackgroundImage from "../../public/background.png";
import { useParams, useNavigate } from "react-router";

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/owner/reset-password/token/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao redefinir a senha.");
      }

      setSuccess(true);
      setNewPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
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
          Trocar Senha
        </Typography>

        {!success && (
          <form onSubmit={handleSubmit}>
            <OutlinedInput
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              placeholder="Nova Senha"
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              sx={{
                mt: 2,
                background: "#fff",
                borderRadius: 2,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    onClick={handleTogglePasswordVisibility}
                    sx={{
                      minWidth: "auto",
                      color: "#6F00BF",
                    }}
                  >
                    {showPasswords ? (
                      <InputVisibilityOff />
                    ) : (
                      <InputVisibilityToggle />
                    )}
                  </Button>
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
                textTransform: "capitalize",
              }}
              fullWidth
            >
              Trocar Senha
            </Button>
          </form>
        )}

        <Stack spacing={2} mt={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">
              Senha alterada com sucesso! Faça login novamente.
            </Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
