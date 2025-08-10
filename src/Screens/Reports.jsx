// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import PaidIcon from "@mui/icons-material/Paid";
import SearchIcon from "@mui/icons-material/Search";
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
  const [dateError, setDateError] = useState("");
  const ownerUser = JSON.parse(localStorage.getItem("user"));
  const ownerId = ownerUser.id;
  const token = localStorage.getItem("authToken");
  const [owner, setOwner] = useState(null);
  const establishmentSearch = async () => {
    try {
      const response = await fetch(
        `https://lavaja.up.railway.app/api/establishment/owner/${ownerId}`,
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
    if (owner?.establishments?.[0]?._id) {
      fetchReportData();
    }
  }, [owner]);

  const handleStartDateChange = (newValue) => {
    if (newValue && endDate && newValue.isAfter(endDate)) {
      setDateError("A data inicial não pode ser maior que a data final");
      return;
    }
    setDateError("");
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    if (newValue) {
      if (newValue.isBefore(startDate)) {
        setDateError("A data final não pode ser menor que a data inicial");
        return;
      }
      if (newValue.isAfter(dayjs())) {
        setDateError("A data final não pode ser maior que hoje");
        return;
      }
    }
    setDateError("");
    setEndDate(newValue);
  };

  const fetchReportData = async () => {
    if (!owner?.establishments?.[0]?._id) return;
    if (dateError) {
      return;
    }
    try {
      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

      const res = await fetch(
        `https://lavaja.up.railway.app/api/appointments/appointments/report/dashboard?startDate=${formattedStartDate}&endDate=${formattedEndDate}&establishmentId=${owner.establishments[0]._id}`
      );
      const data = await res.json();
      setReportData(data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    }
  };

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

const originLabels = reportData ? Object.keys(reportData.origins || {}) : [];
const originValues = reportData ? Object.values(reportData.origins || {}) : [];
// FIXOS por tipo (donut ou barra)
const fixedTypeLabels = reportData ? Object.keys(reportData.costs?.fixed?.byType || {}) : [];
const fixedTypeValues = reportData ? Object.values(reportData.costs?.fixed?.byType || {}) : [];
const fixedTotal = reportData?.costs?.fixed?.total ?? 0;

// VARIÁVEIS por produto (donut ou barra)
const varProdLabels = reportData ? Object.keys(reportData.costs?.variable?.byProduct || {}) : [];
const varProdValues = reportData ? Object.values(reportData.costs?.variable?.byProduct || {}) : [];
const variableTotal = reportData?.costs?.variable?.total ?? 0;


const topCustomers = reportData?.topCustomers || [];
const topCustLabels = topCustomers.map((c) => c.name || c.phone);
const topCustCounts = topCustomers.map((c) => c.count);

// ---- Ganhos x Gastos (por dia) ----
const ts = reportData?.timeseries || {};
const revByDay = ts.revenueByDay || {};
const costByDay = ts.costsByDay || {};
const netByDay = ts.netByDay || {};

// gera eixo de datas contínuo entre startDate e endDate (YYYY-MM-DD)
const daysRange = [];
if (startDate && endDate) {
  const d0 = dayjs(startDate).startOf("day");
  const d1 = dayjs(endDate).startOf("day");
  for (let d = d0; d.isBefore(d1) || d.isSame(d1); d = d.add(1, "day")) {
    daysRange.push(d.format("YYYY-MM-DD"));
  }
}

// monta as séries alinhadas ao eixo
const seriesRevenue = daysRange.map((k) => Number(revByDay[k] || 0));
const seriesCosts   = daysRange.map((k) => Number(costByDay[k] || 0));
const seriesNet     = daysRange.map((k) => Number(netByDay[k] || 0));
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
        <Grid2 size={{ xs: 12, md: 12, lg: 6 }} sx={{ height: "100%" }}>
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
              {dateError && (
                <Typography
                  variant="caption"
                  sx={{ color: "red", mt: 0.5, display: "block" }}
                >
                  {dateError}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1.4,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="pt-br"
                  localeText={
                    ptBR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flex: 1,
                      flexDirection: { xs: "column", sm: "row" },
                      minWidth: "6.5rem",
                    }}
                  >
                    <DatePicker
                      label="Início"
                      format="DD/MM/YYYY"
                      value={startDate}
                      onChange={handleStartDateChange}
                      maxDate={endDate || dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!dateError,
                          sx: {
                            bgcolor: "#fff",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "#fff",
                            },
                            "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#ff8ba7",
                              },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          },
                        },
                      }}
                    />

                    <DatePicker
                      label="Fim"
                      format="DD/MM/YYYY"
                      value={endDate}
                      onChange={handleEndDateChange}
                      minDate={startDate}
                      maxDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!dateError,
                          sx: {
                            bgcolor: "#fff",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              bgcolor: "#fff",
                            },
                            "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "#ff8ba7",
                              },
                            "& .MuiInputBase-root.Mui-error": {
                              bgcolor: "#fff",
                            },
                          },
                        },
                      }}
                    />
                  </Box>

                  <IconButton
                    onClick={fetchReportData}
                    disabled={!!dateError}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 3,
                      height: 40,
                      width: 40,
                      alignSelf: "center",
                      "&:hover": {
                        bgcolor: "#eaeaea",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#f5f5f5",
                        "& .MuiSvgIcon-root": {
                          color: "#bdbdbd",
                        },
                      },
                    }}
                  >
                    <SearchIcon sx={{ color: "#6b21a8" }} />
                  </IconButton>
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }} sx={{ height: "100%" }}>
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
        
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }} sx={{ height: "100%" }}>
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
                Receita no período
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
  <Grid2 size={{ xs: 12 }}>
    <Card sx={commonCardStyles}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 600 }}>
          Receita x Gastos no período
        </Typography>

        {(!daysRange.length) || (seriesRevenue.every(v => v === 0) && seriesCosts.every(v => v === 0)) ? (
          <Box sx={{ height: 265, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Não há dados para mostrar no período selecionado.
            </Typography>
          </Box>
        ) : (
          <Chart
  options={{
    chart: { type: "area", toolbar: { show: false }, background: "transparent" },
    xaxis: { categories: daysRange.map(d => dayjs(d).format("DD/MM")) },
    stroke: { curve: "smooth", width: 2 },            // linhas mais grossas
    markers: { size: 4, strokeWidth: 0 },             // pontos visíveis
    dataLabels: { enabled: false },
    legend: { position: "bottom" },
    colors: ["#16a34a", "#ef4444", "#2563eb"],        // ganho, gasto, lucro
    fill: {                                           // área com mais contraste
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.08, stops: [0, 90, 100] },
    },
    grid: { borderColor: "rgba(0,0,0,0.08)" },
    tooltip: { y: { formatter: v => `R$ ${Number(v).toFixed(2)}` } },
    yaxis: { min: 0 }                                  // evita “afundar” perto do zero
  }}
  series={[
    { name: "Ganhos", data: seriesRevenue },
    { name: "Gastos", data: seriesCosts },
    { name: "Lucro",  data: seriesNet },
  ]}
  type="area"
  height={280}
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
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 600 }}>
          Custos Variáveis por Produto no período
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total: R$ {variableTotal.toFixed(2)}
        </Typography>

        {!varProdValues.length || varProdValues.every(v => v === 0) ? (
          <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Não há dados para mostrar no período selecionado.
            </Typography>
          </Box>
        ) : (
          <Chart
            options={{
              labels: varProdLabels,
              chart: { type: "donut", toolbar: { show: true } },
              legend: { position: "bottom" },
              colors: ["#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#d8b4fe"],
              dataLabels: { enabled: true },
            }}
            series={varProdValues}
            type="donut"
            height={250}
          />
        )}
      </CardContent>
    </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
    <Card sx={commonCardStyles}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 600 }}>
          Custos Fixos por Tipo no período
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total: R$ {fixedTotal.toFixed(2)}
        </Typography>

        {!fixedTypeValues.length || fixedTypeValues.every(v => v === 0) ? (
          <Box sx={{ height: 255, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Não há dados para mostrar no período selecionado.
            </Typography>
          </Box>
        ) : (
          <Chart
            options={{
              labels: fixedTypeLabels,
              chart: { type: "donut", toolbar: { show: true } },
              legend: { position: "bottom" },
              colors: ["#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#d8b4fe"],
              dataLabels: { enabled: true },
            }}
            series={fixedTypeValues}
            type="donut"
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
                Serviço mais reservados no período
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
                Horários Mais Reservados no período
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
         <Grid2 size={{ xs: 12}}>
    <Card sx={commonCardStyles}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 600 }}>
          Origem dos Agendamentos no período
        </Typography>

        {(!originValues.length || originValues.every((v) => v === 0)) ? (
          <Box sx={{ height: 265, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Não há dados para mostrar no período selecionado.
            </Typography>
          </Box>
        ) : (
          <Chart
            options={{
              labels: originLabels,         // ["Sistema","Link","Outros"]
              chart: { type: "donut", toolbar: { show: true } },
              legend: { position: "bottom" },
              // mantém a paleta do projeto
              colors: ["#7e22ce", "#9333ea", "#c084fc"],
              dataLabels: { enabled: true },
            }}
            series={originValues}          // [qtdSistema, qtdLink, qtdOutros]
            type="donut"
            height={250}
          />
        )}
      </CardContent>
    </Card>
  </Grid2>
      </Grid2>
<Grid2 container spacing={3} sx={{ mb: 3 }}>
      <Grid2 size={{ xs: 12 }}>
    <Card sx={commonCardStyles}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ color: "#6b21a8", fontWeight: 600 }}>
          Top Clientes no período
        </Typography>

        {!topCustCounts.length ? (
          <Box sx={{ height: 265, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Não há dados para mostrar no período selecionado.
            </Typography>
          </Box>
        ) : (
          <Chart
            options={{
              chart: { type: "bar", toolbar: { show: true } },
              xaxis: { categories: topCustLabels },
              colors: ["#7e22ce"],
              plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
              dataLabels: { enabled: false },
              tooltip: {
                y: {
                  formatter: (val, { dataPointIndex }) => {
                    const spent = topCustSpent?.[dataPointIndex] ?? 0;
                    return `${val} lavagens • R$ ${spent.toFixed(2)}`;
                  },
                },
              },
            }}
            series={[{ name: "Lavagens", data: topCustCounts }]}
            type="bar"
            height={260}
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
