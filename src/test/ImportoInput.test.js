import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { themeOne } from '@theme/MainTheme';

import { render, fireEvent } from '@testing-library/react';
import ImportoInput from '@components/ImportoInput';
import '@testing-library/jest-dom';

function renderComponent() {
  const handleChange = jest.fn();
  const { getByLabelText, rerender } = render(
    <ThemeProvider theme={themeOne}>
      <ImportoInput label="Importo" onChange={handleChange} />
    </ThemeProvider>
  );
  return { getByLabelText, rerender };
}

describe('ImportoInput Component', () => {
  test('should handle integer input correctly', () => {
    const { getByLabelText } = renderComponent();
    const input = getByLabelText('Importo');

    // Simula l'inserimento di un valore intero
    fireEvent.change(input, { target: { value: '1000' } });

    // Il valore nell'input deve essere formattato correttamente
    expect(input.value).toBe('1.000,00');
    expect(handleChange).toHaveBeenCalledWith(1000);
  });

  test('should handle decimal input correctly', () => {
    const { getByLabelText } = renderComponent();

    const input = getByLabelText('Importo');

    // Simula l'inserimento di un valore decimale
    fireEvent.change(input, { target: { value: '1000,50' } });

    // Il valore nell'input deve essere formattato correttamente
    expect(input.value).toBe('1.000,50');
    expect(handleChange).toHaveBeenCalledWith(1000.5);
  });

  test('should handle invalid input (non-numeric) and prevent incorrect input', () => {
    const { getByLabelText } = renderComponent();

    const input = getByLabelText('Importo');

    // Simula l'inserimento di un valore non valido
    fireEvent.change(input, { target: { value: 'abc' } });

    // Il valore non deve essere accettato, quindi il campo rimane invariato
    expect(input.value).toBe('0,00');
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('should reset the input field correctly', () => {
    const { getByLabelText, rerender } = renderComponent();
    const input = getByLabelText('Importo');

    // Verifica il valore iniziale
    expect(input.value).toBe('1.000,50');

    // Re-render con reset impostato a true
    rerender(<ImportoInput label="Importo" value="1000,50" reset />);

    // Il campo deve essere resettato
    expect(input.value).toBe('0,00');
  });

  test('should handle deleting decimals', () => {
    const { getByLabelText } = renderComponent();

    const input = getByLabelText('Importo');

    // Simula l'inserimento di un valore decimale
    fireEvent.change(input, { target: { value: '1000,50' } });
    expect(input.value).toBe('1.000,50');

    // Simula la cancellazione dei decimali
    fireEvent.change(input, { target: { value: '1000,' } });

    // Verifica che il campo venga gestito correttamente
    expect(input.value).toBe('1.000,00');
    expect(handleChange).toHaveBeenCalledWith(1000);
  });

  test('should handle input with points and commas correctly', () => {
    const { getByLabelText } = renderComponent();

    const input = getByLabelText('Importo');

    // Simula l'inserimento di un numero con punti e virgola
    fireEvent.change(input, { target: { value: '1.000,50' } });

    // Verifica che il valore venga formattato correttamente
    expect(input.value).toBe('1.000,50');
    expect(handleChange).toHaveBeenCalledWith(1000.5);
  });
});
