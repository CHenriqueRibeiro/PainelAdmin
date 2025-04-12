// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Navigate, Outlet } from "react-router-dom";

const NAVIGATION = [
  {
    segment: "Home",
    icon: <AnalyticsIcon sx={{ color: "#6A1B9A", fontSize: 28 }} />,
    onClick: () => Navigate("/home"),
  },
  {
    segment: "Estabelecimento",
    icon: <StorefrontIcon sx={{ color: "#009688", fontSize: 28 }} />,
    onClick: () => Navigate("/estabelecimento"),
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

export default function DashboardLayoutBasic(props) {
  // eslint-disable-next-line react/prop-types
  const { window } = props;

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={demoWindow}>
      <DashboardLayout
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
          "& .MuiStack-root.css-1d9cypr-MuiStack-root": {
            display: "none",
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
