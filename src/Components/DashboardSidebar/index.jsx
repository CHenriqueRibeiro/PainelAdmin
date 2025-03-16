import { Box, Button, Drawer, List } from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import LocalCarWashRoundedIcon from "@mui/icons-material/LocalCarWashRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Logo from "@mui/material/Avatar";
import Img from "../../../public/logoteste.png";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const DashboardSidebar = () => {
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
    navigate("/home");
  };
  const goToReports = () => {
    navigate("/relatorios");
  };
  const goTogoEstablishment = () => {
    navigate("/estabelecimento");
  };
  return (
    <>
      <Box sx={{}}>
        <Drawer
          variant="permanent"
          sx={{
            boxShadow: 4,
            "& > :first-of-type": {
              background: "linear-gradient(0deg, #a13fad 0%, #9211bb 100%)",
              display: "flex",
              flexDirection: "flex",
              alignItems: "center",
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
              width: "20dvw",
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
              onClick={goTogoEstablishment}
            >
              <LocalCarWashRoundedIcon />
              Estabelecimento
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
          </List>
          <Box
            sx={{
              position: "absolute",
              top: "85%",
              display: "flex",
              width: "20dvw",
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
      </Box>
    </>
  );
};

export default DashboardSidebar;
