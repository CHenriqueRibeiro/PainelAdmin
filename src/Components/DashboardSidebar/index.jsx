import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip, Snackbar, Alert as MuiAlert } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import LinkIcon from "@mui/icons-material/Link";
import ChatPopUpIA from "../ChatPopUpIA";
import { useAuth} from "../../Context/AuthContext";

const NAVIGATION = [
  {
    segment: "Home",
    title: "Agendamentos",
    icon: <UpdateRoundedIcon sx={{ color: "#009688", fontSize: 28 }} />,
  },
  {
    segment: "Estabelecimento",
    icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} />,
  },
  {
    segment: "Relatorios",
    icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
  },

      {
        segment: "Custos",
        icon: <QueryStatsRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
      {
        segment: "Orcamentos",
        icon: <DescriptionRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
      {
        segment: "Estoque",
        icon: <InventoryRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
    

];

const demoTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function SidebarFooter() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Tooltip title="Sair">
        <IconButton
          onClick={handleLogout}
          sx={{ color: "#6A1B9A", minWidth: "auto", px: 2, py: 2 }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 29 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function ToolbarActionsIA({ onToggleIA }) {
   const {establishments } = useAuth();
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackOpenDefault, setSnackOpenDefault] = React.useState(false);
  const currentEstablishment = establishments?.[0];
const establishmentId = currentEstablishment?._id;
const hasServices = currentEstablishment?.services?.length > 0;

const publicLink = establishmentId
  ? `${window.location.origin}/agendamento/${establishmentId}`
  : "";

  const handleCopyLink = async () => {
    if (publicLink) {
      await navigator.clipboard.writeText(publicLink);
      setSnackOpen(true);
    }
  };


  return (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2, gap: 1 }}>
      {hasServices ? (
        
        <Tooltip title="Copiar link de agendamento" >
        <Box onClick={handleCopyLink} sx={{
            display: "flex",
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "all 0.2s",
          "&:hover": {
            background: "#AC42F7",
          },
        }}>

         
            <LinkIcon />
        </Box>
            </Tooltip>
      ): (
          <Tooltip title="É necessário cadastrar pelo menos um serviço para gerar o link de agendamento" >
            
          <Box  onClick={() => setSnackOpenDefault(true)} sx={{
            display: "flex",
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          borderRadius: 4,
          cursor: "default",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "all 0.2s",
          "&:hover": {
            background: "#AC42F7",
          },
        }}>
            <LinkIcon />
        </Box>
          </Tooltip>
        )}
       <Snackbar
  open={snackOpenDefault}
  autoHideDuration={4000}
  onClose={() => setSnackOpenDefault(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <MuiAlert elevation={6} color="warning">
    Cadastre ao menos um serviço para gerar o link de agendamento
  </MuiAlert>
</Snackbar>
      <Box
        onClick={onToggleIA}
        sx={{
          background: "#6A1B9A",
          color: "#fff",
          px: 2,
          py: 1,
          mr: 0.6,
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "all 0.2s",
          "&:hover": {
            background: "#AC42F7",
          },
        }}
      >
        JáIA 💡
      </Box>
     
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert elevation={6}>
          Link copiado!
        </MuiAlert>
      </Snackbar>
      
    </Box>
  );
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;
  const [showIA, setShowIA] = React.useState(false);
  const token = localStorage.getItem("authToken");

  return (

      <AppProvider navigation={NAVIGATION} theme={demoTheme} window={demoWindow}>
        <DashboardLayout
          sidebarExpandedWidth={230}
          slots={{
            appTitle: () => (
              <Box sx={{ pl: 2, fontWeight: "bold", color: "#6A1B9A" }}></Box>
            ),
            toolbarActions: () => (
              <ToolbarActionsIA onToggleIA={() => setShowIA((prev) => !prev)} />
            ),
            sidebarFooter: SidebarFooter,
          }}
          sx={{
            "& .MuiAppBar-root": {
              height: "4rem",
              background: "#F9F8FF",
              display: "flex",
              justifyContent: "center",
              border: 0,
            },
            "& .MuiDrawer-paper": {
              pt: 2,
              borderColor: "#F1EEFF",
              background: "#F9F8FF",
            },
            "& .MuiListItemText-root.MuiTypography-root.MuiTypography-body1": {
              color: "#AC42F7",
            },
            "& .MuiListItemIcon-root svg": {
              color: "#6A1B9A",
              fontSize: "28px",
            },
            "& .MuiIconButton-root.MuiIconButton-sizeMedium": {
              color: "#6A1B9A",
            },
          }}
        >
          <Outlet />
          <ChatPopUpIA
            open={showIA}
            onClose={() => setShowIA(false)}
            token={token}
          />
        </DashboardLayout>
      </AppProvider>
  );
}
