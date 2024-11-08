import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { validators } from '@utils/validators';

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

  static getMetadati(key) {
    return key ? metadatiProcedimento[key] : metadatiProcedimento;
  }
}

// Constants
const esitiMediazione = [
  'IN CORSO',
  'NEGATIVO INCONTRO FILTRO',
  'NEGATIVO MANCATA ADESIONE',
  'NEGATIVO MANCATO ACCORDO',
  'POSITIVO',
];

const causaliDemandata = [
  'CONDIZIONE DI PROCEDIBILITÀ',
  'DEMANDATA DAL GIUDICE PER IMPROCEDIBILITÀ',
  'DEMANDATA DAL GIUDICE PER LE MATERIE NON OBBLIGATORIE',
  'DEMANDATA DAL GIUDICE PER MANCATA CONCILIAZIONE',
  'VOLONTARIA IN MATERIA DI',
];

const modalitaSvolgimento = ['PRESENZA', 'TELEMATICA', 'TELEMATICA MISTA'];

const oggettiControversia = [
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

const titoliMediatore = [{ maschile: 'AVV', femminile: 'AVV.SSA' }];

const metadatiProcedimento = {
  numProtocollo: {
    key: 'numProtocollo',
    label: 'Numero protocollo',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  annoProtocollo: {
    key: 'annoProtocollo',
    label: 'Anno protocollo',
    type: 'string',
    descrizione: 'DATI GENERALI',
  },
  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data deposito',
    type: 'date',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.required(value),
      ].filter((result) => result !== true);
    },
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede deposito',
    type: 'string',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.required(value),
        validators.onlyAlphanumeric(value),
      ].filter((result) => result !== true);
    },
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede svolgimento',
    type: 'string',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyAlphanumeric(value),
      ].filter((result) => result !== true);
    },
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e ora incontro',
    type: 'datetime',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.isDateTime(value),
      ].filter((result) => result !== true);
    },
  },
  oggettoControversia: {
    key: 'oggettoControversia',
    label: 'Oggetto controversia',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: oggettiControversia,
    validation: (value) => {
      return [
        validators.required(value),
      ].filter((result) => result !== true);
    },
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore controversia',
    type: 'number',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.required(value),
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito mediazione',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: esitiMediazione,
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  modalitaSvolgimento: {
    key: 'modalitaSvolgimento',
    label: 'Modalità svolgimento',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: modalitaSvolgimento,
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  nomeMediatore: {
    key: 'nomeMediatore',
    label: 'Nome mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  cognomeMediatore: {
    key: 'cognomeMediatore',
    label: 'Cognome mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  titoloMediatore: {
    key: 'titoloMediatore',
    label: 'Titolo mediatore',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: titoliMediatore,
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  totaleIncontri: {
    key: 'totaleIncontri',
    label: 'Totale incontri',
    type: 'number',
    descrizione: 'DATI GENERALI',
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Compenso mediatore',
    type: 'number',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
  isDemandata: {
    key: 'isDemandata',
    label: 'È Demandata',
    type: 'boolean',
    descrizione: 'DATI GENERALI',
  },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale demandata',
    type: 'string',
    descrizione: 'DATI GENERALI',
    options: causaliDemandata,
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  materiaCausaleDemandata: {
    key: 'materiaCausaleDemandata',
    label: 'Materia causale demandata',
    type: 'string',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyAlphanumeric(value),
      ].filter((result) => result !== true);
    },
  },
  speseAvvioSedeSecondaria: {
    key: 'speseAvvioSedeSecondaria',
    label: 'Spese avvio sede secondaria',
    type: 'number',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
  speseIndennitaSedeSecondaria: {
    key: 'speseIndennitaSedeSecondaria',
    label: 'Spese indennità sede secondaria',
    type: 'number',
    descrizione: 'DATI GENERALI',
    validation: (value) => {
      return [
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
};
