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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Slide from '@mui/material/Slide';

import ProtocolloInput from '@components/ProtocolloInput';
import ImportoInput from '@components/ImportoInput';
import { CssTextField, ClearButton, labelColor } from '@theme/MainTheme';
import {
  Procedimento,
  oggettiControversia,
  modalitaSvolgimento,
  causaliDemandata,
  esitiMediazione,
  sedePrincipale
} from '@model/procedimento';
import Select from '@components/Select';
import { ProcedimentoContext } from '@context/Procedimento';
import NumberInput from '@components/NumberInput';
import SelectQualificaPersona from '@components/SelectQualificaPersona';
import TabellaSpese from '../components/TabellaSpese';
import { calculateValueByActiveRule } from '@model/regola';

// Constants
const inputHeight = 36;
const gridRowHeight = inputHeight + 34 + 3;
const CAUSALE_VOLONTARIA_IN_MATERIA = 'VOLONTARIA IN MATERIA DI';

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
    // Style
    const theme = useTheme();
    const inputWidth = '168px';
    const minWidth = '133px';
    const maxWidth = '30rem';
    const backgroundColor = theme.palette.background.default;
    const formLabelFontSize = '1.2rem';
    const formLabelColor = '#467bae';

    // Context
    const procedimentoContext = React.useContext(ProcedimentoContext);
    const { procedimento, setProcedimento, regole, metadatiProcedimento } = procedimentoContext;

    // State
    const [initialProc] = React.useState(new Procedimento()); // Stato iniziale da comparare
    const [errors, setErrors] = React.useState({});
    const [touchedFields, setTouchedFields] = React.useState({});
    const [sedeUgualeCaricamento, setSedeUgualeCaricamento] =
      React.useState(false);
    const [titoliMediatore, setTitoliMediatore] = React.useState([
      { maschile: 'AVV', femminile: 'AVV.SSA' },
    ]);
    const [showFormMateriaVolontaria, setShowFormMateriaVolontaria] =
      React.useState(
        procedimento.causaleDemandata === CAUSALE_VOLONTARIA_IN_MATERIA
      );
    const [
      automatedValueCompensoMediatore,
      setAutometedValueCompensoMediatore,
    ] = React.useState(
      calculateValueByActiveRule('compensoMediatore', procedimentoContext)
    );
    const [bodySpese, setBodySpese] = React.useState([
      [{ nome: 'Incasso dalle parti', tipo: 'entrata' }, 0, 'da saldare'],
      [{ nome: 'Incasso dalle controparti', tipo: 'entrata' }, 0, 'da saldare'],
      [
        { nome: 'Compenso mediatore', tipo: 'uscita' },
        automatedValueCompensoMediatore != null &&
        automatedValueCompensoMediatore != undefined
          ? {
              value: automatedValueCompensoMediatore,
              automated: true,
            }
          : 0,
        'da saldare',
      ],
    ]);

    // Refs
    const containerFormDemandataRef = React.useRef(null);

    // UseImperativeHandle
    const requiredFields = [
      'sedeDeposito',
      'numProtocollo',
      'annoProtocollo',
      'oggettoControversia',
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

    // Use Effect
    React.useEffect(() => {
      let hasErrors = Object.values(errors).some((hasError) => hasError);
      if (typeof enableNextStep === 'function') {
        //console.log('enable next');
        enableNextStep(!hasErrors && requiredFieldsFilled());
        //enableNextStep(true)
      }
    }, [errors, procedimento]);

    React.useEffect(() => {
      setBodySpese((prevBodySpese) => {
        // Aggiorna il valore di "Compenso mediatore"
        let updatedBodySpese = prevBodySpese.map((row) => {
          if (row[0].nome === 'Compenso mediatore') {
            return [
              row[0],
              automatedValueCompensoMediatore != null
                ? { value: automatedValueCompensoMediatore, automated: true }
                : procedimento.compensoMediatore,
              row[2],
            ];
          }
          return row;
        });
    
        // Definisce le spese per la sede secondaria
        const speseSedeSecondaria = [
          { nome: 'Spese avvio sede secondaria', tipo: 'uscita', key: 'speseAvvioSedeSecondaria' },
          { nome: 'Spese indennità sede secondaria', tipo: 'uscita', key: 'speseIndennitaSedeSecondaria' },
        ];
    
        const isSedeSecondaria = procedimento.sedeSvolgimento !== sedePrincipale;
    
        // Rimuove le spese della sede secondaria se già presenti, prima di eventuale aggiunta
        updatedBodySpese = updatedBodySpese.filter(
          (row) => !speseSedeSecondaria.some((spesa) => spesa.nome === row[0].nome)
        );
    
        // Aggiunge le spese della sede secondaria se `isSedeSecondaria` è true
        if (isSedeSecondaria) {
          speseSedeSecondaria.forEach((spesa) => {
            updatedBodySpese.push([
              spesa,
              procedimento[spesa.key] || 0,
              'da saldare',
            ]);
          });
        }
    
        return updatedBodySpese;
      });
    }, [
      procedimento.sedeSvolgimento,
      procedimento.speseAvvioSedeSecondaria,
      procedimento.speseIndennitaSedeSecondaria,
      procedimento.compensoMediatore,
      automatedValueCompensoMediatore,
    ]);
    
    React.useEffect(() => {
      const valueCompensoMediatore = calculateValueByActiveRule(
        'compensoMediatore',
        procedimentoContext
      );
      setAutometedValueCompensoMediatore(valueCompensoMediatore);
    }, [regole]);

    // Handlers
    const handleReset = () => {
      setProcedimento(new Procedimento());
      setTouchedFields({});
      setErrors({});
    };
    const isModified = () => {
      return JSON.stringify(procedimento) !== JSON.stringify(initialProc);
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
      nomeMediatore: (value) =>
        !!value && /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value),
      cognomeMediatore: (value) => validationRules.nomeMediatore(value),
      titoloMediatore: (value) => true,
      causaleDemandata: (value) => !!value,
      materiaCausaleDemandata: (value) =>
        !!value && /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(value),
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

        updatedTouchedFields[campoModel] = true;
        updatedErrors[campoModel] = !isValid;
        updatedProcedimento[campoModel] = valore;
      });

      setTouchedFields(updatedTouchedFields);
      setErrors(updatedErrors);
      setProcedimento(updatedProcedimento);

      // console.log('procedimento originale: ', initialProc);
       console.log(updatedProcedimento);
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
                //console.log(numProtocollo, anno);
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

          {/* Demandata */}
          <Grid
            size={{ xs: showFormMateriaVolontaria ? 6 : 12 }}
            sx={{
              width: 'auto',
              maxWidth: maxWidth,
            }}
          >
            <Select
              label="Demandata"
              value={procedimento.causaleDemandata || ''}
              options={causaliDemandata}
              onChange={(event) => {
                const showFormMateriaVolontaria =
                  event.target.value === CAUSALE_VOLONTARIA_IN_MATERIA;

                if (showFormMateriaVolontaria)
                  requiredFields.push('materiaCausaleDemandata');
                else {
                  requiredFields.pop('materiaCausaleDemandata');
                }

                handleInputChange({
                  isDemandata: !!event.target.value,
                  causaleDemandata: event,
                  materiaCausaleDemandata: showFormMateriaVolontaria
                    ? procedimento.materiaCausaleDemandata
                    : undefined,
                });

                setShowFormMateriaVolontaria(showFormMateriaVolontaria);
              }}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                '0',
                backgroundColor
              )}
              error={touchedFields.causaleDemandata && errors.causaleDemandata}
            />
          </Grid>

          {/* Materia demandata */}
          {showFormMateriaVolontaria && (
            <Grid ref={containerFormDemandataRef} size={{ xs: 6 }}>
              <Slide
                in={showFormMateriaVolontaria}
                container={containerFormDemandataRef.current}
                direction="left"
                mountOnEnter
                unmountOnExit
                timeout={300}
              >
                <CssTextField
                  size="small"
                  id="outlined-required-materia-demandata"
                  label="Materia"
                  required
                  value={procedimento.materiaCausaleDemandata || ''}
                  onChange={(event) =>
                    handleInputChange({ materiaCausaleDemandata: event })
                  }
                  error={
                    touchedFields.materiaCausaleDemandata &&
                    errors.materiaCausaleDemandata
                  }
                  helperText={
                    touchedFields.materiaCausaleDemandata &&
                    errors.materiaCausaleDemandata
                      ? procedimento.materiaCausaleDemandata
                        ? 'Materia non valida'
                        : 'Campo obbligatorio'
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
              </Slide>
            </Grid>
          )}

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
              value={procedimento.modalitaSvolgimento || ''}
              label="Modalità svolgimento"
              onChange={(event) =>
                handleInputChange({ modalitaSvolgimento: event })
              }
              options={modalitaSvolgimento}
              renderOptions={(selected) => {
                const tooltipMessage = {
                  PRESENZA: 'Partecipazione sia in presenza che da remoto.',
                  TELEMATICA: 'Incontro interamente a distanza.',
                  TELEMATICA_MISTA:
                    'Incontro di persona, presso una sede fisica.',
                };

                return (
                  <Tooltip placement="right" title={tooltipMessage[selected]}>
                    <div style={{ display: 'flex', width: '100%' }}>
                      {selected.replaceAll(/_/g, ' ')}
                      <InfoOutlinedIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: '.8rem',
                        }}
                      />
                    </div>
                  </Tooltip>
                );
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

          {/* Titolo */}
          <Grid size={{ xs: 12 }}>
            <SelectQualificaPersona
              label="Titolo professionale/cortesia"
              value={procedimento.titoloMediatore || ''}
              error={errors.titoloMediatore}
              helperText={errors.titoloMediatore ? 'Titolo non valido' : ''}
              onSubmit={(newTitolo) => {
                setTitoliMediatore([...titoliMediatore, newTitolo]);
              }}
              onDelete={(deletedTitolo) => {
                setTitoliMediatore(
                  titoliMediatore.filter((titolo) => titolo !== deletedTitolo)
                );
              }}
              sx={inputStyles(
                theme,
                maxWidth,
                minWidth,
                maxWidth,
                0,
                backgroundColor
              )}
              options={titoliMediatore}
              onChange={(event) => {
                handleInputChange({ titoloMediatore: event });
              }}
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
              helperText={errors.nomeMediatore ? 'Nome non valido' : ''}
              label="Nome"
              onChange={(event) => handleInputChange({ nomeMediatore: event })}
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
              helperText={errors.cognomeMediatore ? 'Cognome non valido' : ''}
              label="Cognome"
              onChange={(event) =>
                handleInputChange({ cognomeMediatore: event })
              }
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

        {/* Riepilogo spese */}
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
              Riepilogo spese
            </Typography>
          </Grid>

          {/* Tabella spese */}
          <Grid size={{ xs: 12 }}>
            <TabellaSpese
              metadata={[
                { columnName: 'Transazione' },
                { columnType: 'importo', columnName: 'importo' },
                { columnType: 'stato', columnName: 'stato' },
              ]}
              body={bodySpese}
              onImportoChange={(row, importo) => {
                const label = row[0].nome;
                const key = Object.values(metadatiProcedimento.current).find(
                  (field) => field.label === label
                )?.key;

                console.log('Key trovata:', key);
                if (key) handleInputChange({ [key]: importo });
              }}
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
