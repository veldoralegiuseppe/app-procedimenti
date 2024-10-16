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
import { Comune } from '@model/comune';
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
  importoPositivoOltrePrimoIncontroInput: container.querySelector(
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

async function fillRuolo(ruolo = 'CONTROPARTE') {
  const controparteRadio = screen.getByLabelText('CONTROPARTE');
  const parteRadio = screen.getByLabelText('CONTROPARTE');
  const selectedRadio = ruolo == 'CONTROPARTE' ? controparteRadio : parteRadio;

  await userEvent.click(selectedRadio);
  expect(selectedRadio).toBeChecked();
}

async function fillCampiObbligatori(container) {
  const { nomeInput, cognomeInput, rappresentanteLegaleInput } =
    getSelectors(container);

  await userEvent.type(nomeInput, 'GIUSEPPE');
  await userEvent.type(cognomeInput, 'VELDORALE');
  await userEvent.type(rappresentanteLegaleInput, 'RAIMONDO GIUDICE');

  expect(nomeInput).toHaveValue('GIUSEPPE');
  expect(cognomeInput).toHaveValue('VELDORALE');
  expect(rappresentanteLegaleInput).toHaveValue('RAIMONDO GIUDICE');
}

async function fillCodiceFiscale(container) {
  const { codiceFiscaleInput } = getSelectors(container);
  await userEvent.type(codiceFiscaleInput, 'VLDGPP97E16F138C');
  expect(codiceFiscaleInput).toHaveValue('VLDGPP97E16F138C');
}

async function fillDatiAnagrafici(container) {
  const { nomeInput, cognomeInput } = getSelectors(container);
  await userEvent.type(nomeInput, 'GIUSEPPE');
  await userEvent.type(cognomeInput, 'VELDORALE');

  expect(nomeInput).toHaveValue('GIUSEPPE');
  expect(cognomeInput).toHaveValue('VELDORALE');
}

async function fillDatiDemografici(container) {
  const {
    provinciaResidenzaInput,
    comuneResidenzaInput,
    indirizzoResidenzaInput,
  } = getSelectors(container);

  // Simula l'apertura della lista e la selezione della provincia
  await userEvent.click(provinciaResidenzaInput);
  await userEvent.type(provinciaResidenzaInput, 'SALERNO');
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{Enter}');
  await waitFor(() => {
    expect(provinciaResidenzaInput).toHaveValue('SALERNO');
  });

  // Abilito manualmente il comune assendoci un bug di Jest che non dipende dal componente
  await waitFor(() => {
    expect(comuneResidenzaInput).not.toBeDisabled();
  });
  await userEvent.click(comuneResidenzaInput);
  await userEvent.type(comuneResidenzaInput, 'SIANO');
  await userEvent.keyboard('{arrowdown}');
  await userEvent.keyboard('{Enter}');
  expect(comuneResidenzaInput).toHaveValue('SIANO');

  // Digita il comune e l'indirizzo
  await userEvent.type(indirizzoResidenzaInput, 'VIALE EUROPA 168');
  expect(indirizzoResidenzaInput).toHaveValue('VIALE EUROPA 168');
}

async function fillRecapiti(container) {
  const { pecEmailInput } = getSelectors(container);
  await userEvent.type(pecEmailInput, 'GIUSEPPE.VELDORALE@PEC.IT');
  expect(pecEmailInput).toHaveValue('GIUSEPPE.VELDORALE@PEC.IT');
}

async function fillDittaIndividualeLiberoProfessionista(container) {
  const { partitaIVAInput } = getSelectors(container);
  await userEvent.type(partitaIVAInput, '11111111111');
  expect(partitaIVAInput).toHaveValue('11111111111');
}

async function fillRappresentanteLegale(container) {
  const {
    rappresentanteLegaleInput: avvocatoInput,
    rappresentanteLegalePecEmailInput: avvocatoPecEmailInput,
  } = getSelectors(container);
  await userEvent.type(avvocatoInput, 'RAIMONDO GIUDICE');
  await userEvent.type(avvocatoPecEmailInput, 'RAIMONDO.GIUDICE@PEC.IT');

  expect(avvocatoInput).toHaveValue('RAIMONDO GIUDICE');
  expect(avvocatoPecEmailInput).toHaveValue('RAIMONDO.GIUDICE@PEC.IT');
}

async function fillSpeseMediazione(container) {
  const {
    speseAvvioInput,
    spesePostaliInput,
    pagamentoIndennitaInput,
    importoMancatoAccordoInput: mancatoAccordoInput,
    importoPositivoPrmoIncontroInput: positivoPrmoIncontroInput,
    importoPositivoOltrePrimoIncontroInput: positivoOltrePrmoIncontroInput,
  } = getSelectors(container);

  await userEvent.type(speseAvvioInput, '{backspace}{backspace}{backspace}100');
  await userEvent.type(
    spesePostaliInput,
    '{backspace}{backspace}{backspace}100'
  );
  await userEvent.type(
    pagamentoIndennitaInput,
    '{backspace}{backspace}{backspace}100'
  );
  await userEvent.type(
    mancatoAccordoInput,
    '{backspace}{backspace}{backspace}100'
  );
  await userEvent.type(
    positivoPrmoIncontroInput,
    '{backspace}{backspace}{backspace}100'
  );
  await userEvent.type(
    positivoOltrePrmoIncontroInput,
    '{backspace}{backspace}{backspace}100'
  );

  expect(speseAvvioInput).toHaveValue('100,00');
  expect(spesePostaliInput).toHaveValue('100,00');
  expect(pagamentoIndennitaInput).toHaveValue('100,00');
  expect(mancatoAccordoInput).toHaveValue('100,00');
  expect(positivoPrmoIncontroInput).toHaveValue('100,00');
  expect(positivoOltrePrmoIncontroInput).toHaveValue('100,00');
}

async function fillNote(container) {
  const { noteInput } = getSelectors(container);
  await userEvent.type(noteInput, 'NOTE DI ESEMPIO');
  expect(noteInput).toHaveValue('NOTE DI ESEMPIO');
}

async function submitForm() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Crea/i }));
  });
}

