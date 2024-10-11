import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { themeOne } from '@theme/MainTheme';
import FormPersonaFisica from '@pages/FormPersonaFisica.jsx';
import * as ComuniUtils from '@assets/js/comuni';

// Mock delle chiamate getProvince e getComuni
jest.mock('@assets/js/comuni', () => ({
  getProvince: jest.fn(),
  getComuni: jest.fn(),
}));

beforeEach(() => {
  // Mock della risposta di getProvince e getComuni
  ComuniUtils.getProvince.mockResolvedValue([
    { codice: '001', nome: 'MILANO', sigla: 'MI', regione: 'LOMBARDIA' },
    { codice: '002', nome: 'ROMA', sigla: 'RM', regione: 'LAZIO' },
  ]);
  
  ComuniUtils.getComuni.mockResolvedValue([
    {
      codice: '001001',
      nome: 'MILANO',
      codiceCatastale: 'F205',
      provincia: { nome: 'MILANO', regione: 'LOMBARDIA' },
    },
    {
      codice: '001002',
      nome: 'ROMA',
      codiceCatastale: 'H501',
      provincia: { nome: 'ROMA', regione: 'LAZIO' },
    },
  ]);
});

test('renders the form with all required fields', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={themeOne}>
        <FormPersonaFisica />
      </ThemeProvider>
    );
  });

  // Usa una funzione per cercare le label in modo più flessibile.
  const nomeInput = screen.getByLabelText((content) => content.includes('Nome'));
  const cognomeInput = screen.getByLabelText((content) => content.includes('Cognome'));
  const avvocatoInput = screen.getByLabelText((content) => content.includes('Avvocato'));

  // Verifica che i campi obbligatori siano presenti
  expect(nomeInput).toBeInTheDocument();
  expect(cognomeInput).toBeInTheDocument();
  expect(avvocatoInput).toBeInTheDocument();
  
  // Verifica che i campi obbligatori siano inizialmente vuoti
  expect(nomeInput).toHaveValue('');
  expect(cognomeInput).toHaveValue('');
  expect(avvocatoInput).toHaveValue('');
  
  // Simula l'invio del form per verificare i messaggi di errore
  fireEvent.change(nomeInput, { target: { value: '' } });
  fireEvent.change(cognomeInput, { target: { value: '' } });
  fireEvent.change(avvocatoInput, { target: { value: '' } });

  fireEvent.click(screen.getByRole('button', { name: "Crea" }));

  // Verifica la presenza dei messaggi di errore per i campi obbligatori
  expect(await screen.findByText(/Campi obbligatori assenti/i)).toBeInTheDocument();
});
