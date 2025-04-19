// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AutoAwesomeMosaicRoundedIcon from "@mui/icons-material/AutoAwesomeMosaicRounded";
import { Navigate, Outlet } from "react-router-dom";
import { IconButton, Stack, Tooltip } from "@mui/material";

const NAVIGATION = [
  {
    segment: "Home",
    icon: (
      <AutoAwesomeMosaicRoundedIcon sx={{ color: "#009688", fontSize: 28 }} />
    ),
    onClick: () => Navigate("/home"),
  },
  {
    segment: "Estabelecimento",
    icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} />,
    onClick: () => Navigate("/estabelecimento"),
  },

  {
    segment: "Relatorios",
    icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    onClick: () => Navigate("/relatorios"),
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
  return (
    <>
      <Tooltip title="Suporte">
        <a
          href="https://wa.me/5585991673309"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <IconButton sx={{ color: "#6A1B9A", minWidth: "auto", px: 2, py: 2 }}>
            <WhatsAppIcon sx={{ fontSize: 29 }} />
          </IconButton>
        </a>
      </Tooltip>
    </>
  );
}

function CustomAppTitle() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      color={"#6A1B9A"}
    ></Stack>
  );
}

export default function DashboardLayoutBasic(props) {
  // eslint-disable-next-line react/prop-types
  const { window } = props;

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={demoWindow}>
      <DashboardLayout
        sidebarExpandedWidth={230}
        slots={{
          appTitle: CustomAppTitle,
          sidebarFooter: SidebarFooter,
        }}
        sx={{
          "& .MuiAppBar-root": {
            height: "5rem",
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
      </DashboardLayout>
    </AppProvider>
  );
}