const normalizeComune = (comune) => ({
  codice: comune.codice,
  nome: comune.nome,
  nomeStraniero: comune.nomeStraniero,
  codiceCatastale: comune.codiceCatastale,
  cap: comune.cap,
  prefisso: comune.prefisso,
  email: comune.email,
  pec: comune.pec,
  telefono: comune.telefono,
  fax: comune.fax,
  provincia: comune.provincia ? normalizeProvincia(comune.provincia) : undefined,
  coordinate: comune.coordinate ? normalizeCoordinate(comune.coordinate) : undefined,
});

const normalizeProvincia = (provincia) => ({
  codice: provincia.codice,
  nome: provincia.nome,
  sigla: provincia.sigla,
  regione: provincia.regione,
});

const normalizeCoordinate = (coordinate) => ({
  lat: coordinate.lat,
  lng: coordinate.lng,
});

async function verifyCreatedPersona(mockSetPersone, expected) {
  await waitFor(() => {
    const callArguments = mockSetPersone.mock.calls[0][0];

    // Normalizza gli oggetti `luogoDiNascita` e `residenza` che sono istanze di `Comune`
    if (callArguments[0].luogoDiNascita) {
      callArguments[0].luogoDiNascita = normalizeComune(callArguments[0].luogoDiNascita);
    }
    if (callArguments[0].residenza) {
      callArguments[0].residenza = normalizeComune(callArguments[0].residenza);
    }

    // Confronta l'oggetto normalizzato con quello atteso
    expect(callArguments[0]).toMatchObject(expected);
  });
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

test('crea una controparte fisica con i dati essenziali', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);
  const expectedPersonaFisica = {
    nome: 'GIUSEPPE',
    cognome: 'VELDORALE',
    isParteIstante: false,
    rappresentanteLegale: 'RAIMONDO GIUDICE',
    luogoDiNascita: {
      cap: undefined,
      codice: undefined,
      codiceCatastale: undefined,
      email: undefined,
      fax: undefined,
      nome: undefined,
      pec: undefined,
      telefono: undefined,
      provincia: {
        codice: undefined,
        nome: undefined,
        sigla: undefined,
        regione: undefined,
      },
      coordinate: {
        lat: undefined,
        lng: undefined,
      },
    },
    residenza: {
      cap: undefined,
      codice: undefined,
      codiceCatastale: undefined,
      email: undefined,
      fax: undefined,
      nome: undefined,
      pec: undefined,
      telefono: undefined,
      provincia: {
        codice: undefined,
        nome: undefined,
        sigla: undefined,
        regione: undefined,
      },
      coordinate: {
        lat: undefined,
        lng: undefined,
      },
    },
    pagamentoIndennita: 0,
    importoMancatoAccordo: 0,
    importoPositivoPrimoIncontro: 0,
    importoPositivoOltrePrimoIncontro: 0,
  };
  
  // Compila il form
  await fillRuolo('CONTROPARTE');
  await fillCampiObbligatori(container);

  // Invia il form
  await submitForm();

  // Verifica l'oggetto creato atteso
  await verifyCreatedPersona(mockSetPersone, expectedPersonaFisica);
});

test('crea una parte fisica con tutti i campi compilati', async () => {
  const mockSetPersone = jest.fn();
  const mockContextValue = {
    persone: [],
    setPersone: mockSetPersone,
  };

  const { container } = await renderComponent(mockContextValue);

  const expectedPersonaFisica = {
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
    importoPositivoOltrePrimoIncontro: 100,
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

  // Invia il form
  await submitForm();

  // Verifica l'oggetto creato atteso
  await verifyCreatedPersona(mockSetPersone, expectedPersonaFisica);
});
