import * as React from 'react';
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';

import { ProcedimentoContext } from '@context/Procedimento';
import { themeOne } from '@theme/MainTheme';
import FormPersonaFisica from '@pages/FormPersonaFisica.jsx';
import * as ComuniUtils from '@assets/js/comuni';
import { provinceCampania, comuniCampania } from './mock/mockProvinceComuni';
import userEvent from '@testing-library/user-event';

// Mock delle chiamate
jest.mock('@assets/js/comuni', () => ({
  getProvince: jest.fn(),
  getComuni: jest.fn(),
  findComuneByCodiceCatastale: jest.fn(),
}));

async function renderComponent(mockContextValue) {
  let container;
  await act(async () => {
    const rendered = render(
      <ProcedimentoContext.Provider value={mockContextValue}>
        <ThemeProvider theme={themeOne}>
          <FormPersonaFisica/>
        </ThemeProvider>
      </ProcedimentoContext.Provider>
    );
    container = rendered.container;
  });
  return { container };
}

beforeEach(() => {
  ComuniUtils.getProvince.mockResolvedValue(provinceCampania);
  ComuniUtils.getComuni.mockResolvedValue(comuniCampania);
  ComuniUtils.findComuneByCodiceCatastale.mockImplementation((codice) =>
    Promise.resolve(
      comuniCampania.find((comune) => comune.codiceCatastale === codice)
    )
  );
});

// test('renders the form with all required fields', async () => {
//   await act(async () => {
//     render(
//       <ThemeProvider theme={themeOne}>
//         <FormPersonaFisica />
//       </ThemeProvider>
//     );
//   });

//   // Usa una funzione per cercare le label in modo più flessibile.
//   const nomeInput = screen.getByLabelText((content) => content.includes('Nome'));
//   const cognomeInput = screen.getByLabelText((content) => content.includes('Cognome'));
//   const avvocatoInput = screen.getByLabelText((content) => content.includes('Avvocato'));

//   // Verifica che i campi obbligatori siano presenti
//   expect(nomeInput).toBeInTheDocument();
//   expect(cognomeInput).toBeInTheDocument();
//   expect(avvocatoInput).toBeInTheDocument();
  
//   // Verifica che i campi obbligatori siano inizialmente vuoti
//   expect(nomeInput).toHaveValue('');
//   expect(cognomeInput).toHaveValue('');
//   expect(avvocatoInput).toHaveValue('');
  
//   // Simula l'invio del form per verificare i messaggi di errore
//   fireEvent.change(nomeInput, { target: { value: '' } });
//   fireEvent.change(cognomeInput, { target: { value: '' } });
//   fireEvent.change(avvocatoInput, { target: { value: '' } });

//   fireEvent.click(screen.getByRole('button', { name: "Crea" }));

//   // Verifica la presenza dei messaggi di errore per i campi obbligatori
//   expect(await screen.findByText(/Campi obbligatori assenti/i)).toBeInTheDocument();
// });

test('abilita il campo Comune di residenza quando una provincia è selezionata', async () => {
  const mockSetPersone = jest.fn();
    const mockContextValue = {
      persone: [],
      setPersone: mockSetPersone,
    };

   const { container } = await renderComponent(mockContextValue);

  // Trova il campo della provincia di residenza e inserisci un valore
  const provinciaInput = container.querySelector('#pf-provincia-residenza');
  await userEvent.type(provinciaInput, 'SALERNO');
  await userEvent.keyboard('{Enter}');

  // Verifica che il campo del comune sia abilitato
  setTimeout(()=> {
    const comuneInput = container.querySelector('#pf-comune-residenza');
    expect(comuneInput).not.toBeDisabled();
  }, 1000)
  
  // Interagisci con il campo del comune ora abilitato
  const comuneInput = container.querySelector('#pf-comune-residenza');
  await userEvent.type(comuneInput, 'MERCATO SAN SEVERINO');
  await userEvent.keyboard('{Enter}');

  // Verifica che il comune selezionato sia quello corretto
  setTimeout(()=> {
    expect(comuneInput).toHaveValue('MERCATO SAN SEVERINO');
  }, 1000)
  
});
