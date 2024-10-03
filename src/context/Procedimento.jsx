import * as React from 'react';
import { createContext, useState } from 'react';
import { Procedimento } from '@model/procedimento.js';
import { PersonaFisica } from '@model/personaFisica';
import { PersonaGiuridica } from '@model/personaGiuridica';
import { Comune } from '@model/comune.js';

export const ProcedimentoContext = createContext();

const mockProcedimento = Object.assign(new Procedimento(), {
  numProtocollo: '000001',
  annoProtocollo: '2024',
  dataDeposito: '23/01/2024',
  sede: 'Roma',
  sedeSvolgimento: 'Roma - Sede Centrale',
  dataOraIncontro: '23/02/2024 10:30',
  oggettoControversia: 'Controversia per mancato pagamento',
  valoreControversia: 15000
});

  // Mock per Comune (per PersonaFisica e PersonaGiuridica)
  const mockComuneRoma = new Comune({
    codice: '001',
    nome: 'Roma',
    nomeStraniero: 'Rome',
    codiceCatastale: 'H501',
    cap: '00100',
    prefisso: '06',
    provincia: { nome: 'Roma', regione: 'Lazio', sigla: 'RM' },
    email: 'comune.roma@email.it',
    pec: 'pec@comuneroma.it',
    telefono: '06 123456',
    fax: '06 654321',
    coordinate: { lat: 41.9027835, lng: 12.4963655 },
  });

  const mockComuneMilano = new Comune({
    codice: '002',
    nome: 'Milano',
    nomeStraniero: 'Milan',
    codiceCatastale: 'F205',
    cap: '20100',
    prefisso: '02',
    provincia: { nome: 'Milano', regione: 'Lombardia', sigla: 'ML' },
    email: 'comune.milano@email.it',
    pec: 'pec@comunemilano.it',
    telefono: '02 987654',
    fax: '02 654321',
    coordinate: { lat: 45.4642035, lng: 9.189982 },
  });

export const ProcedimentoProvider = ({ children }) => {

  const [procedimento, setProcedimento] = useState(mockProcedimento);
  const [persone, setPersone] = useState([
    Object.assign(new PersonaFisica(), {
      nome: 'MARIO',
      cognome: 'ROSSI',
      codiceFiscale: 'RSSMRA85M01H501Z',
      partitaIVA: '12345678911',
      dataNascitaLocale: '01/01/1985',
      luogoDiNascita: mockComuneRoma,
      residenza: mockComuneRoma,
      indirizzo: 'Via Roma, 1',
      pecEmail: 'mario.rossi@pec.it',
      speseAvvio: 1000,
      spesePostali: 50,
      pagamentoIndennita: 200,
      importoMancatoAccordo: 5000,
      importoPositivoPrimoIncontro: 3000,
      importoPositivoOltrePrimoIncontro: 7000,
      note: 'Nota di prova',
      isParteIstante: true,
      rappresentanteLegale: 'RAIMONDO GIUDICE',
      rappresentanteLegalePecEmail: 'raimondo.giudice@gmail.com',
      sesso: 'UOMO',
    }),

    Object.assign(new PersonaFisica(), {
      nome: 'MARIO',
      cognome: 'ROSSI',
      codiceFiscale: 'RSSMRA85M01H501Z',
      partitaIVA: '12345678911',
      dataNascitaLocale: '01/01/1985',
      luogoDiNascita: mockComuneRoma,
      residenza: mockComuneRoma,
      indirizzo: 'Via Roma, 1',
      pecEmail: 'mario.rossi@pec.it',
      speseAvvio: 1000,
      spesePostali: 50,
      pagamentoIndennita: 200,
      importoMancatoAccordo: 5000,
      importoPositivoPrimoIncontro: 3000,
      importoPositivoOltrePrimoIncontro: 7000,
      note: 'Nota di prova',
      isParteIstante: true,
      rappresentanteLegale: 'RAIMONDO GIUDICE',
      rappresentanteLegalePecEmail: 'raimondo.giudice@gmail.com',
      sesso: 'UOMO',
    }),

    Object.assign(new PersonaFisica(), {
      nome: 'MARIO',
      cognome: 'ROSSI',
      codiceFiscale: 'RSSMRA85M01H501Z',
      partitaIVA: '12345678911',
      dataNascitaLocale: '01/01/1985',
      luogoDiNascita: mockComuneRoma,
      residenza: mockComuneRoma,
      indirizzo: 'Via Roma, 1',
      pecEmail: 'mario.rossi@pec.it',
      speseAvvio: 1000,
      spesePostali: 50,
      pagamentoIndennita: 200,
      importoMancatoAccordo: 5000,
      importoPositivoPrimoIncontro: 3000,
      importoPositivoOltrePrimoIncontro: 7000,
      note: 'Nota di prova',
      isParteIstante: false,
      rappresentanteLegale: 'RAIMONDO GIUDICE',
      rappresentanteLegalePecEmail: 'raimondo.giudice@gmail.com',
      sesso: 'UOMO',
    }),

    Object.assign(new PersonaGiuridica(), {
      partitaIVA: '98765432109',
      denominazione: 'Impresa ABC S.p.A.',
      sedeLegale: mockComuneMilano,
      indirizzoSedeLegale: 'Via Milano, 100',
      pecEmail: 'info@impresaabc.it',
      rappresentanteLegale: 'Luca Bianchi',
      rappresentanteLegalePecEmail: 'luca.bianchi@impresaabc.it',
      speseAvvio: 1500,
      spesePostali: 100,
      pagamentoIndennita: 500,
      importoMancatoAccordo: 8000,
      importoPositivoPrimoIncontro: 4000,
      importoPositivoOltrePrimoIncontro: 10000,
      note: 'Queste sono note di esempio.',
      rappresentanteLegale: 'RAIMONDO GIUDICE',
      rappresentanteLegalePecEmail: 'raimondo.giudice@gmail.com',
      isParteIstante: false,
    }),
  ]);

  return (
    <ProcedimentoContext.Provider
      value={{ procedimento, setProcedimento, persone, setPersone }}
    >
      {children}
    </ProcedimentoContext.Provider>
  );
};
