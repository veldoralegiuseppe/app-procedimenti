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

import ProtocolloInput from '@components/ProtocolloInput';
import ImportoInput from '@components/ImportoInput';
import { CssTextField, labelColor } from '@theme/MainTheme';
import Select from '@components/Select';


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
  const { value, error, sx, onChange, label, helperText, options, ...restProps } = props;

  // Handlers
  const getOnChange = () => {
    return fieldKey !== 'numProtocollo'
      ? (change) => handleChanges({ [fieldKey]: change })
      : (numProtocollo, annoProtocollo) =>
          handleChanges({ numProtocollo, annoProtocollo });
  };
  const handleChanges = (changes) => {
    if (onChange) onChange(changes);
    //handleInputChange(changes);
    console.log('changes', changes);
  };

  // Commons
  const commonProps = {
    label: label || '',
    value: value,
    error: error,
    helperText: helperText || '',
    onChange: getOnChange(),
    sx: { ...inputStyles, ...sx },
    options: options,
    ...restProps,
  };

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
            {...commonProps}
          />
        </LocalizationProvider>
      );

    case 'valoreControversia':
    case 'compensoMediatore':
    case 'speseAvvioSedeSecondaria':
    case 'speseIndennitaSedeSecondaria':
      return <ImportoInput {...commonProps} />;

    case 'sedeDeposito':
    case 'sedeSvolgimento':
    case 'nomeMediatore':
    case 'cognomeMediatore':
    case 'materiaCausaleDemandata':
      return <CssTextField {...commonProps} />;

    case 'oggettoControversia':
    case 'esitoMediazione':
    case 'modalitaSvolgimento':
    case 'causaleDemandata':
      return (
        <Select {...commonProps} />
      );

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
                      {value ? (
                        <CloseIcon
                          onClick={(event) => {
                            event.stopPropagation();
                            commonProps.onChange(null);
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
            onChange={(date) =>
              commonProps.onChange(
                date ? date.format('YYYY-MM-DDTHH:mm') : null
              )
            }
          />
        </LocalizationProvider>
      );

    case 'titoloMediatore':
      return (
        <SelectQualificaPersona
          {...commonProps}
          // Devono essere passati come props
          // onSubmit={(newTitolo) => {
          //   setTitoliMediatore([...titoliMediatore, newTitolo]);
          // }}
          // onDelete={(deletedTitolo) => {
          //   setTitoliMediatore(
          //     titoliMediatore.filter((titolo) => titolo !== deletedTitolo)
          //   );
          // }}
        />
      );

    default:
      return null;
  }
};

const ComponentFactory = {
  InputFactory,
};

export default ComponentFactory;
