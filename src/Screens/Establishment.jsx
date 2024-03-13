import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navbar from "../Components/Header";
import DashboardSidebar from "../Components/DashboardSidebar";
import PerfectScrollbar from "react-perfect-scrollbar";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-perfect-scrollbar/dist/css/styles.css";
export default function Establishment() {
  const [servicos, setServicos] = useState([{ servico: "", valor: "" }]);
  const [horario, setHorario] = useState([{ horario: "" }]);
  const handleAddBoxService = () => {
    setServicos([...servicos, { servico: "", valor: "" }]);
  };

  const handleInputChangeService = (index, field, value) => {
    const newServicos = [...servicos];
    newServicos[index][field] = value;
    setServicos(newServicos);
  };

  const handleDeleteBoxService = (index) => {
    if (servicos.length > 1) {
      const newServicos = [...servicos];
      newServicos.splice(index, 1);
      setServicos(newServicos);
    }
  };
  const handleAddBoxHours = () => {
    setHorario([...horario, { servico: "" }]);
  };

  const handleInputChangeHours = (index, field, value) => {
    const newServicos = [...horario];
    newServicos[index][field] = value;
    setHorario(newServicos);
  };

  const handleDeleteBoxHours = (index) => {
    if (horario.length > 1) {
      const newServicos = [...horario];
      newServicos.splice(index, 1);
      setHorario(newServicos);
    }
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
              mt: isMobile ? 4 : 0,
              height: isMobile ? "100%" : "95%",
              width: "95%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: isMobile ? "100%" : "95%",
                height: "auto",
                minHeight: "25rem",
                background: "#FFFFFF",
                borderRadius: 6,
                boxShadow: 5,
                pb: 4,
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
                  minHeight: "3rem",
                  borderBottom: "1px #955eef solid",
                }}
              >
                <Typography variant="h6">Dados do estabelecimento</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "90%",
                  height: isMobile ? "25%" : "25%",
                  minHeight: "16rem",
                  background: "#955eef",
                  borderRadius: 3,
                  boxShadow: 3,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "95%",
                    height: isMobile ? "85%" : "90%",
                    minHeight: "14rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "95%",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "95%",
                      height: isMobile ? "25%" : "25%",
                    }}
                  >
                    <OutlinedInput
                      placeholder="Nome"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "45%",
                        background: "#FFFFFF",
                        borderColor: "#955eef",
                      }}
                    />
                    <OutlinedInput
                      placeholder="Telefone"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "50%",
                        background: "#FFFFFF",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "95%",
                      height: isMobile ? "25%" : "25%",
                    }}
                  >
                    <OutlinedInput
                      placeholder="Cep"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "35%",
                        background: "#FFFFFF",
                        borderColor: "#955eef",
                      }}
                    />
                    <OutlinedInput
                      placeholder="Bairro"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "55%",
                        background: "#FFFFFF",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "95%",
                      height: isMobile ? "25%" : "25%",
                    }}
                  >
                    <OutlinedInput
                      placeholder="Endereço"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "70%",
                        background: "#FFFFFF",
                        borderColor: "#955eef",
                      }}
                    />
                    <OutlinedInput
                      placeholder="N°"
                      sx={{
                        borderRadius: 3,
                        height: "3rem",
                        width: "25%",
                        background: "#FFFFFF",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "95%",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#FFFFFF",
                        borderRadius: 3,
                        background: "#9A6CDB",
                        color: "#FFFFFF",
                        ":active": {
                          borderColor: "#9A6CDB",
                          background: "#FFFFFF",
                          color: "#9A6CDB",
                        },
                        ":hover": {
                          borderColor: "#9A6CDB",
                          background: "#FFFFFF",
                          color: "#9A6CDB",
                        },
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#FFFFFF",
                        borderRadius: 3,
                        background: "#9A6CDB",
                        color: "#FFFFFF",
                        ":active": {
                          background: "#FFFFFF",
                          color: "#9A6CDB",
                        },
                        ":hover": {
                          borderColor: "#9A6CDB",
                          background: "#FFFFFF",
                          color: "#9A6CDB",
                        },
                      }}
                    >
                      Salvar
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "90%",
                  height: "auto",
                  maxHeight: "16rem",
                  background: "#955eef",
                  borderRadius: 3,
                  boxShadow: 3,
                  marginTop: "1rem",
                }}
              >
                <PerfectScrollbar
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                  }}
                >
                  {servicos.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "90%",
                        height: "25%",
                        mt: index > 0 ? 2 : 2,
                        pt: 4,
                      }}
                    >
                      <OutlinedInput
                        placeholder="Serviço"
                        value={item.servico}
                        onChange={(e) =>
                          handleInputChangeService(
                            index,
                            "servico",
                            e.target.value
                          )
                        }
                        sx={{
                          borderRadius: 3,
                          height: "3rem",
                          width: "60%",
                          background: "#FFFFFF",
                          borderColor: "#955eef",
                        }}
                      />
                      <OutlinedInput
                        placeholder="Valor"
                        value={item.valor}
                        onChange={(e) =>
                          handleInputChangeService(
                            index,
                            "valor",
                            e.target.value
                          )
                        }
                        sx={{
                          borderRadius: 3,
                          height: "3rem",
                          width: "20%",
                          background: "#FFFFFF",
                        }}
                      />
                      {servicos.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteBoxService(index)}
                          sx={{
                            width: "15%",
                            height: "3rem",
                            background: "#ff7979",
                            color: "#FFFFFF",
                            ":hover": {
                              background: "#e74c3c",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </PerfectScrollbar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    mt: 2.5,
                    mb: 2,
                    width: "90%",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAddBoxService}
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Adicionar Serviço
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "95%",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Salvar
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-around",
                  width: "90%",
                  height: "auto",
                  maxHeight: "16rem",
                  background: "#955eef",
                  borderRadius: 3,
                  boxShadow: 3,
                  marginTop: "1rem",
                }}
              >
                <PerfectScrollbar
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                  }}
                >
                  {horario.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "90%",
                        height: "25%",
                        mt: index > 0 ? 2 : 2,
                        pt: 4,
                      }}
                    >
                      <OutlinedInput
                        placeholder="horario"
                        value={item.servico}
                        onChange={(e) =>
                          handleInputChangeHours(
                            index,
                            "servico",
                            e.target.value
                          )
                        }
                        sx={{
                          borderRadius: 3,
                          height: "3rem",
                          width: "5rem",
                          background: "#FFFFFF",
                          borderColor: "#955eef",
                        }}
                      />

                      {horario.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteBoxHours(index)}
                          sx={{
                            width: "15%",
                            height: "3rem",
                            background: "#ff7979",
                            color: "#FFFFFF",
                            ":hover": {
                              background: "#e74c3c",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </PerfectScrollbar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    mt: 2.5,
                    mb: 2,
                    width: "90%",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAddBoxHours}
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Adicionar Hora
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "95%",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#FFFFFF",
                      borderRadius: 3,
                      background: "#9A6CDB",
                      color: "#FFFFFF",
                      ":active": {
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                      ":hover": {
                        borderColor: "#9A6CDB",
                        background: "#FFFFFF",
                        color: "#9A6CDB",
                      },
                    }}
                  >
                    Salvar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </PerfectScrollbar>
        {!isMobile && <DashboardSidebar />}
      </Box>
    </>
  );
}
