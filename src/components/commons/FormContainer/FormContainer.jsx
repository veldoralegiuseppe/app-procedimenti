import * as React from 'react';
import Grid from '@mui/material/Grid2';
import FormPresenter from '@components/commons/FormPresenter/FormPresenter';
import useFormContainer from './hooks/useFormContainer';
import ClearButton from '@components/commons/ClearButton/ClearButton';
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
    touchedFields,
    handleReset,
    updateModel,
    onBlur,
    isMissingProps,
  } = useFormContainer(config, sezioni);

  return (
    <Grid container sx={{ rowGap: '3rem' }}>
      {isMissingProps || filteredSezioni.length === 0
        ? null
        : filteredSezioni.map(([sezione, campi]) => (
            <FormPresenter
              key={sezione}
              errors={errors}
              campi={campi}
              sezione={sezione}
              model={config.model}
              onChange={updateModel}
              onBlur={onBlur}
              renderOverrides={renderOverrides}
            />
          ))}

      {!isMissingProps && config.clearable && (
        <ClearButton
          touchedFields={touchedFields}
          model={config.model}
          onClick={() => handleReset(config.model)}
        />
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
