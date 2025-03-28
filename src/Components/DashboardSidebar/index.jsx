import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import LocalCarWashRoundedIcon from "@mui/icons-material/LocalCarWashRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PaidIcon from "@mui/icons-material/Paid";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DoneAllIcon from "@mui/icons-material/DoneAll";
const DashboardSidebar = () => {
  const { userLogout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(getTodayFormatted());
  }, []);
  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    userLogout();
    navigate("/", { replace: true });
  };

  const handleWhatsapp = () => {
    const phoneNumber = "+5585985847007";
    const message =
      "Olá, estou entrando em contato pois estou precisando de suporte na plataforma do LavaJá";
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappLink, "_blank");
  };
  const getTodayFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  console.log();

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background:
            "linear-gradient(180deg, #eaecff 0%, #e8eefd 81%, #e7e8fc 100%)",
          height: "6rem",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleToggleSidebar}
            edge="start"
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              width: "100dvw",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: 2,
                color: "#8C4AF2",
                background: "#FFFFFF",
                height: "3rem",
                width: "10rem",
              }}
            >
              <PaidIcon />
              <Divider orientation="vertical" flexItem />
              <Typography>R$ 200,00</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: 2,
                color: "#8C4AF2",
                background: "#FFFFFF",
                height: "3rem",
                width: "6rem",
              }}
            >
              <ScheduleIcon />
              <Divider orientation="vertical" flexItem />
              <Typography>1</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: 2,
                color: "#8C4AF2",
                background: "#FFFFFF",
                height: "3rem",
                width: "6rem",
              }}
            >
              <DoneAllIcon />
              <Divider orientation="vertical" flexItem />
              <Typography>5</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#8C4AF2",
              }}
            >
              <Typography>{today}</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 70,
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: open ? 240 : 70,
            transition: "width 0.3s",
            background: "linear-gradient(180deg, #8C4AF2 100%, #f4f4fe 100%)",
          },
        }}
      >
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Button
            startIcon={<LocalCarWashRoundedIcon />}
            fullWidth={!open}
            sx={{ justifyContent: open ? "flex-start" : "center" }}
          >
            {open && "Estabelecimento"}
          </Button>
          <Button
            startIcon={<EventNoteRoundedIcon />}
            fullWidth={!open}
            sx={{ justifyContent: open ? "flex-start" : "center" }}
          >
            {open && "Agendamentos"}
          </Button>
          <Button
            startIcon={<AssessmentRoundedIcon />}
            fullWidth={!open}
            sx={{ justifyContent: open ? "flex-start" : "center" }}
          >
            {open && "Relatórios"}
          </Button>
        </List>
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            startIcon={<WhatsAppIcon />}
            fullWidth={!open}
            sx={{ justifyContent: open ? "flex-start" : "center" }}
            onClick={handleWhatsapp}
          >
            {open && "Suporte"}
          </Button>
          <Button
            startIcon={<LogoutRoundedIcon />}
            fullWidth={!open}
            sx={{ justifyContent: open ? "flex-start" : "center" }}
            onClick={handleLogout}
          >
            {open && "Sair"}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;
