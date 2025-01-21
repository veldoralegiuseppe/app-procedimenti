import React from 'react';
import useRiepilogoSpese from './hooks/useRiepilogoSpese';
import PersoneSelect from '../PersoneSelect/PersoneSelect';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { ModelTypes } from '@shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import _ from 'lodash';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: '3rem' }}>{children}</Box>}
    </div>
  );
}

const RiepilogoSpese = () => {
  const procedimentoStore = useStoreContext(ModelTypes.PROCEDIMENTO);
  const procedimento = procedimentoStore(state => state.model);

  const {
    activeTab,
    handleTabChange,
    indexParteSelezionata,
    indexControparteSelezionata,
    transazioniProcedimento,
    transazioniParte,
    transazioniControparte,
    handleSelectParte,
    handleSelectControparte,
    handleChangeTransazioneParte,
    handleChangeTransazioneControparte,
    storeParti,
    storeControparti
  } = useRiepilogoSpese({procedimento});

  return (
    <>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          variant="fullWidth"
          centered
          onChange={handleTabChange}
        >
          <Tab label="Generali" />
          <Tab label="Parti istanti" />
          <Tab label="Controparti" />
        </Tabs>
      </Box>

      {/* Panel spese generali */}
      <TabPanel value={activeTab} index={0}>
        {procedimento && (
          <TabellaTransazioni
            transazioni={transazioniProcedimento}
            disabled={['Incasso parti', 'Incasso controparti']}
          />
        )}
      </TabPanel>

      {/* Panel parti */}
      <TabPanel value={activeTab} index={1}>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '4rem' }}
        >
          <PersoneSelect
            indexPersona={indexParteSelezionata}
            onChange={handleSelectParte}
            store={storeParti}
          />
          {activeTab === 1 && (
            <TabellaTransazioni
              transazioni={transazioniParte}
              onChange={handleChangeTransazioneParte}
            />
          )}
        </div>
      </TabPanel>

      {/* Panel controparti */}
      <TabPanel value={activeTab} index={2}>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '4rem' }}
        >
          <PersoneSelect
            indexPersona={indexControparteSelezionata}
            onChange={handleSelectControparte}
            store={storeControparti}
          />
          {activeTab === 2 && (
            <TabellaTransazioni
              transazioni={transazioniControparte}
              onChange={handleChangeTransazioneControparte}
            />
          )}
        </div>
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
