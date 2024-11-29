import React, {useMemo, useCallback} from 'react';
import { createContext, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import Backdrop from '@mui/material/Backdrop';
import _ from 'lodash';

import { PersonaFisica, PersonaGiuridica } from '@features/persona';
import { Comune } from '@shared/factories';
import {NotificationAlert} from '@shared/components';

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
  return{
    numProtocollo: '000001',
    annoProtocollo: '2024',
    dataDeposito: new Date(),
    sedeDeposito: 'NOLA',
    sedeSvolgimento: 'SAVIANO',
    dataOraIncontro: dayjs().toISOString(),
    oggettoControversia: 'DIVISIONE',
    valoreControversia: 15000,
  };
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

const ProcedimentoProvider = ({ children }) => {

  // Stati locali
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [alertMessage, setAlertMessage] = useState(null);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

  // Funzione per notifiche
  const notify = useCallback((message, severity) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity);
  }, []);
  
  // Valori del contesto
  const contextValue = useMemo(
    () => ({
      notify,
      isBackdropOpen,
      setIsBackdropOpen,
    }),
    [notify, isBackdropOpen]
  );

  return (
    <ProcedimentoContext.Provider value={contextValue}>
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

//ProcedimentoProvider.whyDidYouRender = true;

export {ProcedimentoProvider};
