import { validators } from '@utils';
import PersonaGiuridicaEnumsV1 from './enums/PersonaGiuridicaEnumsV1';
import {InputTypes, FieldTypes, ValidationHooksTypes} from '@shared/metadata';

const PersonaGiuridicaMetadataV1 = {
  type: FieldTypes.PERSONA_FISICA,

  version: '1.0',

  denominazione: {
    key: 'denominazione',
    label: 'Denominazione',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    inputValidations: [validators.required, validators.onlyAlphanumeric],
  },


  comuneSedeLegale: {
    key: 'comuneSedeLegale',
    label: 'Comune',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
    freeSolo: false,
    deletable: false,
    creatable: false,
  },

  provinciaSedeLegale: {
    key: 'provinciaSedeLegale',
    label: 'Provincia',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
    freeSolo: false,
    deletable: false,
    creatable: false,
  },

  capComuneSedeLegale: {
    key: 'capComuneSedeLegale',
    label: 'CAP',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
  },

  indirizzoSedeLegale: {
    key: 'indirizzoSedeLegale',
    label: 'Indirizzo',
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
    options: PersonaGiuridicaEnumsV1.ruolo,
  },
};

export default PersonaGiuridicaMetadataV1;
