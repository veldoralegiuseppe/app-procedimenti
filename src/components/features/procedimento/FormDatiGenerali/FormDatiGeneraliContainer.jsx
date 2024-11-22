import * as React from 'react';
import Grid from '@mui/material/Grid2';
import IstanzaFormContainer from './containers/IstanzaFormContainer';
import IncontroFormContainer from './containers/IncontroFormContainer';
import MediatoreFormContainer from './containers/MediatoreFormContainer';
import RiepilogoTransazioniFormContainer from './containers/RiepilogoTransazioniFormContainer/RiepilogoTransazioniFormContainer';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';
import ClearButton from '@components/commons/ClearButton/ClearButton';
import _ from 'lodash';

const FormDatiGenerali = () => {
  const { procedimento, handleReset } = React.useContext(ProcedimentoContext);
  const [touchedFields, setTouchedFields] = React.useState({});

  const handleOnBlur = (changes) => {
    console.log('handleOnBlur', changes);
    setTouchedFields((prev) => {
      const updatedTouchedFields = { ...prev, ...changes };
      console.log('Touched fields:', updatedTouchedFields);
      return updatedTouchedFields;
    });
  };

  const onReset = () => {
    setTouchedFields({});
    handleReset(procedimento);
  };

  const commonSx = { width: '29.2rem' };
  const renderOverrides = {
    campi: {
      oggettoControversia: { sx: commonSx },
      esitoMediazione: { sx: commonSx },
      causaleDemandata: { sx: commonSx },
      modalitaSvolgimento: { sx: commonSx },
      sedeDeposito: { sx: commonSx },
      sedeSvolgimento: { sx: commonSx },
      nomeMediatore: { sx: commonSx },
      cognomeMediatore: { sx: commonSx },
    },
  };
  const config = {
    renderOverrides,
    model: procedimento,
    modelClass: Procedimento,
    onBlur: handleOnBlur,
  };

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      <Grid size={{ xs: 12 }}>
        <IstanzaFormContainer config={config} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <IncontroFormContainer config={config} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MediatoreFormContainer config={config} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <RiepilogoTransazioniFormContainer config={config} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ClearButton
          touchedFields={touchedFields}
          model={procedimento}
          onClick={() => onReset()}
        />
      </Grid>
    </Grid>
  );
};

export default FormDatiGenerali;
