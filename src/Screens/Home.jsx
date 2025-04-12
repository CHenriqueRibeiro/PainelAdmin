import {
  Box,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import NoCrashRoundedIcon from "@mui/icons-material/NoCrashRounded";
import CarCrashRoundedIcon from "@mui/icons-material/CarCrashRounded";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "#F1EEFF",
        }}
      >
        <PerfectScrollbar
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            id="teste2"
            sx={{
              height: "9rem",
              width: "95%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              background: "#FFFFFF",
              borderRadius: 6,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "98%",
                height: "87%",
                borderRadius: 6,
                overflow: "hidden",
                background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4, #dea6f4, #e2a9f4, #e5acf3, #e8aff3, #ecb2f3, #efb6f2, #f3b9f2, #f6bdf2)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: 2,
                }}
              >
                <AccountBalanceRoundedIcon
                  sx={{
                    position: "absolute",
                    top: "60%",
                    transform: "translateY(-50%)",
                    fontSize: 100,
                    color: "#FFFFFF",
                    opacity: 0.15,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" fontSize={26} fontWeight={600}>
                    50,00
                  </Typography>
                  <Tooltip
                    title="Total de vendas do dia"
                    sx={{ cursor: "default" }}
                  >
                    <Typography variant="subtitle1">Recebido hoje</Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{ background: "#FFFFFF" }}
              />
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: 2,
                }}
              >
                <NoCrashRoundedIcon
                  sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 100,
                    color: "#FFFFFF",
                    opacity: 0.15,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" fontSize={26} fontWeight={600}>
                    5
                  </Typography>
                  <Tooltip
                    title="Total lavegens concluidas no dia"
                    sx={{ cursor: "default" }}
                  >
                    <Typography variant="subtitle1">Lavagens no dia</Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Divider
                variant="middle"
                orientation="vertical"
                flexItem
                sx={{ background: "#FFFFFF" }}
              />
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: 2,
                }}
              >
                <CarCrashRoundedIcon
                  sx={{
                    position: "absolute",
                    top: "74%",
                    transform: "translateY(-50%)",
                    fontSize: 100,
                    color: "#FFFFFF",
                    opacity: 0.15,
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" fontSize={26} fontWeight={600}>
                    2
                  </Typography>
                  <Tooltip
                    title="Total de lavagens pendentes do dia"
                    sx={{ cursor: "default" }}
                  >
                    <Typography variant="subtitle1">
                      Lavagens pendentes
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </PerfectScrollbar>
      </Box>
    </>
  );
}
