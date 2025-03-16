import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardSidebar from "../Components/DashboardSidebar";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          width: isMobile ? "100dvw" : "80dvw",
          marginLeft: isMobile ? "0" : "20dvw",
          height: "100dvh",
          background: "#F5F6FA",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PerfectScrollbar
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyItems: "center",
            overflow: "auto",
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            id="teste2"
            sx={{
              mt: isMobile ? 4 : 0,
              height: "100%",
              width: isMobile ? "90%" : "85%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: isMobile ? "90%" : "95%",
                height: isMobile ? "35rem" : "95%",
                background: "#FFFFFF",
                borderRadius: 6,
                boxShadow: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90%",
                  height: isMobile ? "10%" : "5%",
                  minHeight: "2rem",
                  borderBottom: "1px #955eef solid",
                }}
              >
                <Typography variant="h6">Agendamentos</Typography>
              </Box>

              <PerfectScrollbar
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "90%",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px #955eef solid",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "space-around",
                          width: "65%",
                          height: "10rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <PersonRoundedIcon />
                          <Typography>Henrique</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <EventNoteRoundedIcon />
                          <Typography>30/03/2024 - 09:00</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <DriveEtaRoundedIcon />
                          <Typography>Polo</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <WaterDropRoundedIcon />
                          <Typography>Lavagem Simples</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          width: "35%",
                          color: "#955eef",
                        }}
                      >
                        <Typography>R$ 35,00</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "1rem 0 1rem 0",
                      }}
                    >
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: "#008000",
                          border: "1px #008000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#008000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CheckCircleRoundedIcon />
                        <Typography>iniciar</Typography>
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #fe0000 ",
                          border: "1px #fe0000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#fe0000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CancelRoundedIcon />
                        cancelar
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #0DC143",
                          border: "1px #0DC143 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#0DC143",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <WhatsAppIcon />
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px #955eef solid",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "space-around",
                          width: "65%",
                          height: "10rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <PersonRoundedIcon />
                          <Typography>Ana kesia</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <EventNoteRoundedIcon />
                          <Typography>26/03/2024 - 12:30</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <DriveEtaRoundedIcon />
                          <Typography>Gol</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <WaterDropRoundedIcon />
                          <Typography>Lavagem Simples</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          width: "35%",
                          color: "#955eef",
                        }}
                      >
                        <Typography>R$ 65,00</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "1rem 0 1rem 0",
                      }}
                    >
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: "#008000",
                          border: "1px #008000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#008000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CheckCircleRoundedIcon />
                        <Typography>iniciar</Typography>
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #fe0000 ",
                          border: "1px #fe0000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#fe0000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CancelRoundedIcon />
                        cancelar
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #0DC143",
                          border: "1px #0DC143 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#0DC143",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <WhatsAppIcon />
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px #955eef solid",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "space-around",
                          width: "65%",
                          height: "10rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <PersonRoundedIcon />
                          <Typography>Claudia</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <EventNoteRoundedIcon />
                          <Typography>26/03/2024 - 10:30</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <DriveEtaRoundedIcon />
                          <Typography>Gol</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#955eef",
                          }}
                        >
                          <WaterDropRoundedIcon />
                          <Typography>Lavagem Completa</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          width: "35%",
                          color: "#955eef",
                        }}
                      >
                        <Typography>R$ 45,00</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "1rem 0 1rem 0",
                      }}
                    >
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: "#008000",
                          border: "1px #008000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#008000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CheckCircleRoundedIcon />
                        <Typography>iniciar</Typography>
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #fe0000 ",
                          border: "1px #fe0000 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#fe0000",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <CancelRoundedIcon />
                        cancelar
                      </Button>
                      <Button
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          width: "auto",
                          borderRadius: 3,
                          color: " #0DC143",
                          border: "1px #0DC143 solid",
                          transition: "transform 0.3s",
                          ":active": {
                            background: "#FFFFFF",
                            transform: "scale(0.95)",
                          },
                          ":hover": {
                            background: "#0DC143",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <WhatsAppIcon />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </PerfectScrollbar>
            </Box>
          </Box>

          <Box
            id="teste"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: isMobile ? "90%" : "85%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                height: "95%",
                width: "100%",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: isMobile ? "90%" : "95%",
                  height: isMobile ? "27rem" : "45%",
                  background: "#FFFFFF",
                  borderRadius: 6,
                  boxShadow: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    height: "10%",
                    minHeight: "2rem",
                    borderBottom: "1px #955eef solid",
                  }}
                >
                  <Typography variant="h6">Em atendimento</Typography>
                </Box>

                <PerfectScrollbar
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "90%",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "90%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px #955eef solid",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-around",
                            width: "65%",
                            height: "10rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <PersonRoundedIcon />
                            <Typography>Tereza</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <EventNoteRoundedIcon />
                            <Typography>12/03/2024 - 09:00</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <DriveEtaRoundedIcon />
                            <Typography>Twister</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <WaterDropRoundedIcon />
                            <Typography>Lavagem Simples</Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "35%",
                            color: "#955eef",
                          }}
                        >
                          <Typography>R$ 15,00</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          margin: "1rem 0 1rem 0",
                        }}
                      >
                        <Button
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "auto",
                            borderRadius: 3,
                            color: "#008000",
                            border: "1px #008000 solid",
                            transition: "transform 0.3s",
                            ":active": {
                              background: "#FFFFFF",
                              transform: "scale(0.95)",
                            },
                            ":hover": {
                              background: "#008000",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <CheckCircleRoundedIcon />
                          <Typography>Finalizar</Typography>
                        </Button>

                        <Button
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "auto",
                            borderRadius: 3,
                            color: " #0DC143",
                            border: "1px #0DC143 solid",
                            transition: "transform 0.3s",
                            ":active": {
                              background: "#FFFFFF",
                              transform: "scale(0.95)",
                            },
                            ":hover": {
                              background: "#0DC143",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </PerfectScrollbar>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: isMobile ? "90%" : "95%",
                  height: isMobile ? "27rem" : "45%",
                  background: "#FFFFFF",
                  borderRadius: 6,
                  boxShadow: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    height: "10%",
                    minHeight: "2rem",
                    borderBottom: "1px #955eef solid",
                  }}
                >
                  <Typography variant="h6">Finalizados</Typography>
                </Box>

                <PerfectScrollbar
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "90%",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "90%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px #955eef solid",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-around",
                            width: "65%",
                            height: "10rem",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <PersonRoundedIcon />
                            <Typography>Fatima</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <EventNoteRoundedIcon />
                            <Typography>12/03/2024 - 09:00</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <DriveEtaRoundedIcon />
                            <Typography>Twister</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#955eef",
                            }}
                          >
                            <WaterDropRoundedIcon />
                            <Typography>Lavagem Simples</Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "35%",
                            color: "#955eef",
                          }}
                        >
                          <Typography>R$75,00</Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          margin: "1rem 0 1rem 0",
                        }}
                      >
                        <Button
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "auto",
                            borderRadius: 3,
                            color: "#008000",
                            border: "1px #008000 solid",
                            transition: "transform 0.3s",
                            ":active": {
                              background: "#FFFFFF",
                              transform: "scale(0.95)",
                            },
                            ":hover": {
                              background: "#008000",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <CheckCircleRoundedIcon />
                          <Typography>Entregar veiculo</Typography>
                        </Button>

                        <Button
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            width: "auto",
                            borderRadius: 3,
                            color: " #0DC143",
                            border: "1px #0DC143 solid",
                            transition: "transform 0.3s",
                            ":active": {
                              background: "#FFFFFF",
                              transform: "scale(0.95)",
                            },
                            ":hover": {
                              background: "#0DC143",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </PerfectScrollbar>
              </Box>
            </Box>
          </Box>
        </PerfectScrollbar>
        {!isMobile && <DashboardSidebar />}
      </Box>
    </>
  );
}
