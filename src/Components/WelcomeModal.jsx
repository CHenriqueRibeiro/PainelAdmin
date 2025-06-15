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
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WelcomeModal = ({
  isOpen,
  onClose,
  statusConta,
  dataLimiteTeste,
  onboardingSteps = { estabelecimento: false, servico: false }
}) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const formatarData = (data) => {
    if (!data) return null;
    const novaData = new Date(data);
    return !isNaN(novaData) ? novaData.toLocaleDateString('pt-BR') : data;
  };

  const dataLimiteFormatada = formatarData(dataLimiteTeste);

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
      label: 'Cadastrar Estabelecimento e Serviços',
      description: 'Cadastre primeiro seu estabelecimento e depois do cadastro concluído, cadastre pelo menos um serviço para começar a utilizar o agendamento e outros serviços.',
      action: () => navigate('/Estabelecimento')
    }
  ];

  const handleNext = () => {
    onClose();
  };

  const handleAction = () => {
    steps[activeStep].action();
  };

  const stepConcluido = onboardingSteps.estabelecimento && onboardingSteps.servico;

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
          Bem-vindo ao Painel Administrativo!
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
              p: 2
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
            Estamos felizes em tê-lo conosco! Para começar a usar o sistema, siga o passo abaixo:
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
                color: '#6A1B9A'
              }
            }
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6" sx={{ color: '#6A1B9A' }}>
                  {step.label}
                </Typography>
              </StepLabel>
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
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
