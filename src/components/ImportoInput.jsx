import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { CssTextField } from '@theme/MainTheme';

const ImportoInput = ({ onChange, label, sx, value = 0 }) => {
  // State
  const [importo, setImporto] = useState('0,00');

  // Utility
  const formatValueFromNumber = (number) => {
    const parts = number.toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts[1];
    return `${integerPart},${decimalPart}`;
  };

  // Effect
  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      const formattedValue = formatValueFromNumber(value);
      setImporto(formattedValue);
    }
  }, [value]);

  // Handle
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
      inputValue.length < importo.length &&
      cursorPosition === commaPosition + 1
    ) {
      decimalPart = `0${decimalPart[0]}`;
    }

    // Gestisce il canc dei centesimi
    else if (
      inputValue.length < importo.length &&
      cursorPosition === commaPosition + 2
    ) {
      decimalPart = `${decimalPart[0]}0`;
    }

    return decimalPart;
  };

  const formatIntegerPart = (integerPart) => {
    if (!integerPart) return '0';

    // Gestione della primo input intero
    if (importo.split(',')[0] === '0') {
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
    console.log('inputValue format', inputValue)

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
    let inputValue = event.target.value;
    const commaPosition = inputValue.indexOf(',');
  
    // Conta i punti presenti nella stringa del valore precedente e attuale
    const oldPointsCount = (importo.match(/\./g) || []).length;
    const newPointsCount = (inputValue.match(/\./g) || []).length;
  
    // Calcola lo shift del cursore in base ai punti aggiunti o rimossi
    const pointShift = newPointsCount - oldPointsCount;
  
    // Se l'utente sta digitando nella parte intera rispetta la posizione del cursore
    if (startCursorPosition-1 == commaPosition) {
      return commaPosition // Mantieni la posizione del cursore nella parte decimale
    }else{
      //console.log('inserimento parte decimale')
    }
  
    // Se l'utente cancella qualcosa subito prima della virgola
    if (
      event.nativeEvent.inputType === 'deleteContentBackward' &&
      startCursorPosition === commaPosition + 1
    ) {
      return commaPosition;
    }
  
    // Se ci sono cambiamenti nel numero di caratteri e l'utente è nella parte intera
    if (inputValue.length <= importo.length || importo !== inputValue) {
      return Math.max(0, startCursorPosition + pointShift);
    } else {
      return Math.max(0, startCursorPosition - 1 + pointShift);
    }
  };
  
  const handleValueChange = (event) => {
    let inputValue = event.target.value;
    let startCursorPosition = event.target.selectionStart;
    const commaPosition = inputValue.indexOf(',');

     // Controllo se l'input è nel formato (x...x,xx)
     if (!/^[0-9]+,[0-9]+$/.test(inputValue)) {
      event.target.value = importo
      let nextCursor = /,,/.test(inputValue) ? commaPosition+1 : Math.max(startCursorPosition-1,0)
      console.log('nextCursor',nextCursor)
      event.target.selectionStart = nextCursor
      event.target.selectionEnd = nextCursor
      event.target.setSelectionRange(nextCursor, nextCursor);
      return;
    }


    // Controlla se l'input è vuoto e imposta "0,00"
    if (!inputValue) {
      setImporto('0,00');
      if (onChange) {
        onChange(0);
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
    setImporto(adjustedValue);
    inputValue = adjustedValue;

    requestAnimationFrame(() => {
      const adjustedCommaPosition = adjustedValue.indexOf(',');
      let cursorPosition = handleCursorPosition(
        event,
        startCursorPosition,
        adjustedCommaPosition
      );
      console.log('posiziono il cursore a:', cursorPosition)
      event.target.selectionStart = cursorPosition
      event.target.selectionEnd = cursorPosition
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });

    // Passa il valore numerico grezzo al componente genitore se presente
    if (onChange) {
      // Rimuovi i punti delle migliaia prima della conversione
      const numericValue = parseFloat(
        adjustedValue.replace(/\./g, '').replace(',', '.')
      ); // Rimuovi i punti e sostituisci la virgola con il punto
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
    }
  };

  return (
    <CssTextField
      value={importo}
      onChange={handleValueChange}
      onBlur={() => setImporto(importo)} // Mantieni il valore formattato
      label={label}
      variant="outlined"
      size="small"
      sx={{ ...sx }} // Usa il tuo stile personalizzato
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
