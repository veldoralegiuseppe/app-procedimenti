import dayjs from 'dayjs';
import 'dayjs/locale/it';

export class Procedimento {
  constructor({
    numProtocollo,
    annoProtocollo = String(new Date().getFullYear()),
    dataDeposito = new Date().toDateString(),
    sedeDeposito,
    sedeSvolgimento,
    dataOraIncontro = null,
    oggettoControversia,
    valoreControversia = 0,
    esitoMediazione,
    modalitaSvolgimento,
    nomeMediatore,
    cognomeMediatore,
    titoloMediatore,
    totaleIncontri = 0,
    incassoParti = 0,
    incassoControparti = 0,
    compensoMediatore = 0,
    speseAvvioSedeSecondaria = 0,
    speseIndennitaSedeSecondaria = 0,
    isDemandata = false,
    causaleDemandata,
    materiaCausaleDemandata,
  } = {}) {
    this.numProtocollo = numProtocollo;
    this.annoProtocollo = annoProtocollo;
    this.dataDeposito = dataDeposito;
    this.sedeDeposito = sedeDeposito;
    this.sedeSvolgimento = sedeSvolgimento;
    this.dataOraIncontro = dataOraIncontro;
    this.oggettoControversia = oggettoControversia;
    this.valoreControversia = valoreControversia;
    this.esitoMediazione = esitoMediazione;
    this.modalitaSvolgimento = modalitaSvolgimento;
    this.totaleIncontri = totaleIncontri;
    this.nomeMediatore = nomeMediatore;
    this.cognomeMediatore = cognomeMediatore;
    this.titoloMediatore = titoloMediatore;
    this.isDemandata = isDemandata;
    this.causaleDemandata = causaleDemandata;
    this.materiaCausaleDemandata = materiaCausaleDemandata;
    this.incassoParti = incassoParti;
    this.incassoControparti = incassoControparti;
    this.compensoMediatore = compensoMediatore;
    this.speseAvvioSedeSecondaria = speseAvvioSedeSecondaria;
    this.speseIndennitaSedeSecondaria = speseIndennitaSedeSecondaria;
  }

  getProtocollo() {
    return this.numProtocollo && this.annoProtocollo
      ? `${this.numProtocollo}/${this.annoProtocollo}`
      : null;
  }

  equals(p) {
    if (!p || !(p instanceof Procedimento)) return false;
    return JSON.stringify(this) === JSON.stringify(p);
  }

  getDataDepositoLocale() {
    return this.dataDeposito
      ? dayjs(this.dataDeposito).format('DD/MM/YYYY')
      : null;
  }

  getDataOraIncontroLocale() {
    return this.dataOraIncontro
      ? dayjs(this.dataOraIncontro).format('DD/MM/YYYY HH:mm')
      : null;
  }

  static getMetadati() {
    return metadatiProcedimento;
  }
}

const metadatiProcedimento = {
  numProtocollo: {
    key: 'numProtocollo',
    label: 'Numero Protocollo',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  annoProtocollo: {
    key: 'annoProtocollo',
    label: 'Anno Protocollo',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data Deposito',
    type: 'date',
    descrizione: 'DATI GENERALI',
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede Deposito',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede Svolgimento',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e Ora Incontro',
    type: 'datetime',
    descrizione: 'DATI GENERALI',
  },
  oggettoControversia: {
    key: 'oggettoControversia',
    label: 'Oggetto Controversia',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: oggettiControversia,
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore Controversia',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito Mediazione',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: esitiMediazione,
  },
  modalitaSvolgimento: {
    key: 'modalitaSvolgimento',
    label: 'Modalità Svolgimento',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: modalitaSvolgimento,
  },
  nomeMediatore: {
    key: 'nomeMediatore',
    label: 'Nome Mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  cognomeMediatore: {
    key: 'cognomeMediatore',
    label: 'Cognome Mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  titoloMediatore: {
    key: 'titoloMediatore',
    label: 'Titolo Mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  totaleIncontri: {
    key: 'totaleIncontri',
    label: 'Totale Incontri',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  incassoParti: {
    key: 'incassoParti',
    label: 'Incasso Parti',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  incassoControparti: {
    key: 'incassoControparti',
    label: 'Incasso Controparti',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Compenso mediatore',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  isDemandata: {
    key: 'isDemandata',
    label: 'È Demandata',
    type: 'boolean',
    descrizione: 'DATI GENERALI',
  },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale Demandata',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: causaliDemandata,
  },
  materiaCausaleDemandata: {
    key: 'materiaCausaleDemandata',
    label: 'Materia Causale Demandata',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  speseAvvioSedeSecondaria: {
    key: 'speseAvvioSedeSecondaria',
    label: 'Spese avvio sede secondaria',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  speseIndennitaSedeSecondaria: {
    key: 'speseIndennitaSedeSecondaria',
    label: 'Spese indennità sede secondaria',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
};
export const sedePrincipale = 'NOLA';

export const esitiMediazione = [
  'IN CORSO',
  'NEGATIVO INCONTRO FILTRO',
  'NEGATIVO MANCATA ADESIONE',
  'NEGATIVO MANCATO ACCORDO',
  'POSITIVO',
];

export const causaliDemandata = [
  'CONDIZIONE DI PROCEDIBILITÀ',
  'DEMANDATA DAL GIUDICE PER IMPROCEDIBILITÀ',
  'DEMANDATA DAL GIUDICE PER LE MATERIE NON OBBLIGATORIE',
  'DEMANDATA DAL GIUDICE PER MANCATA CONCILIAZIONE',
  'VOLONTARIA IN MATERIA DI',
];

export const modalitaSvolgimento = [
  'PRESENZA',
  'TELEMATICA',
  'TELEMATICA MISTA',
];

export const oggettiControversia = [
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
];
