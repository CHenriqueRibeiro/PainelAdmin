import { useEffect, useState } from "react";
import {
  Box,
  Button,
  //IconButton,
  Input,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardSidebar from "../Components/DashboardSidebar";
import PerfectScrollbar from "react-perfect-scrollbar";
//import DeleteIcon from "@mui/icons-material/Delete";
//import InputMask from "react-input-mask";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
export default function Establishment() {
  const [nameEstablishment, setNameEstablishment] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [outHours, setOutHours] = useState("");
  const [dataEstablishment, setDataEstablishment] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const { isTokenValid } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const OwnerUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [isTokenValid]);

  useEffect(() => {
    const fetchCepApi = async () => {
      if (cep.length === 9) {
        try {
          const response = await fetch(
            `https://brasilapi.com.br/api/cep/v2/${cep}`
          );

          if (!response.ok) {
            throw new Error("Erro ao buscar CEP");
          }

          const data = await response.json();
          console.log("Dados do CEP:", data);

          setCity(data.city);
          setNeighborhood(data.neighborhood);
          setAddress(data.street);
          setCep(data.cep);
          setState(data.state);
          setCep(data.cep);
          setLatitude(data.location.coordinates.latitude);
          setLongitude(data.location.coordinates.longitude);
        } catch (error) {
          console.error("Erro:", error);
        }
      }
    };

    fetchCepApi();
  }, [cep]);

  const fetchEstablishments = async () => {
    const ownerId = OwnerUser.id;
    const token = localStorage.getItem("authToken");

    if (!ownerId || !token) {
      console.warn("Dono ou token não encontrados");
      return;
    }

    try {
      const response = await fetch(
        `https://backlavaja.onrender.com/api/establishment/owner/${ownerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar estabelecimentos");
      }

      const data = await response.json();
      setDataEstablishment(data.establishments);
      console.log("Estabelecimentos:", data.establishments);
    } catch (error) {
      console.error("Erro:", error);
    }
  };
  useEffect(() => {
    fetchEstablishments();
  }, []);
  console.log(dataEstablishment);
  const createEstablishment = async () => {
    const userData = {
      nameEstablishment: nameEstablishment,
      address: {
        state: state,
        city: city,
        neighborhood: neighborhood,
        street: address,
        number: addressNumber,
        latitude: Number(latitude),
        longitude: Number(longitude),
        cep: Number(cep),
      },
      openingHours: {
        open: openHours,
        close: outHours,
      },
      owner: OwnerUser.id,
    };
    console.log(userData);
    try {
      const response = await fetch(
        "https://backlavaja.onrender.com/api/establishment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar estabelecimento");
      }

      const result = await response.json();
      console.log("Estabelecimento criado:", result);
      await fetchEstablishments();
    } catch (error) {
      console.error("Erro:", error);
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
        {dataEstablishment.length > 0 ? (
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
                    width: "95%",
                    height: isMobile ? "10%" : "5%",
                    minHeight: "3rem",
                    borderBottom: "1px #9E36AF solid",
                  }}
                >
                  <Typography variant="h6">Dados do estabelecimento</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex_start",
                    justifyContent: "space-around",
                    width: "95%",
                    height: isMobile ? "25%" : "25%",
                    minHeight: "16rem",
                    background: "#9E36AF",
                    borderRadius: 3,
                    boxShadow: 3,
                    mt: 2,
                    pl: 3,
                  }}
                >
                  <Typography variant="h6" component="h2" color="#FFFFFF">
                    Nome:{dataEstablishment[0].nameEstablishment}
                  </Typography>
                  <Typography variant="h6" component="h2" color="#FFFFFF">
                    Endereço:{dataEstablishment[0].address.street}
                  </Typography>
                  <Typography variant="h6" component="h2" color="#FFFFFF">
                    Horário de abertura:{" "}
                    {dataEstablishment[0].openingHours.open} hr
                  </Typography>
                  <Typography variant="h6" component="h2" color="#FFFFFF">
                    Horário de fechamento:{" "}
                    {dataEstablishment[0].openingHours.close} hr
                  </Typography>
                </Box>
              </Box>
            </Box>
          </PerfectScrollbar>
        ) : (
          <>
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
                    <Typography variant="h6">
                      Dados do estabelecimento
                    </Typography>
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
                          onChange={(e) => setNameEstablishment(e.target.value)}
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
                          placeholder="Horario de abertura"
                          sx={{
                            borderRadius: 3,
                            height: "3rem",
                            width: "35%",
                            background: "#FFFFFF",
                            borderColor: "#955eef",
                          }}
                          onChange={(e) => setOpenHours(e.target.value)}
                        />
                        <OutlinedInput
                          placeholder="Horario de fechamento"
                          sx={{
                            borderRadius: 3,
                            height: "3rem",
                            width: "55%",
                            background: "#FFFFFF",
                          }}
                          onChange={(e) => setOutHours(e.target.value)}
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
                          inputComponent={InputMask}
                          inputProps={{
                            mask: "99999-999",
                            maskChar: null,
                            required: true,
                          }}
                          onChange={(e) => setCep(e.target.value)}
                        />
                        <OutlinedInput
                          placeholder="Endereço"
                          value={address}
                          sx={{
                            borderRadius: 3,
                            height: "3rem",
                            width: "60%",
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
                          placeholder="Cidade"
                          value={city}
                          sx={{
                            borderRadius: 3,
                            height: "3rem",
                            width: "70%",
                            background: "#FFFFFF",
                            borderColor: "#955eef",
                          }}
                        />
                        <OutlinedInput
                          placeholder="Bairro"
                          value={neighborhood}
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
                          justifyContent: "space-between",
                          width: "95%",
                          height: isMobile ? "25%" : "25%",
                        }}
                      >
                        <OutlinedInput
                          placeholder="Estado"
                          value={state}
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
                          value={addressNumber}
                          sx={{
                            borderRadius: 3,
                            height: "3rem",
                            width: "70%",
                            background: "#FFFFFF",
                            borderColor: "#955eef",
                          }}
                          onChange={(e) => setAddressNumber(e.target.value)}
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
                          onClick={createEstablishment}
                        >
                          Salvar
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {/*<Box
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
                          borderRadius: "1rem",
                          height: "3rem",
                          width: "25%",
                          background: "#FFFFFF",
                        }}
                      />
                      {servicos.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteBoxService(index)}
                          sx={{
                            width: "10%",
                            height: "3rem",
                            color: "#cd1c1c",
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
              </Box>*/}
                  {/*<Box
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
                          borderRadius: "1rem",
                          height: "3rem",
                          width: "6rem",
                          background: "#FFFFFF",
                          borderColor: "#955eef",
                        }}
                      />

                      {horario.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteBoxHours(index)}
                          sx={{
                            width: "10%",
                            height: "3rem",
                            color: "#cd1c1c",
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
              </Box>*/}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-around",
                      width: "90%",
                      height: "auto",
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
                        flexDirection: "row",
                        minHeight: "5rem",
                        width: isMobile ? "90%" : "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={{}}
                        sx={{ width: "95%" }}
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
                        mb: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={{}}
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
                        Salvar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </PerfectScrollbar>
          </>
        )}

        {!isMobile && <DashboardSidebar />}
      </Box>
    </>
  );
}
