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
import userEvent from '@testing-library/user-event';

import { themeOne } from '@theme/MainTheme';
import CreaParteControparte from '@pages/CreaParteControparte';
import * as ComuniUtils from '@assets/js/comuni';
import { ProcedimentoContext } from '@context/Procedimento';
import { PersonaFisica } from '@model/personaFisica';
import { provinceCampania, comuniCampania } from './mock/mockProvinceComuni';


// Mock delle chiamate
jest.mock('@assets/js/comuni', () => ({
  getProvince: jest.fn(),
  getComuni: jest.fn(),
  findComuneByCodiceCatastale: jest.fn(),
}));

// Utility
async function renderComponent(mockContextValue) {
  let container;
  await act(async () => {
    const rendered = render(
      <ProcedimentoContext.Provider value={mockContextValue}>
        <ThemeProvider theme={themeOne}>
          <CreaParteControparte handleClose={jest.fn()} onError={jest.fn()} />
        </ThemeProvider>
      </ProcedimentoContext.Provider>
    );
    container = rendered.container;
  });
  return { container };
}
async function fillCodiceFiscale(input, value) {
  await act(async () => {
    fireEvent.change(input, {
      target: { value },
    });
    console.log('Valore del codice fiscale:', input.value);
  });
}
async function verifyPopulatedFields(container) {
  await waitFor(() => {
    // Verifica del campo Data di nascita
    const dataNascitaField = container.querySelector('#pf-data-nascita');
    console.log('Valore del campo data di nascita:', dataNascitaField.value);
    expect(dataNascitaField).toHaveValue('16/05/1997');

    // Verifica del campo Sesso
    const sessoField = container.querySelector('#pf-sesso');
    console.log('Valore del campo sesso:', sessoField.textContent);
    expect(sessoField.textContent).toBe('UOMO');

    // Verifica del campo Comune di nascita
    const comuneNascitaField = container.querySelector('#pf-comune-nascita');
    console.log('Valore del campo comune di nascita:', comuneNascitaField.value);
    expect(comuneNascitaField).toHaveValue('MERCATO SAN SEVERINO');

    // Verifica del campo Provincia di nascita
    const provinciaNascitaField = container.querySelector('#pf-provincia-nascita');
    console.log('Valore del campo provincia di nascita:', provinciaNascitaField.value);
    expect(provinciaNascitaField).toHaveValue('SALERNO');
  
  });
}
async function fillRemainingFields(container) {
  await act(async () => {
    const inputs = {
      nomeInput: '#pf-nome',
      cognomeInput: '#pf-cognome',
      provinciaResidenzaInput: '#pf-provincia-residenza',
      comuneResidenzaInput: '#pf-comune-residenza',
      indirizzoResidenzaInput: '#pf-indirizzo-residenza',
      capInput: '#pf-cap-residenza',
      pecEmailInput: '#pf-pec-email',
      rappresentanteLegalePecEmailInput: '#pf-pec-email-avvocato',
      partitaIVAInput: '#pf-piva',
      avvocatoInput: '#pf-avvocato',
      speseAvvioInput: '#pf-spese-avvio',
      spesePostaliInput: '#pf-spese-postali',
      importoPagamentoIndennitaInput: '#pf-pagamento-indennita',
      importoMancatoAccordoInput: '#pf-mancato-accordo',
      importoPositivoPrimoIncontroInput: '#pf-positivo-primo-incontro',
      importoPositivoOltrePrimoIncontroInput: '#pf-positivo-oltre-primo-incontro',
      noteInput: '#pf-note',
    };

    // Popolazione campi di testo normali
    fireEvent.change(container.querySelector(inputs.nomeInput), {
      target: { value: 'Giuseppe' },
    });
    fireEvent.change(container.querySelector(inputs.cognomeInput), {
      target: { value: 'Veldorale' },
    });

    // Interazione con Autocomplete per provincia di residenza
    userEvent.click(container.querySelector(inputs.provinciaResidenzaInput));
    userEvent.type(container.querySelector(inputs.provinciaResidenzaInput), 'SALERNO');
    const provinciaOption = await screen.findByText('SALERNO');
    userEvent.click(provinciaOption);

    // Interazione con Autocomplete per comune di residenza
    userEvent.click(container.querySelector(inputs.comuneResidenzaInput));
    userEvent.type(container.querySelector(inputs.comuneResidenzaInput), 'MERCATO SAN SEVERINO');
    const comuneOption = await screen.findByText('MERCATO SAN SEVERINO');
    userEvent.click(comuneOption);

    // Popolazione degli altri campi
    fireEvent.change(container.querySelector(inputs.indirizzoResidenzaInput), {
      target: { value: 'Viale Europa 168' },
    });
    fireEvent.change(container.querySelector(inputs.capInput), {
      target: { value: '84088' },
    });
    fireEvent.change(container.querySelector(inputs.pecEmailInput), {
      target: { value: 'giuseppe.veldorale@pec.it' },
    });
    fireEvent.change(
      container.querySelector(inputs.rappresentanteLegalePecEmailInput),
      { target: { value: 'raimondo.giudice@pec.it' } }
    );
    fireEvent.change(container.querySelector(inputs.partitaIVAInput), {
      target: { value: '12345678901' },
    });
    fireEvent.change(container.querySelector(inputs.avvocatoInput), {
      target: { value: 'Raimondo Giudice' },
    });
    fireEvent.change(container.querySelector(inputs.speseAvvioInput), {
      target: { value: 100 },
    });
    fireEvent.change(container.querySelector(inputs.spesePostaliInput), {
      target: { value: 10 },
    });
    fireEvent.change(
      container.querySelector(inputs.importoPagamentoIndennitaInput),
      { target: { value: 500 } }
    );
    fireEvent.change(
      container.querySelector(inputs.importoMancatoAccordoInput),
      { target: { value: '1000' } }
    );
    fireEvent.change(
      container.querySelector(inputs.importoPositivoPrimoIncontroInput),
      { target: { value: 200 } }
    );
    fireEvent.change(
      container.querySelector(inputs.importoPositivoOltrePrimoIncontroInput),
      { target: { value: 300 } }
    );
    fireEvent.change(container.querySelector(inputs.noteInput), {
      target: { value: 'Queste sono delle note di esempio.' },
    });
  });
}
async function submitForm() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Crea/i }));
  });
}
async function verifyCreatedPersona(mockSetPersone) {
  const expected = {
    ...new PersonaFisica(),
    nome: 'GIUSEPPE',
    cognome: 'VELDORALE',
    rappresentanteLegale: 'RAIMONDO GIUDICE',
    codiceFiscale: 'VLDGPP97E16F138C',
    dataNascita: '1997-05-16',
    luogoDiNascita: comuniCampania[0], 
    sesso: 'M',
    indirizzoResidenza: 'VIALE EUROPA 168',
    partitaIVA: '12345678901',
    pecEmail: 'GIUSEPPE.VELDORALE@PEC.IT',
    rappresentanteLegalePecEmail: 'RAIMONDO.GIUDICE@PEC.IT',
    residenza: comuniCampania[1],
    isParteIstante: true,
    speseAvvio: 100,
    spesePostali: 10,
    pagamentoIndennita: 500,
    importoMancatoAccordo: 1000,
    importoPositivoPrimoIncontro: 200,
    importoPositivoOltrePrimoIncontro: 300,
    note: 'QUESTE SONO DELLE NOTE DI ESEMPIO.',
  };

  await waitFor(() => {
    const callArguments = mockSetPersone.mock.calls[0][0];
    const receivedNormalized = normalize(callArguments[0]);
    const expectedNormalized = normalize(expected);

    expect(receivedNormalized).toMatchObject(expectedNormalized);
  });
}
function normalize(persona) {
  return {
    ...persona,
    luogoDiNascita: JSON.parse(JSON.stringify(persona.luogoDiNascita)),
    residenza: JSON.parse(JSON.stringify(persona.residenza)),
  };
}

