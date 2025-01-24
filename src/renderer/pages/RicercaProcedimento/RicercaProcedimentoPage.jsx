import React, {useState, useCallback} from 'react';
import { useTheme } from '@mui/material/styles';
import { PageHeader, ButtonFactory, FormModal } from '@ui-shared/components';
import { TabellaProcedimenti } from '@features/procedimento';
import { FormRicerca, OverviewStatistico } from './components';
import { ButtonTypes, StoreTypes } from '@ui-shared/metadata';
import { useDatabase } from '@ui-shared/hooks';
import { useRicercaStore } from '@features/ricerca';
import { useStoreContext } from '@ui-shared/context';
import { ModelTypes } from '@shared/metadata';
import { LinearProgress } from '@mui/material';

const RicercaProcedimentoPage = () => {
  const theme = useTheme();
  const ricercaStore = useStoreContext(StoreTypes.RICERCA)
  const {setProperty, getProperty} = useRicercaStore(ricercaStore)
  const procedimenti = getProperty({key: 'results', namespace: 'queryResult'});
  const { retrieve, calculateStatistics } = useDatabase();
  const [isModalOpen, setModalOpen] = useState(false);
  const helperText = `Puoi effettuare la ricerca dei procedimenti utilizzando la ricerca semplice o la ricerca avanzata. 
                    La ricerca semplice ti permette di trovare rapidamente i procedimenti inserendo pochi criteri di base, 
                    mentre la ricerca avanzata ti consente di filtrare i risultati utilizzando criteri più dettagliati e specifici.`;

  const handleSearch = useCallback(async () => {
    const res = await retrieve({ type: ModelTypes.PROCEDIMENTO });
    setProperty({key: 'queryResult', value: res?.success ? res.data : {}});
  }, [retrieve]);

  const handleOpenStatistics = useCallback(async () => {
    setModalOpen(true);
    const statistics = await calculateStatistics({ type: ModelTypes.PROCEDIMENTO });
    console.log('statistics', statistics);
  }, [calculateStatistics]);

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

          {/* Form di ricerca */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '1.5rem 0',
              rowGap: '2rem',
            }}
          >
            
            <FormRicerca />

            <div style={{ textAlign: 'end' }}>
              <ButtonFactory
                onClick={handleSearch}
                text="Cerca"
                size="small"
                type={ButtonTypes.PRIMARY}
              />
            </div>
          </div>

          {/* Tabella */}
          {/* <LinearProgress /> */}
          <TabellaProcedimenti procedimenti={procedimenti} />

          {/* Buttons */}
          <div style={{ textAlign: 'center' }}>
              <ButtonFactory
                onClick={handleOpenStatistics}
                text="Riepilogo"
                size="small"
                type={ButtonTypes.PRIMARY}
              />
            </div>

          <FormModal
            title="Riepilogo"
            open={isModalOpen}
            handleClose={() => setModalOpen(false)}
          >
            {isModalOpen && <OverviewStatistico />}
          </FormModal>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RicercaProcedimentoPage;
