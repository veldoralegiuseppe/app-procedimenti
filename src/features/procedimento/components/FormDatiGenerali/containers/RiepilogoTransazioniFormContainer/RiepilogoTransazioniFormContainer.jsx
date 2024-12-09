import * as React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useModelStore } from '@shared/hooks';
import { useStoreContext } from '@shared/context';
import { FieldTypes } from '@shared/metadata';
import Totali from '../../../../../transazione/components/TabellaTransazioni/components/Totali';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';

const RiepilogoTransazioniFormContainerComponent = () => {
  const { transazioni, totali, updateTotali } = useTransazioniProcedimento();
  const procedimentoStore = useStoreContext(FieldTypes.PROCEDIMENTO);
  const { setProperty } = useModelStore(procedimentoStore);

  const onChange = React.useCallback((index, changes) => {
    const fieldKey = transazioni[index].key;
    setProperty(fieldKey, changes);
    console.log('updateTotali', changes);
    updateTotali();
  }, [transazioni, setProperty, updateTotali]);

  return (
    <Grid container size={{ xs: 12 }} sx={{ rowGap: '1.5rem' }}>
      <TabellaTransazioni
        transazioni={transazioni}
        onChange={onChange}
        disabled={['Incasso parti', 'Incasso controparti']}
      />

      <Totali totali={totali} />
    </Grid>
  );
};

const RiepilogoTransazioniFormContainer = React.memo(
  RiepilogoTransazioniFormContainerComponent
);
RiepilogoTransazioniFormContainer.whyDidYouRender = true;
export default RiepilogoTransazioniFormContainer;
