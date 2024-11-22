import * as React from 'react';
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import { useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

import ProtocolloInput from '@components/ProtocolloInput';
import ImportoInput from '@components/ImportoInput';
import { CssTextField, labelColor } from '@theme/MainTheme';
import Select from '@components/Select';
import TitoliAutocomplete from '@components/features/persona/TitoliAutocomplete';
import OptionsAutocomplete from '@components/commons/autocomplete/OptionsAutocomplete';

const InputFactory = ({ fieldKey, ...props }) => {
  // Styles
  const theme = useTheme();
  const inputStyles = {
    margin: '0',
    backgroundColor: theme.palette.background.default,
    width: '168px',
    maxWidth: '30rem',
    minWidth: '133px',
    height: '36px',
  };

  // Props
  const {
    value,
    error,
    sx,
    onChange,
    onBlur,
    label,
    helperText,
    options,
    ...restProps
  } = props;

  //console.log('props', props);

  // Handlers
  const handleChanges = (changes) => {
    if (onChange) onChange(changes);
    //handleInputChange(changes);
    //console.log('changes', changes);
  };

  // Commons
  const commonProps = {
    label: label || '',
    value: value !== undefined ? value : '',
    error: error,
    helperText: helperText || '',
    onChange: (change) => handleChanges({ [fieldKey]: change }),
    sx: { ...inputStyles, ...sx },
    onBlur: (change) => onBlur({ [fieldKey]: change }),
    options: options,
    size: 'small',
    ...restProps,
  };

  //console.log('commonProps', commonProps);

  switch (fieldKey) {
    case 'numProtocollo':
      return <ProtocolloInput {...commonProps} />;

    case 'dataDeposito':
      return (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="it"
          localeText={
            itIT.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <MobileDatePicker
            slots={{ textField: CssTextField }}
            slotProps={{
              textField: {
                error: error,
                onBlur: (e) => {
                  console.log('blurDataDeposito', e.target.value);
                  commonProps.onBlur?.(
                    e.target.value ? e.target.value.toUpperCase() : undefined
                  );
                },
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonthOutlinedIcon sx={{ color: labelColor }} />
                    </InputAdornment>
                  ),
                },
                size: 'small',
              },
            }}
            {...{
              ...commonProps,
              onChange: (change) => {
                commonProps.onChange(
                  change ? change.format('YYYY-MM-DD') : undefined
                );
                commonProps.onBlur(
                  change ? change.format('YYYY-MM-DD') : undefined
                );
              },
            }}
            value={value ? dayjs(value) : null}
          />
        </LocalizationProvider>
      );

    case 'valoreControversia':
    case 'compensoMediatore':
    case 'speseAvvioSedeSecondaria':
    case 'speseIndennitaSedeSecondaria':
      return (
        <ImportoInput
          {...{
            ...commonProps,
            onChange: undefined,
            onBlur: (change) => {
              commonProps.onBlur(change);
              commonProps.onChange(change);
            },
          }}
        />
      );

    case 'nomeMediatore':
    case 'cognomeMediatore':
    case 'materiaCausaleDemandata':
      return (
        <CssTextField
          {...{
            ...commonProps,
            onBlur: (e) => {
              commonProps.onBlur(
                e.target.value ? e.target.value.toUpperCase() : undefined
              );
            },
          }}
        />
      );

    case 'sedeDeposito':
    case 'sedeSvolgimento':
      return <OptionsAutocomplete {...commonProps} />;

    case 'oggettoControversia':
    case 'esitoMediazione':
    case 'modalitaSvolgimento':
    case 'causaleDemandata':
      return <Select {...commonProps} />;

    case 'dataOraIncontro':
      return (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="it"
          localeText={
            itIT.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <MobileDateTimePicker
            slots={{ textField: CssTextField }}
            slotProps={{
              textField: {
                error: commonProps.error,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {commonProps.value ? (
                        <CloseIcon
                          onClick={(event) => {
                            event.stopPropagation();
                            commonProps.onChange?.(undefined);
                            commonProps.onBlur?.(undefined);
                          }}
                          sx={{
                            cursor: 'pointer',
                            color: theme.palette.error.main,
                          }}
                        />
                      ) : (
                        <CalendarMonthOutlinedIcon sx={{ color: labelColor }} />
                      )}
                    </InputAdornment>
                  ),
                },
                size: 'small',
              },
            }}
            {...commonProps}
            value={commonProps.value ? dayjs(commonProps.value) : null}
            onChange={(date) =>{
              const newDateTime = date ? date.format('YYYY-MM-DDTHH:mm') : undefined;
              commonProps.onChange?.(newDateTime);               
              commonProps.onBlur?.(newDateTime);
            }}
          />
        </LocalizationProvider>
      );

    case 'titoloMediatore':
      return <TitoliAutocomplete {...commonProps} />;

    default:
      return null;
  }
};

const ComponentFactory = {
  InputFactory,
};

export default ComponentFactory;
