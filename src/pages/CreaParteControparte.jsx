import * as React from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Unstable_Grid2';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

import FormPersonaFisica from '@pages/FormPersonaFisica';
import FormPersonaGiuridica from '@pages/FormPersonaGiuridica';

const formLabelFontSize = '1rem';
const labelColor = 'rgb(105 105 105 / 60%)';

export default function CreaParteControparte({ handleClose, onError }) {
  const theme = useTheme();
  const [tipologiaPersona, setTipologiaPersona] = React.useState('PERSONA_FISICA');
  const [ruolo, setRuolo] = React.useState('PARTE_ISTANTE');
  const formPersonaFisicaRef = React.useRef();
  const formPersonaGiuridicaRef = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { hasErrors, message } = tipologiaPersona === 'PERSONA_FISICA'
      ? formPersonaFisicaRef.current?.getErrors()
      : formPersonaGiuridicaRef.current?.getErrors();

    if (hasErrors) {
      console.log('Errori rilevati:', message);
      onError(message);
    } else {
      console.log('Form inviato con successo');
      handleClose(); // Chiude il modale
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        rowGap: '3rem',
        marginTop: '2rem',
        padding: '0',
      }}
    >
      {/* Ruolo */}
      <Grid xs={12} sx={{ width: '100%' }}>
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61' }}>
          <Typography
            sx={{ fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae' }}
          >
            Ruolo
          </Typography>
        </Grid>
        <FormControl sx={{ marginTop: '4px' }}>
          <RadioGroup
            row
            value={ruolo}
            onChange={(event) => setRuolo(event.target.value)}
          >
            <FormControlLabel
              value="PARTE_ISTANTE"
              control={<Radio />}
              label="PARTE ISTANTE"
              sx={{
                marginRight: '4.5rem',
                '& .MuiTypography-root': {
                  color: theme.palette.text.primary,
                  fontWeight: '500',
                },
                '& .MuiRadio-root:not(.Mui-checked) span': { color: labelColor },
              }}
            />
            <FormControlLabel
              value="CONTROPARTE"
              control={<Radio />}
              label="CONTROPARTE"
              sx={{
                '& .MuiTypography-root': {
                  color: theme.palette.text.primary,
                  fontWeight: '500',
                },
                '& .MuiRadio-root:not(.Mui-checked) span': { color: labelColor },
              }}
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Tipologia */}
      <Grid xs={12} sx={{ width: '100%' }}>
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61' }}>
          <Typography
            sx={{ fontWeight: '400', fontSize: formLabelFontSize, color: '#467bae' }}
          >
            Tipologia
          </Typography>
        </Grid>
        <FormControl sx={{ marginTop: '4px' }}>
          <RadioGroup
            row
            value={tipologiaPersona}
            onChange={(event) => setTipologiaPersona(event.target.value)}
          >
            <FormControlLabel
              value="PERSONA_FISICA"
              control={<Radio />}
              label="PERSONA FISICA"
              sx={{
                marginRight: '4.5rem',
                '& .MuiTypography-root': {
                  color: theme.palette.text.primary,
                  fontWeight: '500',
                },
                '& .MuiRadio-root:not(.Mui-checked) span': { color: labelColor },
              }}
            />
            <FormControlLabel
              value="PERSONA_GIURIDICA"
              control={<Radio />}
              label="PERSONA GIURIDICA"
              sx={{
                '& .MuiTypography-root': {
                  color: theme.palette.text.primary,
                  fontWeight: '500',
                },
                '& .MuiRadio-root:not(.Mui-checked) span': { color: labelColor },
              }}
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Persona fisica */}
      <Grid xs={12} sx={{ width: '100%' }}>
        <Accordion
          disabled={tipologiaPersona !== 'PERSONA_FISICA'}
          expanded={tipologiaPersona === 'PERSONA_FISICA'}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: 'white' }} />}
            sx={{
              backgroundColor: '#467bae',
              color: 'white',
              height: '48px',
              '&.Mui-expanded': { minHeight: 'unset' },
            }}
          >
            <Typography>Persona fisica</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.default }}>
            <FormPersonaFisica ref={formPersonaFisicaRef} />
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Persona giuridica */}
      <Grid xs={12} sx={{ width: '100%' }}>
        <Accordion
          disabled={tipologiaPersona !== 'PERSONA_GIURIDICA'}
          expanded={tipologiaPersona === 'PERSONA_GIURIDICA'}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon sx={{ color: 'white' }} />}
            sx={{
              backgroundColor: '#467bae',
              color: 'white',
              height: '48px',
              '&.Mui-expanded': { minHeight: 'unset' },
            }}
          >
            <Typography>Persona giuridica</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.default }}>
            <FormPersonaGiuridica ref={formPersonaGiuridicaRef} />
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Buttons */}
      <Grid
        xs={12}
        sx={{
          width: '100%',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '3rem',
          borderTop: '1px solid #f1f1f1',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            width: '90px',
            marginRight: '4.5rem',
            color: '#467bae',
            border: `.9px solid #467bae`,
            '&:hover': { backgroundColor: '#6ea5da29', border: `.9px solid #467bae` },
          }}
          startIcon={<ArrowBackOutlinedIcon sx={{ color: '#467bae' }} />}
        >
          Indietro
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: '90px',
            color: 'white',
            backgroundColor: '#108d10',
            '&:hover': { backgroundColor: '#119c11', color: 'white' },
          }}
          startIcon={<AddIcon sx={{ color: 'white' }} />}
        >
          Crea
        </Button>
      </Grid>
    </div>
  );
}
