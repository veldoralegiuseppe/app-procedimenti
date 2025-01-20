import React from 'react';
import useRiepilogoSpese from './hooks/useRiepilogoSpese';
import PersoneSelect from '../PersoneSelect/PersoneSelect';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
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

const RiepilogoSpese = ({ procedimento }) => {
  const {
    activeTab,
    handleTabChange,
    transazioniProcedimento,
    transazioniPersona,
    indexPersonaSelezionata,
    handleSelectPersona,
    handleChangeTransazionePersona,
  } = useRiepilogoSpese({ procedimento });

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
          <Tab label="Parti e controparti" />
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

      {/* Panel parti e controparti */}
      <TabPanel value={activeTab} index={1}>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '4rem' }}
        >
          <PersoneSelect
            indexPersona={indexPersonaSelezionata}
            onChange={handleSelectPersona}
          />
          {activeTab === 1 && (
            <TabellaTransazioni transazioni={transazioniPersona} onChange={handleChangeTransazionePersona} />
          )}
        </div>
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
