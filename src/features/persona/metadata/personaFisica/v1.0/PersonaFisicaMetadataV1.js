import { validators } from '@utils';
import PersonaFisicaEnumsV1 from './enums/PersonaFisicaEnumsV1';
import {InputTypes, FieldTypes, ValidationHooksTypes} from '@shared/metadata';

const PersonaFisicaMetadataV1 = {
  type: FieldTypes.PERSONA_FISICA,

  version: '1.0',

  codiceFiscale: {
    key: 'codiceFiscale',
    label: 'Codice fiscale',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.isCodiceFiscale],
  },

  nome: {
    key: 'nome',
    label: 'Nome',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.onlyAlphabetic],
  },

  cognome: {
    key: 'cognome',
    label: 'Cognome',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.onlyAlphabetic],
  },

  dataNascita: {
    key: 'dataNascita',
    label: 'Data di nascita',
    type: FieldTypes.DATE,
    inputType: InputTypes.DATE,
  },

  comuneNascita: {
    key: 'comuneNascita',
    label: 'Comune nascita',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
    freeSolo: false,
    deletable: false,
    creatable: false,
  },

  provinciaNascita: {
    key: 'provinciaNascita',
    label: 'Provincia nascita',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
    deletable: false,
    creatable: false,
  },

  capComuneNascita: {
    key: 'capComuneNascita',
    label: 'CAP',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  sesso: {
    key: 'sesso',
    label: 'Genere',
    type: FieldTypes.STRING,  
    options: PersonaFisicaEnumsV1.sesso,
    inputType: InputTypes.SELECT,
  },

  comuneResidenza: {
    key: 'comuneResidenza',
    label: 'Comune residenza',
    inputType: InputTypes.AUTOCOMPLETE,
    deletable: false,
    creatable: false,
  },

  provinciaResidenza: {
    key: 'provinciaResidenza',
    label: 'Provincia residenza',
    inputType: InputTypes.AUTOCOMPLETE,
    deletable: false,
    creatable: false,
  },

  indirizzoResidenza: {
    key: 'indirizzoResidenza',
    label: 'Indirizzo residenza',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  capComuneResidenza: {
    key: 'capComuneResidenza',
    label: 'CAP',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  partitaIVA: {
    key: 'partitaIVA',
    label: 'Partita IVA',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  pecEmail: {
    key: 'pecEmail',
    label: 'PEC/Email',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  nomeRappresentanteLegale: {
    key: 'nomeRappresentanteLegale',
    label: 'Nome avvocato',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  cognomeRappresentanteLegale: {
    key: 'cognomeRappresentanteLegale',
    label: 'Cognome avvocato',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  pecEmailRappresentanteLegale: {
    key: 'pecEmailRappresentanteLegale',
    label: 'PEC/Email',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  speseAvvio: {
    key: 'speseAvvio',
    label: 'Spese avvio',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  spesePostali: {
    key: 'spesePostali',
    label: 'Spese postali',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  speseIndennita: {
    key: 'speseIndennita',
    label: 'Spese indennità',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  speseMancatoAccordo: {
    key: 'speseMancatoAccordo',
    label: 'Spese mancato accordo',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  spesePositivoPrimoIncontro: {
    key: 'spesePositivoPrimoIncontro',
    label: 'Spese positivo primo incontro',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  spesePositivoOltrePrimoIncontro: {
    key: 'spesePositivoOltrePrimoIncontro',
    label: 'Spese positivo oltre primo incontro',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.IMPORTO,
  },

  note: {
    key: 'note',
    label: 'Note',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  isParteIstante: {
    key: 'isParteIstante',
    label: 'Parte istante',
    type: FieldTypes.BOOLEAN,
  },
};

export default PersonaFisicaMetadataV1;
