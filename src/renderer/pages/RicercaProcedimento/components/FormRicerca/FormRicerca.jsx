import React from 'react';
import { Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Accordion } from '@ui-shared/components';
import FormRicercaSemplice from './components/FormRicercaSemplice/FormRicercaSemplice';
import _ from 'lodash';
import FormRicercaAvanzata from './components/FormRicercaAvanzata/FormRicercaAvanzata';

const RICERCA_SEMPLICE = 'ricercaSemplice';
const RICERCA_AVANZATA = 'ricercaAvanzata';

const ACCORDION_STYLES = {
  border: '1px solid #57738e69',
  boxShadow: 'none',
};

const getAccordionSummaryStyle = (isSelected) => ({
  backgroundColor: isSelected ? '#467bae' : '#6c8caba6',
});

const FormAccordion = ({ title, isSelected, onClick, children }) => (
  <Accordion
    isDisabled={false}
    isExpanded={isSelected}
    title={title}
    titleSx={{ fontSize: '.99rem' }}
    onClick={onClick}
    square={true}
    sx={{
      ...ACCORDION_STYLES,
      '& .MuiAccordionSummary-root': getAccordionSummaryStyle(isSelected),
    }}
  >
    {children}
  </Accordion>
);

const FormRicercaComponent = () => {
  const [formSelected, updateFormSelected] = React.useState(
    () => RICERCA_SEMPLICE
  );

  const handleAccordionClick = React.useCallback(
    (form) => {
      console.log('handleAccordionClick form:', form);
      if (!_.isEqual(form, formSelected)) updateFormSelected(form);
    },
    [formSelected]
  );

  return (
    <Box
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper elevation={2} style={{ width: '100%', padding: '1.5rem' }}>
        <Grid container rowGap="1.5rem">
          <Grid size={{ xs: 12 }}>
            <FormAccordion
              title="Ricerca per numero di protocollo"
              isSelected={formSelected === RICERCA_SEMPLICE}
              onClick={() => handleAccordionClick(RICERCA_SEMPLICE)}
            >
             <FormRicercaSemplice />
            </FormAccordion>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormAccordion
              title="Ricerca avanzata"
              isSelected={formSelected === RICERCA_AVANZATA}
              onClick={() => handleAccordionClick(RICERCA_AVANZATA)}
            >
              <FormRicercaAvanzata />
            </FormAccordion>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

const FormRicerca = React.memo(
  FormRicercaComponent,
  (prevProps, nextProps) => {
    return true;
  }
);
export default FormRicerca;
