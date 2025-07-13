import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const WelcomeModal = ({
  isOpen,
  onClose,
  statusConta,
  dataLimite,
  onboardingSteps = { estabelecimento: false, servico: false }
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    if (location.pathname === '/Estabelecimento' && !onboardingSteps.estabelecimento) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [location.pathname, onboardingSteps.estabelecimento]);

 const isDataLimiteExpirada = () => {
  if (!dataLimite) return false;
  const agora = new Date();
  let limite;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataLimite)) {
    const [dia, mes, ano] = dataLimite.split("/");
    limite = new Date(`${ano}-${mes}-${dia}T23:59:59`);
  } else {
    limite = new Date(dataLimite);
  }
  return agora > limite;
};


  const expirado = isDataLimiteExpirada();

  const formatarData = (data) => {
    if (!data) return null;
    const novaData = new Date(data);
    return !isNaN(novaData) ? novaData.toLocaleDateString('pt-BR') : data;
  };

  const dataLimiteFormatada = formatarData(dataLimite);

  const gerarMensagemStatus = () => {
    if (statusConta === 'teste') {
      return `Sua conta está em modo TESTE e expira em ${dataLimiteFormatada}.`;
    }
    if (statusConta === 'ativa') {
      return `Parabéns! Sua conta está ATIVA até ${dataLimiteFormatada}.`;
    }
    if (statusConta === 'cancelada') {
      return `Sua conta foi CANCELADA. Entre em contato para reativar.`;
    }
    return '';
  };

  const steps = [
    {
      label: 'Cadastrar Estabelecimento',
      description: 'Clique no botão "+" em estabelecimento para cadastrar seu primeiro estabelecimento.',
      action: () => navigate('/Estabelecimento'),
      completed: onboardingSteps.estabelecimento
    },
    {
      label: 'Cadastrar Serviços',
      description: 'Parábens o estabelecimento foi criado com sucesso, agora clique no botão "+" na parte de serviços para cadastrar seu primeiro serviço',
      action: () => navigate('/Estabelecimento'),
      completed: onboardingSteps.servico
    }
  ];

  const handleAction = () => {
    steps[activeStep].action();
  };

  const pendingSteps = steps.filter(step => !step.completed);

  const firstPendingIndex = steps.findIndex(step => !step.completed);

  useEffect(() => {
    setActiveStep(firstPendingIndex === -1 ? 0 : firstPendingIndex);
  }, [onboardingSteps]);
 if (expirado) {
  return (
    <Dialog
      open={isOpen}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 8,
          padding: 2,
          background: '#FFEBEE'
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#C62828',
            textAlign: 'center'
          }}
        >
          Seu período de teste expirou
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#C62828',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}
          >
            O prazo de teste ({dataLimite}) já terminou.<br />
            Para continuar utilizando o LavaJá, realize o pagamento do seu plano <b>falando com nosso suporte.</b>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: '#25D366',
              color: 'white',
              borderRadius: 3,
              px: 4,
              fontWeight: 'bold',
              '&:hover': {
                background: '#128C7E'
              }
            }}
            href="https://wa.me/5585991673309?text=Olá!%20Preciso%20reativar%20meu%20plano%20no%20LavaJá."
            target="_blank"
            rel="noopener"
          >
            Falar com Suporte (WhatsApp)
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

  if (pendingSteps.length === 0) {
    return null;
  }

  if (location.pathname === '/Estabelecimento' && !onboardingSteps.estabelecimento) {
    return (
      <Tooltip
        open={showTooltip}
        title="Clique aqui para cadastrar seu primeiro estabelecimento"
        arrow
        placement="right"
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              backgroundColor: '#6A1B9A',
              color: 'white',
              fontSize: '1rem',
              padding: '12px 20px',
              borderRadius: '8px',
              maxWidth: 300
            }
          }
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <AddIcon
            sx={{
              fontSize: 40,
              color: '#6A1B9A',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1
                },
                '50%': {
                  transform: 'scale(1.2)',
                  opacity: 0.8
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1
                }
              }
            }}
          />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 8,
          padding: 2,
          background: '#F1EEFF'
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#6A1B9A',
            textAlign: 'center'
          }}
        >
          Bem-vindo ao Painel do LavaJá!
        </Typography>
      </DialogTitle>

      {statusConta && (
        <Box sx={{ mb: 2, mx: 3 }}>
          <Paper
            elevation={0}
            sx={{
              background: 
                statusConta === 'cancelada' ? '#FFEBEE' : 
                statusConta === 'teste' ? '#FFF8E1' : 
                '#E8F5E9',
              border: '1px solid',
              borderColor:
                statusConta === 'cancelada' ? '#FFCDD2' :
                statusConta === 'teste' ? '#FFE0B2' :
                '#C8E6C9',
              p: 2,
              borderRadius: 4
            }}
          >
            <Typography
              color={
                statusConta === 'cancelada' ? '#C62828' :
                statusConta === 'teste' ? '#B26A00' :
                '#2E7D32'
              }
              fontWeight={700}
              textAlign="center"
            >
              {gerarMensagemStatus()}
            </Typography>
            {statusConta === 'teste' && (
              <Typography
                sx={{
                  color: '#B26A00',
                  fontWeight: 500,
                  textAlign: 'center',
                  mt: 1,
                  fontSize: '1rem',
                }}
              >
                Atenção: Na versão de teste, as notificações para os clientes via WhatsApp não estão disponíveis.
              </Typography>
            )}
          </Paper>
        </Box>
      )}

      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666666',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}
          >
            Estamos felizes em tê-lo conosco! Para começar a usar o sistema, siga os passos abaixo:
          </Typography>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          orientation="vertical"
          sx={{
            '& .MuiStepLabel-label': {
              color: '#6A1B9A',
              fontWeight: 'bold'
            },
            '& .MuiStepIcon-root': {
              color: '#6A1B9A',
              '&.Mui-active': {
                color: '#6A1B9A'
              },
              '&.Mui-completed': {
                color: '#2E7D32'
              }
            }
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={step.completed}>
              <StepLabel>
                <Typography
                  variant="h6"
                  sx={{
                    color: step.completed ? '#2E7D32' : '#6A1B9A',
                    fontWeight: step.completed ? 700 : 'bold'
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
              {activeStep === index && (
                <StepContent>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666666',
                      mb: 2,
                      fontSize: '1rem'
                    }}
                  >
                    {step.description}
                  </Typography>
                  {!step.completed && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleAction}
                        sx={{
                          mt: 1,
                          mr: 1,
                          borderRadius: 3,
                          background: '#6A1B9A',
                          '&:hover': {
                            background: '#5A3FE0'
                          }
                        }}
                      >
                        Ir para este passo
                      </Button>
                    </Box>
                  )}
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
