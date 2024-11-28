import { validators } from '@utils';
import TransazioneEnums from './enums/TransazioneEnums';

const TransazioneMetadataV1 = {
  nome: {
    key: 'nome',
    label: 'Nome',
    type: 'string',
    validations: {
      onConstruction: [validators.required, validators.onlyAlphanumeric],
      onPersistence: [validators.required, validators.onlyAlphanumeric],
    },
  },

  stato: {
    key: 'stato',
    label: 'Stato',
    type: 'string',
    default: TransazioneEnums.stato.DA_SALDARE,
    validations: {
      onConstruction: [
        (value) => Object.values(TransazioneEnums.stato).includes(value),
      ],
      onPersistence: [
        (value) => Object.values(TransazioneEnums.stato).includes(value),
      ],
    },
  },

  tipo: {
    key: 'tipo',
    label: 'Tipo',
    type: 'string',
    default: TransazioneEnums.tipo.USCITA,
    validations: {
      onConstruction: [
        (value) => Object.values(TransazioneEnums.tipo).includes(value),
      ],
      onPersistence: [
        (value) => Object.values(TransazioneEnums.tipo).includes(value),
      ],
    },
  },

  importoDovuto: {
    key: 'importoDovuto',
    label: 'Importo dovuto',
    type: 'number',
    default: 0,
    validations: {
      onConstruction: [validators.isNumber],
      onPersistence: [validators.isNumber],
    },
  },

  importoCorrisposto: {
    key: 'importoCorrisposto',
    label: 'Importo corrisposto',
    type: 'number',
    default: 0,
    validations: {
      onConstruction: [validators.isNumber],
      onPersistence: [validators.isNumber],
    },
  },
};

export default TransazioneMetadataV1;
