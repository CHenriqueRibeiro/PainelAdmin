import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../Components/Header";
import DashboardSidebar from "../Components/DashboardSidebar";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DriveEtaRoundedIcon from "@mui/icons-material/DriveEtaRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import moment from "moment";
import "moment/locale/pt-br";

import { useState } from "react";
export default function Reports() {
  moment.locale("pt-br");
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [currentYear, setCurrentYear] = useState(moment());
  const startOfWeek = currentWeek.clone().startOf("isoWeek");
  const endOfWeek = currentWeek.clone().endOf("isoWeek");
  const startOfMonth = currentMonth.clone().startOf("month");
  const startOfYear = currentYear.clone().startOf("year");
  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, "week"));
  };
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };
  const goToPreviousYear = () => {
    setCurrentYear(currentYear.clone().subtract(1, "year"));
  };

  const goToNextYear = () => {
    setCurrentYear(currentYear.clone().add(1, "year"));
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          width: isMobile ? "100dvw" : "80dvw",
          marginLeft: isMobile ? "0" : "20dvw",
          height: "100dvh",
          background: "#EDEDED",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
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
                <Typography variant="h6">Recebido hoje</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90%",
                  height: isMobile ? "25%" : "25%",
                  minHeight: "5rem",
                  background: "#955eef",
                  borderRadius: 3,
                  boxShadow: 3,
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#FFFFFF", marginBottom: "1px #FFFFFF solid" }}
                >
                  25/03/2024
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: "#FFFFFF", marginBottom: "1px #FFFFFF solid" }}
                >
                  R$ 100,00
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "90%",
                  alignItems: "center",

                  overflow: "auto",
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
                  </Box>
                </Box>
              </Box>
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
                  height: isMobile ? "15rem" : "25%",
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
                  <Typography variant="h6">Semanal</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "90%",
                    alignItems: "center",
                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      height: isMobile ? "75%" : "75%",
                      minHeight: "5rem",
                      background: "#955eef",
                      borderRadius: 3,
                      boxShadow: 3,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowLeftRoundedIcon
                        onClick={goToPreviousWeek}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          marginBottom: "1px #FFFFFF solid",
                        }}
                      >
                        {startOfWeek.format("DD/MM")} a{" "}
                        {endOfWeek.format("DD/MM/YYYY")}
                      </Typography>
                      <ArrowRightRoundedIcon
                        onClick={goToNextWeek}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        marginBottom: "1px #FFFFFF solid",
                      }}
                    >
                      R$ 3700,00
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: isMobile ? "90%" : "95%",
                  height: isMobile ? "15rem" : "25%",
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
                  <Typography variant="h6">Mensal</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "90%",
                    alignItems: "center",

                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      height: isMobile ? "75%" : "75%",
                      minHeight: "5rem",
                      background: "#955eef",
                      borderRadius: 3,
                      boxShadow: 3,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowLeftRoundedIcon
                        onClick={goToPreviousMonth}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          marginBottom: "1px #FFFFFF solid",
                        }}
                      >
                        {startOfMonth.format("MMMM YYYY")}
                      </Typography>
                      <ArrowRightRoundedIcon
                        onClick={goToNextMonth}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        marginBottom: "1px #FFFFFF solid",
                      }}
                    >
                      R$ 18.560,00
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: isMobile ? "90%" : "95%",
                  height: isMobile ? "15rem" : "25%",
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
                  <Typography variant="h6">Anual</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "90%",
                    alignItems: "center",

                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      height: isMobile ? "75%" : "75%",
                      minHeight: "5rem",
                      background: "#955eef",
                      borderRadius: 3,
                      boxShadow: 3,
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ArrowLeftRoundedIcon
                        onClick={goToPreviousYear}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          marginBottom: "1px #FFFFFF solid",
                        }}
                      >
                        {startOfYear.format("YYYY")}
                      </Typography>
                      <ArrowRightRoundedIcon
                        onClick={goToNextYear}
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 45,
                          cursor: "pointer",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        marginBottom: "1px #FFFFFF solid",
                      }}
                    >
                      R$ 154.654,54
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {!isMobile && <DashboardSidebar />}
      </Box>
    </>
  );
}
