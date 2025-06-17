import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";

import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AutoAwesomeMosaicRoundedIcon from "@mui/icons-material/AutoAwesomeMosaicRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import ChatPopUpIA from "../ChatPopUpIA";
import { useAuth } from "../../Context/AuthContext";

const NAVIGATION = [
  {
    segment: "Home",
    icon: (
      <AutoAwesomeMosaicRoundedIcon sx={{ color: "#009688", fontSize: 28 }} />
    ),
  },
  {
    segment: "Estabelecimento",
    icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} />,
  },
  {
    segment: "Relatorios",
    icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    onClick: () => Navigate("/relatorios"),
  },
  {
    segment: "Gestão/Estoque",
    title: "Gestão",
    icon: <DonutSmallRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    children: [
      {
        segment: "Custos",
        icon: <QueryStatsRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
      {
        segment: "Orcamentos",
        icon: (
          <DescriptionRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />
        ),
      },
      {
        segment: "Estoque",
        icon: <InventoryRoundedIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
      },
    ],
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

// eslint-disable-next-line react/prop-types
function ToolbarActionsIA({ onToggleIA }) {
  return (
    <Box sx={{ pr: 2 }}>
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
    </Box>
  );
}

export default function DashboardLayoutBasic(props) {
  // eslint-disable-next-line react/prop-types
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
