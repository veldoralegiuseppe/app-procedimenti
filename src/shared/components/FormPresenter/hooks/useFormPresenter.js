import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import {ComponentFactory} from '@shared/factories';
import { useTheme } from '@mui/material/styles';

const useFormPresenter = ({
  errors,
  campi,
  renderOverrides,
  onChange,
  onBlur,
  sezione,
  store,
}) => {
  const theme = useTheme();
  //console.log('FormPresenter', errors, campi, renderOverrides, onChange, onBlur, sezione, store);

  // Memorizza il rendering della sezione personalizzata
  const renderCustomSection = useMemo(() => {
    const override = renderOverrides.sezioni?.[sezione];
    if (!override?.component) return null;

    const CustomSectionComponent = override.component;
    return (
      <CustomSectionComponent
        store={store}
        errors={errors}
        onChange={onChange}
      />
    );
  }, [renderOverrides.sezioni, sezione, store, errors, onChange]);

  // Memorizza il rendering dei campi
  const renderFields = useMemo(() => {
    return campi.map((campo) => {
      const CustomComponent = renderOverrides.campi?.[campo.key]?.component;
      const {
        size: responsiveSizeOverrides,
        options: optionsOverrides,
        ...restOverride
      } = renderOverrides.campi?.[campo.key] || {};

      const componentProps = {
        fieldKey: campo.key,
        label: campo.label,
        error: !!errors[campo.key],
        helperText: errors[campo.key],
        onChange,
        onBlur,
        options: optionsOverrides || campo.options,
        theme,
        store,
        ...restOverride,
      };

      // Usa InputFactory o un componente personalizzato
      const FieldComponent = CustomComponent
        ? React.createElement(CustomComponent, componentProps)
        : React.createElement(ComponentFactory.InputFactory, {
            ...componentProps,
          });

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
  }, [campi, renderOverrides.campi, errors, onChange, onBlur]);

  return {
    renderCustomSection,
    renderFields,
  };
};

export default useFormPresenter;
