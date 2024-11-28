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

import { ProcedimentoContext } from '@shared/context';
import { themeOne } from '@shared/theme';
import {FormPersonaFisica} from '@pages';
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
          <FormPersonaFisica />
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

test('verifica dei campi obbligatori', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);
  const campiObbligatori = ['Nome', 'Cognome', 'Avvocato'];

  campiObbligatori.forEach((campo) => {
    // Cerca l'input
    let inputElement = screen.getByLabelText((content) =>
      content.includes(campo)
    );

    // Verifica che sia presente
    expect(inputElement).toBeInTheDocument();

    // Verifica che sia inizialmente vuoto
    expect(inputElement).toHaveValue('');

    // Verifica che sia obbligatorio
    expect(inputElement).toBeRequired();
  });
});

test('abilita il campo Comune di residenza quando una provincia è selezionata', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);

  // Trova il campo della provincia di residenza e inserisci un valore
  const provinciaInput = container.querySelector('#pf-provincia-residenza');
  await userEvent.click(provinciaInput);
  await userEvent.type(provinciaInput, 'SALERNO');
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{Enter}');
  
  await waitFor(() => {
    expect(provinciaInput).toHaveValue('SALERNO');
  });

  // Verifica che il campo del comune sia abilitato
  const comuneInput = container.querySelector('#pf-comune-residenza');
  await waitFor(
    () => {
      expect(comuneInput).not.toBeDisabled();
    }
  );

  // Interagisci con il campo del comune ora abilitato
  await userEvent.type(comuneInput, 'MERCATO SAN SEVERINO');
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{Enter}');

  // Verifica che il comune selezionato sia quello corretto
  await waitFor(() => {
    expect(comuneInput).toHaveValue('MERCATO SAN SEVERINO');
  });
});

test('dati anagrafici pre-compilati se il codice fiscale è specificato e corretto', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);
  const codiceFiscale = 'VLDGPP97E16F138C';
  const campiAnagrafici = {
    'pf-data-nascita': { label: 'Data di nascita', value: '16/05/1997' },
    'pf-sesso': { label: 'Sesso', value: 'M' },
    'pf-provincia-nascita': { label: 'Provincia di nascita', value: 'SALERNO' },
    'pf-comune-nascita': {
      label: 'Comune di nascita',
      value: 'MERCATO SAN SEVERINO',
    },
  };

  // Verifica che siano normalmente attivi
  let dataNascitInput = container.querySelector(`#pf-data-nascita`);
  expect(dataNascitInput).toBeInTheDocument();
  expect(dataNascitInput).toHaveValue('');

  let sessoSelect = container.querySelector(`#pf-sesso`);
  expect(sessoSelect).toBeInTheDocument();
  const cleanedText = sessoSelect.textContent.replace(
    /[\u200B-\u200D\uFEFF]/g,
    ''
  ); // rimuove i caratteri invisibili
  expect(cleanedText).toBe('');

  let provinciaNascitaInput = container.querySelector(`#pf-provincia-nascita`);
  expect(provinciaNascitaInput).toBeInTheDocument();
  expect(provinciaNascitaInput).toHaveValue('');

  let comuneNascitaInput = container.querySelector(`#pf-comune-nascita`);
  expect(comuneNascitaInput).toBeInTheDocument();
  expect(comuneNascitaInput).toHaveValue('');

  // Inserisce il codice fiscale
  const codiceFiscaleInput = container.querySelector('#pf-cf');
  await userEvent.type(codiceFiscaleInput, codiceFiscale);
  await waitFor(() => {
    expect(codiceFiscaleInput).toHaveValue(codiceFiscale);
  });

  // Verifica che i campi anagrafici siano compilati correttamente
  for (let campo in campiAnagrafici) {
    // Cerca l'input
    let inputElement = container.querySelector(`#${campo}`);

    // Verifica che abbia il valore corretto
    if (campo == 'pf-sesso') {
      const cleanedText = inputElement.textContent.replace(
        /[\u200B-\u200D\uFEFF]/g,
        ''
      );
      await waitFor(() => {
        expect(cleanedText).toBe('UOMO');
      });
    } else
      await waitFor(() => {
        expect(inputElement).toHaveValue(campiAnagrafici[campo].value);
      });
  }
});

test('dati anagrafici vuoti se il codice fiscale specificato è errato', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);
  const campiAnagrafici = {
    'pf-data-nascita': { label: 'Data di nascita', value: '16/05/1997' },
    'pf-sesso': { label: 'Sesso', value: 'M' },
    'pf-provincia-nascita': { label: 'Provincia di nascita', value: 'SALERNO' },
    'pf-comune-nascita': {
      label: 'Comune di nascita',
      value: 'MERCATO SAN SEVERINO',
    },
  };

  // Inserisce il codice fiscale
  const codiceFiscaleInput = container.querySelector('#pf-cf');
  await userEvent.type(codiceFiscaleInput, 'XXXXXXXXXXXXXXXX');
  await waitFor(() => {
    expect(codiceFiscaleInput).toHaveValue('XXXXXXXXXXXXXXXX');
  })
  expect(codiceFiscaleInput).toHaveAttribute('aria-invalid', 'true');
  
  // Verifica che i campi anagrafici siano compilati correttamente
  for (let campo in campiAnagrafici) {
    // Cerca l'input
    let inputElement = container.querySelector(`#${campo}`);

    // Verifica che abbia il valore corretto
    if (campo == 'pf-sesso') {
      const cleanedText = inputElement.textContent.replace(
        /[\u200B-\u200D\uFEFF]/g,
        ''
      );
      expect(cleanedText).toBe('');
    } else expect(inputElement).toHaveValue('');
  }
});
