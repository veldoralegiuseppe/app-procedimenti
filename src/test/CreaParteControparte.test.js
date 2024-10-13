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
import ComuneSelect from '../components/ComuneSelect';

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
    console.log(
      'Valore del campo comune di nascita:',
      comuneNascitaField.value
    );
    expect(comuneNascitaField).toHaveValue('MERCATO SAN SEVERINO');

    // Verifica del campo Provincia di nascita
    const provinciaNascitaField = container.querySelector(
      '#pf-provincia-nascita'
    );
    console.log(
      'Valore del campo provincia di nascita:',
      provinciaNascitaField.value
    );
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
      importoPositivoOltrePrimoIncontroInput:
        '#pf-positivo-oltre-primo-incontro',
      noteInput: '#pf-note',
    };

    // Popolazione campi di testo normali
    fireEvent.change(container.querySelector(inputs.nomeInput), {
      target: { value: 'Giuseppe' },
    });
    fireEvent.change(container.querySelector(inputs.cognomeInput), {
      target: { value: 'Veldorale' },
    });

    // Popolazione degli altri campi
    const changeEvent = (inputSelector, value) => {
      fireEvent.change(container.querySelector(inputSelector), {
        target: { value },
      });
    };

    changeEvent(inputs.indirizzoResidenzaInput, 'Viale Europa 168');
    changeEvent(inputs.capInput, '84088');
    changeEvent(inputs.pecEmailInput, 'giuseppe.veldorale@pec.it');
    changeEvent(
      inputs.rappresentanteLegalePecEmailInput,
      'raimondo.giudice@pec.it'
    );
    changeEvent(inputs.partitaIVAInput, '12345678901');
    changeEvent(inputs.avvocatoInput, 'Raimondo Giudice');
    changeEvent(inputs.speseAvvioInput, 100);
    changeEvent(inputs.spesePostaliInput, 10);
    changeEvent(inputs.importoPagamentoIndennitaInput, 500);
    changeEvent(inputs.importoMancatoAccordoInput, '1000');
    changeEvent(inputs.importoPositivoPrimoIncontroInput, 200);
    changeEvent(inputs.importoPositivoOltrePrimoIncontroInput, 300);
    changeEvent(inputs.noteInput, 'Queste sono delle note di esempio.');
  });
}

async function compilaResidenza(container) {
  await act(async () => {
    const inputs = {
      provinciaResidenzaInput: '#pf-provincia-residenza',
      comuneResidenzaInput: '#pf-comune-residenza',
      indirizzoResidenzaInput: '#pf-indirizzo-residenza',
    };

    const provinciaInput = container.querySelector(
      inputs.provinciaResidenzaInput
    );
    userEvent.click(provinciaInput);
    await userEvent.type(provinciaInput, 'SALERNO', { delay: 100 });

    // Attendi che l'opzione appaia nel DOM e selezionala
    const provinciaOption = await waitFor(() =>
      screen.getByRole('option', { name: /SALERNO/i })
    );
    userEvent.click(provinciaOption);
    fireEvent.blur(provinciaInput);

    // Verifica se il valore è stato inserito correttamente
    await waitFor(() => {
      console.log(
        'Stato della provincia:',
        container.querySelector(inputs.provinciaResidenzaInput).value
      );
      expect(
        container.querySelector(inputs.provinciaResidenzaInput).value
      ).toBe('SALERNO');
    });

    // Aspetta che il campo del comune si abiliti
    await waitFor(() => {
      expect(
        container.querySelector(inputs.comuneResidenzaInput)
      ).not.toBeDisabled();
    });

    // Interazione con Autocomplete per comune di residenza
    const comuneInput = container.querySelector(inputs.comuneResidenzaInput);
    userEvent.click(comuneInput);
    await userEvent.type(comuneInput, 'SIANO', { delay: 100 });

    // Attendi che l'opzione appaia nel DOM e selezionala
    const comuneOption = await waitFor(() =>
      screen.getByRole('option', { name: /SIANO/i })
    );
    userEvent.click(comuneOption);

    // Verifica se il valore è stato inserito correttamente
    console.log('Valore inserito nel campo comune:', comuneInput.value);
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

test.only('crea una nuova persona fisica con tutti i campi compilati', async () => {
    const mockSetPersone = jest.fn();
    const mockContextValue = {
      persone: [],
      setPersone: mockSetPersone,
    };
  
    const { container, rerender } = await renderComponent(mockContextValue);
  
    const provinciaInput = container.querySelector('#pf-provincia-residenza');
    await userEvent.click(provinciaInput);
    await userEvent.type(provinciaInput, 'SALERNO', { delay: 100 });
    await userEvent.keyboard('{Enter}'); // Simula la selezione della provincia
  
    // Forza un rerender per verificare che la provincia sia stata presa in considerazione
    rerender(<ComuneSelect />);
  
    // Attendi che il campo 'comune' non sia più disabilitato
    await waitFor(() => {
      expect(container.querySelector('#pf-comune-residenza')).not.toBeDisabled();
    }, { timeout: 5000 });
  
    // Interagisci con il campo del comune ora abilitato
    await userEvent.type(container.querySelector('#pf-comune-residenza'), 'MERCATO SAN SEVERINO', { delay: 100 });
  
    // Compila i campi rimanenti e invia il form
    await fillRemainingFields(container, rerender);
    await submitForm();
  
    // Verifica l'oggetto creato atteso
    await verifyCreatedPersona(mockSetPersone);
  });
  
  
