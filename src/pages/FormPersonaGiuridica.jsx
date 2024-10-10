import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import ProvinciaSelect from '@components/ProvinciaSelect';
import ComuneSelect from '@components/ComuneSelect';
import ImportoInput from '@components/ImportoInput';
import { PersonaGiuridica } from '@model/personaGiuridica';
import ImportoReadOnly from '@components/ImportoReadOnly';
import { CssTextField } from '@theme/MainTheme';
import { Provincia } from '@model/provincia';
import { Comune } from '@model/comune';

function FormPersonaGiuridica(props, ref) {
  // Costanti di layout
  const labelColor = 'rgb(105 105 105 / 60%)';
  const labelDisableColor = 'rgb(148 148 148 / 60%)';
  const inputHeight = 35; //Altezza effettiva
  const gridRowHeight = inputHeight + 34 + 3; // Input + Margine + Helper text
  const theme = useTheme();
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

  // State
  const [capSedeLegale, setCapSedeLegale] = React.useState('');
  const [parteAttuale, setParteAttuale] = React.useState(
    new PersonaGiuridica()
  );
  const [totaleSpese, setTotaleSpese] = React.useState(0);
  const [errors, setErrors] = React.useState({
    partitaIVA: false,
    denominazione: false,
    pecEmail: false,
    rappresentanteLegale: false,
    rappresentanteLegalePecEmail: false,
  });

  // Ref
  const provinciaSedeLegaleRef = React.useRef();
  const comuneSedeLegaleRef = React.useRef();

  const resetForm = () => {
    setParteAttuale(new PersonaGiuridica()); // Reset dello stato a un nuovo oggetto PersonaFisica
    setCapSedeLegale(''); // Reset CAP residenza
    setErrors({
      partitaIVA: false,
      denominazione: false,
      pecEmail: false,
      rappresentanteLegale: false,
      rappresentanteLegalePecEmail: false,
    }); // Reset degli errori

    // Reset delle referenze ai selettori di Comune e Provincia
    if (provinciaSedeLegaleRef.current) {
      provinciaSedeLegaleRef.current.setProvincia(null);
    }
    if (comuneSedeLegaleRef.current) {
      comuneSedeLegaleRef.current.setComune(null);
    }
  };

  // Metodi di React.useImperativeHandle
  const onSubmit = () => {
    const parteCreata = Object.assign(new PersonaGiuridica(), parteAttuale);
    //console.log(parteCreata)
    resetForm();
    return parteCreata;
  };
  const getErrors = () => {
    const requiredFields = ['denominazione', 'rappresentanteLegale'];
    const fieldLabels = {
      partitaIVA: 'Partita IVA',
      denominazione: 'Denominazione',
      pecEmail: 'PEC / Email',
      rappresentanteLegale: 'Avvocato',
      rappresentanteLegalePecEmail: 'PEC / Email rappresentante legale',
      indirizzoSedeLegale: 'Indirizzo sede legale',
    };

    let updatedErrors = { ...errors };
    let hasErrors = false;
    let message = '';

    // Controllo dei campi obbligatori mancanti
    const missingRequiredFields = requiredFields.filter(
      (field) => !parteAttuale[field] || parteAttuale[field].trim() === ''
    );

    if (missingRequiredFields.length > 0) {
      console.log('campi assenti');
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
      console.log('errore compilazione');
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

  // Effetto che calcola il totale quando cambiano gli importi
  const parseImporto = (importo) => {
    return Number(importo);
  };
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

  // Funzioni di validazione
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePartitaIVA = (piva) => /^[0-9]{11}$/.test(piva);
  const validateAnagrafica = (anagrafica) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return regex.test(anagrafica);
  };
  const validateIndirizzo = (indirizzo) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+(?:\s+\d+)?$/i;
    return regex.test(indirizzo);
  };
  const validationRules = {
    denominazione: validateAnagrafica,
    pecEmail: validateEmail,
    partitaIVA: validatePartitaIVA,
    rappresentanteLegale: validateAnagrafica,
    rappresentanteLegalePecEmail: validateEmail,
    indirizzoSedeLegale: validateIndirizzo,
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
        justifyContent: 'center',
        rowGap: '2.8rem',
        padding: '0',
      }}
    >
      {/* Dati societari */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Dati societari
          </Typography>
        </Grid>

        <CssTextField
          size="small"
          label="Partita IVA"
          value={parteAttuale.partitaIVA || ''}
          error={errors.partitaIVA}
          helperText={errors.partitaIVA ? 'Formato invalido' : ''}
          onChange={(event) => handleInputChange(event, 'partitaIVA')}
          sx={textFieldSx(theme)}
        />

        <CssTextField
          required
          size="small"
          label="Denominazione"
          value={parteAttuale.denominazione || ''}
          error={errors.denominazione}
          helperText={
            errors.denominazione
              ? parteAttuale.denominazione
                ? 'Denominazione invalida'
                : 'Campo obbligatorio'
              : ''
          }
          onChange={(event) => handleInputChange(event, 'denominazione')}
          sx={{ ...textFieldSx(theme), minWidth: '400px', maxWidth: '420px' }}
        />
      </Grid>

      {/* Sede legale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid
          xs={12}
          sx={{ width: '100%', borderBottom: '1px solid #467bae61' }}
        >
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Sede Legale
          </Typography>
        </Grid>

        {/* Provincia */}
        <ProvinciaSelect
          ref={provinciaSedeLegaleRef}
          label="Provincia"
          onChange={(provincia) => {
            let comuneSedeLegale = new Comune();
            comuneSedeLegale.provincia = provincia ? Object.assign(new Provincia(), provincia) : null;
            comuneSedeLegaleRef.current.setProvincia(comuneSedeLegale.provincia);
            setParteAttuale({...parteAttuale, sedeLegale: comuneSedeLegale })
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Comune */}
        <ComuneSelect
          ref={comuneSedeLegaleRef}
          provincia={parteAttuale.provincia}
          label="Comune"
          onChange={(comune) => {
            let comuneSedeLegale = comune ? comune : new Comune();
            comuneSedeLegale.provincia = parteAttuale.sedeLegale.provincia;
            setCapSedeLegale(
              comuneSedeLegale && comuneSedeLegale.cap
                ? comuneSedeLegale.cap
                : ''
            );
            setParteAttuale({ ...parteAttuale, sedeLegale: comuneSedeLegale });
          }}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* Indirizzo */}
        <CssTextField
          size="small"
          id="outlined-required-indirizzo"
          label="Indirizzo"
          value={parteAttuale.indirizzoSedeLegale || ''}
          error={errors.indirizzoSedeLegale}
          helperText={errors.indirizzoSedeLegale ? 'Indirizzo non valido' : ''}
          onChange={(event) => handleInputChange(event, 'indirizzoSedeLegale')}
          sx={{ ...textFieldSx(theme), minWidth: '246px', maxWidth: '250px' }}
        />

        {/* CAP */}
        <CssTextField
          size="small"
          label="CAP"
          disabled={true}
          value={capSedeLegale}
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

        <CssTextField
          size="small"
          label="PEC / Email"
          error={errors.pecEmail}
          value={parteAttuale.pecEmail || ''}
          helperText={errors.pecEmail ? 'Indirizzo non valido' : ''}
          onChange={(event) => handleInputChange(event, 'pecEmail')}
          sx={{ ...textFieldSx(theme), minWidth: '350px', maxWidth: '350px' }}
        />
      </Grid>

      {/* Assistenza legale */}
      <Grid xs={12} sx={{ width: '100%', minHeight: `${gridRowHeight}px` }}>
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Rappresentante legale
          </Typography>
        </Grid>

        {/* Avvocato */}
        <CssTextField
          required
          size="small"
          id="outlined-required-avvocato"
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

        {/* PEC / Email */}
        <CssTextField
          size="small"
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
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Spese di mediazione
          </Typography>
        </Grid>

        {/* Spese */}
        <Grid xs={12}>
          <ImportoInput
            value={parteAttuale.speseAvvio}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, speseAvvio: importo })
            }
            label={'Spese di avvio'}
            required={true}
          />
          <ImportoInput
            value={parteAttuale.spesePostali}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, spesePostali: importo })
            }
            label={'Spese postali'}
            required={true}
          />
          <ImportoInput
            value={parteAttuale.pagamentoIndennita}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({ ...parteAttuale, pagamentoIndennita: importo })
            }
            label={'Pagamento indennità'}
            required={true}
          />
          <ImportoInput
            value={parteAttuale.importoMancatoAccordo}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoMancatoAccordo: importo,
              })
            }
            label={'Mancato accordo'}
            required={true}
          />
          <ImportoInput
            value={parteAttuale.importoPositivoPrimoIncontro}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoPositivoPrimoIncontro: importo,
              })
            }
            label={'Positivo primo incontro'}
            required={true}
          />
          <ImportoInput
            value={parteAttuale.importoPositivoOltrePrimoIncontro}
            sx={textFieldSx(theme)}
            onChange={(importo) =>
              setParteAttuale({
                ...parteAttuale,
                importoPositivoOltrePrimoIncontro: importo,
              })
            }
            label={'Positivo oltre primo incontro'}
            required={true}
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
          helperTextColor="rgb(105 105 105 / 60%)"
          sx={{ margin: '4rem 20px 10px 0px' }}
        />
      </Grid>

      {/* Note */}
      <Grid
        xs={12}
        sx={{ width: '100%', minHeight: `${gridRowHeight + 80}px` }}
      >
        <Grid xs={12} sx={{ borderBottom: '1px solid #467bae61' }}>
          <Typography sx={{ fontSize: '1rem', color: '#467bae' }}>
            Informazioni aggiuntive
          </Typography>
        </Grid>
        <CssTextField
          id="outlined-required-note"
          label="Note"
          multiline
          value={parteAttuale.note || ''}
          rows={3}
          sx={{ ...textFieldSx(theme), minWidth: '100%' }}
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

export default React.forwardRef(FormPersonaGiuridica);
