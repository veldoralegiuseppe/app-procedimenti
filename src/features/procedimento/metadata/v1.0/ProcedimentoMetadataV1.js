import ProcedimentoEnumsV1 from './enums/ProcedimentoEnumsV1';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { validators } from '@utils';
import {InputTypes, FieldTypes, ValidationHooksTypes} from '@shared/metadata';

dayjs.locale('it');

const ProcedimentoMetadataV1 = {
  numProtocollo: {
    id: true,
    key: 'numProtocollo',
    label: 'Numero protocollo',
    type: FieldTypes.STRING,
    inputType: InputTypes.PROTOCOLLO,
    default: `/${new Date().getFullYear()}`,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required, validators.isProtocollo],
    },
  },

  type: FieldTypes.PROCEDIMENTO,

  version: '1.0',

  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data deposito',
    type: FieldTypes.DATE,
    inputType: InputTypes.DATE,
    default: dayjs().format('YYYY-MM-DD'),
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required, validators.isDate],
    },
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore controversia',
    type: FieldTypes.NUMBER,
    inputType: InputTypes.IMPORTO,
    default: 0,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [
        validators.required,
        validators.onlyNumber,
        validators.minValueNumber(80),
      ],
    },
  },
  oggettoControversia: {
    key: 'oggettoControversia',
    label: 'Oggetto controversia',
    type: FieldTypes.STRING,
    inputType: InputTypes.SELECT,
    options: ProcedimentoEnumsV1.oggettoControversia,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede deposito',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede svolgimento',
    type: FieldTypes.STRING,
    inputType: InputTypes.AUTOCOMPLETE,
  },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale demandata',
    type: FieldTypes.STRING,
    inputType: InputTypes.SELECT,
    options: ProcedimentoEnumsV1.causaleDemandata,
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito mediazione',
    type: FieldTypes.STRING,
    inputType: InputTypes.SELECT,
    options: ProcedimentoEnumsV1.esitoMediazione,
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e ora incontro',
    type: FieldTypes.DATE_TIME,
    inputType: InputTypes.DATE_TIME,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.isDateTime],
    },
  },
  modalitaSvolgimento: {
    key: 'modalitaSvolgimento',
    label: 'Modalità svolgimento',
    type: FieldTypes.STRING,
    inputType: InputTypes.SELECT,
    options: ProcedimentoEnumsV1.modalitaSvolgimento,
  },
  titoloMediatore: {
    key: 'titoloMediatore',
    label: 'Titolo mediatore',
    type: FieldTypes.STRING,
    inputType: InputTypes.TITOLO_PERSONA,
    options: ProcedimentoEnumsV1.titoliMediatore,
  },
  nomeMediatore: {
    key: 'nomeMediatore',
    label: 'Nome mediatore',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.onlyAlphabetic],
    },
  },
  cognomeMediatore: {
    key: 'cognomeMediatore',
    label: 'Cognome mediatore',
    type: FieldTypes.STRING,
    inputType: InputTypes.TEXT,
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.onlyAlphabetic],
    },
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Spese mediatore',
    type: FieldTypes.TRANSAZIONE,
    default: {
      fk: null,
      nome: 'Spese mediatore',
      tipo: 'USCITA',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },
  speseAvvioSedeSecondaria: {
    key: 'speseAvvioSedeSecondaria',
    label: 'Spese avvio sede secondaria',
    type: FieldTypes.TRANSAZIONE,
    default: {
      fk: null,
      nome: 'Spese avvio sede secondaria',
      tipo: 'USCITA',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },
  speseIndennitaSedeSecondaria: {
    key: 'speseIndennitaSedeSecondaria',
    label: 'Spese indennità sede secondaria',
    type: FieldTypes.TRANSAZIONE,
    default: {
      fk: null,
      nome: 'Spese indennità sede secondaria',
      tipo: 'USCITA',
    },
    version: '1.0',
    validations: {
      [ValidationHooksTypes.ON_PERSISTENCE]: [validators.required],
    },
  },
};

export default ProcedimentoMetadataV1;
