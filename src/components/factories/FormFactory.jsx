import * as React from 'react';
import ComponentFactory from '../factories/ComponentFactory';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';

/**
 * FormFactory è un componente React che genera un form dinamico basato sui campi forniti.
 *
 * @param {Object} props - Le proprietà passate al componente.
 * @param {Object} props.errors - Oggetto che contiene gli errori di validazione per i campi del form.
 * @param {Array} [props.campi=[]] - Array di metadati che descrivono i campi del form.
 * @param {Function} props.touchField - Funzione chiamata quando un campo viene toccato.
 * @param {Function} props.onChange - Funzione chiamata quando il valore di un campo cambia.
 * @param {string} [props.titolo=''] - Titolo del form.
 * @param {Object} props.model - Oggetto che contiene i valori attuali dei campi del form.
 * @param {Object} [props.renderOverrides={}] - Oggetto che permette di sovrascrivere i componenti di rendering predefiniti per i campi specifici.
 *
 * @returns {JSX.Element} Un elemento JSX che rappresenta il form generato.
 */
const FormFactory = ({
  errors,
  campi = [],
  touchField,
  onChange,
  titolo = '',
  model,
  renderOverrides = {},
}) => {
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
          {titolo}
        </Typography>
      </Grid>

      {/* Form */}
      {campi.map((campo) => {
        const CustomComponent = renderOverrides[campo.key]?.component;
        const {
          size: responsiveSizeOverrides,
          options: optionsOverrides,
          ...restOverride
        } = renderOverrides[campo.key] || {};
      
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

        if (CustomComponent) {
          return (
            <Grid
              key={campo.key}
              {...(responsiveSizeOverrides
                ? { size: responsiveSizeOverrides }
                : {})}
            >
              <CustomComponent {...componentProps} />
            </Grid>
          );
        }

        const DefaultComponent = ComponentFactory.InputFactory({
          ...componentProps,
        });

        if (!DefaultComponent) {
          return null;
        }
       
        return (
          <Grid
            key={campo.key}
            {...(responsiveSizeOverrides
              ? { size: responsiveSizeOverrides }
              : {})}
          >
            {DefaultComponent}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FormFactory;
