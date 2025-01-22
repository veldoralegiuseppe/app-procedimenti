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

function ClearBtn({
  onClick,
  updates = {},
}) {
  const theme = useTheme();
  const [isModified, setIsModified] = React.useState(() => !_.isEmpty(updates));

  React.useEffect(()=> {
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
  } = useRiepilogoSpese({ procedimento, open });

  console.log('updatesTransazioniParti', updatesTransazioniParti);

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
          <div>
            <TabellaTransazioni
              transazioni={transazioniProcedimento}
              onChange={handleChangeTransazioneProcedimento}
              disabled={['Incasso parti', 'Incasso controparti']}
            />
            <ClearBtn onClick={() => {}} updates={updatesTransazioniProcedimento[procedimento?.numProtocollo]} />
          </div>
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
            <div>
            <TabellaTransazioni
              transazioni={transazioniParte}
              onChange={handleChangeTransazioneParte}
            />
            <ClearBtn onClick={() => {}} updates={updatesTransazioniParti[procedimento?.numProtocollo]?.[indexParteSelezionata]} />
            </div>
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
