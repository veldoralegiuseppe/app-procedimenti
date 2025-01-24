import React from 'react';
import useRiepilogoSpese from './hooks/useRiepilogoSpese';
import PersoneSelect from '../PersoneSelect/PersoneSelect';
import { Box, Tab, Tabs } from '@mui/material';
import { TabellaTransazioni } from '@features/transazione';
import { ModelTypes } from '@shared/metadata';
import { useStoreContext } from '@ui-shared/context';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { ClearButton } from '@ui-shared/theme';
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

const RiepilogoSpese = ({ open }) => {
  const procedimentoStore = useStoreContext(ModelTypes.PROCEDIMENTO);
  const procedimento = procedimentoStore((state) => state.model);

  const riepilogoProps = useRiepilogoSpese({ procedimento, open });
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
    handleChangeTransazioneProcedimento,
    storeParti,
    storeControparti,
    updatesTransazioniParti,
    updatesTransazioniControparti,
    updatesTransazioniProcedimento,
  } = riepilogoProps;

  const renderTabellaTransazioni = (transazioni, onChange, updates) => (
    <div>
      <TabellaTransazioni transazioni={transazioni} onChange={onChange} />
      {updates && <ClearBtn onClick={() => {}} updates={updates} />}
    </div>
  );

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
        {procedimento &&
          renderTabellaTransazioni(
            transazioniProcedimento,
            handleChangeTransazioneProcedimento,
            updatesTransazioniProcedimento[procedimento?.numProtocollo]
          )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PersoneSelect
          indexPersona={indexParteSelezionata}
          onChange={handleSelectParte}
          store={storeParti}
        />
        {activeTab === 1 &&
          renderTabellaTransazioni(
            transazioniParte,
            handleChangeTransazioneParte,
            updatesTransazioniParti[procedimento?.numProtocollo]?.[
              indexParteSelezionata
            ]
          )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <PersoneSelect
          indexPersona={indexControparteSelezionata}
          onChange={handleSelectControparte}
          store={storeControparti}
        />
        {activeTab === 2 &&
          renderTabellaTransazioni(
            transazioniControparte,
            handleChangeTransazioneControparte
          )}
      </TabPanel>
    </>
  );
};

export default RiepilogoSpese;
