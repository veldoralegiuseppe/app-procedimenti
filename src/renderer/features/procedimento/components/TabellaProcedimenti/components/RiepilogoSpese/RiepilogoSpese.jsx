import React from 'react';
import { useTransazioniProcedimento } from '@features/procedimento';
import { useTransazioniPersona, usePersonaStore } from '@features/persona';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { OptionsAutocomplete } from '@ui-shared/components';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
import { usePersoneStore } from '@features/persona';
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

function PersoneSelect({ onChange, indexPersona }) {
  const extractValue = (persona) => {
    let anagrafica = '';

    if (persona.type === ModelTypes.PERSONA_FISICA)
      anagrafica = `${persona.nome} ${persona.cognome}`;
    else anagrafica = persona.denominazione;

    return { value: anagrafica, type: persona.type };
  };

  const groupBy = (anagrafica, option) => {
    const group =
      option.type === ModelTypes.PERSONA_FISICA
        ? 'Persone fisiche'
        : 'Persone giuridiche';
    return group;
  };

  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const personaFisicaStore = useStoreContext(ModelTypes.PERSONA_FISICA);
  const personaGiuridicaStore = useStoreContext(ModelTypes.PERSONA_GIURIDICA);
  const { getItem } = usePersoneStore(personeStore);
  const { resetModel: resetPersonaFisica } =
    usePersonaStore(personaFisicaStore);
  const { resetModel: resetPersonaGiuridica } = usePersonaStore(
    personaGiuridicaStore
  );
  const [lastIndexSelected, setLastIndexSelected] = React.useState(null);
  const lastValueSelected = React.useRef('');

  const isOptionEqualToValue = (option, anagrafica) => {
    console.log(
      'isOptionEqualToValue',
      option,
      anagrafica,
      lastIndexSelected,
      _.isEqual(option?.id, lastIndexSelected)
    );
    return _.isEqual(option?.id, lastIndexSelected);
  };

  const onBlur = (anagrafica, option) => {
    console.log('onBlur', anagrafica, option);
    const persona = option ? getItem(option.id) : null;
    const newIndex = option?.id >= 0 ? option.id : null;

    setLastIndexSelected(newIndex);
    lastValueSelected.current = anagrafica || '';
    
    if (option?.type === ModelTypes.PERSONA_FISICA) resetPersonaFisica(persona);
    else if (option?.type === ModelTypes.PERSONA_GIURIDICA)
      resetPersonaGiuridica(persona);
    else {
      resetPersonaFisica();
      resetPersonaGiuridica();
    }

    onChange?.(newIndex);
  };

  React.useEffect(() => {
    if (
      indexPersona != null &&
      indexPersona != undefined &&
      !_.isEqual(indexPersona, lastIndexSelected)
    ) {
      setLastIndexSelected(() => {
        const persona = getItem(indexPersona);
        lastValueSelected.current = persona
          ? extractValue(persona)?.value || ''
          : '';
        console.log('lastValueSelected', lastValueSelected.current, 'lastIndexSelected', indexPersona);
        return indexPersona;
      });
    }
  }, [indexPersona]);

  return (
    <OptionsAutocomplete
      label="Seleziona una persona"
      value={lastValueSelected.current}
      deletable={false}
      creatable={false}
      isOptionEqualToValue={isOptionEqualToValue}
      optionsStore={personeStore}
      extractValue={extractValue}
      groupBy={groupBy}
      onBlur={onBlur}
    />
  );
}

const RiepilogoSpese = ({ procedimento }) => {
  const personeStore = useStoreContext(FieldTypes.PERSONE);
  const { getItem } = usePersoneStore(personeStore);
  const [indexPersonaSelezionata, setIndexPersonaSelezionata] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const { getTransazioni: getTransazioniProcedimento } = useTransazioniProcedimento();
  const { getTransazioniPersona } = useTransazioniPersona();
  const [transazioniPersona, setTransazioniPersona] = React.useState([]);

  const transazioniProcedimento = React.useMemo(
    () => getTransazioniProcedimento(),
    [procedimento]
  );

  const handleSelectPersona = React.useCallback(
    (index) => {
      console.log('handleSelectPersona', index);
      setIndexPersonaSelezionata(index);
    },
    [setIndexPersonaSelezionata]
  );

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  React.useEffect(() => {
    if(indexPersonaSelezionata >= 0){
        const persona = indexPersonaSelezionata >= 0
        ? getItem(indexPersonaSelezionata)
        : null;
      const newTransazioni = persona ? getTransazioniPersona(persona) : [];
      setTransazioniPersona(newTransazioni);
    }
  }, [indexPersonaSelezionata])

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
            <TabellaTransazioni transazioni={transazioniPersona} />
          )}
        </div>
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
