import * as React from 'react';
import { Typography, InputAdornment, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
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
import ImportoInput from '@components/ImportoInput';
import { CssTextField, ClearButton, labelColor } from '@theme/MainTheme';
import { Procedimento } from '@model/procedimento';
import Select from '@components/Select';
import { ProcedimentoContext } from '@context/Procedimento';

const oggettiControversia = [
  { value: 'ALTRE NATURE DELLA CONTROVERSIA', view: 'ALTRE NATURE DELLA CONTROVERSIA' },
  { value: 'CONTRATTI BANCARI', view: 'CONTRATTI BANCARI' },
  { value: 'CONTRATTI FINANZIARI', view: 'CONTRATTI FINANZIARI' },
  { value: 'CONTRATTI DI OPERA', view: "CONTRATTI D'OPERA" },
  { value: 'CONTRATTI DI RETE', view: 'CONTRATTI DI RETE' },
  { value: 'CONTRATTI DI SOMMINISTRAZIONE', view: 'CONTRATTI DI SOMMINISTRAZIONE' },
  { value: 'CONSORZIO', view: 'CONSORZIO' },
  { value: 'DIRITTI REALI', view: 'DIRITTI REALI' },
  { value: 'DIVISIONE', view: 'DIVISIONE' },
  { value: 'FRANCHISING', view: 'FRANCHISING' },
  { value: 'LOCAZIONE', view: 'LOCAZIONE' },
  { value: 'PATTI DI FAMIGLIA', view: 'PATTI DI FAMIGLIA' },
  { value: 'RESPONSABILITA MEDICA', view: 'RESPONSABILITÀ MEDICA' },
  { value: 'RISARCIMENTO DANNI MEZZO STAMPA', view: 'RISARCIMENTO DANNI MEZZO STAMPA' },
  { value: 'SUCCESSIONE EREDITARIA', view: 'SUCCESSIONE EREDITARIA' },
  { value: 'SOCIETA DI PERSONE', view: 'SOCIETÀ DI PERSONE' },
  { value: 'SUBFORNITURA', view: 'SUBFORNITURA' },
];

// Constants
const inputHeight = 56;
const gridRowHeight = inputHeight + 34 + 3;

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
  height: `${inputHeight}px`,
  '&:hover .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
  '&.Mui-focused .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
});

