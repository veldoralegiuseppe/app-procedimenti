import React from 'react';
import useRiepilogoSpese from './hooks/useRiepilogoSpese';
import PersoneSelect from '../PersoneSelect/PersoneSelect';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { PersonaEnumsV1 } from '@shared/metadata';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { ClearButton } from '@ui-shared/theme';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';
import { useRicercaStore } from '@features/ricerca';
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

function ClearBtn({ onClick, updates = {} }) {
  const theme = useTheme();
  const [isModified, setIsModified] = React.useState(() => !_.isEmpty(updates));

  React.useEffect(() => {
    console.log('updates', updates);
    setIsModified(!_.isEmpty(updates));
  }, [updates]);

  return (
    <ClearButton
      variant="outlined"
      onClick={onClick}
      startIcon={
        <DeleteIcon
          sx={{
            color: !isModified
              ? 'rgb(105 105 105 / 60%)'
              : theme.palette.primary.main,
          }}
        />
      }
      sx={{
        fontSize: '.9rem',
        '&.Mui-disabled': { color: theme.palette.text.disabled },
      }}
      disabled={!isModified}
    >
      Scarta modifiche
    </ClearButton>
  );
}

const RiepilogoSpese = ({ open, procedimento, persone: pers }) => {
  console.log('RiepilogoSpese', { open, procedimento, pers });
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
    handleChangeParte,
    handleChangeControparte,
    handleChangeProcedimento,
    procedimentoChanges,
    personeChanges,
    persone
  } = useRiepilogoSpese({ procedimento, persone: pers, open });

  const store = useStoreContext(StoreTypes.RICERCA)
  const {roots} = useRicercaStore(store)

  const renderTabellaTransazioni = (transazioni, onChange, indexPersona) => {
   
    console.log('renderTabellaTransazioni', transazioni, indexPersona);
    let rootDep = _.concat(['model'], roots.procedimento);
    let updateMethod = 'setProcedimentoProperty';
    let updateMethodArgs = {}
    let getMethod = 'getProcedimentoProperty';
    let getMethodArgs = {};
    let updates = {}

    if(indexPersona === -1) 
      updates = procedimentoChanges;
    else if(indexPersona >= 0){
      rootDep = _.concat(roots.persone, indexPersona)
      updates = _.get(personeChanges, indexPersona, {})
      updateMethod = 'setPersonaProperty';
      getMethod = 'getPersonaProperty';
      getMethodArgs = {index: indexPersona}
      updateMethodArgs = {index: indexPersona}
      console.log('updatePersona', {rootDep, updates, updateMethod, getMethod, getMethodArgs, indexPersona});
    }

    console.log('renderTabellaTransazioni', updates);

    return (
      <div>
        <TabellaTransazioni
          store={store}
          rootDep={rootDep}
          updateMethod={updateMethod}
          updateMethodArgs={updateMethodArgs}
          getMethod={getMethod}
          getMethodArgs={getMethodArgs}
          transazioni={transazioni}
          disabled={['Incasso parti', 'Incasso controparti']}
          onChange={onChange}
        />

        {_.isNumber(indexPersona) && <ClearBtn onClick={() => {}} updates={updates} />}
      </div>
    );
  };

  return (
    <>
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

      <TabPanel value={activeTab} index={0}>
        {procedimento && _.isEqual(activeTab, 0) && 
          renderTabellaTransazioni(
            transazioniProcedimento,
            handleChangeProcedimento,
            -1
          )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PersoneSelect
          indexPersona={indexParteSelezionata}
          onChange={handleSelectParte}
          persone={persone}
          ruolo={PersonaEnumsV1.ruolo.PARTE_ISTANTE}
        />
        {activeTab === 1 &&
          renderTabellaTransazioni(transazioniParte, handleChangeParte, indexParteSelezionata)}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <PersoneSelect
          indexPersona={indexControparteSelezionata}
          onChange={handleSelectControparte}
          persone={persone}
          ruolo={PersonaEnumsV1.ruolo.CONTROPARTE}
        />
        {activeTab === 2 &&
          renderTabellaTransazioni(
            transazioniControparte,
            handleChangeControparte,
            indexControparteSelezionata
          )}
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
