import * as React from 'react';
import Grid from '@mui/material/Grid2';
import IstanzaFormContainer from './containers/IstanzaFormContainer';
import IncontroFormContainer from './containers/IncontroFormContainer';
import MediatoreFormContainer from './containers/MediatoreFormContainer';
import RiepilogoTransazioniFormContainer from './containers/RiepilogoTransazioniFormContainer/RiepilogoTransazioniFormContainer';
import { ClearButton, Totali, ModelFactory } from '@ui-shared/components';
import { useProcedimentoStore } from '@features/procedimento';
import { TransazioneMetadata } from '@features/transazione';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';
import { useTotali } from '@ui-shared/hooks';

const FormDatiGeneraliContainer = () => {
 
  const procedimentoStore = useStoreContext(FieldTypes.PROCEDIMENTO);
  const { resetModel, getTransazioni } = useProcedimentoStore(procedimentoStore);

  const calculateTotali = React.useCallback(() => {
    const enums = TransazioneMetadata['1.0'].enums;
    const transazioni = getTransazioni();

    const totaleDovutoSedeSecondaria = {
      label: 'Totale spese sede secondaria',
      value:
        transazioni
          .filter((t) => String(t.key).toLowerCase().includes('sedesecondaria'))
          ?.reduce((acc, prop) => acc + (prop?.importoDovuto || 0), 0) || 0,
    };

    const totaleUscita = {
      label: 'Totale spese',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo === enums.tipo.USCITA
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    const totaleEntrata = {
      label: 'Totale incassi',
      value: transazioni.reduce(
        (acc, transazione) =>
          transazione.tipo === enums.tipo.ENTRATA
            ? acc + (transazione.importoDovuto || 0)
            : acc,
        0
      ),
    };

    return [totaleDovutoSedeSecondaria, totaleUscita, totaleEntrata];
  }, []);

  const { totali, updateTotali } = useTotali({ calculateTotali });
  const onTransazioneChange = React.useCallback((index, key, changes) => updateTotali(), []);

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      <Grid size={{ xs: 12 }}>
        <IstanzaFormContainer />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <IncontroFormContainer />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MediatoreFormContainer />
      </Grid>

      <Grid container size={{ xs: 12 }} sx={{ rowGap: '1.5rem' }}>
        <RiepilogoTransazioniFormContainer onChange={onTransazioneChange} />
        <Totali totali={totali} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ClearButton
          modelType={FieldTypes.PROCEDIMENTO}
          onClick={() => {
            resetModel(
              ModelFactory.create({
                type: FieldTypes.PROCEDIMENTO,
                version: '1.0',
              })
            );
            updateTotali();
          }}
        />
      </Grid>
    </Grid>
  );
};

const FormDatiGenerali = React.memo(FormDatiGeneraliContainer);

FormDatiGenerali.whyDidYouRender = true;

export default FormDatiGenerali;
