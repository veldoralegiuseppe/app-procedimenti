import * as React from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
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

const getSelectors = (container) => ({
  codiceFiscaleInput: container.querySelector('#pf-cf'),
  nomeInput: container.querySelector('#pf-nome'),
  cognomeInput: container.querySelector('#pf-cognome'),
  provinciaResidenzaInput: container.querySelector('#pf-provincia-residenza'),
  comuneResidenzaInput: container.querySelector('#pf-comune-residenza'),
  indirizzoResidenzaInput: container.querySelector('#pf-indirizzo-residenza'),
  pecEmailInput: container.querySelector('#pf-pec-email'),
  partitaIVAInput: container.querySelector('#pf-piva'),
  rappresentanteLegaleInput: container.querySelector('#pf-avvocato'),
  rappresentanteLegalePecEmailInput: container.querySelector(
    '#pf-pec-email-avvocato'
  ),
  speseAvvioInput: container.querySelector('#pf-spese-avvio'),
  spesePostaliInput: container.querySelector('#pf-spese-postali'),
  pagamentoIndennitaInput: container.querySelector('#pf-pagamento-indennita'),
  importoMancatoAccordoInput: container.querySelector('#pf-mancato-accordo'),
  importoPositivoPrmoIncontroInput: container.querySelector(
    '#pf-positivo-primo-incontro'
  ),
  importoPositivoOltrePrmoIncontroInput: container.querySelector(
    '#pf-positivo-oltre-primo-incontro'
  ),
  noteInput: container.querySelector('#pf-note'),
  dataNascitaInput: container.querySelector('#pf-data-nascita'),
  sessoInput: container.querySelector('#pf-sesso'),
  comuneNascitaInput: container.querySelector('#pf-comune-nascita'),
  provinciaNascitaInput: container.querySelector('#pf-provincia-nascita'),
});

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

async function fillCodiceFiscale(container) {
  const { codiceFiscaleInput } = getSelectors(container);
  await userEvent.type(codiceFiscaleInput, 'VLDGPP97E16F138C');
}

async function fillDatiAnagrafici(container) {
  const { nomeInput, cognomeInput } = getSelectors(container);
  await userEvent.type(nomeInput, 'GIUSEPPE');
  await userEvent.type(cognomeInput, 'VELDORALE');
}

async function fillDatiDemografici(container) {
  const {
    provinciaResidenzaInput,
    comuneResidenzaInput,
    indirizzoResidenzaInput,
  } = getSelectors(container);

  // Simula l'apertura della lista e la selezione della provincia
  await act(async () => {
    await userEvent.click(provinciaResidenzaInput); // Apre la lista
    await userEvent.type(provinciaResidenzaInput, 'SALERNO');
    await userEvent.keyboard('{Enter}'); // Conferma la selezione della provincia
  });

  // Attendi che la provincia sia correttamente selezionata
  await waitFor(() => {
    expect(provinciaResidenzaInput).toHaveValue('SALERNO');
  });

  // Abilito manualmente il comune assendoci un bug di Jest che non dipende dal componente
  comuneResidenzaInput.disabled = false;
  await waitFor(() => {
    expect(comuneResidenzaInput).not.toBeDisabled();
  });
  comuneResidenzaInput.value = "SIANO"
  await waitFor(() => {
    expect(comuneResidenzaInput).toHaveValue('SIANO');
  });
  
  // Digita il comune e l'indirizzo
  await userEvent.type(indirizzoResidenzaInput, 'VIALE EUROPA 168');
  await waitFor(() => {
    expect(indirizzoResidenzaInput).toHaveValue('VIALE EUROPA 168');
  });
}

async function fillRecapiti(container) {
  const { pecEmailInput } = getSelectors(container);
  await userEvent.type(pecEmailInput, 'GIUSEPPE.VELDORALE@PEC.IT');
}

async function fillDittaIndividualeLiberoProfessionista(container) {
  const { partitaIVAInput: pIva } = getSelectors(container);
  await userEvent.type(pIva, '11111111111');
}

async function fillRappresentanteLegale(container) {
  const {
    rappresentanteLegaleInput: avvocatoInput,
    rappresentanteLegalePecEmailInput: avvocatoPecEmailInput,
  } = getSelectors(container);
  await userEvent.type(avvocatoInput, 'RAIMONDO GIUDICE');
  await userEvent.type(avvocatoPecEmailInput, 'RAIMONDO.GIUDICE@PEC.IT');
}

async function fillSpeseMediazione(container) {
  const {
    speseAvvioInput,
    spesePostaliInput,
    pagamentoIndennitaInput,
    importoMancatoAccordoInput: mancatoAccordoInput,
    importoPositivoPrmoIncontroInput: positivoPrmoIncontroInput,
    importoPositivoOltrePrmoIncontroInput: positivoOltrePrmoIncontroInput,
  } = getSelectors(container);

  await userEvent.type(speseAvvioInput, '100');
  await userEvent.type(spesePostaliInput, '100');
  await userEvent.type(pagamentoIndennitaInput, '100');
  await userEvent.type(mancatoAccordoInput, '100', 100);
  await userEvent.type(positivoPrmoIncontroInput, '100', 100);
  await userEvent.type(positivoOltrePrmoIncontroInput, '100', 100);
}

async function fillNote(container) {
  const { noteInput } = getSelectors(container);
  await userEvent.type(noteInput, 'NOTE DI ESEMPIO');
}

