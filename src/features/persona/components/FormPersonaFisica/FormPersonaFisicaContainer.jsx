import React from 'react';
import Grid from '@mui/material/Grid2';
import { FieldTypes } from '@shared/metadata';
import { useMetadata } from '@shared/hooks';
import { FormPresenter } from '@shared/components';
import { useGenerateInputProps } from '@shared/hooks';

const FormPersonaFisicaContainer = () => {
  const { enums } = useMetadata({ type: FieldTypes.PERSONA_FISICA });

  const propsOverrides = {
    common: {
      onBlur: (changes) => console.log(changes),
    },

    codiceFiscale: {
      size: { xs: 12},
    },
  };

  const { getInputPropsArray } = useGenerateInputProps({
    modelType: FieldTypes.PERSONA_FISICA,
    overrides: propsOverrides,
  });

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
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
    </Grid>
  );
};

export default FormPersonaFisicaContainer;
