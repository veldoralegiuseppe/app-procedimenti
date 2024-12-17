import React from 'react';
import Grid from '@mui/material/Grid2';
import { FieldTypes } from '@shared/metadata';
import { useMetadata } from '@shared/hooks';
import { FormPresenter, ClearButton } from '@shared/components';
import useFormPersonaFisica from './hooks/useFormPersonaFisica';
import RiepilogoTransazioniFormContainer from './components/RiepilogoTransazioni/RiepilogoTransazioniPersonaFisica';

const FormPersonaFisicaContainer = () => {
  const { enums } = useMetadata({ type: FieldTypes.PERSONA_FISICA });
  const { getInputPropsArray, resetPersonaFisica } = useFormPersonaFisica();
  //console.log('getInputPropsArray', getInputPropsArray());

  return (
    <Grid container sx={{ rowGap: '2.4rem' }}>
      {Object.entries(enums.sezione).map(([key, sezione]) => {
        const titolo =
          key.charAt(0).toUpperCase() +
          key.slice(1).toLowerCase().replaceAll('_', ' ');

        return (
          <FormPresenter
            key={key}
            titolo={titolo}
            inputPropsArray={getInputPropsArray(sezione)}
            type={FieldTypes.PERSONA_FISICA}
          />
        );
      })}

      <Grid sx={{ marginTop: '2rem' }}>
        <RiepilogoTransazioniFormContainer />
      </Grid>

      <Grid sx={{ marginTop: '2rem' }}>
        <ClearButton
          modelType={FieldTypes.PERSONA_FISICA}
          onClick={() => resetPersonaFisica()}
        />
      </Grid>
    </Grid>
  );
};

export default FormPersonaFisicaContainer;
