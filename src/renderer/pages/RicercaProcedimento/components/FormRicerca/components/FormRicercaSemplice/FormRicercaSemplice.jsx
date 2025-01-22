import React from 'react';
import Grid from '@mui/material/Grid2';
import { FormPresenter } from '@ui-shared/components';
import { ModelTypes } from '@shared/metadata';
import { useMetadata, useGenerateInputProps } from '@ui-shared/hooks';

const FormRicercaSemplice = () => {
  const { enums } = useMetadata({ type: ModelTypes.PROCEDIMENTO });
  const { getInputPropsArray } = useGenerateInputProps({
    modelType: ModelTypes.PROCEDIMENTO,
  });

  return (
    <Grid>
      <FormPresenter
        key={'procedimento-ricerca-semplice'}
        inputPropsArray={getInputPropsArray(enums.sezione.RICERCA_SEMPLICE)}
        type={ModelTypes.PROCEDIMENTO}
      />
    </Grid>
  );
};

export default FormRicercaSemplice;
