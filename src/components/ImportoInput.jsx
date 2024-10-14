import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { CssTextField } from '@theme/MainTheme';

const ImportoInput = (props) => {
  const [value, setValue] = useState('0,00');

  const formatDecimalPart = (decimalPart, event) => {
    let inputValue = event.target.value;
    let cursorPosition = event.target.selectionStart;
    const commaPosition = inputValue.indexOf(',');

    // Assicura che la parte decimale esista e che sia composta da almeno due cifre
    decimalPart = decimalPart ? decimalPart.padEnd(2, '0') : '00';

    // Gestione inserimento dei decimi
    if (cursorPosition === commaPosition + 2) {
      decimalPart = decimalPart[0] + decimalPart[2];
      decimalPart = decimalPart.slice(0, 2);
    }

    // Tronca le cifre in eccesso
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }

    // Gestisce il canc dei decimi
    if (
      inputValue.length < value.length &&
      cursorPosition === commaPosition + 1
    ) {
      decimalPart = `0${decimalPart[0]}`;
    }

    // Gestisce il canc dei centesimi
    else if (
      inputValue.length < value.length &&
      cursorPosition === commaPosition + 2
    ) {
      decimalPart = `${decimalPart[0]}0`;
    }

    return decimalPart;
  };

  const formatIntegerPart = (integerPart) => {
    if (!integerPart) return '0';

    // Gestione della primo input intero
    if (value.split(',')[0] === '0') {
      integerPart = String(integerPart).replace('0', '');
    }

    // Gestione della parte intera
    let formattedIntegerPart = String(integerPart).replace(/^0+/, ''); // Rimuove gli zeri iniziali

    integerPart =
      !isNaN(formattedIntegerPart) && formattedIntegerPart !== ''
        ? parseInt(formattedIntegerPart, 10).toLocaleString('it-IT')
        : '0';

    console.log('formattedIntegerPart:', integerPart);

    return `${integerPart}`;
  };

  const formatValue = (event) => {
    let inputValue = event.target.value;

    // Regex per escludere i formati errati (,x)
    const invalidFormatRegex = /^,?\d{1,2}$|^,\d{2}$|^,\d{1}$/;

    // Gestione degli '0' all'inizio di 0,00 e del formato ,XX
    if (invalidFormatRegex.test(inputValue) || /^0+(,00)?$/.test(inputValue)) {
      let commaIndex = inputValue.indexOf(',');
      if (commaIndex >= 0) {
        return '0' + inputValue.slice(inputValue.indexOf(',')).padEnd(2, '0');
      }
      return '0,00';
    }

    // Rimuove gli zeri multipli all'inizio, tranne il caso "0,XX"
    let adjustedValue = inputValue.replace(/^0+(?![,0])/, '');

    let [integerPart, decimalPart] = adjustedValue.split(',');
    return `${formatIntegerPart(
      integerPart.replaceAll('.', '')
    )},${formatDecimalPart(decimalPart, event)}`;
  };

  const handleCursorPosition = (event, startCursorPosition) => {
    // Regex per escludere i formati errati (,x)
    const invalidFormatRegex = /^,?\d{1,2}$|^,\d{2}$|^,\d{1}$/;

    let inputValue = event.target.value;
    const commaPosition = inputValue.indexOf(',');

    // Contare il numero di punti delle migliaia prima della formattazione
    const oldPointsCount = (value.match(/\./g) || []).length; // Punti nel vecchio valore
    const newPointsCount = (inputValue.match(/\./g) || []).length; // Punti nel nuovo valore

    // Calcola lo shift del cursore in base ai punti aggiunti o rimossi
    const pointShift = newPointsCount - oldPointsCount;

    // Sposta il cursore immediatamente a sinistra della virgola quando si cancella un decimale
    if (
      event.nativeEvent.inputType === 'deleteContentBackward' &&
      startCursorPosition === commaPosition + 1
    ) {
      return commaPosition;
    }

    // Se ci sono cambiamenti nel numero di caratteri, aggiusta la posizione del cursore
    if (inputValue.length <= value.length || value !== inputValue) {
      // Modifica il cursore tenendo conto dei punti
      return invalidFormatRegex.test(inputValue)
        ? 0
        : Math.max(0, startCursorPosition + pointShift);
    } else {
      // Se il numero è stato modificato e i punti sono cambiati, riduci la posizione del cursore
      return Math.max(0, startCursorPosition - 1 + pointShift);
    }
  };

  const handleValueChange = (event) => {
    let inputValue = event.target.value;
    let startCursorPosition = event.target.selectionStart;
    const commaPosition = inputValue.indexOf(',');

    // Controlla se l'input è vuoto e imposta "0,00"
    if (!inputValue) {
      setValue('0,00');
      if (props.onChange) {
        props.onChange(0);
      }
      return;
    }

    // Impedisce la cancellazione della virgola
    if (
      startCursorPosition === commaPosition + 1 &&
      event.nativeEvent.inputType === 'deleteContentBackward'
    ) {
      //console.log('impedisco canc')
      event.preventDefault();
    }

    // Formatta il valore
    const adjustedValue = formatValue(event);

    // Aggiorna lo stato e riposiziona il cursore
    setValue(adjustedValue);
    inputValue = adjustedValue;

    requestAnimationFrame(() => {
      const adjustedCommaPosition = adjustedValue.indexOf(',');
      let cursorPosition = handleCursorPosition(
        event,
        startCursorPosition,
        adjustedCommaPosition
      );
      //console.log('posiziono il cursore a:', cursorPosition)
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });

    // Passa il valore numerico grezzo al componente genitore se presente
    if (props.onChange) {
      const numericValue = parseFloat(adjustedValue.replace(',', '.')); // Converti in numero
      if (!isNaN(numericValue)) {
        props.onChange(numericValue);
      }
    }
  };

  return (
    <CssTextField
      value={value}
      onChange={handleValueChange}
      onBlur={() => setValue(value)} // Mantieni il valore formattato
      label={props.label}
      variant="outlined"
      size="small"
      sx={{ ...props.sx }} // Usa il tuo stile personalizzato
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EuroSymbolIcon sx={{ color: '#69696961' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ImportoInput;
