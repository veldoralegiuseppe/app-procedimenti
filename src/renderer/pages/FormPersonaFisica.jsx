import * as React from 'react';
import {
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { itIT } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';

import {
  ImportoInput,
  ProvinciaSelect,
  ComuneSelect,
  ImportoReadOnly,
} from '@ui-shared/components';
import * as CodiceFiscaleUtils from '@assets/js/convalidaCodiceFiscale';
import { Comune, Provincia } from '@ui-shared/components';
import { PersonaFisica } from '@features/persona';
import {
  CssTextField,
  labelColor,
  labelDisableColor,
  CssSelect,
  formControlStyles,
} from '@ui-shared/theme';

// Constants
const inputHeight = 35;
const gridRowHeight = inputHeight + 34 + 3;

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
    color: theme.palette.text.primary,
  },
});

// Main Component
function FormPersonaFisica(props, ref) {
  // Layout
  const theme = useTheme();

  // State
  const [parteAttuale, setParteAttuale] = React.useState(new PersonaFisica());
  const [helperTextCf, setHelperTextCf] = React.useState('');
  const [capResidenza, setCapResidenza] = React.useState('');
  const [anagraficiDisabilitati, setAnagraficiDisabilitati] =
    React.useState(false);
  const [totaleSpese, setTotaleSpese] = React.useState(0);
  const [errors, setErrors] = React.useState({
    codiceFiscale: false,
    cognome: false,
    nome: false,
    email: false,
    pecEmail: false,
    partitaIVA: false,
    denominazione: false,
    rappresentanteLegale: false,
    rappresentanteLegalePecEmail: false,
    indirizzoResidenza: false,
  });

  // Effect
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

  // Ref
  const comuneNascitaRef = React.useRef();
  const provinciaNascitaRef = React.useRef();
  const comuneResidenzaRef = React.useRef();
  const provinciaResidenzaRef = React.useRef();

  // Utility
  const resetForm = () => {
    setParteAttuale(new PersonaFisica()); // Reset dello stato a un nuovo oggetto PersonaFisica
    setCapResidenza(''); // Reset CAP residenza
    setHelperTextCf(''); // Reset helper text del Codice Fiscale
    setErrors({
      codiceFiscale: false,
      cognome: false,
      nome: false,
      email: false,
      pecEmail: false,
      partitaIVA: false,
      denominazione: false,
      rappresentanteLegale: false,
      rappresentanteLegalePecEmail: false,
      indirizzoResidenza: false,
    }); // Reset degli errori

    // Reset delle referenze ai selettori di Comune e Provincia
    if (provinciaNascitaRef.current) {
      provinciaNascitaRef.current.setProvincia(null);
    }
    if (comuneNascitaRef.current) {
      comuneNascitaRef.current.setComune(null);
    }
    if (provinciaResidenzaRef.current) {
      provinciaResidenzaRef.current.setProvincia(null);
    }
    if (comuneResidenzaRef.current) {
      comuneResidenzaRef.current.setComune(null);
    }

    setAnagraficiDisabilitati(false); // Riattiva i campi anagrafici
  };
  const resetAnagrafici = () => {
    setParteAttuale((prevParteAttuale) => ({
      ...prevParteAttuale,
      dataNascita: null,
      luogoDiNascita: null,
      sesso: null,
    }));
    provinciaNascitaRef.current.setProvincia(null);
    comuneNascitaRef.current.setComune(null);
    setAnagraficiDisabilitati(false);
  };
  const handleInvalidCodiceFiscale = (message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      codiceFiscale: true,
    }));
    setHelperTextCf(message);
    resetAnagrafici();
  };
  const handleValidCodiceFiscale = async (cf) => {
    try {
      // Estrai il comune di nascita dal Codice Fiscale
      const comuneNascita = await CodiceFiscaleUtils.comuneCf(cf);

      if (!comuneNascita) {
        console.error(
          'Comune di nascita non trovato per il codice fiscale:',
          cf
        );
        setHelperTextCf('Comune di nascita non valido');
        setErrors((prevErrors) => ({
          ...prevErrors,
          codiceFiscale: true,
        }));
        return;
      }

      // Aggiorna lo stato con i dati estratti
      setParteAttuale((prevParteAttuale) => ({
        ...prevParteAttuale,
        codiceFiscale: cf,
        dataNascita: CodiceFiscaleUtils.dataCf(cf),
        luogoDiNascita: comuneNascita,
        sesso: CodiceFiscaleUtils.sessoCf(cf),
      }));

      // Aggiorna i riferimenti a provincia e comune
      if (provinciaNascitaRef.current && comuneNascita.provincia) {
        provinciaNascitaRef.current.setProvincia(comuneNascita.provincia);
      }
      if (comuneNascitaRef.current) {
        comuneNascitaRef.current.setComune(comuneNascita);
      }

      // Disabilita i campi anagrafici e rimuovi gli errori
      setAnagraficiDisabilitati(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        codiceFiscale: false,
      }));
      setHelperTextCf('');
    } catch (error) {
      console.error('Errore durante la validazione del codice fiscale:', error);
      setHelperTextCf('Errore durante la validazione del codice fiscale');
      setErrors((prevErrors) => ({
        ...prevErrors,
        codiceFiscale: true,
      }));
    }
  };
  const handleCodiceFiscaleChange = (event) => {
    let cf = event.currentTarget.value.toUpperCase(); // Converti tutto in maiuscolo

    // Limita la lunghezza del Codice Fiscale a 16 caratteri, ma aggiorna comunque il valore
    if (cf.length > 16) {
      cf = cf.slice(0, 16); // Limita il valore massimo a 16 caratteri
    }

    // Aggiorna immediatamente il campo Codice Fiscale nello stato, senza eseguire la validazione
    setParteAttuale((prevParteAttuale) => ({
      ...prevParteAttuale,
      codiceFiscale: cf,
    }));

    // Se il campo è vuoto, rimuovi eventuali errori e resetta i campi
    if (cf === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        codiceFiscale: false,
      }));
      setHelperTextCf('');
      resetAnagrafici();
      return;
    }

    // Se il Codice Fiscale ha esattamente 16 caratteri, esegui la validazione
    if (cf.length === 16) {
      const isValid = CodiceFiscaleUtils.isValid(cf);

      if (isValid) {
        handleValidCodiceFiscale(cf);
      } else {
        handleInvalidCodiceFiscale('Codice fiscale non valido');
      }
    } else {
      // Se è incompleto, ma non bloccare l'input
      setHelperTextCf('Codice fiscale incompleto');
      setErrors((prevErrors) => ({
        ...prevErrors,
        codiceFiscale: true,
      }));
    }
  };
  const parseImporto = (importo) => {
    //console.log(`importoInput: ${importo} - importoNumber: ${Number(importo)}`)
    return Number(importo);
  };

  // Handler
  const onSubmit = () => {
    const parteCreata = Object.assign(new PersonaFisica(), parteAttuale);
    resetForm();
    return parteCreata;
  };
  const getErrors = () => {
    const requiredFields = ['cognome', 'nome', 'rappresentanteLegale'];
    const fieldLabels = {
      codiceFiscale: 'Codice fiscale',
      cognome: 'Cognome',
      nome: 'Nome',
      email: 'Email',
      pecEmail: 'PEC / Email',
      partitaIVA: 'Partita IVA',
      denominazione: 'Denominazione',
      rappresentanteLegale: 'Avvocato',
      indirizzoResidenza: 'Indirizzo di residenza',
      rappresentanteLegalePecEmail: 'PEC / Email del rappresentante legale',
    };

    let updatedErrors = { ...errors };
    let hasErrors = false;
    let message = '';

    // Controllo dei campi obbligatori mancanti
    const missingRequiredFields = requiredFields.filter(
      (field) => !parteAttuale[field] || parteAttuale[field].trim() === ''
    );

    if (missingRequiredFields.length > 0) {
      hasErrors = true;
      message =
        'Campi obbligatori assenti: ' +
        missingRequiredFields.map((field) => fieldLabels[field]).join(', ');

      // Aggiorna gli errori per i campi obbligatori mancanti
      missingRequiredFields.forEach((field) => {
        updatedErrors[field] = true;
      });
    }

    // Controllo degli errori di altri campi che non sono tra i mancanti
    const fieldsWithErrors = Object.keys(updatedErrors).filter(
      (field) => updatedErrors[field] && !missingRequiredFields.includes(field)
    ); // Non verificare i campi obbligatori mancanti

    if (fieldsWithErrors.length > 0) {
      hasErrors = true;
      const errorFields = fieldsWithErrors
        .map((field) => fieldLabels[field])
        .join(', ');
      message +=
        (message ? '\n' : '') +
        `Errore di compilazione dei seguenti campi: ${errorFields}`;
    }

    // Aggiorna lo stato degli errors
    setErrors(updatedErrors);

    return { hasErrors, message };
  };
  React.useImperativeHandle(ref, () => ({
    onSubmit,
    getErrors,
  }));

  // Validator
  const validatePartitaIVA = (piva) => /^[0-9]{11}$/.test(piva);
  const validateAnagrafica = (anagrafica) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return regex.test(anagrafica);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validationRules = {
    nome: validateAnagrafica,
    cognome: validateAnagrafica,
    pecEmail: validateEmail,
    partitaIVA: validatePartitaIVA,
    rappresentanteLegale: validateAnagrafica,
    rappresentanteLegalePecEmail: validateEmail,
    indirizzoResidenza: () => {
      return true;
    },
  };
  const handleInputChange = (event, campoModel) => {
    const valore = event.target.value.toUpperCase();
    const isValid = valore ? validationRules[campoModel]?.(valore) : true;

    setParteAttuale({ ...parteAttuale, [campoModel]: valore });
    isValid
      ? setErrors({ ...errors, [campoModel]: false })
      : setErrors({ ...errors, [campoModel]: true });
  };

  return (
    <div
      style={{
        position: 'relative',
        marginTop: '1rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: '2.8rem',
      }}
    >
      {/* Codice fiscale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        {/* Titolo */}
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Codice fiscale
          </Typography>
        </Grid>

        {/* Campo Codice Fiscale */}
        <Grid
          xs={12}
          sx={{ display: 'flex', alignItems: 'center', columnGap: '7rem' }}
        >
          <CssTextField
            error={errors.codiceFiscale}
            value={parteAttuale.codiceFiscale || ''}
            helperText={helperTextCf}
            size="small"
            id="pf-cf"
            label="Codice fiscale"
            onChange={handleCodiceFiscaleChange}
            sx={textFieldSx(theme)}
          />

          <div style={{ width: '42rem', margin: '14px 20px 10px 0px' }}>
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
              Inserendo il codice fiscale, i campi relativi ai dati anagrafici
              (esclusi nome e cognome) si compileranno automaticamente.
            </Alert>
          </div>
        </Grid>
      </Grid>

      {/* Dati anagrafici */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Dati anagrafici
          </Typography>
        </Grid>

        {/* Cognome */}
        <CssTextField
          required
          size="small"
          id="pf-cognome"
          value={parteAttuale.cognome || ''}
          error={errors.cognome}
          helperText={
            errors.cognome
              ? parteAttuale.cognome
                ? 'Cognome non valido'
                : 'Campo obbligatorio'
              : ''
          }
          label="Cognome"
          onChange={(event) => handleInputChange(event, 'cognome')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Nome */}
        <CssTextField
          required
          size="small"
          id="pf-nome"
          error={errors.nome}
          value={parteAttuale.nome || ''}
          helperText={
            errors.nome
              ? parteAttuale.nome
                ? 'Nome non valido'
                : 'Campo obbligatorio'
              : ''
          }
          label="Nome"
          onChange={(event) => handleInputChange(event, 'nome')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Data di nascita */}
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="it"
          localeText={
            itIT.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <DatePicker
            disabled={anagraficiDisabilitati}
            label="Data di nascita"
            value={
              parteAttuale.dataNascita ? dayjs(parteAttuale.dataNascita) : null
            }
            onChange={(date) => {
              const formattedDate = date ? date.format('YYYY-MM-DD') : null;
              setParteAttuale({ ...parteAttuale, dataNascita: formattedDate });
            }}
            slotProps={{
              textField: {
                size: 'small',
                id: 'pf-data-nascita',
                sx: {
                  ...textFieldSx(theme),
                  minWidth: '246px',
                  maxWidth: '250px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: anagraficiDisabilitati
                      ? '#efefef73 !important'
                      : 'inherit', // Colore di sfondo per stato disabilitato
                    '& fieldset': {
                      borderWidth: '1px',
                      borderColor: anagraficiDisabilitati
                        ? '#eaeaea !important'
                        : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset:not(.Mui-disabled)': {
                      borderColor: theme.palette.logo.secondary, // Colore del bordo su hover solo se non disabilitato
                    },
                    '&.Mui-focused fieldset:not(.Mui-disabled)': {
                      borderColor: theme.palette.logo.secondary, // Colore del bordo quando in focus solo se non disabilitato
                      borderWidth: '1px',
                    },
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.38)', // Colore del testo su stato disabilitato
                  },
                  '& .MuiInputLabel-outlined': {
                    color: labelColor, // Colore di default della label
                    transform: 'translate(14px, 8px) scale(1)', // Posizionamento centrato di default
                  },
                  '&:hover .MuiInputLabel-root:not(.Mui-disabled)': {
                    color: theme.palette.logo.secondary, // Cambia il colore della label su hover solo se non disabilitato
                  },
                  '& .MuiInputLabel-outlined.Mui-focused:not(.Mui-disabled)': {
                    color: theme.palette.logo.secondary, // Cambia il colore della label quando è in focus solo se non disabilitato
                  },
                  '& .MuiInputLabel-outlined.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.38)', // Colore della label quando è disabilitata
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -8px) scale(0.75)', // Posizionamento della label ridotta
                  },
                  '& .MuiSvgIcon-root': {
                    color: labelColor, // Colore di default dell'icona del calendario
                    transition: 'color 0.3s ease', // Transizione per il cambiamento di colore
                  },
                  '&:hover .MuiSvgIcon-root:not(.Mui-disabled), &.Mui-focused .MuiSvgIcon-root:not(.Mui-disabled)':
                    {
                      color: theme.palette.logo.secondary, // Cambia il colore dell'icona su hover e focus solo se non disabilitato
                    },
                  // Aggiungi questa regola per assicurarti che lo stato disabilitato abbia priorità
                  '& .Mui-disabled .MuiSvgIcon-root': {
                    color: 'rgba(0, 0, 0, 0.38) !important', // Colore dell'icona quando disabilitata, forza il colore
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
          sx={formControlStyles(theme, labelColor)} // Usa la funzione per applicare lo stile
        >
          <InputLabel id="pf-sesso-label" sx={{ color: labelColor }}>
            Sesso
          </InputLabel>

          <CssSelect
            labelId="sesso-input-label"
            id="pf-sesso"
            value={parteAttuale.sesso || ''}
            onChange={(event) =>
              setParteAttuale({ ...parteAttuale, sesso: event.target.value })
            }
            disabled={anagraficiDisabilitati}
            label="Sesso"
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.dropdown.primary, // Sfondo delle opzioni
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
          id="pf-provincia-nascita"
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
          label="Provincia di nascita"
          disabled={anagraficiDisabilitati}
          onChange={(provincia) => {
            comuneNascitaRef.current.setProvincia(
              provincia ? Object.assign(new Provincia(), provincia) : null
            );
            let comuneNascita = new Comune();
            comuneNascita.provincia = provincia;
            setParteAttuale({
              ...parteAttuale,
              luogoDiNascita: comuneNascita,
            });
          }}
        />

        {/* Comune di nascita */}
        <ComuneSelect
          ref={comuneNascitaRef}
          provincia={parteAttuale.luogoNascita?.provincia}
          id="pf-comune-nascita"
          label="Comune di nascita"
          disabled={anagraficiDisabilitati}
          onChange={(comune) => {
            let comuneNascita = comune ? comune : new Comune();
            comuneNascita.provincia = parteAttuale.luogoDiNascita.provincia;
            setParteAttuale({ ...parteAttuale, luogoDiNascita: comuneNascita });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
      </Grid>

      {/* Dati demografici */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Dati demografici
          </Typography>
        </Grid>

        {/* Provincia  */}
        <ProvinciaSelect
          ref={provinciaResidenzaRef}
          label="Provincia di residenza"
          id="pf-provincia-residenza"
          onChange={(provincia) => {
            comuneResidenzaRef.current.setProvincia(
              Object.assign(new Provincia(), provincia)
            );
            let residenza = new Comune();
            residenza.provincia = provincia;
            setParteAttuale({
              ...parteAttuale,
              residenza: residenza,
            });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Comune */}
        <ComuneSelect
          ref={comuneResidenzaRef}
          provincia={parteAttuale.provinciaResidenza}
          disabled={parteAttuale.provinciaResidenza}
          id="pf-comune-residenza"
          label="Comune di residenza"
          onChange={(comune) => {
            let comuneResidenza = comune ? comune : new Comune();
            comuneResidenza.provincia = parteAttuale.residenza.provincia;
            setCapResidenza(comune?.cap || '');
            setParteAttuale({
              ...parteAttuale,
              residenza: comuneResidenza,
            });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Indirizzo di residenza */}
        <CssTextField
          size="small"
          value={parteAttuale.indirizzoResidenza || ''}
          id="pf-indirizzo-residenza"
          label="Indirizzo"
          onChange={(event) => handleInputChange(event, 'indirizzoResidenza')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* CAP */}
        <CssTextField
          size="small"
          id="pf-cap-residenza"
          label="CAP"
          disabled={true}
          value={parteAttuale.residenza?.cap || ''}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
      </Grid>

      {/* Recapiti */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Recapiti
          </Typography>
        </Grid>

        {/* PEC / Email */}
        <CssTextField
          size="small"
          id="pf-pec-email"
          label="PEC / Email"
          value={parteAttuale.pecEmail || ''}
          error={errors.pecEmail}
          helperText={errors.pecEmail ? 'Indirizzo non valido' : ''}
          onChange={(event) => handleInputChange(event, 'pecEmail')}
          sx={{
            ...textFieldSx(theme),
            minWidth: '350px',
            maxWidth: '350px',
          }}
        />
      </Grid>

      {/* Ditta individuale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Ditta individuale / Professionista autonomo
          </Typography>
        </Grid>

        {/* Partita IVA */}
        <CssTextField
          size="small"
          id="pf-piva"
          label="Partita IVA"
          value={parteAttuale.partitaIVA || ''}
          error={errors.partitaIVA}
          helperText={errors.partitaIVA ? 'Formato invalido' : ''}
          onChange={(event) => handleInputChange(event, 'partitaIVA')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />
      </Grid>

      {/* Assistenza legale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Rappresentante legale
          </Typography>
        </Grid>

        {/* Avvocato */}
        <CssTextField
          required
          size="small"
          id="pf-avvocato"
          label="Avvocato"
          value={parteAttuale.rappresentanteLegale || ''}
          error={errors.rappresentanteLegale}
          helperText={
            errors.rappresentanteLegale
              ? parteAttuale.rappresentanteLegale
                ? 'Anagrafica invalida'
                : 'Campo obbligatorio'
              : ''
          }
          onChange={(event) => handleInputChange(event, 'rappresentanteLegale')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Email/PEC */}
        <CssTextField
          size="small"
          id="pf-pec-email-avvocato"
          label="PEC / Email"
          value={parteAttuale.rappresentanteLegalePecEmail || ''}
          error={errors.rappresentanteLegalePecEmail}
          helperText={
            errors.rappresentanteLegalePecEmail ? 'Indirizzo invalido' : ''
          }
          onChange={(event) =>
            handleInputChange(event, 'rappresentanteLegalePecEmail')
          }
          sx={{
            ...textFieldSx(theme),
            minWidth: '350px',
            maxWidth: '350px',
          }}
        />
      </Grid>

      {/* Spese di mediazione */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Spese di mediazione
          </Typography>
        </Grid>

        {/* Spese */}
        <Grid xs={12}>
          <ImportoInput
            value={parteAttuale.speseAvvio}
            id="pf-spese-avvio"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, speseAvvio: importo })
            }
            label={'Spese di avvio'}
          />
          <ImportoInput
            value={parteAttuale.spesePostali}
            id="pf-spese-postali"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, spesePostali: importo })
            }
            label={'Spese postali'}
          />
          <ImportoInput
            value={parteAttuale.pagamentoIndennita}
            id="pf-pagamento-indennita"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, pagamentoIndennita: importo })
            }
            label={'Pagamento indennità'}
          />
          <ImportoInput
            value={parteAttuale.importoMancatoAccordo}
            id="pf-mancato-accordo"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoMancatoAccordo: importo,
              })
            }
            label={'Mancato accordo'}
          />
          <ImportoInput
            value={parteAttuale.importoPositivoPrimoIncontro}
            id="pf-positivo-primo-incontro"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoPositivoPrimoIncontro: importo,
              })
            }
            label={'Positivo primo incontro'}
          />
          <ImportoInput
            value={parteAttuale.importoPositivoOltrePrimoIncontro}
            id="pf-positivo-oltre-primo-incontro"
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoPositivoOltrePrimoIncontro: importo,
              })
            }
            label={'Positivo oltre primo incontro'}
          />
        </Grid>

        {/* Totale */}
        <ImportoReadOnly
          value={totaleSpese}
          label="Totale Spese"
          backgroundColor="#d7ebff0f"
          textColor="#467bae"
          labelColor="#467bae"
          borderColor="#467bae38"
          euroIconColor="#467bae"
          helperTextColor={labelColor}
          helperText="Calcolato automaticamente"
          sx={{ margin: '4rem 20px 10px 0px' }}
        />
      </Grid>

      {/* Note */}
      <Grid
        xs={12}
        sx={{ width: '100%', minHeight: `${gridRowHeight + 80}px` }}
      >
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Informazioni aggiuntive
          </Typography>
        </Grid>
        <CssTextField
          id="pf-note"
          label="Note"
          multiline
          rows={3}
          value={parteAttuale.note || ''}
          sx={{
            ...textFieldSx(theme),
            minWidth: '100%',
          }}
          onChange={(event) => {
            event.target.value =
              event.target.value.trim() == ''
                ? ''
                : event.target.value.toLocaleUpperCase();
            parteAttuale.note = event.target.value.toLocaleUpperCase();
            setParteAttuale({ ...parteAttuale });
          }}
        />
      </Grid>
    </div>
  );
}

export default React.forwardRef(FormPersonaFisica);
