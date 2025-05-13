// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Box, Grid2, Typography, Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
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
  const [startDate, setStartDate] = useState(
    dayjs().startOf("week").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("week").format("YYYY-MM-DD")
  );

  const commonCardStyles = {
    background: "rgba(255, 255, 255, 0.5)",
    boxShadow: 3,
    backdropFilter: "blur(10px)",
    borderRadius: 6,
  };

  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["João", "Maria", "Lucas", "Ana"],
    },
    colors: ["#9333ea"],
  };

  const serviceChartOptions = {
    ...barChartOptions,
    xaxis: {
      categories: ["Simples", "Completa", "Premium"],
    },
  };

  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Cartão", "Dinheiro", "Pix"],
    colors: ["#9333ea", "#c084fc", "#e9d5ff"],
    legend: {
      position: "bottom",
    },
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
                    onChange={(newValue) => {
                      if (newValue) setStartDate(newValue.format("YYYY-MM-DD"));
                    }}
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
                    onChange={(newValue) => {
                      if (newValue) setEndDate(newValue.format("YYYY-MM-DD"));
                    }}
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
        <Grid2 size={{ xs: 12, md: 12, lg: 2.66 }} sx={{ height: "100%" }}>
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
                Receita
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
                R$ 1.541,12
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 2.66 }} sx={{ height: "100%" }}>
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
                126
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 2.66 }} sx={{ height: "100%" }}>
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
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Receita Semanal
              </Typography>
              <Chart
                options={{
                  ...barChartOptions,
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
                }}
                series={[
                  { name: "Receita", data: [12, 15, 11, 18, 14, 20, 25] },
                ]}
                type="area"
                height={250}
              />
            </CardContent>
          </Card>
        </Grid2>
        {/*<Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Funcionários que Mais Lavaram
              </Typography>
              <Chart
                options={barChartOptions}
                series={[{ name: "Lavagens", data: [30, 25, 20, 18] }]}
                type="bar"
                height={250}
              />
            </CardContent>
          </Card>
        </Grid2>*/}
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
              <Chart
                options={serviceChartOptions}
                series={[{ name: "Quantidade", data: [50, 30, 20] }]}
                type="bar"
                height={250}
              />
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
                Formas de Pagamento
              </Typography>
              <Chart
                options={pieChartOptions}
                series={[40, 35, 25]}
                type="pie"
                height={265}
              />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Horários Mais Reservados
              </Typography>
              <Chart
                options={{
                  chart: { id: "horarios", toolbar: { show: false } },
                  xaxis: {
                    categories: [
                      "08h",
                      "09h",
                      "10h",
                      "11h",
                      "12h",
                      "13h",
                      "14h",
                    ],
                  },
                  colors: ["#7e22ce"],
                  dataLabels: { enabled: false },
                }}
                series={[{ name: "Reservas", data: [5, 8, 15, 12, 7, 9, 4] }]}
                type="bar"
                height={250}
              />
            </CardContent>
          </Card>
        </Grid2>
        {/*<Grid2 size={{ xs: 12, md: 6 }}>
          <Card sx={commonCardStyles}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ color: "#6b21a8", fontWeight: 600 }}
              >
                Origem do Agendamento
              </Typography>
              <Chart
                options={{
                  labels: ["Aplicativo", "Sistema"],
                  legend: { position: "bottom" },
                  colors: ["#6b21a8", "#c084fc"],
                }}
                series={[60, 40]}
                type="donut"
                height={265}
              />
            </CardContent>
          </Card>
        </Grid2>*/}
      </Grid2>
    </Box>
  );
};

export default ReportPage;
