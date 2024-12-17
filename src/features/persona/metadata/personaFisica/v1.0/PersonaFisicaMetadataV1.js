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
    inputValidations: [validators.required, validators.onlyAlphabetic],
  },

  cognome: {
    key: 'cognome',
    label: 'Cognome',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.required, validators.onlyAlphabetic],
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
    freeSolo: false,
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
    freeSolo: false,
    deletable: false,
    creatable: false,
  },

  provinciaResidenza: {
    key: 'provinciaResidenza',
    label: 'Provincia residenza',
    inputType: InputTypes.AUTOCOMPLETE,
    freeSolo: false,
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
    inputValidations: [validators.isEmail],
  },

  nomeRappresentanteLegale: {
    key: 'nomeRappresentanteLegale',
    label: 'Nome avvocato',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.onlyAlphabetic],
  },

  cognomeRappresentanteLegale: {
    key: 'cognomeRappresentanteLegale',
    label: 'Cognome avvocato',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.onlyAlphabetic],
  },

  pecEmailRappresentanteLegale: {
    key: 'pecEmailRappresentanteLegale',
    label: 'PEC/Email',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.isEmail],
  },

  speseAvvio: {
    key: 'speseAvvio',
    label: 'Spese avvio',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'speseAvvio',
      nome: 'Spese avvio',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  spesePostali: {
    key: 'spesePostali',
    label: 'Spese postali',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'spesePostali',
      nome: 'Spese postali',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  speseIndennita: {
    key: 'speseIndennita',
    label: 'Spese indennità',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'speseIndennita',
      nome: 'Spese indennità',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  speseMancatoAccordo: {
    key: 'speseMancatoAccordo',
    label: 'Spese mancato accordo',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'speseMancatoAccordo',
      nome: 'Spese mancato accordo',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  spesePositivoPrimoIncontro: {
    key: 'spesePositivoPrimoIncontro',
    label: 'Spese positivo primo incontro',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'spesePositivoPrimoIncontro',
      nome: 'Spese positivo primo incontro',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  spesePositivoOltrePrimoIncontro: {
    key: 'spesePositivoOltrePrimoIncontro',
    label: 'Spese positivo oltre primo incontro',
    type: FieldTypes.TRANSAZIONE,
    default: {
      key: 'spesePositivoOltrePrimoIncontro',
      nome: 'Spese positivo oltre primo incontro',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },

  note: {
    key: 'note',
    label: 'Note',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    multiline: true,
    rows: 4,
  },

  ruolo: {
    key: 'ruolo',
    label: 'Ruolo',
    type: FieldTypes.STRING,
    inputType: InputTypes.RADIO_GROUP,
    options: PersonaFisicaEnumsV1.ruolo,
  },
};

export default PersonaFisicaMetadataV1;
