import * as React from 'react';
import { Typography, InputAdornment, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import CloseIcon from '@mui/icons-material/Close';

import ProtocolloInput from '@components/ProtocolloInput';
import ImportoInput from '@components/importoInput/ImportoInput';
import {
  CssTextField,
  ClearButton,
  labelColor,
} from '@theme/MainTheme';
import { Procedimento } from '@model/procedimento';
import Select from '@components/Select';

const oggettiControversia = [
  {
    value: 'ALTRE NATURE DELLA CONTROVERSIA',
    view: 'ALTRE NATURE DELLA CONTROVERSIA',
  },
  { value: 'CONTRATTI BANCARI', view: 'CONTRATTI BANCARI' },
  { value: 'CONTRATTI FINANZIARI', view: 'CONTRATTI FINANZIARI' },
  { value: 'CONTRATTI DI OPERA', view: "CONTRATTI D'OPERA" },
  { value: 'CONTRATTI DI RETE', view: 'CONTRATTI DI RETE' },
  {
    value: 'CONTRATTI DI SOMMINISTRAZIONE',
    view: 'CONTRATTI DI SOMMINISTRAZIONE',
  },
  { value: 'CONSORZIO', view: 'CONSORZIO' },
  { value: 'DIRITTI REALI', view: 'DIRITTI REALI' },
  { value: 'DIVISIONE', view: 'DIVISIONE' },
  { value: 'FRANCHISING', view: 'FRANCHISING' },
  { value: 'LOCAZIONE', view: 'LOCAZIONE' },
  { value: 'PATTI DI FAMIGLIA', view: 'PATTI DI FAMIGLIA' },
  { value: 'RESPONSABILITA MEDICA', view: 'RESPONSABILITÀ MEDICA' },
  {
    value: 'RISARCIMENTO DANNI MEZZO STAMPA',
    view: 'RISARCIMENTO DANNI MEZZO STAMPA',
  },
  { value: 'SUCCESSIONE EREDITARIA', view: 'SUCCESSIONE EREDITARIA' },
  { value: 'SOCIETA DI PERSONE', view: 'SOCIETÀ DI PERSONE' },
  { value: 'SUBFORNITURA', view: 'SUBFORNITURA' },
];
const inputStyles = (
  theme,
  inputWidth,
  minWidth,
  maxWidth,
  margin,
  backgroundColor
) => ({
  margin,
  backgroundColor,
  width: inputWidth,
  maxWidth,
  minWidth,
  '& .MuiOutlinedInput-input': { fontWeight: '500' },
  '&:hover .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
  '&.Mui-focused .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
});

function DatiGeneraliProcedimento() {
  const theme = useTheme();
  const inputWidth = '168px';
  const minWidth = '133px';
  const maxWidth = '200px';
  const margin = '18px 20px 0px 0px';
  const backgroundColor = theme.palette.background.default;
  const formLabelFontSize = '1rem';

  const [procedimento, setProcedimento] = React.useState(new Procedimento());
  const [initialProc] = React.useState(new Procedimento()); // Stato iniziale da comparare
  const [errors, setErrors] = React.useState({
    numProtocollo: false,
    sede: false,
    oggettoControversia: false,
  });

  const handleReset = () => {
    setProcedimento(new Procedimento());
  };
  const isModified = () => {
    return JSON.stringify(procedimento) !== JSON.stringify(initialProc);
  };

  return (
    <form
      id="step-procedimento-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: '4rem',
        padding: '4.5rem 0',
      }}
    >
      {/* Procedimento di mediazione */}
      <Grid xs={12}>
        <Grid
          xs={12}
          sx={{
            borderBottom: '1px solid #467bae61',
            margin: '0 0 0 1rem',
            width: 'calc(100% - 1rem)',
          }}
        >
          <Typography
            sx={{
              fontWeight: '400',
              fontSize: formLabelFontSize,
              color: '#467bae',
            }}
          >
            Procedimento di mediazione
          </Typography>
        </Grid>

        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          {/* Numero di procedimento */}
          <ProtocolloInput
            onChange={(numProtocollo, anno) => {
              setProcedimento((prev) => ({
                ...prev,
                numProtocollo,
                annoProtocollo: anno,
              }));
            }}
            numProtocollo={procedimento.numProtocollo}
            anno={procedimento.annoProtocollo}
            sx={inputStyles(
              theme,
              inputWidth,
              minWidth,
              maxWidth,
              margin,
              backgroundColor
            )}
          />

          {/* Data deposito */}
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="it"
            localeText={
              itIT.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <MobileDatePicker
              label="Data deposito"
              value={dayjs(procedimento.dataDeposito)}
              onChange={(value) => {
                setProcedimento((prev) => ({
                  ...prev,
                  dataDeposito: new Date(value),
                }));
              }}
              sx={inputStyles(
                theme,
                inputWidth,
                minWidth,
                maxWidth,
                margin,
                backgroundColor
              )}
              slots={{ textField: CssTextField }}
              slotProps={{
                textField: {
                  error: false,
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonthOutlinedIcon
                          sx={{
                            color: false
                              ? theme.palette.error.main
                              : labelColor,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                  size: 'small',
                },
              }}
            />
          </LocalizationProvider>

          {/* Data e ora incontro */}
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="it"
            localeText={
              itIT.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <MobileDateTimePicker
              label="Data e ora incontro"
              value={procedimento.dataOraIncontro || null}
              onChange={(value) => {
                setProcedimento((prev) => ({
                  ...prev,
                  dataOraIncontro: value ? new Date(value) : null,
                }));
              }}
              sx={inputStyles(
                theme,
                inputWidth,
                minWidth,
                maxWidth,
                margin,
                backgroundColor
              )}
              slots={{ textField: CssTextField }}
              slotProps={{
                textField: {
                  error: false,
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {procedimento.dataOraIncontro ? (
                          <CloseIcon
                            onClick={(event) => {
                              event.stopPropagation();
                              setProcedimento((prev) => ({
                                ...prev,
                                dataOraIncontro: null,
                              }));
                            }}
                            sx={{
                              cursor: 'pointer',
                              color: theme.palette.error.main,
                            }}
                          />
                        ) : (
                          <CalendarMonthOutlinedIcon
                            sx={{
                              color: labelColor,
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  },
                  size: 'small',
                },
              }}
            />
          </LocalizationProvider>

          {/* Sede caricamento */}
          <CssTextField
            required
            size="small"
            id="outlined-required-sede"
            label="Sede"
            value={procedimento.sede || ''}
            onChange={(event) => {
              setProcedimento((prev) => ({
                ...prev,
                sede: event.target.value,
              }));
            }}
            sx={inputStyles(
              theme,
              inputWidth,
              minWidth,
              maxWidth,
              margin,
              backgroundColor
            )}
          />

          {/* Sede svolgimento */}
          <CssTextField
            size="small"
            id="outlined-required-sede-svolgimento"
            label="Sede svolgimento"
            value={procedimento.sedeSvolgimento || ''}
            onChange={(event) => {
              setProcedimento((prev) => ({
                ...prev,
                sedeSvolgimento: event.target.value,
              }));
            }}
            sx={inputStyles(
              theme,
              inputWidth,
              minWidth,
              maxWidth,
              margin,
              backgroundColor
            )}
          />
        </Grid>
      </Grid>

      {/* Controversia */}
      <Grid xs={12}>
        <Grid
          xs={12}
          sx={{
            borderBottom: '1px solid #467bae61',
            margin: '0 0 0 1rem',
            width: 'calc(100% - 1rem)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: '400',
              fontSize: formLabelFontSize,
              color: `#467bae`,
            }}
          >
            Controversia
          </Typography>
        </Grid>

        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          {/* Oggetto di controversia */}
          <Select
            label="Oggetto di controversia"
            value={procedimento.oggettoControversia || ''}
            onChange={(event) => {
              setProcedimento((prev) => ({
                ...prev,
                oggettoControversia: event.target.value,
              }));
            }}
            options={oggettiControversia}
          />

          {/* Valore della controversia */}
          <ImportoInput
            importo={procedimento.valoreControversia}
            onChange={(valore) => {
              setProcedimento((prev) => ({
                ...prev,
                valoreControversia: valore,
              }));
            }}
            sx={{
              margin,
              backgroundColor,
              width: inputWidth,
              minWidth,
              maxWidth,
            }}
            label="Valore della controversia"
          />
        </Grid>
      </Grid>

      {/* Reset button */}
      <Grid
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'start',
          margin: '1rem 0 0 1rem',
          width: 'calc(100% - 1rem)',
        }}
      >
        <ClearBtn onReset={handleReset} isDisabled={!isModified()} />
      </Grid>
    </form>
  );
}

function ClearBtn({ onReset, isDisabled }) {
  const theme = useTheme();

  return (
    <ClearButton
      variant="outlined"
      onClick={onReset}
      startIcon={
        <DeleteIcon
          sx={{
            color: isDisabled
              ? 'rgb(105 105 105 / 60%)'
              : theme.palette.primary.main,
          }}
        />
      }
      sx={{
        fontSize: '.9rem',
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
          fontWeight: '400',
        },
      }}
      disabled={isDisabled}
    >
      Pulisci campi
    </ClearButton>
  );
}

export default React.forwardRef(DatiGeneraliProcedimento);
