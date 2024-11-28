import * as React from 'react';
import Grid from '@mui/material/Grid2';
import {FormPresenter, ClearButton} from '@shared/components';
import useFormContainer from './hooks/useFormContainer';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * FormContainer: Componente per gestire dinamicamente le sezioni del form.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Function} props.store - La funzione store utilizzata per gestire lo stato del form.
 * @param {Object} [props.config={}] - La configurazione del form.
 * @param {Function} [props.config.modelClass] - La classe del modello dei dati.
 * @param {Object} [props.config.renderOverrides] - Le sovrascritture di rendering.
 * @param {boolean} [props.config.clearable] - Indica se il form può essere resettato.
 * @param {Array|Object|null} [props.sezioni=null] - Le sezioni del form.
 *
 * @returns {JSX.Element|null} - Il componente FormContainer.
 *
 * @example
 * <FormContainer config={config} sezioni={sezioni} />
 *
 * @component
 */
const FormContainerComponent = ({ store: useStore, config = {}, sezioni = null }) => {
  const {
    errors,
    renderOverrides,
    filteredSezioni,
    touchedFields,
    handleReset,
    updateModel,
    onBlur,
    isMissingProps,
    model,
  } = useFormContainer({ useStore, config, sezioni });

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
              onChange={updateModel}
              onBlur={onBlur}
              renderOverrides={renderOverrides}
              store={useStore}
            />
          ))}

      {!isMissingProps && config.clearable && (
        <ClearButton
          key={`${sezioni}-clear-button`}
          touchedFields={touchedFields}
          model={model}
          onClick={handleReset}
        />
      )}
    </Grid>
  );
};

const FormContainer = React.memo(
  FormContainerComponent,
  (prevProps, nextProps) => {
  
    // Controllo delle sezioni
    return  _.isEqual(prevProps.sezioni, nextProps.sezioni) 

    // Controllo del config
     && _.isEqual(JSON.stringify(prevProps.config), JSON.stringify(nextProps.config))
  }
);

FormContainer.whyDidYouRender = true;

FormContainer.propTypes = {
  store: PropTypes.func.isRequired, 
  config: PropTypes.shape({
    modelClass: PropTypes.func,
    renderOverrides: PropTypes.object,
    clearable: PropTypes.bool,
  }),
  sezioni: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.null]),
};

export default FormContainer;
