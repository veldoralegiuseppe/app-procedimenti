import React from 'react';
import Grid from '@mui/material/Grid2';
import { FieldTypes } from '@ui-shared/metadata';
import { useMetadata } from '@ui-shared/hooks';
import { FormPresenter, ClearButton } from '@ui-shared/components';
import useFormPersonaGiuridica from './hooks/useFormPersonaGiuridica';
import RiepilogoTransazioniFormContainer from './components/RiepilogoTransazioniFormContainer';

const FormPersonaGiuridicaContainer = () => {
  const { enums } = useMetadata({ type: FieldTypes.PERSONA_GIURIDICA });
  const { getInputPropsArray, resetPersonaGiuridica } = useFormPersonaGiuridica();
  //console.log('getInputPropsArray', getInputPropsArray());

  return (
    <Grid container sx={{ rowGap: '2.4rem' }}>
      {Object.entries(enums.sezione).map(([key, sezione]) => {
        const titolo =
          key.charAt(0).toUpperCase() +
          key.slice(1).toLowerCase().replaceAll('_', ' ');

          console.log('getInputPropsArray', getInputPropsArray(sezione));

        return (
          <FormPresenter
            key={key}
            titolo={titolo}
            inputPropsArray={getInputPropsArray(sezione)}
            type={FieldTypes.PERSONA_GIURIDICA}
          />
        );
      })}

      <Grid sx={{ marginTop: '2rem' }}>
        <RiepilogoTransazioniFormContainer />
      </Grid>

      <Grid sx={{ marginTop: '2rem' }}>
        <ClearButton
          modelType={FieldTypes.PERSONA_GIURIDICA}
          onClick={() => resetPersonaGiuridica()}
        />
      </Grid>
    </Grid>
  );
};

export default FormPersonaGiuridicaContainer;
