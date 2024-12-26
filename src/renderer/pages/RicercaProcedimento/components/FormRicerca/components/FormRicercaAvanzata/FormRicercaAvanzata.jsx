import React from 'react';
import Grid from '@mui/material/Grid2';
import { FormPresenter, FormTitle } from '@ui-shared/components';
import { FieldTypes } from '@ui-shared/metadata';
import { useMetadata, useGenerateInputProps } from '@ui-shared/hooks';
import { StringUtils } from '@ui-shared/utils';
import FormPersona from './components/FormPersona/FormPersona';
import { over } from 'lodash';

const FormRicercaAvanzata = () => {
  const { enums } = useMetadata();

  const inputPropsGenerators = {
    [FieldTypes.PROCEDIMENTO]: useGenerateInputProps({
      modelType: FieldTypes.PROCEDIMENTO,
      overrides: { common: { required: false } },
    }).getInputPropsArray,
  };

  return (
    <Grid container sx={{rowGap: '1.5rem'}}>
      <Grid size={{ xs: 12 }}>
        {Object.keys(inputPropsGenerators).map((type) => (
          <FormPresenter
            key={`${type}-ricerca-avanzata`}
            titolo={StringUtils.fromCamelCase(type)}
            inputPropsArray={inputPropsGenerators[type](
              enums[type].sezione.RICERCA_AVANZATA
            )}
            type={type}
          />
        ))}
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormTitle title="Persona" />
        <FormPersona />
      </Grid>
    </Grid>
  );
};

export default FormRicercaAvanzata;
