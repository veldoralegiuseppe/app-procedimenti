import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { validators } from '@utils/validators';

export class Procedimento {
  constructor({
    numProtocollo,
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
    const metadati = { ...metadatiProcedimento, className: this.name };
    return key ? metadati[key] : metadati;
  }

  validateRequiredFields(){
    if (!this.dataDeposito) {
      throw new Error('La data di deposito è obbligatoria.');
    }

    if (!this.sedeDeposito) {
      throw new Error('La sede di deposito è obbligatoria.');
    }

    if (!this.oggettoControversia) {
      throw new Error('L\'oggetto della controversia è obbligatorio.');
    }

    if (!this.valoreControversia) {
      throw new Error('Il valore della controversia è obbligatorio.');
    }
  }

  validateIncontro() {
    if (this.dataOraIncontro && this.dataDeposito) {
      const dataDeposito = dayjs(this.dataDeposito);
      const dataOraIncontro = dayjs(this.dataOraIncontro);
      if (dataOraIncontro.isBefore(dataDeposito)) {
        throw new Error('La data e ora dell\'incontro non può essere precedente alla data di deposito.');
      }
    }
  }

  validateValoreControversia(){
    if (this.valoreControversia < 80) {
      throw new Error('Il valore della controversia non può essere inferiore a 80.');
    }
  }

  validateDemandata(){
    if (this.isDemandata && !this.causaleDemandata) {
      throw new Error('La causale della demandata è obbligatoria.');
    }

    if (this.causaleDemandata === 'VOLONTARIA IN MATERIA DI' && !this.materiaCausaleDemandata) {
      throw new Error('La materia della causale demandata è obbligatoria quando la causale è "VOLONTARIA IN MATERIA DI".');
    }

  }

  validateCompensoMediatore(){
    if (this.compensoMediatore > this.valoreControversia) {
      throw new Error('Il compenso del mediatore non può essere superiore al valore della controversia.');
    }
  }

  validateSpeseSedeSecondaria(){
    if (this.speseAvvioSedeSecondaria > this.valoreControversia) {
      throw new Error('Le spese di avvio della sede secondaria non possono essere superiori al valore della controveria.');
    }

    if (this.speseIndennitaSedeSecondaria > this.valoreControversia) {
      throw new Error('Le spese di indennità della sede secondaria non possono essere superiori al valore della controveria.');
    }
  }

  validate() {
    this.validateRequiredFields();
    this.validateIncontro();
    this.validateValoreControversia();
    this.validateDemandata();
    this.validateCompensoMediatore();
    this.validateSpeseSedeSecondaria();
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

const SEZIONI = {
  ISTANZA_MEDIAZIONE: 'Istanza di mediazione',
  FISSAZIONE_INCONTRO: 'Fissazione incontro',
  MEDIATORE: 'Mediatore',
};

const metadatiProcedimento = {
  numProtocollo: {
    key: 'numProtocollo',
    label: 'Numero protocollo',
    type: 'string',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
  },
  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data deposito',
    type: 'date',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede deposito',
    type: 'string',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede svolgimento',
    type: 'string',
    sezione: SEZIONI.FISSAZIONE_INCONTRO,
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e ora incontro',
    type: 'datetime',
    sezione: SEZIONI.FISSAZIONE_INCONTRO,
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
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
    options: oggettiControversia,
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore controversia',
    type: 'number',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
    validation: (value) => {
      return [
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito mediazione',
    type: 'string',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
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
    sezione: SEZIONI.FISSAZIONE_INCONTRO,
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
    sezione: SEZIONI.MEDIATORE,
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
    sezione: SEZIONI.MEDIATORE,
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
    sezione: SEZIONI.MEDIATORE,
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
    sezione: SEZIONI.FISSAZIONE_INCONTRO,
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Compenso mediatore',
    type: 'number',
    sezione: SEZIONI.MEDIATORE,
    validation: (value) => {
      return [
        validators.onlyNumber(value),
      ].filter((result) => result !== true);
    },
  },
  // isDemandata: {
  //   key: 'isDemandata',
  //   label: 'È Demandata',
  //   type: 'boolean',
  //   sezione: 'Istanza di mediazione',
  // },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale demandata',
    type: 'string',
    sezione: SEZIONI.ISTANZA_MEDIAZIONE,
    options: causaliDemandata,
    validation: (value) => {
      return [
        validators.onlyAlphabetic(value),
      ].filter((result) => result !== true);
    },
  },
  // materiaCausaleDemandata: {
  //   key: 'materiaCausaleDemandata',
  //   label: 'Materia causale demandata',
  //   type: 'string',
  //   sezione: 'Istanza di mediazione',
  //   validation: (value) => {
  //     return [
  //       validators.onlyAlphanumeric(value),
  //     ].filter((result) => result !== true);
  //   },
  // },
  // speseAvvioSedeSecondaria: {
  //   key: 'speseAvvioSedeSecondaria',
  //   label: 'Spese avvio sede secondaria',
  //   type: 'number',
  //   sezione: 'DATI GENERALI',
  //   validation: (value) => {
  //     return [
  //       validators.onlyNumber(value),
  //     ].filter((result) => result !== true);
  //   },
  // },
  // speseIndennitaSedeSecondaria: {
  //   key: 'speseIndennitaSedeSecondaria',
  //   label: 'Spese indennità sede secondaria',
  //   type: 'number',
  //   sezione: 'DATI GENERALI',
  //   validation: (value) => {
  //     return [
  //       validators.onlyNumber(value),
  //     ].filter((result) => result !== true);
  //   },
  // },
};
