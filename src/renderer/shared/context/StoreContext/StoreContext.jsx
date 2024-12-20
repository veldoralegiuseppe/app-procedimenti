import React, { createContext } from 'react';
import { useProcedimento } from '@features/procedimento';
import { usePersone, usePersona } from '@features/persona';
import { useCreateStore } from '@shared/hooks';
import { FieldTypes } from '@shared/metadata';
import { ModelFactory } from '@shared/components';

export const StoreContext = createContext();

const procedimentoTest = {
  numProtocollo: '000001/2024', // Numero di protocollo
  dataDeposito: '2024-12-19', // Data di deposito
  valoreControversia: 80, // Valore numerico della controversia
  oggettoControversia: 'ALTRE NATURE DELLA CONTROVERSIA', // Natura della controversia
  sedeDeposito: 'NOLA', // Sede di deposito
  sedeSvolgimento: 'NOLA', // Sede di svolgimento
  causaleDemandata: 'CONDIZIONE DI PROCEDIBILITÀ', // Causale della domanda
  esitoMediazione: 'IN CORSO', // Stato dell'esito della mediazione
  dataOraIncontro: undefined, // Data e ora incontro, non specificato
  modalitaSvolgimento: 'PRESENZA', // Modalità di svolgimento
  titoloMediatore: 'AVV', // Titolo del mediatore
  nomeMediatore: 'RAIMONDO', // Nome del mediatore
  cognomeMediatore: 'GIUDICE', // Cognome del mediatore
  compensoMediatore: {
    // Dettagli sul compenso del mediatore
    nome: 'Spese mediatore',
    key: 'compensoMediatore',
    stato: 'DA SALDARE',
    tipo: 'USCITA',
    importoDovuto: 10,
    importoCorrisposto: 0,
    type: 'transazione', 
    version: '1.0',
  },
  speseAvvioSedeSecondaria: {
    // Dettagli sulle spese per avvio sede secondaria
    nome: 'Spese avvio sede secondaria',
    key: 'speseAvvioSedeSecondaria',
    stato: 'DA SALDARE',
    tipo: 'USCITA',
    importoDovuto: 15,
    importoCorrisposto: 0,
    type: 'transazione', 
    version: '1.0',
  },
  speseIndennitaSedeSecondaria: {
    // Dettagli sulle spese di indennità
    nome: 'Spese indennità sede secondaria',
    key: 'speseIndennitaSedeSecondaria',
    stato: 'DA SALDARE',
    tipo: 'USCITA',
    importoDovuto: 19,
    importoCorrisposto: 0,
    type: 'transazione', 
    version: '1.0',
  },
  type: 'procedimento', // Tipo di procedura
  version: '1.0', // Versione del metadato
};

const personaFisicaTest = {
  capComuneNascita: 84088, // CAP del comune di nascita
  capComuneResidenza: 84088, // CAP del comune di residenza
  codiceFiscale: 'VLDGPP97E16F138C', // Codice fiscale
  cognome: 'VELDORALE', // Cognome
  nome: 'GIUSEPPE', // Nome
  comuneNascita: 'MERCATO SAN SEVERINO', // Comune di nascita
  comuneResidenza: 'SIANO', // Comune di residenza
  dataNascita: '1997-05-16', // Data di nascita
  indirizzoResidenza: 'VIALE EUROPA 168', // Indirizzo di residenza
  provinciaNascita: 'SALERNO', // Provincia di nascita
  provinciaResidenza: 'SALERNO', // Provincia di residenza
  ruolo: 'PARTE ISTANTE', // Ruolo
  sesso: 'UOMO', // Sesso
  partitaIVA: '11111111111', // Partita IVA
  pecEmail: 'VELDORALE.GIUSEPPE@GMAIL.COM', // PEC email
  cognomeRappresentanteLegale: 'GIUDICE', // Cognome del rappresentante legale
  nomeRappresentanteLegale: 'RAIMONDO', // Nome del rappresentante legale
  pecEmailRappresentanteLegale: 'RAIMONDO.GIUDICE@GMAIL.COM', // PEC email del rappresentante legale
  note: 'NOTE AGGIUNTIVE', // Note aggiuntive
  ruolo: 'PARTE ISTANTE', // Ruolo

  // Spese
  speseAvvio: {
    nome: 'Spese avvio',
    key: 'speseAvvio',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },
  speseIndennita: {
    nome: 'Spese indennità',
    key: 'speseIndennita',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },
  speseMancatoAccordo: {
    nome: 'Spese mancato accordo',
    key: 'speseMancatoAccordo',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },
  spesePositivoOltrePrimoIncontro: {
    nome: 'Spese positivo oltre primo incontro',
    key: 'spesePositivoOltrePrimoIncontro',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },
  spesePositivoPrimoIncontro: {
    nome: 'Spese positivo primo incontro',
    key: 'spesePositivoPrimoIncontro',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },
  spesePostali: {
    nome: 'Spese postali',
    key: 'spesePostali',
    stato: 'DA SALDARE',
    tipo: undefined,
    importoDovuto: 1,
    importoCorrisposto: 0,
  },

  type: 'personaFisica', // Tipo di entità
  version: '1.0', // Versione dei metadati
};

const StoreProvider = ({ children }) => {
  const procedimentoStore = useCreateStore({
    storeInterface: useProcedimento,
    initialModel: ModelFactory.create({type: FieldTypes.PROCEDIMENTO}),
  });
  const personeStore = useCreateStore({ storeInterface: usePersone, initialItems: [] });
  const personaFisicaStore = useCreateStore({
    storeInterface: usePersona,
    initialModel: ModelFactory.create({ type: FieldTypes.PERSONA_FISICA }),
  });
  const personaGiuridicaStore = useCreateStore({
    storeInterface: usePersona,
    initialModel: ModelFactory.create({ type: FieldTypes.PERSONA_GIURIDICA }),
  });

  const compose = React.useCallback(() => {
    const procedimento = procedimentoStore.getState().getModel();
    const persone = personeStore.getState().getItems();

    return {...procedimento, persone};
  }, [procedimentoStore, personeStore]);

  const storeMap = React.useMemo(
    () => ({
      [FieldTypes.PROCEDIMENTO]: procedimentoStore,
      [FieldTypes.PERSONE]: personeStore,
      [FieldTypes.PERSONA_FISICA]: personaFisicaStore,
      [FieldTypes.PERSONA_GIURIDICA]: personaGiuridicaStore,
    }),
    [procedimentoStore]
  );

  return (
    <StoreContext.Provider value={{ storeMap, compose }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
