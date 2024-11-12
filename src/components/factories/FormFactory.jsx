import * as React from 'react';
import ComponentFactory from '../factories/ComponentFactory';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';

const FormFactory = ({
  errors,
  campi = [],
  responsiveSizeOverrides,
  touchField,
  onChange,
  titolo = '',
  model,
  renderOverrides = {},
}) => {
  return (
    <Grid container sx={{ columnGap: '1rem', rowGap: '1.7rem' }} size={{ xs: 12 }}>
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
        const CustomComponent = renderOverrides[campo.key];
        const componentProps = {
          fieldKey: campo.key,
          value: model[campo.key],
          label: campo.label,
          error: !!errors[campo.key],
          helperText: errors[campo.key],
          onChange: onChange,
          options: campo.options,
        };

        if (CustomComponent) {
          return (
            <Grid
              key={campo.key}
              {...(responsiveSizeOverrides && responsiveSizeOverrides[campo.key]
                ? { size: responsiveSizeOverrides[campo.key] }
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
            {...(responsiveSizeOverrides && responsiveSizeOverrides[campo.key]
              ? { size: responsiveSizeOverrides[campo.key] }
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
