import * as React from 'react';
import Grid from '@mui/material/Grid2';
import IstanzaFormContainer from './containers/IstanzaFormContainer';
import IncontroFormContainer from './containers/IncontroFormContainer';
import MediatoreFormContainer from './containers/MediatoreFormContainer';
import RiepilogoTransazioniFormContainer from './containers/RiepilogoTransazioniFormContainer/RiepilogoTransazioniFormContainer';
import ClearButton from '@components/commons/ClearButton/ClearButton';
import useFormDatiGenerali from './hooks/useFormDatiGenerali';
import { useProcedimento } from '@model/Procedimento/useProcedimento';
import { Procedimento } from '@model/Procedimento/procedimento';

const FormDatiGeneraliContainer = () => {
  const { config } = useFormDatiGenerali();

  // Queto deve spostarsi nel componente adibito alla creazione del procedimento
  const resetStore = useProcedimento((state) => state.resetModel);
  
  React.useEffect(() => {
    resetStore(new Procedimento().toJSON());
  }, [resetStore]);

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      {/* <Grid size={{ xs: 12 }}>
        <IstanzaFormContainer
          config={config}
          procedimentoStore={useProcedimento}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <IncontroFormContainer config={config} procedimentoStore={useProcedimento} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MediatoreFormContainer config={config} procedimentoStore={useProcedimento} />
      </Grid> */}

      <Grid size={{ xs: 12 }}>
        <RiepilogoTransazioniFormContainer config={config} procedimentoStore={useProcedimento} />
      </Grid>

      {/* <Grid size={{ xs: 12 }}>
        <ClearButton
          touchedFields={touchedFields}
          model={config.model}
          onClick={onReset}
        />
      </Grid> */}
    </Grid>
  );
};

const FormDatiGenerali = React.memo(FormDatiGeneraliContainer);

FormDatiGenerali.whyDidYouRender = true;

export default FormDatiGenerali;
