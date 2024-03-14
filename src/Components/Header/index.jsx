import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  CssBaseline,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import LocalCarWashRoundedIcon from "@mui/icons-material/LocalCarWashRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Logo from "@mui/material/Avatar";
import Img from "../../../public/logoteste.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const { userLogout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    userLogout();
    navigate("/", { replace: true });
  };
  const handleWhatsapp = () => {
    const phoneNumber = "+5585985847007";

    const message =
      "Olá, estou entrando em contato pois estou precisando de suporte na  plataforma do LavaJá";

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappLink, "_blank");
  };
  const goToSchedules = () => {
    navigate("/Home");
  };
  const goToReports = () => {
    navigate("/Relatorios");
  };
  const goTogoEstablishment = () => {
    navigate("/Estabelecimento");
  };
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          background: "#5F29B8",
          width: "100%",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            lavacar
          </Typography>
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            "& > :nth-child(3)": {
              display: "flex",
              alignItems: "center",
              background: "#5F29B8",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "4rem",
            }}
          >
            <Logo
              id="imglogo"
              alt="Remy Sharp"
              src={Img}
              style={{ width: "auto", height: "100%" }}
            />
          </Box>
          <List
            sx={{
              width: "65dvw",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 3,
            }}
          >
            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                borderRadius: 3,
                fontWeight: "400",
                color: "#FFFFFF",
                gap: 1,
                ":active": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
                ":hover": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
              }}
              onClick={goToSchedules}
            >
              <EventNoteRoundedIcon />
              Agendamentos
            </Button>

            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                borderRadius: 3,
                fontWeight: "400",
                color: "#FFFFFF",
                gap: 1,
                ":active": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
                ":hover": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
              }}
              onClick={goToReports}
            >
              <AssessmentRoundedIcon />
              Relatorios
            </Button>
            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                borderRadius: 3,
                fontWeight: "400",
                color: "#FFFFFF",
                gap: 1,
                ":active": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
                ":hover": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
              }}
              onClick={goTogoEstablishment}
            >
              <LocalCarWashRoundedIcon />
              Cadastro
            </Button>
          </List>
          <Box
            sx={{
              position: "absolute",
              top: "85%",
              display: "flex",
              width: "65dvw",
              height: "5rem",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                borderRadius: 3,
                fontWeight: "400",
                color: "#FFFFFF",
                gap: 1,
                ":active": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
                ":hover": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
              }}
              onClick={handleWhatsapp}
            >
              <WhatsAppIcon />
              Suporte
            </Button>
            <Button
              variant="text"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "90%",
                borderRadius: 3,
                fontWeight: "400",
                color: "#FFFFFF",
                gap: 1,
                ":active": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
                ":hover": {
                  background: "#FFFFFF",
                  color: "#9A6CDB",
                },
              }}
              onClick={handleLogout}
            >
              <LogoutRoundedIcon />
              Sair
            </Button>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Navbar;