const StepDatiGeneraliProcedimento = React.forwardRef(({ enableNextStep }, ref) => {
  const theme = useTheme();
  const inputWidth = '168px';
  const minWidth = '133px';
  const maxWidth = '200px';
  const margin = '18px 20px 0px 0px';
  const backgroundColor = theme.palette.background.default;
  const formLabelFontSize = '1.2rem';
  const formLabelColor = '#467bae';

  const {procedimento, setProcedimento} = React.useContext(ProcedimentoContext);
  const [initialProc] = React.useState(new Procedimento()); // Stato iniziale da comparare
  const [errors, setErrors] = React.useState({});
  const [touchedFields, setTouchedFields] = React.useState({});
  
  const requiredFields = ['sede', 'numProtocollo', 'annoProtocollo', 'oggettoControversia'];

  const requiredFieldsFilled = () => {
    return requiredFields.every(
      (field) => !!procedimento[field] && procedimento[field].trim() !== ''
    );
  };

  React.useImperativeHandle(ref, () => ({
    validate: () => {
      let hasErrors = Object.values(errors).some(hasError => hasError);
      return !hasErrors && requiredFieldsFilled();
      //return false;
    },
  }));

  React.useEffect(() => {
    let hasErrors = Object.values(errors).some(hasError => hasError);
    if (typeof enableNextStep === 'function') {
      console.log('enable next')
      enableNextStep(!hasErrors && requiredFieldsFilled());
      //enableNextStep(true)
    }
  }, [errors, procedimento]);

  const handleReset = () => {
    setProcedimento(new Procedimento());
    setTouchedFields({});
    setErrors({});
  };

  const isModified = () => {
    return JSON.stringify(procedimento) !== JSON.stringify(initialProc);
  };

  const handleInputChange = (valueOrEvent, campoModel) => {
    const valore =
      typeof valueOrEvent === 'object' && valueOrEvent.target
        ? valueOrEvent.target.value.toUpperCase()
        : String(valueOrEvent).toUpperCase();

    const isValid = valore ? validationRules[campoModel]?.(valore) : true;

    setTouchedFields((prevTouched) => ({
      ...prevTouched,
      [campoModel]: true,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [campoModel]: !isValid,
    }));

    setProcedimento((prev) => ({
      ...prev,
      [campoModel]: valore,
    }));
  };

  const validationRules = {
    sede: (sede) => sede && /^[a-zA-Z0-9\s!@#\$%\^\&*\)\(+=._-]+$/.test(sede),
    sedeSvolgimento: (sede) => sede ? validationRules.sede(sede) : true,
    numProtocollo: (value) => !!value,
    annoProtocollo: (value) => !!value && !isNaN(value),
    dataDeposito: () => true,
    dataOraIncontro: () => true,
    oggettoControversia: (value) => !!value,
    valoreControversia: (value) => !isNaN(value) && value >= 0,
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
      }}
    >
      {/* Procedimento di mediazione */}
      <Grid
        size={{ xs: 12 }}
        sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}
      >
        <Grid
          xs={12}
          sx={{
            borderBottom: `1px solid ${formLabelColor}`,
            margin: '0 0 0 1rem',
            width: 'calc(100% - 1rem)',
          }}
        >
          <Typography sx={{ fontSize: formLabelFontSize, color: formLabelColor }}>
            Procedimento di mediazione
          </Typography>
        </Grid>

        {/* Protocollo */}
        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          <ProtocolloInput
            onChange={(numProtocollo, anno) => {
              handleInputChange(numProtocollo, 'numProtocollo');
              handleInputChange(anno, 'annoProtocollo');
            }}
            numProtocollo={procedimento.numProtocollo}
            anno={procedimento.annoProtocollo}
            error={
              (touchedFields.numProtocollo && errors.numProtocollo) ||
              (touchedFields.annoProtocollo && errors.annoProtocollo)
            }
            helperText={
              (touchedFields.numProtocollo || touchedFields.annoProtocollo) &&
              (errors.numProtocollo || errors.annoProtocollo)
                ? procedimento.numProtocollo && procedimento.annoProtocollo
                  ? 'Protocollo non valido'
                  : 'Campo obbligatorio'
                : ''
            }
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
              value={
                procedimento.dataDeposito
                  ? dayjs(procedimento.dataDeposito)
                  : null
              }
              onChange={(date) => {
                const formattedDate = date ? date.format('YYYY-MM-DD') : null;
                handleInputChange(formattedDate, 'dataDeposito');
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
                        <CalendarMonthOutlinedIcon sx={{ color: labelColor }} />
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
              value={
                procedimento.dataOraIncontro
                  ? dayjs(procedimento.dataOraIncontro)
                  : null
              }
              onChange={(date) => {
                const formattedDate = date
                  ? date.format('YYYY-MM-DDTHH:mm')
                  : null;
                handleInputChange(formattedDate, 'dataOraIncontro');
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
                            sx={{ color: labelColor }}
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

          {/* Sede */}
          <CssTextField
            required
            size="small"
            id="outlined-required-sede"
            label="Sede"
            value={procedimento.sede || ''}
            error={touchedFields.sede && errors.sede}
            helperText={
              touchedFields.sede && errors.sede
                ? procedimento.sede
                  ? 'Sede non valida'
                  : 'Campo obbligatorio'
                : ''
            }
            onChange={(event) => handleInputChange(event, 'sede')}
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
            onChange={(event) => handleInputChange(event, 'sedeSvolgimento')}
            error={touchedFields.sedeSvolgimento && errors.sedeSvolgimento}
            helperText={
              touchedFields.sedeSvolgimento && errors.sedeSvolgimento
                ? 'Sede non valida'
                : ''
            }
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
      <Grid
        size={{ xs: 12 }}
        sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}
      >
        <Grid
          xs={12}
          sx={{
            borderBottom: `1px solid ${formLabelColor}`,
            margin: '0 0 0 1rem',
            width: 'calc(100% - 1rem)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: formLabelFontSize,
              fontWeight: '400',
              color: formLabelColor,
            }}
          >
            Controversia
          </Typography>
        </Grid>

        <Grid xs={12} sx={{ paddingLeft: '1rem' }}>
          <Select
            label="Oggetto di controversia"
            value={procedimento.oggettoControversia || ''}
            onChange={(event) =>
              handleInputChange(event, 'oggettoControversia')
            }
            error={
              touchedFields.oggettoControversia && errors.oggettoControversia
            }
            helperText={
              touchedFields.oggettoControversia && errors.oggettoControversia
                ? 'Campo obbligatorio'
                : ''
            }
            options={oggettiControversia}
          />

          {/* Valore della controversia */}
          <ImportoInput
            value={procedimento.valoreControversia}
            onChange={(event) => handleInputChange(event, 'valoreControversia')}
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
        size={{ xs: 12 }}
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
});

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
        '&.Mui-disabled': { color: theme.palette.text.disable },
      }}
      disabled={isDisabled}
    >
      Pulisci campi
    </ClearButton>
  );
}

export default StepDatiGeneraliProcedimento;
