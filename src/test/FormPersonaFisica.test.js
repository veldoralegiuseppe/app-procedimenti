import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { themeOne } from '@theme/MainTheme';
import FormPersonaFisica from '@pages/FormPersonaFisica.jsx';

// Mock della funzione fetch per gestire le chiamate API nei test.
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: [] }), // Simula una risposta JSON.
    })
  );
});

afterAll(() => {
  global.fetch.mockClear(); // Ripristina fetch dopo tutti i test.
});

test('renders the form with all required fields', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={themeOne}>
        <FormPersonaFisica />
      </ThemeProvider>
    );
  });

  // Usa `getAllByLabelText` ma controlla che ci sia almeno un elemento.
  const nomeInputs = screen.getAllByLabelText(/Nome/i);
  expect(nomeInputs.length).toBeGreaterThanOrEqual(1);

  const cognomeInputs = screen.getAllByLabelText(/Cognome/i);
  expect(cognomeInputs.length).toBeGreaterThanOrEqual(1);

  const codiceFiscaleInputs = screen.getAllByLabelText(/Codice fiscale/i);
  expect(codiceFiscaleInputs.length).toBeGreaterThanOrEqual(1);
});


