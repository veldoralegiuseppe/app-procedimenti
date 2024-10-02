import * as React from 'react';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

import { CssTextField } from '@theme/MainTheme';

export default function ImportoInput(props) {
  const importoFieldRef = React.useRef(null);
  const theme = useTheme();
  const labelColor = 'rgb(105 105 105 / 60%)';
  const [cursorShift, setCursorShift] = React.useState(0);
  const [importoAttuale, setImportoAttuale] = React.useState(
    props.importo ? props.importo : '0,00'
  );

  // Gestione reset del campo
  React.useEffect(() => {
    if (props.reset) {
      setImportoAttuale('0,00');
      if (importoFieldRef.current) {
        importoFieldRef.current.value = '0,00';
      }
    }
  }, [props.reset]);

  const handleInputChange = (event) => {
    const input = event.target;
    let importoCorrente = input.value.replaceAll('.', '');
    const activateLog = false;
    var exit = false;

    var isOnlyCent = /^,{1}\d+/g;
    var inputValido = /(?<![\D*\w*])(\d+,{1}\d{2})(?![\D*\d*,*])/g;

    importoCorrente.split(',').forEach((s) => {
      //console.log(`Token: ${s}, isNumber: ${!/[^\d+]/g.test(s)}`)
      if (s !== '' && /[^\d+]/g.test(s)) {
        let currentPosition = input.selectionStart;
        input.value = importoAttuale;
        importoCorrente = importoAttuale.replaceAll('.', '');
        input.setSelectionRange(currentPosition - 1, currentPosition - 1);
        exit = true;
      }
    });

    if (exit) return;

    if (isOnlyCent.test(importoCorrente) || importoCorrente == '') {
      input.value = '';
    } else if (!importoCorrente.includes(',')) {
      // Inserimento di numeri interi
      if (importoCorrente.length < 3) {
        if (activateLog) console.log('Gestisco numeri interi');
        input.value = importoCorrente += ',00';
        input.setSelectionRange(1, 1);
      } else {
        // Canc della virgola
        if (activateLog) console.log('Gestisco la virgola cancellata');
        let currentPosition = input.selectionStart;
        input.value =
          importoCorrente.slice(0, importoCorrente.length - 2) +
          ',' +
          importoCorrente.slice(importoCorrente.length - 2);
        input.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (
      importoCorrente.charAt(0) == '0' &&
      /\d/g.test(importoCorrente.charAt(1))
    ) {
      // Gestisco i numeri del tipo 023,00
      if (activateLog) console.log('Gestisco i valori all inizio');
      let currentPosition = input.selectionStart;
      input.value = importoCorrente.slice(1);
      input.setSelectionRange(currentPosition - 1, currentPosition - 1);
    } else if (input.selectionStart == 1 && importoAttuale == '0,00') {
      if (activateLog) console.log('Gestisco primo input');
      let importo = importoCorrente.charAt(0) + importoCorrente.slice(2);
      input.value = importo;
      let currentPosition = input.selectionStart;
      if (activateLog)
        console.log(
          `importoCorrente: ${importoCorrente}, importo: ${importo}, currentPosition: ${currentPosition}`
        );
      input.setSelectionRange(currentPosition - 3, currentPosition - 3);
    } else if (
      input.selectionStart == input.value.length - 3 &&
      importoCorrente.includes(',,')
    ) {
      // Gestisco l'aggiunta della virgola
      if (activateLog) console.log('Gestisco aggiunta virgola');
      if (
        importoCorrente.includes(',,') &&
        !inputValido.test(importoCorrente.replace(',,', ','))
      )
        return;
      else {
        let currentPosition = input.selectionStart;
        input.value = importoCorrente.replace(',,', ',');
        input.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (input.selectionStart == input.value.length - 2) {
      // Aggiunta di un decimale
      if (activateLog) console.log('Aggiungo un decimale');
      let importo =
        importoCorrente.slice(0, importoCorrente.length - 2) +
        importoCorrente.slice(importoCorrente.length - 1);
      if (!inputValido.test(importo)) {
        if (activateLog) console.log('Input invalido nell aggiungere decimali');
        let currentPosition = input.selectionStart;
        input.value = importoAttuale;
        input.setSelectionRange(currentPosition - 1, currentPosition - 1);
        return;
      }
      let currentPosition = input.selectionStart;
      let formattedImporto = Number(
        importo.replaceAll(',', '.')
      ).toLocaleString('it-IT', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      input.value = formattedImporto;
      let numPunti = (formattedImporto.match(/\./g) || []).length;
      if (activateLog)
        console.log(
          `Aggiungo decimo - importo:${importo}, formattedImporto: ${formattedImporto}, numPunti: ${numPunti}, currentPosition: ${currentPosition}, cursorShift:${cursorShift}`
        );
      if (numPunti == cursorShift)
        input.setSelectionRange(currentPosition, currentPosition);
      else input.setSelectionRange(currentPosition + 1, currentPosition + 1);
    } else if (input.selectionStart == input.value.length - 1) {
      if (importoCorrente.charAt(importoCorrente.length - 2) == ',') {
        // Canc dei decimi
        if (activateLog) console.log('Gestisco il canc dei decimi');
        let importo =
          importoCorrente.slice(0, importoCorrente.length - 1) +
          '0' +
          importoCorrente.slice(importoCorrente.length - 1);
        if (!inputValido.test(importo)) {
          if (activateLog) console.log('Input invalido nel canc decimi');
          let currentPosition = input.selectionStart;
          input.value = importoAttuale;
          input.setSelectionRange(currentPosition - 1, currentPosition - 1);
          return;
        }
        let currentPosition = input.selectionStart;
        input.value =
          importoCorrente.slice(0, importoCorrente.length - 1) +
          '0' +
          importoCorrente.slice(importoCorrente.length - 1);
        input.setSelectionRange(currentPosition, currentPosition);
      } else {
        // Aggiunta di un centesimo
        if (activateLog) console.log('Aggiungo un centesimo');
        let importo = importoCorrente.slice(0, importoCorrente.length - 1);
        if (!inputValido.test(importo)) {
          let currentPosition = input.selectionStart;
          input.value = importoAttuale;
          input.setSelectionRange(currentPosition, currentPosition);
          return;
        }
        let currentPosition = input.selectionStart;
        let formattedImporto = Number(
          importo.replaceAll(',', '.')
        ).toLocaleString('it-IT', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        input.value = formattedImporto;
        input.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (input.selectionStart === input.value.length) {
      // Canc dei centesimi
      if (importoCorrente.charAt(importoCorrente.length - 2) === ',') {
        if (activateLog) console.log('Gestisco il canc dei centesimi');
        let currentPosition = input.selectionStart;
        // Se si cancella il centesimo, aggiungi uno zero al suo posto
        input.value = importoCorrente.slice(0, importoCorrente.length) + '0';
        input.setSelectionRange(currentPosition, currentPosition);
      } else {
        let currentPosition = input.selectionStart;
        // Se si cancella la parte finale, riporta il valore corrente
        input.value = importoAttuale;
        input.setSelectionRange(currentPosition, currentPosition);
      }
    } else if (!inputValido.test(importoCorrente)) {
      let currentPosition = input.selectionStart;
      input.value = importoAttuale;
      input.setSelectionRange(currentPosition - 1, currentPosition - 1);
      //input.setSelectionRange(dimParteIntera, dimParteIntera)
    }

    // Gestire il caso di cancellazione totale: riportare a 0,00
    if (importoCorrente === '') {
      input.value = '0,00';
      setImportoAttuale('0,00');
      input.setSelectionRange(1, 1);
      return;
    }

    // Aggiungo i punti
    if (activateLog) console.log(`input.value:${input.value}`);
    let importoView = input.value ? input.value.replaceAll('.', '') : '0.00';
    let importoNumber = Number(importoView.replace(',', '.'));
    if (activateLog)
      console.log(
        `importoView:${importoView}\nimportoNumber: ${importoNumber}`
      );
    const formattedNumber = importoNumber.toLocaleString('it-IT', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    let currentPosition = input.selectionStart;
    importoCorrente = formattedNumber;
    input.value = formattedNumber;

    let numPunti = (formattedNumber.match(/\./g) || []).length;
    if (activateLog)
      console.log(`prevPosition: ${currentPosition}, numPunti: ${numPunti}`);

    if (numPunti == cursorShift)
      input.setSelectionRange(Number(currentPosition), Number(currentPosition));
    else {
      if (numPunti > cursorShift)
        input.setSelectionRange(
          Number(currentPosition + 1),
          Number(currentPosition + 1)
        );
      else
        input.setSelectionRange(
          Number(currentPosition - 1),
          Number(currentPosition - 1)
        );
      setCursorShift(numPunti);
    }

    // Aggiorna lo stato dell'importo
    setImportoAttuale(input.value);

    // Passa il numero puro al chiamante
    if (props.onChange) {
      const pureNumber = Number(input.value.replace(',', '.'));
      props.onChange(pureNumber);
    }
  };

  return (
    <CssTextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EuroSymbolIcon sx={{ color: '#69696961' }} />
          </InputAdornment>
        ),
      }}
      value={importoAttuale}
      onChange={handleInputChange}
      sx={{
        ...props.sx,
        '& .MuiFormLabel-root:not(.Mui-error, .Mui-selected, .Mui-focused)': {
          color: labelColor,
        },
        '& .MuiOutlinedInput-input': {
          fontWeight: '500',
          color: theme.palette.text.primary,
        },
        '&:hover .MuiSvgIcon-root': {
          color: theme.palette.logo.secondary, // Colore dell'icona su hover
        },
        '&.Mui-focused .MuiSvgIcon-root': {
          color: theme.palette.logo.secondary, // Colore dell'icona in focus
        },
        // Colore della label su hover
        '&:hover .MuiInputLabel-root': {
          color: theme.palette.logo.secondary,
        },
        '&.Mui-focused .MuiInputLabel-root': {
          color: theme.palette.logo.secondary, // Colore della label in focus
        },
      }}
      label={props.label}
      variant="outlined"
      size="small"
      required={props.required}
      ref={importoFieldRef}
    />
  );
}
