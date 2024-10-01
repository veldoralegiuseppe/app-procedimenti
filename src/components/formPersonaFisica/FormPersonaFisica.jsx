import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ImportoField from '/src/components/importoField/ImportoField.jsx';
import ProvinciaSelect from '/src/components/provinciaSelect/ProvinciaSelect.jsx';
import ComuneSelect from '/src/components/comuneSelect/ComuneSelect.jsx';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import * as CodiceFiscaleUtils from '/src/assets/js/convalidaCodiceFiscale.js';
import { Comune } from '/src/vo/comune.js';
import * as ComuniUtils from '/src/assets/js/comuni.js';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { PersonaFisica } from '/src/vo/personaFisica.js';
import Alert from '@mui/material/Alert';
import ReadOnlyAmountField from '/src/components/readOnlyAmountField/ReadonlyAmountField.jsx';

// Constants
const labelColor = 'rgb(105 105 105 / 60%)';
const labelDisableColor = 'rgb(148 148 148 / 60%)'
const inputHeight = 35;
const gridRowHeight = inputHeight + 34 + 3;
const formLabelFontSize = '1rem';
const anagraficaHelperText = '';

// Styling
const textFieldSx = (theme) => ({
  width: '20%',
  height: `${inputHeight}px`,
  margin: '14px 20px 10px 0px',
  minWidth: '133.5px',
  maxWidth: '168px',
  '& .MuiFormLabel-root:not(.Mui-error,.Mui-focused,.Mui-selected)': {
    color: labelColor,
  },
  '& .MuiFormLabel-root.Mui-disabled': {
    color: labelDisableColor,
  },
  '& .MuiOutlinedInput-input': {
    fontWeight: '500',
    color: theme.palette.text.primary,
  },
});

const CssTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root.Mui-focused:not(.Mui-error), & .MuiFormLabel-root.Mui-focused:not(.Mui-error)': {
    color: theme.palette.logo.secondary,
  },
  '& .MuiOutlinedInput-root': {
    input: { textTransform: 'uppercase' },
    '&.Mui-disabled': { backgroundColor: '#efefef73' },
    '&.Mui-disabled fieldset': { borderColor: '#eaeaea' },
    '&:hover:not(.Mui-disabled, .Mui-error) fieldset': {
      borderColor: theme.palette.logo.secondary,
    },
    '&.Mui-focused.Mui-error fieldset': { borderWidth: '1.2px' },
    '&.Mui-focused:not(.Mui-error) fieldset': { border: `1.2px solid ${theme.palette.logo.secondary}` },
    '&.Mui-focused:not(.Mui-error) .MuiInputAdornment-root .MuiSvgIcon-root': {
      fill: `${theme.palette.logo.secondary} !important`,
    },
  },
}));

const CssSelect = styled(Select)(({ theme }) => ({
    '&.Mui-disabled': {
      backgroundColor: '#efefef73',
    },
    '& .MuiSvgIcon-root': {
      fill: theme.palette.text.primary, // Colore di default della freccia
    },
    '&:hover .MuiSvgIcon-root, &.Mui-focused .MuiSvgIcon-root': {
      fill: theme.palette.logo.secondary, // Colore secondario quando selezionato o su hover
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.logo.secondary, // Colore del bordo quando in focus
      },
    },
  }));
  

