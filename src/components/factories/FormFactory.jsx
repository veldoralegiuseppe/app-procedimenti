import * as React from 'react';
import ComponentFactory from '../factories/ComponentFactory';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * FormFactory è un componente React che genera un form dinamico basato sui campi forniti.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Object} props.errors - Oggetto che contiene gli errori di validazione per i campi del form.
 * @param {Array} [props.campi=[]] - Array di oggetti che rappresentano i campi del form.
 * @param {Function} props.touchField - Funzione chiamata quando un campo viene toccato.
 * @param {Function} props.onChange - Funzione chiamata quando il valore di un campo cambia.
 * @param {string} [props.sezione=''] - Nome della sezione del form.
 * @param {Object} props.model - Oggetto che rappresenta il modello dei dati del form.
 * @param {Object} [props.renderOverrides={}] - Oggetto che permette di sovrascrivere il rendering di campi e sezioni.
 * @param {Object} props.renderOverrides.campi - Oggetto che permette di sovrascrivere il rendering dei singoli campi.
 * @param {Object} props.renderOverrides.sezioni - Oggetto che permette di sovrascrivere il rendering delle sezioni.
 *
 * @returns {React.Element} Il componente FormFactory.
 */
const FormFactory = ({
  errors,
  campi = [],
  touchField,
  onChange,
  sezione = '',
  model,
  renderOverrides = {},
}) => {
  const renderCustomSection = () => {
    const override = renderOverrides.sezioni?.[sezione];
    if (!override?.component) return null;

    const CustomSectionComponent = override.component;
    return (
      <Grid size={{ xs: 12 }}>
        <CustomSectionComponent
          model={model}
          errors={errors}
          onChange={onChange}
          touchField={touchField}
        />
      </Grid>
    );
  };

  const renderFields = () =>
    campi.map((campo) => {
      const CustomComponent = renderOverrides.campi?.[campo.key]?.component;
      const {
        size: responsiveSizeOverrides,
        options: optionsOverrides,
        ...restOverride
      } = renderOverrides.campi?.[campo.key] || {};

      const componentProps = {
        fieldKey: campo.key,
        value: model[campo.key],
        label: campo.label,
        error: !!errors[campo.key],
        helperText: errors[campo.key],
        onChange: onChange,
        options: optionsOverrides || campo.options,
        ...restOverride,
      };

      const FieldComponent = CustomComponent
        ? React.createElement(CustomComponent, componentProps)
        : ComponentFactory.InputFactory(componentProps);

      if (!FieldComponent) return null;

      return (
        <Grid
          key={campo.key}
          {...(responsiveSizeOverrides
            ? { size: responsiveSizeOverrides }
            : {})}
        >
          {FieldComponent}
        </Grid>
      );
    });

  return (
    <Grid
      container
      sx={{ columnGap: '1rem', rowGap: '1.7rem' }}
      size={{ xs: 12 }}
    >
      {/* Titolo della form */}
      <Grid
        size={{ xs: 12 }}
        sx={{
          height: '2rem',
          borderBottom: `1px solid #467bae`,
        }}
      >
        <Typography sx={{ fontSize: '1.2rem', color: '#467bae' }}>
          {sezione}
        </Typography>
      </Grid>

      {/* Render di una sezione personalizzata o dei campi standard */}
      {renderOverrides.sezioni?.[sezione]
        ? renderCustomSection()
        : renderFields()}
    </Grid>
  );
};

FormFactory.propTypes = {
  errors: PropTypes.object.isRequired,
  campi: PropTypes.array,
  touchField: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  titolo: PropTypes.string,
  model: PropTypes.object.isRequired,
  renderOverrides: PropTypes.shape({
    campi: PropTypes.objectOf(
      PropTypes.shape({
        component: PropTypes.elementType,
        size: PropTypes.object,
        options: PropTypes.array,
      })
    ),
    sezioni: PropTypes.objectOf(
      PropTypes.shape({
        component: PropTypes.elementType,
      })
    ),
  }),
};

export default FormFactory;
