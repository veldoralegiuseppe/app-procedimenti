import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';

import { ThemeProvider } from '@mui/material/styles';
import { themeOne } from '@theme/MainTheme';
import ImportoInput from '@components/ImportoInput';

// Funzione di render astratta per includere il ThemeProvider
const render = (ui, options = {}) => {
  return rtlRender(
    <ThemeProvider theme={themeOne}>{ui}</ThemeProvider>,
    options
  );
};

// Helper function per simulare l'inserimento input da parte dell'utente
const typeInInput = (element, value) => {
  fireEvent.change(element, { target: { value } });
};

describe('ImportoInput', () => {
  it('renders correctly with default value', () => {
    render(<ImportoInput label="Importo" />);
    const input = screen.getByLabelText('Importo');
    expect(input).toHaveValue('0,00');
  });

  it('formats initial value correctly from the props', () => {
    render(<ImportoInput label="Importo" value={1234.56} />);
    const input = screen.getByLabelText('Importo');
    expect(input).toHaveValue('1.234,56');
  });

  it('formats user input correctly with thousand separators and decimal points', () => {
    render(<ImportoInput label="Importo" />);
    const input = screen.getByLabelText('Importo');

    typeInInput(input, '1234');
    expect(input).toHaveValue('1.234,00');

    typeInInput(input, '1234,56');
    expect(input).toHaveValue('1.234,56');
  });

  it('does not allow deleting the comma', () => {
    render(<ImportoInput label="Importo" />);
    const input = screen.getByLabelText('Importo');

    typeInInput(input, '1234,56');
    expect(input).toHaveValue('1.234,56');

    // Prova a cancellare la virgola
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input).toHaveValue('123.456,00');
  });

  it('calls onChange with correct numeric value', () => {
    const handleChange = jest.fn();
    render(<ImportoInput label="Importo" onChange={handleChange} />);

    const input = screen.getByLabelText('Importo');

    typeInInput(input, '1234,56');
    expect(handleChange).toHaveBeenCalledWith(1234.56);

    typeInInput(input, '1000,00');
    expect(handleChange).toHaveBeenCalledWith(1000.0);
  });

  it('formats the number correctly when thousands are entered', async () => {
    render(<ImportoInput label="Importo" />);
    const input = screen.getByLabelText('Importo');

    // Simula un clic sull'input per dargli il focus
    fireEvent.click(input);

    // Digita carattere per carattere usando fireEvent.change
    typeInInput(input, '1000000');
    setTimeout(() => {
      expect(input).toHaveValue('1.000.000,00');
      done(); 
    }, 1000);
  });

  it('maintains correct cursor position after formatting', async () => {
    render(<ImportoInput label="Importo" />);
    const input = screen.getByLabelText('Importo');

    typeInInput(input, '123456');
    setTimeout(() => {
        expect(input).toHaveValue('123.456,00');
      }, 600);
    
    // Aggiungi un piccolo timeout per attendere che tutti gli aggiornamenti siano completati
    setTimeout(() => {
      expect(input.selectionStart).toBe(7); // Verifica che il cursore sia nella posizione corretta (prima della virgola)
      done(); // Chiama done() per segnalare che il test è completato
    }, 600);
  });
});
