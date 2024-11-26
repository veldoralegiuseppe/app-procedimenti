import * as React from 'react';
import {
  LocalizationProvider,
  MobileDatePicker,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
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
import useInputFactory from './hooks/useInputFactory';

const InputFactory = ({ store, fieldKey, theme, ...props }) => {

  const { value, commonProps } = useInputFactory({ store, fieldKey, theme, ...props });

  // Switch per il rendering condizionale
  switch (fieldKey) {
    case 'numProtocollo':
      return <ProtocolloInput {...commonProps} />;

    case 'dataDeposito':
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <MobileDatePicker
            slots={{ textField: CssTextField }}
            slotProps={{
              textField: {
                error: commonProps.error,
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
                const formatted = change ? change.format('YYYY-MM-DD') : undefined;
                commonProps.onChange?.(formatted);
                commonProps.onBlur?.(formatted);
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
            value: !commonProps.value ? 0 : commonProps.value,
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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
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
                            color: theme?.palette.error.main,
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
            onChange={(date) => {
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
  InputFactory: React.memo(InputFactory),
};

export default ComponentFactory;
