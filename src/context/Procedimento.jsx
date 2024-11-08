import * as React from 'react';
import { createContext, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import Backdrop from '@mui/material/Backdrop';
import _ from 'lodash';

import { Procedimento } from '@model/procedimento.js';
import { PersonaFisica } from '@model/personaFisica';
import { PersonaGiuridica } from '@model/personaGiuridica';
import { Comune } from '@model/comune.js';
import NotificationAlert from '@components/NotificationAlert';
import { ProcedimentoMetadata } from '../model/procedimento';
import {
  campiCondizione,
} from '@model/regola';
import { Pipeline } from '@utils/pipeline';
import { rulesApplicator } from '@filters/rulesApplicator';
import { stateRulesUpdater } from '@filters/stateRulesUpdater';

export const ProcedimentoContext = createContext();

function mockedPersone() {
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

  return [
    Object.assign(new PersonaFisica(), {
      nome: 'MARIO',
      cognome: 'ROSSI',
      codiceFiscale: 'RSSMRA85M01H501Z',
      partitaIVA: '12345678911',
      dataNascita: '01/01/1985',
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
      dataNascita: '01/01/1985',
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
      dataNascita: '01/01/1985',
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
  ];
}

function mockedProcedimento() {
  return new Procedimento({
    numProtocollo: '000001',
    annoProtocollo: '2024',
    dataDeposito: new Date(),
    sedeDeposito: 'NOLA',
    sedeSvolgimento: 'SAVIANO',
    dataOraIncontro: dayjs().toISOString(),
    oggettoControversia: 'DIVISIONE',
    valoreControversia: 15000,
  });
}

function mockedRegole() {
  const regoleMockate = [
    {
      espressione: {
        target: {
          key: 'compensoMediatore',
          label: 'Compenso Mediatore',
          type: 'number',
        },
        formula: 'SOMMA SPESE POSTALI DELLE PARTI * 1.2',
      },
      condizioni: [
        {
          campo: {
            key: 'valoreControversia',
            label: 'Valore Controversia',
            type: 'number',
          },
          operatore: '>',
          valore: 1000,
        },
      ],
      stato: 'ATTIVA',
    },
  ];

  return regoleMockate;
}

export const ProcedimentoProvider = ({ children }) => {
  const [procedimento, setProcedimento] = React.useState(new Procedimento());
  const metadatiProcedimento = React.useRef(new ProcedimentoMetadata());
  const [persone, setPersone] = React.useState([]);
  const [regole, setRegole] = React.useState(mockedRegole());
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isBackdropOpen, setIsBackdropOpen] = React.useState(false);
  const rulePipeline = new Pipeline([rulesApplicator, stateRulesUpdater]);

  const notify = (message, severity) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity);
  };

  // Effetti
  React.useEffect(() => {
    // Crea copie profonde di `procedimento` e `regole`
    const procedimentoCopy = _.cloneDeep(procedimento);
    const regoleCopy = _.cloneDeep(regole);
    const ctx = rulePipeline.process({ procedimento, persone, regole });
    console.log('ctx', ctx);

    // Usa una condizione per controllare se lo stato deve essere aggiornato
    if (!_.isEqual(ctx.regole, regoleCopy)) {
      setRegole([...ctx.regole]);
    }
    if (!_.isEqual(ctx.procedimento, procedimentoCopy)) {
      setProcedimento({ ...ctx.procedimento });
    }
  }, [
    ...React.useMemo(
      () => campiCondizione.map((key) => procedimento[key]),
      [procedimento]
    ),
    regole,
  ]);

  return (
    <ProcedimentoContext.Provider
      value={{
        procedimento,
        metadatiProcedimento,
        setProcedimento,
        persone,
        setPersone,
        notify,
        isBackdropOpen,
        setIsBackdropOpen,
        regole,
        setRegole,
      }}
    >
      {children}

      <NotificationAlert
        isOpen={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => {
          setShowAlert(false);
          setAlertMessage(null);
        }}
      />
      <Backdrop open={isBackdropOpen} />
    </ProcedimentoContext.Provider>
  );
};