// Main Component
function FormPersonaFisica(props, ref) {
  const theme = useTheme();
  const [captcha, setCaptcha] = React.useState(null);
  const [parteAttuale, setParteAttuale] = React.useState(new PersonaFisica());
  const [erroreCf, setErroreCf] = React.useState(false);
  const [helperTextCf, setHelperTextCf] = React.useState('');
  const [capResidenza, setCapResidenza] = React.useState('');
  const [anagraficiDisabilitati, setAnagraficiDisabilitati] = React.useState(false);
  const [totaleSpese, setTotaleSpese] = React.useState(0);

  // Effetto che calcola il totale quando cambiano gli importi
  React.useEffect(() => {
    const totale =
      parseImporto(parteAttuale.speseAvvio) +
      parseImporto(parteAttuale.spesePostali) +
      parseImporto(parteAttuale.pagamentoIndennita) +
      parseImporto(parteAttuale.importoMancatoAccordo) +
      parseImporto(parteAttuale.importoPositivoPrimoIncontro) +
      parseImporto(parteAttuale.importoPositivoOltrePrimoIncontro);

    setTotaleSpese(totale.toFixed(2)); // Fissa il totale a due decimali
  }, [parteAttuale]);

  const comuneNascitaRef = React.useRef();
  const provinciaNascitaRef = React.useRef();
  const comuneResidenzaRef = React.useRef();
  const provinciaResidenzaRef = React.useRef();

  // Metodo onSubmit che ritorna i dati di `parteAttuale`
  const onSubmit = () => {
    return parteAttuale;
  };

  // Esponiamo `onSubmit` tramite il `ref`
  React.useImperativeHandle(ref, () => ({
    onSubmit,
  }));
  
  React.useEffect(() => {
    ComuniUtils.initialize();
    window.AgenziaEntrateAPI.onCaptcha((url) => setCaptcha(url));
  }, []);

  // Utility function 
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const resetAnagrafici = () => {
        setParteAttuale({ ...parteAttuale, dataNascita: null, luogoDiNascita: null, sesso: null });
        provinciaNascitaRef.current.setProvincia(null);
        comuneNascitaRef.current.setComune(null);
        setAnagraficiDisabilitati(false);
  };
  const handleInvalidCodiceFiscale = (message) => {
        setErroreCf(true);
        setHelperTextCf(message);
        resetAnagrafici();
  };
  const handleValidCodiceFiscale = (cf) => {
        const comuneNascita = CodiceFiscaleUtils.comuneCf(cf);
        setParteAttuale({
            ...parteAttuale,
            codiceFiscale: cf,
            dataNascita: CodiceFiscaleUtils.dataCf(cf),
            luogoDiNascita: comuneNascita,
            sesso: CodiceFiscaleUtils.sessoCf(cf),
        });
        provinciaNascitaRef.current.setProvincia(comuneNascita.provincia);
        comuneNascitaRef.current.setComune(comuneNascita);
        setAnagraficiDisabilitati(true);
        setErroreCf(false);
        setHelperTextCf('');
  };
  const handleCodiceFiscaleChange = (event) => {
        let cf = event.currentTarget.value.toLocaleUpperCase();

        // Limita la lunghezza del Codice Fiscale a 16 caratteri
        if (cf.length > 16) {
            event.target.value = cf.slice(0, 16);
            return;
        }

        // Se il campo è vuoto, rimuovi eventuali errori e resetta i campi
        if (cf === '') {
            setErroreCf(false);
            setHelperTextCf('');
            resetAnagrafici();
            return;
        }

        // Controllo se il Codice Fiscale inserito è valido
        const isValid = cf.length === 16 && CodiceFiscaleUtils.isValid(cf);

        if (isValid) {
            handleValidCodiceFiscale(cf);
        } else if (cf.length === 16) {
            handleInvalidCodiceFiscale('Codice fiscale non valido');
        } else {
            handleInvalidCodiceFiscale('Codice fiscale incompleto');
        }
  };
  const parseImporto = (importo) => {
    console.log(`importoInput: ${importo} - importoNumber: ${Number(importo)}`)
    return Number(importo);
  };

  return (
    <div style={{ position: 'relative', marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', rowGap: '2.8rem' }}>
      
      {/* Codice fiscale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        {/* Titolo */}
        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
            <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Codice fiscale</Typography>
        </Grid>

        {/* Campo Codice Fiscale */}
        <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', columnGap: '7rem' }}>
            <CssTextField
                error={erroreCf}
                helperText={helperTextCf}
                size='small'
                id="outlined-required-cf-piva"
                label="Codice fiscale"
                onChange={handleCodiceFiscaleChange}
                sx={textFieldSx(theme)}
            />

            <div style={{width: '42rem', margin: '14px 20px 10px 0px',}}>
                <Alert
                    severity="info"
                    sx={{
                        fontSize: '0.875rem', // Testo ridimensionato
                        padding: '4px 8px', // Margini ridotti per rendere l'Alert più piccolo
                        //backgroundColor: '#e0f7fa', // Colore di sfondo azzurro chiaro
                        color: '#0277bd', // Colore blu/azzurro per il testo
                        width: '100%', // Fa sì che il testo si adatti alla larghezza
                        whiteSpace: 'normal', // Permette al testo di andare a capo
                        wordWrap: 'break-word', // Forza l'andata a capo se necessario
                    }}
                >
                    Inserendo il codice fiscale, i campi relativi ai dati anagrafici (esclusi nome e cognome) si compileranno automaticamente.
                </Alert>
            </div>
            
        </Grid>
      </Grid>

      {/* Dati anagrafici */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
            <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Dati anagrafici</Typography>
        </Grid>

        {/* Cognome */}
        <CssTextField
            required
            size='small'
            id="outlined-required-cognome"
            label="Cognome"
            onChange={(event) => setParteAttuale({ ...parteAttuale, cognome: event.target.value.toLocaleUpperCase() })}
            sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Nome */}
        <CssTextField
            required
            size='small'
            id="outlined-required-nome"
            label="Nome"
            onChange={(event) => setParteAttuale({ ...parteAttuale, nome: event.target.value.toLocaleUpperCase() })}
            sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Data di nascita */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='it' localeText={itIT.components.MuiLocalizationProvider.defaultProps.localeText}>
            <DatePicker
                disabled={anagraficiDisabilitati}
                label="Data di nascita"
                value={parteAttuale.dataNascita ? dayjs(parteAttuale.dataNascita) : null}
                onChange={(value) => setParteAttuale({ ...parteAttuale, dataNascita: new Date(value) })}
                slotProps={{
                    textField: {
                        helperText: anagraficaHelperText,
                        size: 'small',
                        sx: {
                            ...textFieldSx(theme),
                            minWidth: '246px',
                            maxWidth: '250px',
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.logo.secondary, // Colore del bordo su hover (arancione)
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.logo.secondary, // Colore del bordo su focus
                                },
                            },

                            '&:hover .MuiSvgIcon-root': {
                                color: theme.palette.logo.secondary, // Colore dell'icona su hover (arancione)
                            },
                            '&.Mui-focused .MuiSvgIcon-root': {
                                color: theme.palette.logo.secondary, // Colore dell'icona in focus (arancione)
                            },
                        },
                        disabled: anagraficiDisabilitati,
                    },
                }}
            />
        </LocalizationProvider>

        {/* Sesso */}
        <FormControl
            variant="outlined"  
            size="small"
            disabled={anagraficiDisabilitati}
            sx={{
                minWidth: '133.5px',
                maxWidth: '168px',
                margin: '14px 20px 10px 0px',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderWidth: '1px',  // Imposta lo spessore del bordo a 1px
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.logo.secondary, // Colore del bordo su hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.logo.secondary, // Colore del bordo su focus
                        borderWidth: '1px', // Mantiene lo spessore del bordo a 1px anche in focus
                    },
                },
                '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 8px) scale(1)', // Posizionamento centrato di default
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -8px) scale(0.75)', // Posizionamento della label ridotta
                }
            }}
        >
            <InputLabel 
              id="sesso-input-label" 
              sx={{
                color: labelColor,
                '&.Mui-disabled': {
                  color: labelColor,
                },
                '&:hover': {
                  //color: 'blue', // Cambia colore su hover
                },
                '&.Mui-focused': {
                  //color: 'orange',
                }
              }}
            >
            Sesso
            </InputLabel>

            <CssSelect
                labelId="sesso-input-label"
                id="sesso-select"
                value={parteAttuale.sesso ? parteAttuale.sesso : ""}
                onChange={(event) => setParteAttuale({ ...parteAttuale, sesso: event.target.value })}
                disabled={anagraficiDisabilitati}
                label="Sesso"
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: theme.palette.dropdown.primary, // Sfondo delle opzioni come in ProvinciaSelect
                        },
                    },
                    MenuListProps: {
                        sx: {
                            '& .MuiMenuItem-root': {
                                color: theme.palette.primary.main, // Colore del testo delle opzioni
                                bgcolor: theme.palette.dropdown.primary, // Sfondo predefinito delle opzioni
                                '&:hover': {
                                    bgcolor: theme.palette.dropdown.hover, // Sfondo quando viene passato il mouse
                                    color: theme.palette.primary.main, // Cambia il colore del testo su hover
                                },
                                '&.Mui-selected': {
                                    bgcolor: theme.palette.dropdown.hover, // Sfondo quando un'opzione è selezionata
                                    color: theme.palette.primary.main, // Colore del testo quando selezionato
                                },
                                '&.Mui-selected:hover': {
                                    bgcolor: theme.palette.dropdown.hover, // Sfondo mantenuto in hover quando selezionato
                                    color: theme.palette.primary.main, // Colore del testo su hover quando selezionato
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value={'M'}>UOMO</MenuItem>
                <MenuItem value={'F'}>DONNA</MenuItem>
            </CssSelect>
        </FormControl>

        {/* Provincia di nascita */}
        <ProvinciaSelect
            ref={provinciaNascitaRef}
            sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
            label="Provincia di nascita"
            disabled={anagraficiDisabilitati}
            helperText={anagraficaHelperText}
            onChange={(value) => {
                comuneNascitaRef.current.setProvincia(value);
                setParteAttuale({ ...parteAttuale, luogoDiNascita: { ...new Comune(), provincia: value } });
            }}
        />

        {/* Comune di nascita */}
        <ComuneSelect
            ref={comuneNascitaRef}
            provincia={parteAttuale.provinciaNascita}
            label="Comune di nascita"
            disabled={anagraficiDisabilitati}
            onChange={(value) => setParteAttuale({ ...parteAttuale, luogoDiNascita: value })}
            sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
      </Grid>

      {/* Dati demografici */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
      <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Dati demografici</Typography>
        </Grid>
        <ProvinciaSelect
          ref={provinciaResidenzaRef}
          label="Provincia di residenza"
          onChange={(value) => {
            comuneResidenzaRef.current.setProvincia(value);
            setParteAttuale({ ...parteAttuale, residenza: { ...new Comune(), provincia: value } });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
        <ComuneSelect
          ref={comuneResidenzaRef}
          provincia={parteAttuale.provinciaResidenza}
          label="Comune di residenza"
          onChange={(value) => {
            const comuneInstance = Object.assign(new Comune(), value);
            setCapResidenza(value?.cap || '');
            setParteAttuale({ ...parteAttuale, residenza: comuneInstance });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
        <CssTextField
          size="small"
          id="outlined-required-indirizzo"
          label="Indirizzo"
          onChange={(event) => setParteAttuale({ ...parteAttuale, indirizzo: event.target.value.toLocaleUpperCase() })}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
        <CssTextField
          size="small"
          id="outlined-required-cup"
          label="CAP"
          disabled={true}
          value={capResidenza}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
      </Grid>

      {/* Recapiti */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>

        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Recapiti</Typography>
        </Grid>

        <CssTextField
          size="small"
          id="outlined-required-pec"
          label="PEC / Email"
          error={parteAttuale.pecEmail && !validateEmail(parteAttuale.pecEmail)}
          helperText={parteAttuale.pecEmail && !validateEmail(parteAttuale.pecEmail) ? 'Indirizzo non valido' : ''}
          onChange={(event) => setParteAttuale({ ...parteAttuale, pecEmail: event.currentTarget.value.toLocaleUpperCase() })}
          sx={{ ...textFieldSx(theme), minWidth: '350px', maxWidth: '350px' }}
        />
  
      </Grid>

      {/* Ditta individuale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Ditta individuale</Typography>
        </Grid>
        <CssTextField
          size="small"
          id="outlined-required-piva"
          label="Partita IVA"
          error={parteAttuale.partitaIVA && !validatePartitaIVA(parteAttuale.partitaIVA)}
          helperText={parteAttuale.partitaIVA && !validatePartitaIVA(parteAttuale.partitaIVA) ? 'Partita IVA non valida' : ''}
          onChange={(event) => setParteAttuale({ ...parteAttuale, partitaIVA: event.currentTarget.value })}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
        <CssTextField
          size="small"
          id="outlined-required-denominazione"
          label="Denominazione"
          error={parteAttuale.denominazione && !validateDenominazione(parteAttuale.denominazione)}
          helperText={parteAttuale.denominazione && !validateDenominazione(parteAttuale.denominazione) ? 'Denominazione non valida' : ''}
          onChange={(event) => setParteAttuale({ ...parteAttuale, denominazione: event.currentTarget.value.toLocaleUpperCase() })}
          sx={{ ...textFieldSx(theme), minWidth: '400px', maxWidth: '420px' }}
        />
      </Grid>

      {/* Assistenza legale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>

        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Rappresentante legale</Typography>
        </Grid>

        {/* Avvocato */}
        <CssTextField
          required
          size="small"
          id="outlined-required-avvocato"
          label="Avvocato"
          error={parteAttuale.rappresentanteLegale && !validateAvvocato(parteAttuale.rappresentanteLegale)}
          helperText={parteAttuale.rappresentanteLegale && !validateAvvocato(parteAttuale.rappresentanteLegale) ? 'Nome non valido' : ''}
          onChange={(event) => setParteAttuale({ ...parteAttuale, rappresentanteLegale: event.currentTarget.value.toLocaleUpperCase() })}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Email/PEC */}
        <CssTextField
          size="small"
          id="outlined-required-pec"
          label="PEC / Email"
          error={parteAttuale.rappresentanteLegalePecEmail && !validateEmail(parteAttuale.rappresentanteLegalePecEmail)}
          helperText={parteAttuale.rappresentanteLegalePecEmail && !validateEmail(parteAttuale.rappresentanteLegalePecEmail) ? 'Indirizzo non valido' : ''}
          onChange={(event) => setParteAttuale({ ...parteAttuale, rappresentanteLegalePecEmail: event.currentTarget.value.toLocaleUpperCase() })}
          sx={{ ...textFieldSx(theme), minWidth: '350px', maxWidth: '350px' }}
        />

      </Grid>

      {/* Spese di mediazione */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>

        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Spese di mediazione</Typography>
        </Grid>
        
        {/* Spese */}
        <Grid xs={12} >
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, speseAvvio: importo })} label={"Spese di avvio"} required={true} />
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, spesePostali: importo })} label={"Spese postali"} required={true} />
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, pagamentoIndennita: importo })} label={"Pagamento indennità"} required={true} />
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, importoMancatoAccordo: importo })} label={"Mancato accordo"} required={true} />
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, importoPositivoPrimoIncontro: importo })} label={"Positivo primo incontro"} required={true} />
          <ImportoField importo={'0,00'} sx={textFieldSx(theme)} onChange={(importo) => setParteAttuale({ ...parteAttuale, importoPositivoOltrePrimoIncontro: importo })} label={"Positivo oltre primo incontro"} required={true} />
        </Grid>

        {/* Totale */}
        <ReadOnlyAmountField
          value={totaleSpese}
          label="Totale Spese"
          backgroundColor="#d7ebff0f"  
          textColor="#467bae"         
          labelColor="#467bae"        
          borderColor="#467bae38"      
          euroIconColor="#467bae"
          helperTextColor={labelColor}
          sx={{ margin: '4rem 20px 10px 0px' }}     
        />


      </Grid>

      {/* Note */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight + 80}px` }}>
        <Grid xs={12} sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontWeight: '400', fontSize: '1rem', color: '#467bae' }}>Informazioni aggiuntive</Typography>
        </Grid>
        <CssTextField
          id="outlined-required-note"
          label="Note"
          multiline
          rows={3}
          sx={{ ...textFieldSx(theme), minWidth: '100%' }}
          onChange={(event) => setParteAttuale({ ...parteAttuale, note: event.target.value.trim() || '' })}
        />
      </Grid>
    </div>
  );
}

export default React.forwardRef(FormPersonaFisica);

