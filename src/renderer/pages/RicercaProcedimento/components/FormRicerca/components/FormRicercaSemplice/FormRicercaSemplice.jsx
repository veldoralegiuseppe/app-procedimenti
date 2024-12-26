import React from 'react';
import Grid from '@mui/material/Grid2';
import { FormPresenter } from '@ui-shared/components';
import { FieldTypes } from '@ui-shared/metadata';
import { useMetadata, useGenerateInputProps } from '@ui-shared/hooks';

const FormRicercaSemplice = () => {
  const { enums } = useMetadata({ type: FieldTypes.PROCEDIMENTO });
  const { getInputPropsArray } = useGenerateInputProps({
    modelType: FieldTypes.PROCEDIMENTO,
  });

  return (
    <Grid>
      <FormPresenter
        key={'procedimento-ricerca-semplice'}
        inputPropsArray={getInputPropsArray(enums.sezione.RICERCA_SEMPLICE)}
        type={FieldTypes.PROCEDIMENTO}
      />
    </Grid>
  );
};

export default FormRicercaSemplice;
