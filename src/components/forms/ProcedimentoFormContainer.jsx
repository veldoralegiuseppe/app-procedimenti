import * as React from 'react';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';
import { ProcedimentoContext } from '@context/Procedimento';
import { Procedimento } from '@model/procedimento';
import FormFactory from '@components/factories/FormFactory';
import useDynamicOptions from '@components/commons/hooks/useDynamicOptions';

const commonSx = { width: '29.2rem' };

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
  const {
    options: sediSvolgimento,
    addOption: addSedeSvolgimento,
    removeOption: removeSedeSvolgimento,
  } = useDynamicOptions(['Option A', 'Option B']);
  const {
    options: sediDeposito,
    addOption: addSedeDeposito,
    removeOption: removeSedeDeposito,
  } = useDynamicOptions(['Option A', 'Option B']);

  // Context
  const { procedimento, handleInputChange } =
    React.useContext(ProcedimentoContext);

  // Constants
  const sezioneCampi = _.omit(
    _.groupBy(Procedimento.getMetadati(), 'sezione'),
    undefined
  );
  const renderOverrides = {
    oggettoControversia: { sx: commonSx },
    esitoMediazione: { sx: commonSx },
    causaleDemandata: { sx: commonSx },
    modalitaSvolgimento: { sx: commonSx },
    sedeDeposito: {
      sx: commonSx,
      options: sediDeposito,
      onSubmit: addSedeDeposito,
      onDelete: removeSedeDeposito,
      validations: ['required'],
    },
    sedeSvolgimento: {
      sx: commonSx,
      options: sediSvolgimento,
      onSubmit: addSedeSvolgimento,
      onDelete: removeSedeSvolgimento,
      validations: ['required'],
    },
    titoloMediatore: { sx: commonSx },
    nomeMediatore: { sx: commonSx },
    cognomeMediatore: { sx: commonSx },
  };

  // Handlers
  const setProcedimento = (changes) => {
    setErrors(handleInputChange(changes, Procedimento.getMetadati()));
  };

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
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
