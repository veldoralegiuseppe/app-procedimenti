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

import {
  ProtocolloInput,
  ImportoInput,
  Select,
  OptionsAutocomplete,
} from '@shared/components';
import { CssTextField, labelColor } from '@shared/theme';
import { TitoliAutocomplete } from '@features/persona';
import useInputFactory from './hooks/useInputFactory';
import { InputTypes } from '@shared/metadata';
import _ from 'lodash';

dayjs.locale('it');

const InputFactoryComponent = ({ fieldKey, inputType, ...props }) => {
  const { commonProps } = useInputFactory({
    fieldKey,
    ...props,
  });

  // Switch per il rendering condizionale
  switch (inputType) {
    case InputTypes.PROTOCOLLO:
      return <ProtocolloInput {...commonProps} />;

    case InputTypes.DATE:
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
                const formatted = change
                  ? change.format('YYYY-MM-DD')
                  : undefined;
                commonProps.onChange?.(formatted);
                commonProps.onBlur?.(formatted);
              },
            }}
            value={value ? dayjs(value) : null}
          />
        </LocalizationProvider>
      );

    case InputTypes.IMPORTO:
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

    case InputTypes.TEXT:
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

    case InputTypes.AUTOCOMPLETE:
      return <OptionsAutocomplete {...commonProps} />;

    case InputTypes.SELECT:
      return <Select {...commonProps} />;

    case InputTypes.DATE_TIME:
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
              const newDateTime = date
                ? date.format('YYYY-MM-DDTHH:mm')
                : undefined;
              commonProps.onChange?.(newDateTime);
              commonProps.onBlur?.(newDateTime);
            }}
          />
        </LocalizationProvider>
      );

    case InputTypes.TITOLO_PERSONA:
      return <TitoliAutocomplete {...commonProps} />;

    default:
      return null;
  }
};

const InputFactory = React.memo(InputFactoryComponent,(prevProps, nextProps) => {
    // Considero dinamici i campi: sx
    return _.isEqual(prevProps.sx, nextProps.sx);
  }
);

export default InputFactory;
