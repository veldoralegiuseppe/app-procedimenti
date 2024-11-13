import * as React from 'react';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';
import FormFactory from '../factories/FormFactory';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';


const commonSx = { width: '29.2rem' };

const renderOverrides = {
  oggettoControversia: { sx: commonSx,},
  esitoMediazione: { sx: commonSx },
  causaleDemandata: { sx: commonSx },
  modalitaSvolgimento: { sx: commonSx },
  sedeSvolgimento: { sx: commonSx },
  titoloMediatore: { sx: commonSx },
  nomeMediatore: { sx: commonSx },
  cognomeMediatore: { sx: commonSx },
};


/**
 * @file ProcedimentoFormContainer.jsx
 * @description Container del pattern container-presenter per la gestione del form di Procedimento.
 * 
 * @component
 * @returns {JSX.Element} Il container del form di Procedimento.
 * 
 * @example
 * // Esempio di utilizzo:
 * <ProcedimentoFormContainer />
 * 
 * @remarks
 * Questo componente utilizza il contesto `ProcedimentoContext` per ottenere i dati del procedimento e la funzione di gestione delle modifiche.
 * I campi del form sono raggruppati per sezione utilizzando la libreria lodash.
 * 
 * @see {@link ProcedimentoContext} per il contesto utilizzato.
 * @see {@link FormFactory} per il componente di presentazione utilizzato per rendere i campi del form.
 */
const ProcedimentoFormContainer = () => {
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

export default ProcedimentoFormContainer;
