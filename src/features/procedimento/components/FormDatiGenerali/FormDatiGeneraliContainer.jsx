import * as React from 'react';
import Grid from '@mui/material/Grid2';
import IstanzaFormContainer from './containers/IstanzaFormContainer';
import IncontroFormContainer from './containers/IncontroFormContainer';
import MediatoreFormContainer from './containers/MediatoreFormContainer';
import RiepilogoTransazioniFormContainer from './containers/RiepilogoTransazioniFormContainer/RiepilogoTransazioniFormContainer';
import {ClearButton} from '@shared/components';
import useFormDatiGenerali from './hooks/useFormDatiGenerali';
import { useProcedimentoStore } from '@features/procedimento';
import {ModelFactory} from '@shared/factories';
import {useStoreContext} from '@shared/context';
import {FieldTypes} from '@shared/metadata';


const FormDatiGeneraliContainer = () => {
  //const { config } = useFormDatiGenerali();

  // Queto deve spostarsi nel componente adibito alla creazione del procedimento
  const {procedimentoStore} = useStoreContext();
  const {resetModel} = useProcedimentoStore(procedimentoStore);
 
  React.useEffect(() => {
    const procedimento = ModelFactory.create({ type: FieldTypes.PROCEDIMENTO });
    resetModel(procedimento);
  }, [resetModel]);

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      <Grid size={{ xs: 12 }}>
        <IstanzaFormContainer/>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <IncontroFormContainer/>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MediatoreFormContainer/>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <RiepilogoTransazioniFormContainer />
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
