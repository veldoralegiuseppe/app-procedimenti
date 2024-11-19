import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import { CssTextField } from '@theme/MainTheme';

const ImportoInput = ({
  onChange,
  onBlur,
  label = '',
  sx,
  id,
  value = 0,
  error = false,
  helperText = '',
  disabled = false,
}) => {
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

    //console.log('formattedIntegerPart:', integerPart);

    return `${integerPart}`;
  };

  const formatValue = (event) => {
    let inputValue = event.target.value;
    let [integerPart, decimalPart] = inputValue.split(',');

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
    if (startCursorPosition - 1 == commaPosition) {
      return commaPosition; // Mantieni la posizione del cursore nella parte decimale
    } else {
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
    //console.log('onChange', event.target.value)
    let inputValue = event.target.value;
    let startCursorPosition = event.target.selectionStart;
    const commaPosition = inputValue.indexOf(',');

    // Gestisce i punti di separazione per la parte intera
    let parteIntera = inputValue.split(',')[0].replaceAll('.', '');
    let numeroDiPunti = inputValue.match(/\./g)?.length || 0;
    let numeroDiPuntiPrevisti =
      parteIntera.length > 3 ? parseInt(parteIntera.length / 3) : 0;

    // Controllo se l'input è nel formato corretto
    if (
      !/^[0-9]+,[0-9]+$/.test(inputValue.replaceAll('.', '')) ||
      numeroDiPunti > numeroDiPuntiPrevisti
    ) {
      // caso ,xx
      if (/^,\d{2}$/.test(inputValue)) {
        inputValue =
          '0' + inputValue.slice(inputValue.indexOf(',')).padEnd(2, '0');
        event.target.value = inputValue;
        setImporto(inputValue);
        if (onChange) onChange(0);
        let nextCursor = 0;
        event.target.selectionStart = nextCursor;
        event.target.selectionEnd = nextCursor;
        event.target.setSelectionRange(nextCursor, nextCursor);
        return;
      }

      // Immissione dati sporchi
      if (inputValue.length > importo.length) {
        let nextCursor = /,,/.test(inputValue)
          ? commaPosition + 1
          : Math.max(startCursorPosition - 1, 0);

        inputValue = importo;
        notifyDouble(importo);
        event.target.value = inputValue;
        event.target.selectionStart = nextCursor;
        event.target.selectionEnd = nextCursor;
        event.target.setSelectionRange(nextCursor, nextCursor);
        return;
      }
    }

    // Gestione degli zero a sinistra
    if (/^0+(?=\d+[,\.]\d+)/.test(inputValue)) {
      //console.log('zeri a sx')
      inputValue = inputValue.replace(/^0+(?![,0])/, '');
      event.target.value = inputValue;
      startCursorPosition = Math.max(startCursorPosition - 1, 0);
      event.target.selectionStart = startCursorPosition;
      event.target.selectionEnd = startCursorPosition;
      event.target.setSelectionRange(startCursorPosition, startCursorPosition);
    }

    // Controlla se l'input è vuoto e imposta "0,00"
    if (!inputValue) {
      setImporto('0,00');
      if (onChange) {
        //console.log('onChange(0)')
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
      //console.log('posiziono il cursore a:', cursorPosition);
      event.target.selectionStart = cursorPosition;
      event.target.selectionEnd = cursorPosition;
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    });

    // Passa il valore numerico grezzo al componente genitore se presente
    notifyDouble(adjustedValue);

    // Funzione di utilità per notificare il valore al componente genitore
    function notifyDouble(formattedValue) {
      if (onChange) {
        // Rimuovi i punti delle migliaia prima della conversione
        const numericValue = parseFloat(
          formattedValue.replace(/\./g, '').replace(',', '.')
        ); // Rimuovi i punti e sostituisci la virgola con il punto
        if (!isNaN(numericValue)) {
          onChange(numericValue);
        }
      }
    }
  };

  return (
    <CssTextField
      value={importo}
      error={error}
      helperText={helperText}
      onChange={handleValueChange}
      id={id}
      onBlur={() => {
        setImporto(importo);
        if (onBlur) onBlur();
      }}
      label={label}
      disabled={disabled}
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
