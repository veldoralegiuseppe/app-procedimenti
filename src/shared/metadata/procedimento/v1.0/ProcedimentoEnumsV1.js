const ProcedimentoEnumsV1 = {
    esitoMediazione: [
      'IN CORSO',
      'NEGATIVO INCONTRO FILTRO',
      'NEGATIVO MANCATA ADESIONE',
      'NEGATIVO MANCATO ACCORDO',
      'POSITIVO',
    ],
  
    causaleDemandata: [
      'CONDIZIONE DI PROCEDIBILITÀ',
      'DEMANDATA DAL GIUDICE PER IMPROCEDIBILITÀ',
      'DEMANDATA DAL GIUDICE PER LE MATERIE NON OBBLIGATORIE',
      'DEMANDATA DAL GIUDICE PER MANCATA CONCILIAZIONE',
      'VOLONTARIA IN MATERIA DI',
    ],
  
    modalitaSvolgimento: ['PRESENZA', 'TELEMATICA', 'TELEMATICA MISTA'],
  
    oggettoControversia: [
      'ALTRE NATURE DELLA CONTROVERSIA',
      'CONTRATTI BANCARI',
      'CONTRATTI FINANZIARI',
      "CONTRATTI D'OPERA",
      'CONTRATTI DI RETE',
      'CONTRATTI DI SOMMINISTRAZIONE',
      'CONSORZIO',
      'DIRITTI REALI',
      'DIVISIONE',
      'FRANCHISING',
      'LOCAZIONE',
      'PATTI DI FAMIGLIA',
      'RESPONSABILITÀ MEDICA',
      'RISARCIMENTO DANNI MEZZO STAMPA',
      'SUCCESSIONE EREDITARIA',
      'SOCIETÀ DI PERSONE',
      'SUBFORNITURA',
    ],
  
    titoliMediatore: [{ maschile: 'AVV', femminile: 'AVV.SSA' }],
  
    sezione: {
      ISTANZA_MEDIAZIONE: ['numProtocollo', 'dataDeposito', 'valoreControversia', 'oggettoControversia', 'sedeDeposito', 'sedeSvolgimento', 'causaleDemandata', 'esitoMediazione'],
      FISSAZIONE_INCONTRO: ['dataOraIncontro', 'modalitaSvolgimento'],
      MEDIATORE: ['titoloMediatore', 'nomeMediatore', 'cognomeMediatore', 'codiceFiscaleMediatore', 'dataNascitaMediatore', 'luogoNascitaMediatore', 'indirizzoMediatore', 'capMediatore', 'cittaMediatore', 'provinciaMediatore', 'telefonoMediatore', 'emailMediatore'],
    },
  };
  
  export default ProcedimentoEnumsV1;
  