import React from 'react';
import useRiepilogoSpese from './hooks/useRiepilogoSpese';
import PersoneSelect from '../PersoneSelect/PersoneSelect';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { PersonaEnumsV1 } from '@shared/metadata';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { ClearButton } from '@ui-shared/theme';
import { ButtonTypes } from '@ui-shared/metadata';
import { ButtonFactory } from '@ui-shared/components';
import _ from 'lodash';
import { height } from '@mui/system';

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
        maxWidth: '14rem',
      }}
      disabled={!isModified}
    >
      Scarta modifiche
    </ClearButton>
  );
}

const RiepilogoSpese = ({ open, procedimento, persone: pers, handleClose }) => {
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
    persone,
    handleSalvaBozzaBtn,
    handleChiudiBtn,
    isSalvaBozzaBtnDisabled,
    roots,
    store,
    handleClearBtn,
  } = useRiepilogoSpese({ procedimento, persone: pers, open, handleClose });

  const renderTabellaTransazioni = (transazioni, onChange, indexPersona) => {
    console.log('renderTabellaTransazioni', transazioni, indexPersona);
    let rootDep = _.concat(['model'], roots.procedimento);
    let updateMethod = 'setProcedimentoProperty';
    let updateMethodArgs = {};
    let getMethod = 'getProcedimentoProperty';
    let getMethodArgs = {};
    let updates = {};

    if (indexPersona === -1) updates = procedimentoChanges;
    else if (indexPersona >= 0) {
      rootDep = _.concat(roots.persone, indexPersona);
      updates = _.get(personeChanges, indexPersona, {});
      updateMethod = 'setPersonaProperty';
      getMethod = 'getPersonaProperty';
      getMethodArgs = { index: indexPersona };
      updateMethodArgs = { index: indexPersona };
      console.log('updatePersona', {
        rootDep,
        updates,
        updateMethod,
        getMethod,
        getMethodArgs,
        indexPersona,
      });
    }

    console.log('renderTabellaTransazioni', updates);

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', rowGap: '2.5rem'}}
      >
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

        {_.isNumber(indexPersona) && (
          <ClearBtn
            onClick={() =>
              handleClearBtn({
                numProtocollo: _.get(procedimento, 'numProtocollo'),
                indexPersona,
              })
            }
            updates={updates}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%' }}>
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}
      >
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
        {procedimento &&
          _.isEqual(activeTab, 0) &&
          renderTabellaTransazioni(
            transazioniProcedimento,
            handleChangeProcedimento,
            -1
          )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '3rem' }}
        >
          <PersoneSelect
            indexPersona={indexParteSelezionata}
            onChange={handleSelectParte}
            persone={persone}
            ruolo={PersonaEnumsV1.ruolo.PARTE_ISTANTE}
          />
          {activeTab === 1 &&
            renderTabellaTransazioni(
              transazioniParte,
              handleChangeParte,
              indexParteSelezionata
            )}
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '3rem' }}
        >
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
        </div>
      </TabPanel>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem 0',
          marginTop: '3rem',
          marginBottom: '-2rem',
          borderTop: 1,
          borderColor: 'divider',
          gridRow: 3,
        }}
      >
        <ButtonFactory
          type={ButtonTypes.OUTLINED}
          text="Chiudi"
          onClick={handleChiudiBtn}
          sx={{ width: '11rem' }}
        />
        <ButtonFactory
          type={ButtonTypes.MODIFY}
          text="Salva bozza"
          onClick={handleSalvaBozzaBtn}
          disabled={isSalvaBozzaBtnDisabled}
          sx={{ width: '11rem' }}
        />
      </Box>
    </div>
  );
};

export default RiepilogoSpese;
