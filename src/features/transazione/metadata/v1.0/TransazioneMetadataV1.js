import { validators } from '@utils';
import TransazioneEnumsV1 from './enums/TransazioneEnumsV1';

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
    default: TransazioneEnumsV1.stato.DA_SALDARE,
    validations: {
      onConstruction: [
        (value) => Object.values(TransazioneEnumsV1.stato).includes(value),
      ],
      onPersistence: [
        (value) => Object.values(TransazioneEnumsV1.stato).includes(value),
      ],
    },
  },

  tipo: {
    key: 'tipo',
    label: 'Tipo',
    type: 'string',
    default: TransazioneEnumsV1.tipo.USCITA,
    validations: {
      onConstruction: [
        (value) => Object.values(TransazioneEnumsV1.tipo).includes(value),
      ],
      onPersistence: [
        (value) => Object.values(TransazioneEnumsV1.tipo).includes(value),
      ],
    },
  },

  importoDovuto: {
    key: 'importoDovuto',
    label: 'Importo dovuto',
    type: 'number',
    default: 0,
    validations: {
      onConstruction: [validators.onlyNumber],
      onPersistence: [validators.onlyNumber],
    },
  },

  importoCorrisposto: {
    key: 'importoCorrisposto',
    label: 'Importo corrisposto',
    type: 'number',
    default: 0,
    validations: {
      onConstruction: [validators.onlyNumber],
      onPersistence: [validators.onlyNumber],
    },
  },
};

export default TransazioneMetadataV1;
