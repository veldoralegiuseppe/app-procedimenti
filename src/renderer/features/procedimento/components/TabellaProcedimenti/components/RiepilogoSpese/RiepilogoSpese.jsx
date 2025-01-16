import React from 'react';
import { useTransazioniProcedimento } from '@features/procedimento';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { OptionsAutocomplete } from '@ui-shared/components';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
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

function PersoneSelect() {
  const personeStore = useStoreContext(FieldTypes.PERSONE);

  const groupBy = (anagrafica, persona) => {
    const group = persona.type === ModelTypes.PERSONA_FISICA ? 'Persone fisiche' : 'Persone giuridiche';
    console.log('grupBy', group);

    return group
  };

  const extractValue = (persona) => {
    let anagrafica = '';

    if (persona.type === ModelTypes.PERSONA_FISICA)
      anagrafica = `${persona.nome} ${persona.cognome}`;
    else anagrafica = persona.denominazione;

    return { value: anagrafica, type: persona.type };
  };

  return (
    <OptionsAutocomplete
      deletable={false}
      creatable={false}
      optionsStore={personeStore}
      extractValue={extractValue}
      groupBy={groupBy}
    />
  );
}

const RiepilogoSpese = ({ procedimento }) => {
  const { getTransazioni } = useTransazioniProcedimento();
  const transazioni = React.useMemo(() => getTransazioni(), [procedimento]);

  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          variant="fullWidth"
          centered
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Generali" />
          <Tab label="Parti e controparti" />
        </Tabs>
      </Box>

      {/* Panel spese generali */}
      <TabPanel value={activeTab} index={0}>
        {procedimento && (
          <TabellaTransazioni
            transazioni={transazioni}
            disabled={['Incasso parti', 'Incasso controparti']}
          />
        )}
      </TabPanel>

      {/* Panel parti e controparti */}
      <TabPanel value={activeTab} index={1}>
        <PersoneSelect />
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
