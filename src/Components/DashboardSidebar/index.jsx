// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Navigate, Outlet } from "react-router-dom";

const NAVIGATION = [
  {
    segment: "Home",
    icon: <DashboardIcon />,
    onClick: () => Navigate("/home"),
  },
  {
    segment: "Estabelecimento",
    icon: <ShoppingCartIcon />,
    onClick: () => Navigate("/estabelecimento"),
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
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
  //const navigate = useNavigate();
  //const { userLogout } = useAuth();

  /*const handleLogout = () => {
    userLogout();
    navigate("/", { replace: true });
  };*/

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={demoWindow}>
      <DashboardLayout
        sx={{
          "& .MuiAppBar-root": {
            height: "5rem",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            border: 0,
          },
          "& .MuiDrawer-paper": {
            pt: 2,
            borderColor: "#F1EEFF",
          },
          "& .MuiStack-root.css-1d9cypr-MuiStack-root": {
            display: "none",
          },
        }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}
