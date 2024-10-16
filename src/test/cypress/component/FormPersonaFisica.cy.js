import React from 'react';
import { mount } from 'cypress/react';
import { ThemeProvider } from '@mui/material/styles';
import { ProcedimentoContext } from '@context/Procedimento';
import FormPersonaFisica from '@pages/FormPersonaFisica';
import { themeOne } from '@theme/MainTheme';
import * as ComuniUtils from '@assets/js/comuni';
import {
  provinceCampania,
  comuniCampania,
} from '../../mock/mockProvinceComuni';

describe('Test di FormPersonaFisica', () => {
  let mockSetPersone;
  let mockContextValue;

  // Usa beforeEach per impostare i mock e montare il componente prima di ogni test
  beforeEach(() => {
    mockSetPersone = cy.stub(); // Stub deve essere all'interno di beforeEach
    mockContextValue = {
      persone: [],
      setPersone: mockSetPersone,
    };

    // Stub delle chiamate alle API all'interno del contesto del test
    cy.stub(ComuniUtils, 'getProvince').resolves(provinceCampania);
    cy.stub(ComuniUtils, 'getComuni').resolves(comuniCampania);
    cy.stub(ComuniUtils, 'findComuneByCodiceCatastale').callsFake((codice) =>
      Promise.resolve(
        comuniCampania.find((comune) => comune.codiceCatastale === codice)
      )
    );

    // Monta il componente
    mount(
      <ProcedimentoContext.Provider value={mockContextValue}>
        <ThemeProvider theme={themeOne}>
          <FormPersonaFisica />
        </ThemeProvider>
      </ProcedimentoContext.Provider>
    );
  });

  it('Verifica dei campi obbligatori', () => {
    const campiObbligatori = {
      Nome: 'pf-nome',
      Cognome: 'pf-cognome',
      Avvocato: 'pf-avvocato',
    };

    for (let label in campiObbligatori) {
      cy.get(`#${campiObbligatori[label]}`)
        .should('exist')
        .and('have.value', '')
        .and('have.attr', 'required');
    }
  });

  it.only('Abilita il campo Comune di residenza quando una provincia è selezionata', () => {
    // Intercetta la chiamata API per le province e restituisci una risposta mockata
    cy.intercept('GET', 'https://axqvoqvbfjpaamphztgd.functions.supabase.co/province', {
      statusCode: 200,
      body: provinceCampania,
    }).as('getProvince');

    // Intercetta la chiamata API per i comuni e restituisci una risposta mockata
    cy.intercept('GET', 'https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni', {
      statusCode: 200,
      body: comuniCampania,
    }).as('getComuni');

    cy.get('#pf-provincia-residenza')
      .click()
      .type('SALERNO')
      .type('{downarrow}')
      .type('{enter}');
    cy.get('#pf-provincia-residenza').should('have.value', 'SALERNO');
    cy.get('#pf-comune-residenza').should('not.be.disabled');
    cy.get('#pf-comune-residenza')
      .click()
      .type('MERCATO SAN SEVERINO')
      .type('{downarrow}')
      .type('{enter}');
    cy.get('#pf-comune-residenza').should('have.value', 'MERCATO SAN SEVERINO');
  });

  it('Dati anagrafici pre-compilati se il codice fiscale è specificato e corretto', () => {
    const codiceFiscale = 'VLDGPP97E16F138C';
    const campiAnagrafici = {
      'pf-data-nascita': '16/05/1997',
      'pf-sesso': 'M',
      'pf-provincia-nascita': 'SALERNO',
      'pf-comune-nascita': 'MERCATO SAN SEVERINO',
    };

    cy.get('#pf-cf').type(codiceFiscale);

    Object.keys(campiAnagrafici).forEach((campo) => {
      cy.get(`#${campo}`).should('have.value', campiAnagrafici[campo]);
    });
  });

  it('Dati anagrafici vuoti se il codice fiscale specificato è errato', () => {
    const codiceFiscaleErrato = 'XXXXXXXXXXXXXXXX';
    const campiAnagrafici = {
      'pf-data-nascita': '',
      'pf-sesso': '',
      'pf-provincia-nascita': '',
      'pf-comune-nascita': '',
    };

    cy.get('#pf-cf').type(codiceFiscaleErrato);
    cy.get('#pf-cf')
      .should('have.value', codiceFiscaleErrato)
      .and('have.attr', 'aria-invalid', 'true');

    Object.keys(campiAnagrafici).forEach((campo) => {
      cy.get(`#${campo}`).should('have.value', campiAnagrafici[campo]);
    });
  });
});
