import { validators } from '@utils';
import {TransazioneEnumsV1} from '@shared/metadata';
import { FieldTypes, ValidationHooksTypes } from '@ui-shared/metadata';

const TransazioneMetadataV1 = {
  nome: {
    id: true,
    key: 'nome',
    label: 'Nome',
    type: FieldTypes.STRING,
    validations: {
      [ValidationHooksTypes.ON_CONSTRUCTION]: [
        validators.required,
        validators.onlyAlphanumeric,
      ],
      [ValidationHooksTypes.ON_PERSISTENCE]: [
        validators.required,
        validators.onlyAlphanumeric,
      ],
    },
  },

  key: {
    key: 'key',
    id: true,
  },

  owner: {
    key: 'owner',
    type: FieldTypes.STRING,
  },

  stato: {
    key: 'stato',
    label: 'Stato',
    type: FieldTypes.STRING,
    default: TransazioneEnumsV1.stato.DA_SALDARE,
    validations: {
      [ValidationHooksTypes.ON_CONSTRUCTION]: [
        (value) => Object.values(TransazioneEnumsV1.stato).includes(value),
      ],
      [ValidationHooksTypes.ON_PERSISTENCE]: [
        (value) => Object.values(TransazioneEnumsV1.stato).includes(value),
      ],
    },
  },

  tipo: {
    key: 'tipo',
    label: 'Tipo',
    type: FieldTypes.STRING,
  },

  importoDovuto: {
    key: 'importoDovuto',
    label: 'Importo dovuto',
    dependsOn: ['tipo'],
    type: FieldTypes.NUMBER,
    default: 0,
    validations: {
      [ValidationHooksTypes.ON_CONSTRUCTION]: [validators.onlyNumber],
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.onlyNumber],
    },
  },

  importoCorrisposto: {
    key: 'importoCorrisposto',
    label: 'Importo corrisposto',
    dependsOn: ['tipo'],
    type: FieldTypes.NUMBER,
    default: 0,
    validations: {
      [ValidationHooksTypes.ON_CONSTRUCTION]: [validators.onlyNumber],
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.onlyNumber],
    },
  },

  type: FieldTypes.TRANSAZIONE,

  version: '1.0',
};

export default TransazioneMetadataV1;
