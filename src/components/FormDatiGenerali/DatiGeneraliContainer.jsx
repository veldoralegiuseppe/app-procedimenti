import * as React from 'react';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';
import FormFactory from '../factories/FormFactory';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';


const renderOverrides = {
  oggettoControversia: {sx: {width: '29.2rem'}},
  esitoMediazione: {sx: {width: '29.2rem'}},
  causaleDemandata: {sx: {width: '29.2rem'}},
}

const DatiGeneraliContainer = () => {
  // States
  const [errors, setErrors] = React.useState({});

  // Context
  const { procedimento, handleInputChange } =
    React.useContext(ProcedimentoContext);
  
  // Constants
  const sezioneCampi = _.omit(
    _.groupBy(Procedimento.getMetadati(), 'sezione'),
    undefined
  );

  // Handlers
  const setProcedimento = (changes) => {
    setErrors(handleInputChange(changes, Procedimento.getMetadati()));
  };

  return (
    <Grid container sx={{rowGap: '3rem'}}> 
      {Object.entries(sezioneCampi).map(([sezione, campi]) => (
        <FormFactory
          key={sezione}
          errors={errors}
          campi={campi}
          titolo={sezione}
          model={procedimento}
          onChange={setProcedimento}
          renderOverrides={renderOverrides}
        />
      ))}
    </Grid>
  );
};

export default DatiGeneraliContainer;
