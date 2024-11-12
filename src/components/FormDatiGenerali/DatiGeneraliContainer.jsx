import * as React from 'react';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';
import FormFactory from '../factories/FormFactory';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';

const responsiveSizeOverrides = {
  //numProtocollo: { xs: 12, sm: 12 },
  // dataDeposito: { xs: 12, md: 6 },
  // valoreControversia: { xs: 12 },
  // sedeDeposito: { xs: 12 },
  // oggettoControversia: { xs: 12 },
  // causaleDemandata: { xs: 12 },
  // esitoMediazione: { xs: 12 },
  // modalitaSvolgimento: { xs: 12, md: 8 },
  // dataOraIncontro: { xs: 12, md: 4 },
  // sedeSvolgimento: { xs: 12 },
  // totaleIncontri: { xs: 12 },
  // titoloMediatore: { xs: 12 },
  // nomeMediatore: { xs: 12,},
  // cognomeMediatore: { xs: 12,},
  // compensoMediatore: { xs: 12 },
};

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
          responsiveSizeOverrides={responsiveSizeOverrides}
        />
      ))}
    </Grid>
  );
};

export default DatiGeneraliContainer;
