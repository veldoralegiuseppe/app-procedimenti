import React from 'react';
import { RadioGroup, FormPresenter } from '@ui-shared/components';
import { Slide } from '@mui/material';
import { ModelTypes } from '@shared/metadata';
import Grid from '@mui/material/Grid2';
import useFormPersona from './hooks/useFormPersona';

const FormPersona = () => {
  const {
    tipoPersona,
    ruoloPersona,
    formSelected,
    containerRef,
    radioTipoPersonaOptions,
    radioRuoloPersonaOptions,
    handleRadioChange,
    renderForm,
  } = useFormPersona();

  const renderRadioGroup = (label, options, value) => (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: '1.5rem' }}>
      <span style={{ color: 'rgb(105 105 105 / 60%)' }}>{label}: </span>
      <RadioGroup
        options={options}
        value={value}
        onChange={handleRadioChange}
      />
    </div>
  );

  return (
    <Grid container ref={containerRef} sx={{ rowGap: '1.8rem' }}>
      <Grid size={{ xs: 12 }}>
        {renderRadioGroup('Tipo', radioTipoPersonaOptions, tipoPersona)}
        {renderRadioGroup('Ruolo', radioRuoloPersonaOptions, ruoloPersona)}
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Slide
          in={[
            ModelTypes.PERSONA_FISICA,
            ModelTypes.PERSONA_GIURIDICA,
          ].includes(tipoPersona)}
          container={containerRef.current}
          direction="left"
        >
          <div>
            <FormPresenter {...renderForm(formSelected)} />
          </div>
        </Slide>
      </Grid>
    </Grid>
  );
};

export default FormPersona;
