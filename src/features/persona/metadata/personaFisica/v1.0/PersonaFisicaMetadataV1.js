import { validators } from '@utils';
import {InputTypes, FieldTypes, ValidationHooksTypes} from '@shared/metadata';

const PersonaFisicaMetadataV1 = {
  type: FieldTypes.PEERSONA_FISICA,

  version: '1.0',

  codiceFiscale: {
    key: 'codiceFiscale',
    label: 'Codice fiscale',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.required],
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
    label: 'Data di nasita',
    type: FieldTypes.DATE,
    inputType: InputTypes.DATE,
  },

  luogoDiNascita: {
    key: 'luogoDiNascita',
    label: 'Luogo di nascita',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  sesso: {
    key: 'sesso',
    label: 'Sesso',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  residenza: {
    key: 'residenza',
    label: 'Residenza',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  indirizzoResidenza: {
    key: 'indirizzoResidenza',
    label: 'Indirizzo residenza',
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
    label: 'PEC email',
    type: FieldTypes.STRING,
    inputType: InputTypes.EMAIL,
  },

  rappresentanteLegale: {
    key: 'rappresentanteLegale',
    label: 'Rappresentante legale',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  rappresentanteLegalePecEmail: {
    key: 'rappresentanteLegalePecEmail',
    label: 'PEC/Email',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  speseAvvio: {
    key: 'speseAvvio',
    label: 'Spese avvio',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
  },

  spesePostali: {
    key: 'spesePostali',
    label: 'Spese postali',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
  },

  speseIndennita: {
    key: 'speseIndennita',
    label: 'Spese indennità',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
  },

  speseMancatoAccordo: {
    key: 'speseMancatoAccordo',
    label: 'Spese mancato accordo',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
  },

  spesePositivoPrimoIncontro: {
    key: 'spesePositivoPrimoIncontro',
    label: 'Spese positivo primo incontro',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
  },

  spesePositivoOltrePrimoIncontro: {
    key: 'spesePositivoOltrePrimoIncontro',
    label: 'Spese positivo oltre primo incontro',
    type: FieldTypes.NUMBER,
    default: 0,
    inputType: InputTypes.NUMBER,
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
