// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Box, Grid2, Typography, Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import PaidIcon from "@mui/icons-material/Paid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";

const ReportPage = () => {
  dayjs.locale("pt-br");
  dayjs.extend(updateLocale);
  dayjs.updateLocale("pt-br", {
    weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  });

  const [startDate, setStartDate] = useState(dayjs().startOf("week"));
  const [endDate, setEndDate] = useState(dayjs().endOf("week"));
  const [reportData, setReportData] = useState(null);
  const ownerUser = JSON.parse(localStorage.getItem("user"));
  const ownerId = ownerUser.id;
  const token = localStorage.getItem("authToken");
  const [owner, setOwner] = useState(null);
  const establishmentSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOwner(data);
    } catch (err) {
      console.error("Erro ao buscar estabelecimentos:", err);
    }
  };

  useEffect(() => {
    establishmentSearch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!owner?.establishments?.[0]?._id) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/appointments/appointments/report/dashboard?startDate=${startDate.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate.format(
            "YYYY-MM-DD"
          )}&establishmentId=${owner.establishments[0]._id}`
        );
        const data = await res.json();
        setReportData(data);
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, owner]);

  const weeklyRevenueData = reportData
    ? [
        reportData.weeklyRevenueByDay.Dom,
        reportData.weeklyRevenueByDay.Seg,
        reportData.weeklyRevenueByDay.Ter,
        reportData.weeklyRevenueByDay.Qua,
        reportData.weeklyRevenueByDay.Qui,
        reportData.weeklyRevenueByDay.Sex,
        reportData.weeklyRevenueByDay.Sáb,
      ]
    : [];

  const serviceTypeLabels = reportData
    ? Object.keys(reportData.serviceTypes)
    : [];
  const serviceTypeValues = reportData
    ? Object.values(reportData.serviceTypes)
    : [];

  const reservedHoursLabels = reportData
    ? Object.keys(reportData.reservedHours)
    : [];
  const reservedHoursValues = reportData
    ? Object.values(reportData.reservedHours)
    : [];
  const totalRevenue = reportData?.totalRevenue ?? 0;
  const totalWashes = reservedHoursValues.reduce((a, b) => a + b, 0);
  const commonCardStyles = {
    background: "rgba(255, 255, 255, 0.5)",
    boxShadow: 3,
    backdropFilter: "blur(10px)",
    borderRadius: 6,
  };

  return (
    <Box sx={{ p: 4, background: "#F1EEFF" }}>
      <Grid2
        container
        spacing={1}
        sx={{
          background: "#FFFFFF",
          boxShadow: 3,
          backdropFilter: "blur(10px)",
          borderRadius: 6,
          p: 1.4,
          mb: 3,
        }}
      >
        <Grid2 size={{ xs: 12, md: 12, lg: 4 }} sx={{ height: "100%" }}>
          <Card
            sx={{
              background: "transparent",
              boxShadow: 0,
              borderRadius: 6,
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
                borderRadius: 6,
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                Filtrar por período
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.4 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    label="Início"
                    format="DD/MM/YYYY"
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(newValue) => newValue && setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: {
                          color: "#FFFFFF",
                          input: {
                            color: "#FFFFFF",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#FFFFFF",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#FFFFFF",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFFFFF",
                          },
                          "& label.Mui-focused": {
                            color: "#B2BA",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottomColor: "#B2BA",
                          },
                          "& .css-joz0rk-MuiPickersSectionList-section-MuiPickersInputBase-section":
                            {
                              color: "#FFFFFF",
                            },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#FFFFFF",
                            },
                            "&:hover fieldset": {
                              borderColor: "#FFFFFF",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFFFFF",
                            },
                          },
                        },
                      },
                      day: {
                        sx: {
                          "&.Mui-selected": {
                            backgroundColor: "#1976d2",
                            color: "#FFFFFF",
                          },
                          "&:hover": {
                            backgroundColor: "#6b21a8",
                            color: "#FFFFFF",
                          },
                        },
                      },
                      popper: {
                        sx: {
                          "& .MuiPaper-root": {
                            borderRadius: 6,
                          },
                        },
                      },
                    }}
                  />

                  <DatePicker
                    label="Fim"
                    format="DD/MM/YYYY"
                    value={endDate ? dayjs(endDate) : null}
                    onChange={(newValue) => newValue && setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        sx: {
                          color: "#FFFFFF",
                          input: {
                            color: "#FFFFFF",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#FFFFFF",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#FFFFFF",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#FFFFFF",
                          },
                          "& label.Mui-focused": {
                            color: "#B2BA",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottomColor: "#B2BA",
                          },
                          "& .css-joz0rk-MuiPickersSectionList-section-MuiPickersInputBase-section":
                            {
                              color: "#FFFFFF",
                            },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#FFFFFF",
                            },
                            "&:hover fieldset": {
                              borderColor: "#FFFFFF",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#FFFFFF",
                            },
                          },
                        },
                      },
                      day: {
                        sx: {
                          "&.Mui-selected": {
                            backgroundColor: "#1976d2",
                            color: "#FFFFFF",
                          },
                          "&:hover": {
                            backgroundColor: "#6b21a8",
                            color: "#FFFFFF",
                          },
                        },
                      },
                      popper: {
                        sx: {
                          "& .MuiPaper-root": {
                            borderRadius: 6,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }} sx={{ height: "100%" }}>
          <Card
            sx={{
              background: "transparent",
              boxShadow: 0,
              borderRadius: 6,
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                position: "relative",
                background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
                height: "100%",
                borderRadius: 4,
              }}
            >
              <PaidIcon
                sx={{
                  position: "absolute",
                  top: "55%",
                  left: "-1rem",
                  transform: "translateY(-50%)",
                  fontSize: 60,
                  color: "#FFFFFF",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                Receita total
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 28,
                  lineHeight: 1.8,
                }}
              >
                R$ {totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }} sx={{ height: "100%" }}>
          <Card
            sx={{
              background: "transparent",
              boxShadow: 0,
              borderRadius: 6,
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                position: "relative",
                background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
                height: "100%",
                borderRadius: 6,
              }}
            >
              <NoCrashIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "-1rem",
                  transform: "translateY(-50%)",
                  fontSize: 70,
                  color: "#FFFFFF",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                Lavagens totais
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 28,
                  lineHeight: 1.8,
                }}
              >
                {totalWashes}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        {/*<Grid2 size={{ xs: 12, md: 6, lg: 2.66 }} sx={{ height: "100%" }}>
          <Card
            sx={{
              background: "transparent",
              boxShadow: 0,
              borderRadius: 6,
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                position: "relative",
                background:
                  "linear-gradient(to right, #cc99f6, #d19cf5, #d59ff5, #daa3f4)",
                height: "100%",
                borderRadius: 6,
              }}
            >
              <WaterDropIcon
                sx={{
                  position: "absolute",
                  top: "55%",
                  left: "-1.5rem",
                  transform: "translateY(-50%)",
                  fontSize: 70,
                  color: "#FFFFFF",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                Mais lavado
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 28,
                  lineHeight: 1.8,
                }}
              >
                Moto
              </Typography>
            </CardContent>
          </Card>
        </Grid2>*/}
      </Grid2>

      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, md: 12, lg: 12 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Receita Semanal
              </Typography>
              {weeklyRevenueData.every((val) => val === 0) ? (
                <Box
                  sx={{
                    height: 265,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    Não há dados para mostrar no período selecionado.
                  </Typography>
                </Box>
              ) : (
                <Chart
                  options={{
                    chart: { id: "area", toolbar: { show: false } },
                    xaxis: {
                      categories: [
                        "Dom",
                        "Seg",
                        "Ter",
                        "Qua",
                        "Qui",
                        "Sex",
                        "Sáb",
                      ],
                    },
                    stroke: { curve: "smooth" },
                    fill: {
                      type: "gradient",
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100],
                      },
                    },
                    colors: ["#9333ea"],
                  }}
                  series={[{ name: "Receita", data: weeklyRevenueData }]}
                  type="area"
                  height={250}
                />
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Tipos de Serviço
              </Typography>
              {serviceTypeValues.every((val) => val === 0) ? (
                <Box
                  sx={{
                    height: 265,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    Não há dados para mostrar no período selecionado.
                  </Typography>
                </Box>
              ) : (
                <Chart
                  options={{
                    chart: { type: "bar", toolbar: { show: true } },
                    xaxis: { categories: serviceTypeLabels },
                    colors: ["#9333ea"],
                    plotOptions: {
                      bar: { borderRadius: 6, columnWidth: "50%" },
                    },
                    dataLabels: { enabled: false },
                  }}
                  series={[{ name: "Quantidade", data: serviceTypeValues }]}
                  type="bar"
                  height={250}
                />
              )}
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Horários Mais Reservados
              </Typography>
              {reservedHoursValues.every((val) => val === 0) ? (
                <Box
                  sx={{
                    height: 265,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    Não há dados para mostrar no período selecionado.
                  </Typography>
                </Box>
              ) : (
                <Chart
                  options={{
                    chart: { id: "horarios", toolbar: { show: true } },
                    xaxis: { categories: reservedHoursLabels },
                    colors: ["#7e22ce"],
                    plotOptions: {
                      bar: { borderRadius: 6, columnWidth: "50%" },
                    },
                    dataLabels: { enabled: false },
                  }}
                  series={[{ name: "Reservas", data: reservedHoursValues }]}
                  type="bar"
                  height={250}
                />
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ReportPage;
