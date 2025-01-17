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
  TextField,
} from '@ui-shared/components';
import { CssTextField, labelColor } from '@ui-shared/theme';
import { TitoliAutocomplete } from '@features/persona';
import useInputFactory from './hooks/useInputFactory';
import { InputTypes } from '@ui-shared/metadata';
import _ from 'lodash';

dayjs.locale('it');

/**
 * Componente InputFactory
 *
 * Questo componente è una fabbrica di input che renderizza diversi componenti in base al tipo di input specificato.
 * Utilizza il hook `useInputFactory` per ottenere le proprietà comuni da passare agli input.
 *
 * ## Prestazioni
 * Il componente è stato ottimizzato per evitare re-render inutili, in particolare:
 * - Le props comuni vengono calcolate solo una volta grazie a useMemo pertanto sono considerate statiche.
 * - Il componente è memorizzato con React.memo e ammette re-render basati solo sullo style (sx).
 * - Lo switch per il rendering condizionale è basato sul tipo di input, pertanto è considerato statico.
 *
 * @component
 * @param {string} props.fieldKey - La chiave del campo.
 * @param {string} props.inputType - Il tipo di input da renderizzare.
 * @param {Object} props.store - Lo store Zustand da cui gli input leggono i dati.
 * @param {Object} props - Ulteriori proprietà statiche passate al componente.
 *
 * @returns {React.Element|null} - Ritorna l'elemento React corrispondente al tipo di input specificato, oppure null se il tipo di input non è riconosciuto.
 *
 * @example
 * <InputFactory
 *   fieldKey="data"
 *   inputType={InputTypes.DATE}
 *   store={store}
 *   {...{
 *     onChange: handleChange,
 *     onBlur: handleBlur,
 *     error: false,
 *   }
 *   }
 * />
 */
const InputFactoryComponent = ({
  fieldKey,
  inputType,
  store,
  decorator,
  ...props
}) => {
  const { commonProps } = useInputFactory({
    fieldKey,
    store,
    ...props,
  });

  // Switch per il rendering condizionale
  let Component = null;

  switch (inputType) {
    case InputTypes.PROTOCOLLO:
      Component = ProtocolloInput;
      break;

    case InputTypes.DATE:
      Component = (props) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <MobileDatePicker
            slots={{ textField: CssTextField }}
            slotProps={{
              textField: {
                error: props.error,
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
              ...props,
              onChange: (change) => {
                const formatted = change
                  ? change.format('YYYY-MM-DD')
                  : undefined;
                props.onChange?.(formatted);
                props.onBlur?.(formatted);
              },
            }}
            value={props.value ? dayjs(props.value) : null}
          />
        </LocalizationProvider>
      );
      break;

    case InputTypes.IMPORTO:
      Component = (commonProps) => (
        <ImportoInput
          {...{
            ...commonProps,
            value: commonProps.value >= 0 ? commonProps.value : 0,
          }}
        />
      );
      break;

    case InputTypes.TEXT:
      Component = (commonProps) => (
        <TextField
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
      break;

    case InputTypes.AUTOCOMPLETE:
      Component = OptionsAutocomplete;
      break;

    case InputTypes.SELECT:
      Component = Select;
      break;

    case InputTypes.DATE_TIME:
      Component = (commonProps) => (
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
                            //color: theme?.palette.error.main,
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
      break;

    case InputTypes.TITOLO_PERSONA:
      Component = TitoliAutocomplete;
      break;

    case InputTypes.RADIO_GROUP:
      Component = RadioGroup;
      break;

    default:
      return null;
  }

  return Component ? <Component {...commonProps} /> : null;
};

const InputFactory = React.memo(
  InputFactoryComponent,
  (prevProps, nextProps) => {
    // Considero dinamici i campi: sx, disabled, value, options
    console.log('InputFactory', prevProps.value,  nextProps.value);
    return (
      _.isEqual(prevProps.value, nextProps.value) &&
      _.isEqual(prevProps.disabled, nextProps.disabled) &&
      _.isEqual(prevProps.options, nextProps.options) &&
      _.isEqual(prevProps.sx, nextProps.sx)
    );
  }
);

export default InputFactory;
