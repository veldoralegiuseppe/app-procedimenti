import * as React from 'react';
import Grid from '@mui/material/Grid2';
import FormFactory from '@components/factories/FormFactory';
import useFormContainer from './hooks/useFormContainer';
import PropTypes from 'prop-types';

/**
 * FormContainer: Componente per gestire dinamicamente le sezioni del form.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Object} [props.config={}] - La configurazione del form.
 * @param {Object} props.config.model - Il modello dei dati del form.
 * @param {Function} [props.config.modelClass] - La classe del modello dei dati.
 * @param {Object} [props.config.renderOverrides] - Le sovrascritture di rendering.
 * @param {Array|null} [props.sezioni=null] - Le sezioni del form.
 *
 * @returns {JSX.Element|null} - Il componente FormContainer.
 *
 * @example
 * <FormContainer config={config} sezioni={sezioni} />
 *
 * @component
 */
const FormContainer = ({ config = {}, sezioni = null }) => {
  const {
    errors,
    renderOverrides,
    filteredSezioni,
    updateModel,
    isMissingProps,
  } = useFormContainer(config, sezioni);
  
  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      {isMissingProps || filteredSezioni.length === 0 ? (
        null
      ) : (
        filteredSezioni.map(([sezione, campi]) => (
          <FormFactory
            key={sezione}
            errors={errors}
            campi={campi}
            sezione={sezione}
            model={config.model}
            onChange={updateModel}
            renderOverrides={renderOverrides}
          />
        ))
      )}
    </Grid>
  );
};


FormContainer.propTypes = {
  config: PropTypes.shape({
    model: PropTypes.object.isRequired,
    modelClass: PropTypes.func,
    renderOverrides: PropTypes.object,
  }).isRequired,
  sezioni: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default React.memo(FormContainer);
