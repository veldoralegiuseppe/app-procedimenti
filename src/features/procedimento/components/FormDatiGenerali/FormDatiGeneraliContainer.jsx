import * as React from 'react';
import Grid from '@mui/material/Grid2';
import IstanzaFormContainer from './containers/IstanzaFormContainer';
import IncontroFormContainer from './containers/IncontroFormContainer';
import MediatoreFormContainer from './containers/MediatoreFormContainer';
import RiepilogoTransazioniFormContainer from './containers/RiepilogoTransazioniFormContainer/RiepilogoTransazioniFormContainer';
import { ClearButton, Totali } from '@shared/components';
import { useProcedimentoStore } from '@features/procedimento';
import { TransazioneMetadata } from '@features/transazione';
import { ModelFactory } from '@shared/factories';
import { useStoreContext } from '@shared/context';
import { FieldTypes } from '@shared/metadata';
import { useTotali } from '@shared/hooks';

const FormDatiGeneraliContainer = () => {
  // Questo deve spostarsi nel componente adibito alla creazione del procedimento
  const procedimentoStore = useStoreContext(FieldTypes.PROCEDIMENTO);
  const { resetModel, setProperty, getTransazioni } = useProcedimentoStore(procedimentoStore);
  const procedimento = ModelFactory.create({ type: FieldTypes.PROCEDIMENTO });

  React.useEffect(() => {
    resetModel(procedimento);
  }, []);

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

  const onChange = React.useCallback(({ fieldKey, changes }) => {
    const transazioni = getTransazioni();
    const transazioniKeys = transazioni.map((t) => t.key);

    if (!fieldKey) {
      Object.entries(changes).forEach(([key, value]) => {
        setProperty(key, value);
        if (transazioniKeys.includes(key)) {
          updateTotali();
        }
      });
    } else {
      setProperty(fieldKey, changes);
      if (transazioniKeys.includes(fieldKey)) {
        updateTotali();
      }
    }
  }, []);

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      <Grid size={{ xs: 12 }}>
        <IstanzaFormContainer onChange={onChange} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <IncontroFormContainer onChange={onChange} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MediatoreFormContainer onChange={onChange} />
      </Grid>

      <Grid container size={{ xs: 12 }} sx={{ rowGap: '1.5rem' }}>
        <RiepilogoTransazioniFormContainer onChange={onChange} />
        <Totali totali={totali} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ClearButton
          modelType={FieldTypes.PROCEDIMENTO}
          onClick={() => {
            resetModel(procedimento);
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
