import React from 'react';
import Grid from '@mui/material/Grid2';
import { ModelTypes } from '@shared/metadata';
import { useMetadata } from '@ui-shared/hooks';
import { FormPresenter, ClearButton } from '@ui-shared/components';
import useFormPersonaGiuridica from './hooks/useFormPersonaGiuridica';
import RiepilogoTransazioniFormContainer from './components/RiepilogoTransazioniFormContainer';

const FormPersonaGiuridicaContainer = () => {
  const { enums } = useMetadata({ type: ModelTypes.PERSONA_GIURIDICA });
  const { getInputPropsArray, resetPersonaGiuridica } = useFormPersonaGiuridica();
  //console.log('getInputPropsArray', getInputPropsArray());

  return (
    <Grid container sx={{ rowGap: '2.4rem' }}>
      {Object.entries(enums.sezione).filter(([key, _]) => key !== 'RICERCA_AVANZATA').map(([key, sezione]) => {
        const titolo =
          key.charAt(0).toUpperCase() +
          key.slice(1).toLowerCase().replaceAll('_', ' ');

        return (
          <FormPresenter
            key={key}
            titolo={titolo}
            inputPropsArray={getInputPropsArray(sezione)}
            type={ModelTypes.PERSONA_GIURIDICA}
          />
        );
      })}

      <Grid sx={{ marginTop: '2rem' }}>
        <RiepilogoTransazioniFormContainer />
      </Grid>

      <Grid sx={{ marginTop: '2rem' }}>
        <ClearButton
          modelType={ModelTypes.PERSONA_GIURIDICA}
          onClick={() => resetPersonaGiuridica()}
        />
      </Grid>
    </Grid>
  );
};

export default FormPersonaGiuridicaContainer;
