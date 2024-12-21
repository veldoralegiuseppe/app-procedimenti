import React from 'react';
import { useTheme } from '@mui/material/styles';
import { PageHeader } from '@ui-shared/components';
import { TabellaProcedimenti } from '@features/procedimento';

const RicercaProcedimentoPage = () => {
  const theme = useTheme();
  const helperText = `Puoi effettuare la ricerca dei procedimenti utilizzando la ricerca semplice o la ricerca avanzata. 
                    La ricerca semplice ti permette di trovare rapidamente i procedimenti inserendo pochi criteri di base, 
                    mentre la ricerca avanzata ti consente di filtrare i risultati utilizzando criteri più dettagliati e specifici.`;

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          rowGap: '5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.palette.background.default,
            flexDirection: 'column',
            rowGap: '1.5rem',
            height: 'auto',
            padding: '0',
            borderRadius: '8px',
          }}
        >
          <PageHeader title="Ricerca procedimento" helperText={helperText} />
          <TabellaProcedimenti />
        </div>
      </div>
    </React.Fragment>
  );
};

export default RicercaProcedimentoPage;