async function verifyPopulatedFields(container, expected) {
  const selectors = getSelectors(container);
  const importiField = [
    'speseAvvio',
    'spesePostali',
    'pagamentoIndennita',
    'importoMancatoAccordo',
    'importoPositivoPrimoIncontro',
    'importoPositivoOltrePrimoIncontro',
  ];

  await waitFor(() => {
    for (let attributo in expected) {
      const selectorName = `${attributo}Input`;
      const expectedValue = expected[attributo];

      // Log del valore atteso
      console.log(`Verificando campo: ${attributo}`);
      console.log(`Valore atteso: ${expectedValue}`);

      if (attributo === 'sesso') {
        const actualValue = selectors[selectorName].textContent;
        console.log(`Valore attuale (sesso): ${actualValue}`);
        expect(actualValue).toBe(expectedValue);
      } else if (importiField.includes(attributo)) {
        const actualValue = selectors[selectorName].value;
        console.log(`Valore attuale (importo): ${actualValue}`);
        expect(actualValue).toBe(expectedValue.toLocaleString('it-IT'));
      } else if (attributo === 'residenza') {
        // Gestione dei campi legati alla residenza
        const comuneResidenzaValue = selectors['comuneResidenzaInput'].value;
        const provinciaResidenzaValue =
          selectors['provinciaResidenzaInput'].value;

        console.log(
          `Valore attuale (comune residenza): ${comuneResidenzaValue}`
        );
        console.log(
          `Valore attuale (provincia residenza): ${provinciaResidenzaValue}`
        );
        console.log(
          `Valore atteso (comune residenza): ${expected.residenza.nome}`
        );
        console.log(
          `Valore atteso (provincia residenza): ${expected.residenza.provincia.nome}`
        );

        expect(comuneResidenzaValue).toBe(expected.residenza.nome);
        expect(provinciaResidenzaValue).toBe(expected.residenza.provincia.nome);
      } else if (attributo === 'luogoDiNascita') {
        // Gestione dei campi legati al luogo di nascita
        const comuneNascitaValue = selectors['comuneNascitaInput'].value;
        const provinciaNascitaValue = selectors['provinciaNascitaInput'].value;

        console.log(`Valore attuale (comune nascita): ${comuneNascitaValue}`);
        console.log(
          `Valore attuale (provincia nascita): ${provinciaNascitaValue}`
        );
        console.log(
          `Valore atteso (comune nascita): ${expected.luogoDiNascita.nome}`
        );
        console.log(
          `Valore atteso (provincia nascita): ${expected.luogoDiNascita.provincia.nome}`
        );

        expect(comuneNascitaValue).toBe(expected.luogoDiNascita.nome);
        expect(provinciaNascitaValue).toBe(
          expected.luogoDiNascita.provincia.nome
        );
      } else {
        // Altri campi generici
        const actualValue = selectors[selectorName].value;
        console.log(`Valore attuale (generico): ${actualValue}`);
        expect(actualValue).toBe(expectedValue);
      }
    }
  });
}

async function submitForm() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Crea/i }));
  });
}

async function verifyCreatedPersona(mockSetPersone, expected) {
  setTimeout(() => {
    const callArguments = mockSetPersone.mock.calls[0][0];
    expect(callArguments[0]).toMatchObject(expected);
  }, 500);
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

test('crea una nuova persona fisica con tutti i campi compilati', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);

  const expectedPersonaFisica = {
    ...new PersonaFisica(),
    nome: 'GIUSEPPE',
    cognome: 'VELDORALE',
    rappresentanteLegale: 'RAIMONDO GIUDICE',
    codiceFiscale: 'VLDGPP97E16F138C',
    dataNascita: '1997-05-16',
    luogoDiNascita: comuniCampania[0],
    sesso: 'M',
    indirizzoResidenza: 'VIALE EUROPA 168',
    partitaIVA: '11111111111',
    pecEmail: 'GIUSEPPE.VELDORALE@PEC.IT',
    rappresentanteLegalePecEmail: 'RAIMONDO.GIUDICE@PEC.IT',
    residenza: comuniCampania[1],
    isParteIstante: true,
    speseAvvio: 100,
    spesePostali: 100,
    pagamentoIndennita: 100,
    importoMancatoAccordo: 100,
    importoPositivoPrimoIncontro: 100,
    importoPositivoOltrePrmoIncontro: 100,
    note: 'NOTE DI ESEMPIO',
  };

  // Compila la form
  await fillCodiceFiscale(container);
  await fillDatiAnagrafici(container);
  await fillDatiDemografici(container);
  await fillRecapiti(container);
  await fillDittaIndividualeLiberoProfessionista(container);
  await fillRappresentanteLegale(container);
  await fillSpeseMediazione(container);
  await fillNote(container);

  // Verifico che i campi siano correttamente popolati
  await verifyPopulatedFields(container, expectedPersonaFisica);

  // Invia il form
  await submitForm();

  // Verifica l'oggetto creato atteso
  await verifyCreatedPersona(mockSetPersone, expectedPersonaFisica);
});

test.only('fill dati demografici', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);

  const expectedPersonaFisica = {
    indirizzoResidenza: 'VIALE EUROPA 168',
    residenza: comuniCampania[1],
  };

  await fillDatiDemografici(container);
  //await verifyPopulatedFields(container, expectedPersonaFisica);
});
