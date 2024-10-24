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
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';

import ProtocolloInput from '@components/ProtocolloInput';
import ImportoInput from '@components/ImportoInput';
import { CssTextField, ClearButton, labelColor } from '@theme/MainTheme';
import { Procedimento } from '@model/procedimento';
import Select from '@components/Select';
import { ProcedimentoContext } from '@context/Procedimento';
import NumberInput from '@components/NumberInput';
import SelectQualificaPersona from '@components/SelectQualificaPersona';
import it from 'dayjs/locale/it';
import { height } from '@mui/system';

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

// Constants
const inputHeight = 36;
const gridRowHeight = inputHeight + 34 + 3;
const infoColor = labelColor;

const inputStyles = (
  theme,
  inputWidth,
  minWidth,
  maxWidth,
  margin,
  backgroundColor
) => ({
  margin: margin,
  backgroundColor,
  width: inputWidth,
  maxWidth,
  minWidth,
  height: `${inputHeight}px`,
  '&:hover .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
  '&.Mui-focused .MuiSvgIcon-root': { color: theme.palette.logo.secondary },
});

const StepDatiGeneraliProcedimento = React.forwardRef(
  ({ enableNextStep }, ref) => {
    const theme = useTheme();
    const inputWidth = '168px';
    const minWidth = '133px';
    const maxWidth = '30rem';
    const margin = '18px 20px 0px 0px';
    const backgroundColor = theme.palette.background.default;
    const formLabelFontSize = '1.2rem';
    const formLabelColor = '#467bae';

    const { procedimento, setProcedimento } =
      React.useContext(ProcedimentoContext);
    const [initialProc] = React.useState(new Procedimento()); // Stato iniziale da comparare
    const [errors, setErrors] = React.useState({});
    const [touchedFields, setTouchedFields] = React.useState({});
    const [sedeUgualeCaricamento, setSedeUgualeCaricamento] =
      React.useState(false);

    const requiredFields = [
      'sedeDeposito',
      'numProtocollo',
      'annoProtocollo',
      'oggettoControversia',
    ];

    const esitiMediazione = [
      { value: 'IN CORSO', view: 'IN CORSO' },
      { value: 'NEGATIVO INCONTRO FILTRO', view: 'NEGATIVO INCONTRO FILTRO' },
      { value: 'NEGATIVO MANCATA ADESIONE', view: 'NEGATIVO MANCATA ADESIONE' },
      { value: 'NEGATIVO MANCATO ACCORDO', view: 'NEGATIVO MANCATO ACCORDO' },
      { value: 'POSITIVO', view: 'POSITIVO' },
    ];

    const modalitaSvolgimento = [
      {
        value: 'PRESENZA',
        view: (
          <Tooltip
            placement="right"
            title="Partecipazione sia in presenza che da remoto."
          >
            PRESENZA
            <InfoOutlinedIcon sx={{ color: infoColor }} />
          </Tooltip>
        ),
      },
      {
        value: 'TELEMATICA',
        view: (
          <Tooltip placement="right" title="Incontro interamente a distanza.">
            TELEMATICA
            <InfoOutlinedIcon sx={{ color: infoColor }} />
          </Tooltip>
        ),
      },
      {
        value: 'TELEMATICA_MISTA',
        view: (
          <Tooltip
            placement="right"
            title="Incontro di persona, presso una sede fisica."
          >
            TELEMATICA MISTA
            <InfoOutlinedIcon sx={{ color: infoColor }} />
          </Tooltip>
        ),
      },
    ];

    const requiredFieldsFilled = () => {
      return requiredFields.every(
        (field) => !!procedimento[field] && procedimento[field].trim() !== ''
      );
    };

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        let hasErrors = Object.values(errors).some((hasError) => hasError);
        return !hasErrors && requiredFieldsFilled();
        //return false;
      },
    }));

    React.useEffect(() => {
      let hasErrors = Object.values(errors).some((hasError) => hasError);
      if (typeof enableNextStep === 'function') {
        console.log('enable next');
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

    const handleInputChange = (changes) => {
      const updatedProcedimento = { ...procedimento };
      const updatedTouchedFields = { ...touchedFields };
      const updatedErrors = { ...errors };

      Object.entries(changes).forEach(([campoModel, valueOrEvent]) => {
        let valore;
        if (typeof valueOrEvent === 'object' && valueOrEvent.target) {
          valore =
            valueOrEvent.target.value === ''
              ? undefined
              : valueOrEvent.target.value;
        } else {
          valore = valueOrEvent === '' ? undefined : valueOrEvent;
        }

        if (typeof valore === 'string') {
          valore = valore.toUpperCase();
        }

        const isValid = valore ? validationRules[campoModel]?.(valore) : true;
        console.log('valore: ', valore);

        updatedTouchedFields[campoModel] = true;
        updatedErrors[campoModel] = !isValid;
        updatedProcedimento[campoModel] = valore;

        console.log('campo model: ', campoModel);
        console.log('valore: ', valore);
      });

      setTouchedFields(updatedTouchedFields);
      setErrors(updatedErrors);
      setProcedimento(updatedProcedimento);

      console.log('procedimento originale: ', initialProc);
      console.log(updatedProcedimento);
    };

    const validationRules = {
      sedeDeposito: (sede) => sede && /^[a-zA-Z0-9\s]+$/.test(sede),
      sedeSvolgimento: (sede) =>
        sede ? validationRules.sedeDeposito(sede) : true,
      numProtocollo: (value) => !!value,
      annoProtocollo: (value) => !!value && !isNaN(value),
      dataDeposito: () => true,
      dataOraIncontro: () => true,
      oggettoControversia: (value) => !!value,
      valoreControversia: (value) => !isNaN(value) && value >= 0,
      esitoMediazione: () => true,
      modalitaSvolgimento: () => true,
      numeroIncontri: (value) => !isNaN(value) && value >= 0,
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
          container
          size={{ xs: 12 }}
          sx={{
            width: '100%',
            minHeight: `${gridRowHeight}px`,
            paddingLeft: '1rem',
            rowGap: '1.5rem',
            columnGap: '1.5rem',
          }}
        >
          {/* Titolo form */}
          <Grid
            size={{ xs: 12 }}
            sx={{
              borderBottom: `1px solid ${formLabelColor}`,
              width: 'calc(100% - 1rem)',
            }}
          >
            <Typography
              sx={{ fontSize: formLabelFontSize, color: formLabelColor }}
            >
              Istanza di mediazione
            </Typography>
          </Grid>

          {/* Protocollo */}
          <Grid size={{ xs: 4 }} sx={{ width: 'auto' }}>
            <ProtocolloInput
              onChange={(numProtocollo, anno) => {
                console.log(numProtocollo, anno);
                handleInputChange({ numProtocollo, annoProtocollo: anno });
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
                '0',
                backgroundColor
              )}
            />
          </Grid>

          {/* Data deposito */}
          <Grid size={{ xs: 4 }} sx={{ width: 'auto' }}>
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
                  handleInputChange({ dataDeposito: formattedDate });
                }}
                sx={inputStyles(
                  theme,
                  inputWidth,
                  minWidth,
                  maxWidth,
                  '0',
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
                            sx={{ color: labelColor }}
                          />
                        </InputAdornment>
                      ),
                    },
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Valore della controversia */}
          <Grid size={{ xs: 4 }} sx={{ width: 'auto' }}>
            <ImportoInput
              value={procedimento.valoreControversia}
              onChange={(event) => {
                console.log(event);
                handleInputChange({ valoreControversia: event });
              }}
              sx={inputStyles(
                theme,
                inputWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
              label="Valore della controversia"
            />
          </Grid>

          {/* Sede deposito */}
          <Grid size={{ xs: 12 }} sx={{ width: 'auto', maxWidth: maxWidth }}>
            <CssTextField
              required
              size="small"
              id="outlined-required-sede-deposito"
              label="Sede deposito"
              value={procedimento.sedeDeposito || ''}
              error={touchedFields.sedeDeposito && errors.sedeDeposito}
              helperText={
                touchedFields.sedeDeposito && errors.sedeDeposito
                  ? procedimento.sedeDeposito
                    ? 'Sede non valida'
                    : 'Campo obbligatorio'
                  : ''
              }
              onChange={(event) => {
                handleInputChange({
                  sedeDeposito: event,
                  sedeSvolgimento: sedeUgualeCaricamento
                    ? event
                    : procedimento.sedeSvolgimento,
                });
              }}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
            />
          </Grid>

          {/* Oggetto controversia */}
          <Grid size={{ xs: 12 }} sx={{ width: 'auto', maxWidth: maxWidth }}>
            <Select
              label="Oggetto di controversia"
              required={true}
              value={procedimento.oggettoControversia || ''}
              onChange={(event) =>
                handleInputChange({ oggettoControversia: event })
              }
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
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
          </Grid>

          {/* Esito mediazione */}
          <Grid size={{ xs: 12 }} sx={{ width: 'auto', maxWidth: maxWidth }}>
            <Select
              value={procedimento.esitoMediazione || ''}
              label="Esito"
              onChange={(event) =>
                handleInputChange({ esitoMediazione: event })
              }
              error={touchedFields.esitoMediazione && errors.esitoMediazione}
              options={esitiMediazione}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
            />
          </Grid>

          {/* <SelectQualificaPersona label="Qualifica" options={[{maschile: "AVV", femminile: "AVV.SSA"}, {maschile: "DOTT", femminile: "DOTT.SSA"}]}/> */}
        </Grid>

        {/* Fissazione incontro */}
        <Grid
          container
          size={{ xs: 12 }}
          sx={{
            width: '100%',
            minHeight: `${gridRowHeight}px`,
            paddingLeft: '1rem',
            rowGap: '1.5rem',
            columnGap: '1.5rem',
          }}
        >
          {/* Titolo form */}
          <Grid
            size={{ xs: 12 }}
            sx={{
              borderBottom: `1px solid ${formLabelColor}`,
              width: 'calc(100% - 1rem)',
              //margin: '0 0 0 1rem',
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
              Fissazione incontro
            </Typography>
          </Grid>

          {/* Modalità svolgimento */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{ width: 'auto', maxWidth: maxWidth }}
          >
            <Select
              value={procedimento.modalitaSvolgimento}
              label="Modalità svolgimento"
              onChange={(event) =>
                handleInputChange({ modalitaSvolgimento: event })
              }
              options={modalitaSvolgimento}
              renderValue={(selected) => String(selected).replaceAll('_', ' ')}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
            />
          </Grid>

          {/* Data ora incontro */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ width: 'auto', maxWidth: inputWidth }}
          >
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
                  handleInputChange({ dataOraIncontro: formattedDate });
                }}
                sx={inputStyles(
                  theme,
                  inputWidth,
                  minWidth,
                  maxWidth,
                  '0',
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
          </Grid>

          {/* Sede svolgimento */}
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '1.5rem',
              width: 'auto',
            }}
          >
            <CssTextField
              size="small"
              id="outlined-required-sede-svolgimento"
              disabled={sedeUgualeCaricamento}
              label="Sede svolgimento"
              value={procedimento.sedeSvolgimento || ''}
              onChange={(event) =>
                handleInputChange({ sedeSvolgimento: event })
              }
              error={touchedFields.sedeSvolgimento && errors.sedeSvolgimento}
              helperText={
                touchedFields.sedeSvolgimento && errors.sedeSvolgimento
                  ? 'Sede non valida'
                  : ''
              }
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
            />
            <FormControlLabel
              value={sedeUgualeCaricamento}
              onChange={(event) => {
                const checked = event.target.checked;
                setSedeUgualeCaricamento(checked);

                if (checked)
                  handleInputChange({
                    sedeSvolgimento: procedimento.sedeDeposito,
                  });
                else handleInputChange({ sedeSvolgimento: '' });
              }}
              sx={{
                '& .MuiTypography-root': {
                  color: labelColor,
                },
              }}
              control={<Checkbox />}
              label="Coincidente con sede deposito"
            />
          </Grid>

          {/* Totale incontri */}
          <Grid
            size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            sx={{ width: 'auto' }}
          >
            <NumberInput
              value={procedimento.totaleIncontri}
              label="Totale incontri"
              sx={inputStyles(
                theme,
                '11rem',
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
              onChange={(num) => {
                handleInputChange({ totaleIncontri: num });
              }}
            />
          </Grid>
        </Grid>

        {/* Mediatore */}
        <Grid
          container
          size={{ xs: 12 }}
          sx={{
            width: '100%',
            minHeight: `${gridRowHeight}px`,
            paddingLeft: '1rem',
            rowGap: '1.5rem',
            columnGap: '1.5rem',
          }}
        >
          {/* Titolo della form */}
          <Grid
            size={{ xs: 12 }}
            sx={{
              borderBottom: `1px solid ${formLabelColor}`,
              width: 'calc(100% - 1rem)',
            }}
          >
            <Typography
              sx={{ fontSize: formLabelFontSize, color: formLabelColor }}
            >
              Mediatore
            </Typography>
          </Grid>

          {/* Qualifica */}
          <Grid size={{ xs: 12 }}>
            <SelectQualificaPersona
              label="Titolo professionale/cortesia"
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                0,
                backgroundColor
              )}
              options={[{ maschile: 'AVV', femminile: 'AVV.SSA' }]}
            />
          </Grid>

          {/* Nome */}
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ width: 'auto', maxWidth: maxWidth }}
          >
            <CssTextField
              required
              size="small"
              id="med-nome"
              error={errors.nomeMediatore}
              value={procedimento.nomeMediatore || ''}
              helperText={
                errors.nomeNomeMediatore
                  ? procedimento.nomeMediatore
                    ? 'Nome non valido'
                    : 'Campo obbligatorio'
                  : ''
              }
              label="Nome"
              onChange={(event) => handleInputChange(event, 'nomeMediatore')}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                0,
                backgroundColor
              )}
            />
          </Grid>

          {/* Cognome */}
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ width: 'auto', maxWidth: maxWidth }}
          >
            <CssTextField
              required
              size="small"
              id="med-cognome"
              error={errors.cognomeMediatore}
              value={procedimento.cognomeMediatore || ''}
              helperText={
                errors.cognomeNomeMediatore
                  ? procedimento.cognomeMediatore
                    ? 'Nome non valido'
                    : 'Campo obbligatorio'
                  : ''
              }
              label="Cognome"
              onChange={(event) => handleInputChange(event, 'cognomeMediatore')}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                0,
                backgroundColor
              )}
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
  }
);

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