// Test

beforeEach(() => {
  // Mock della risposta di getProvince e getComuni
  ComuniUtils.getProvince.mockResolvedValue(provinceCampania);
  ComuniUtils.getComuni.mockResolvedValue(comuniCampania);
  ComuniUtils.findComuneByCodiceCatastale.mockImplementation((codice) =>
    Promise.resolve(
      comuniCampania.find((comune) => comune.codiceCatastale === codice)
    )
  );
});

test('renders the form and shows error messages for missing required fields', async () => {
  const handleClose = jest.fn();
  const onError = jest.fn();

  // Mock dello stato per il contesto
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  await act(async () => {
    render(
      <ProcedimentoContext.Provider value={mockContextValue}>
        <ThemeProvider theme={themeOne}>
          <CreaParteControparte handleClose={handleClose} onError={onError} />
        </ThemeProvider>
      </ProcedimentoContext.Provider>
    );
  });

  // Trova i campi obbligatori
  const nomeInput = screen.getByLabelText((content) =>
    content.includes('Nome')
  );
  const cognomeInput = screen.getByLabelText((content) =>
    content.includes('Cognome')
  );
  const avvocatoInput = screen.getByLabelText((content) =>
    content.includes('Avvocato')
  );

  // Verifica che i campi obbligatori siano presenti
  expect(nomeInput).toBeInTheDocument();
  expect(cognomeInput).toBeInTheDocument();
  expect(avvocatoInput).toBeInTheDocument();

  // Simula l'invio del form senza compilare i campi obbligatori
  fireEvent.change(nomeInput, { target: { value: '' } });
  fireEvent.change(cognomeInput, { target: { value: '' } });
  fireEvent.change(avvocatoInput, { target: { value: '' } });

  fireEvent.click(getByRole('button', { name: /Crea/i }));

  // Verifica che la funzione onError venga chiamata con il messaggio di errore corretto
  expect(onError).toHaveBeenCalledWith(
    expect.stringContaining('Cognome, Nome, Avvocato')
  );
});

test.only('creates a new persona fisica with all fields filled', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  // Render
  const { container } = await renderComponent(mockContextValue);

  // Compila i campi del form
  const codiceFiscaleInput = container.querySelector('#pf-cf');
  await fillCodiceFiscale(codiceFiscaleInput, 'VLDGPP97E16F138C');

  // Verifica che i campi siano popolati correttamente
  await verifyPopulatedFields(container);

  // Compila i campi restanti
  await fillRemainingFields(container);

  // Simula il click sul bottone "Crea"
  await submitForm();

  // Verifica l'oggetto atteso
  await verifyCreatedPersona(mockSetPersone);
});
