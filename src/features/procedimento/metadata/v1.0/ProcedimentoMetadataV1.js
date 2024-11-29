import ProcedimentoEnumsV1 from './enums/ProcedimentoEnumsV1';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { validators } from '@utils';

dayjs.locale('it');

const ProcedimentoMetadataV1 = {
  numProtocollo: {
    key: 'numProtocollo',
    label: 'Numero protocollo',
    type: 'string',
    default: `/${new Date().getFullYear()}`,
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    validations: {
      onPresistence: [validators.required, validators.isProtocollo],
    },
  },
  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data deposito',
    type: 'date',
    default: dayjs().format('YYYY-MM-DD'),
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    validations: {
      onPresistence: [validators.required, validators.isDate],
    },
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore controversia',
    type: 'number',
    default: 0,
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    validations: {
      onPresistence: [
        validators.required,
        validators.onlyNumber,
        validators.minValueNumber(80),
      ],
    },
  },
  oggettoControversia: {
    key: 'oggettoControversia',
    label: 'Oggetto controversia',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    options: ProcedimentoEnumsV1.oggettoControversia,
    validations: {
      onPresistence: [validators.required],
    },
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede deposito',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    validations: {
      onPresistence: [validators.required],
    },
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede svolgimento',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
  },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale demandata',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    options: ProcedimentoEnumsV1.causaleDemandata,
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito mediazione',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['ISTANZA_MEDIAZIONE'],
    options: ProcedimentoEnumsV1.esitoMediazione,
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e ora incontro',
    type: 'datetime',
    sezione: ProcedimentoEnumsV1.sezione['FISSAZIONE_INCONTRO'],
    validations: {
      onPresistence: [validators.isDateTime],
    },
  },
  modalitaSvolgimento: {
    key: 'modalitaSvolgimento',
    label: 'Modalità svolgimento',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['FISSAZIONE_INCONTRO'],
    options: ProcedimentoEnumsV1.modalitaSvolgimento,
  },
  titoloMediatore: {
    key: 'titoloMediatore',
    label: 'Titolo mediatore',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['MEDIATORE'],
    options: ProcedimentoEnumsV1.titoliMediatore,
  },
  nomeMediatore: {
    key: 'nomeMediatore',
    label: 'Nome mediatore',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['MEDIATORE'],
    validations: {
      onPresistence: [validators.onlyAlphabetic],
    },
  },
  cognomeMediatore: {
    key: 'cognomeMediatore',
    label: 'Cognome mediatore',
    type: 'string',
    sezione: ProcedimentoEnumsV1.sezione['MEDIATORE'],
    validations: {
      onPresistence: [validators.onlyAlphabetic],
    },
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Spese mediatore',
    type: 'transazione',
    default: {
      nome: 'Spese mediatore',
      tipo: 'USCITA',
    },
    version: '1.0',
    sezione: ProcedimentoEnumsV1.sezione['RIEPILOGO_TRANSAZIONI'],
    validations: {
      onPresistence: [validators.required],
    },
  },
  speseAvvioSedeSecondaria: {
    key: 'speseAvvioSedeSecondaria',
    label: 'Spese avvio sede secondaria',
    type: 'transazione',
    default: {
      nome: 'Spese avvio sede secondaria',
      tipo: 'USCITA',
    },
    version: '1.0',
    sezione: ProcedimentoEnumsV1.sezione['RIEPILOGO_TRANSAZIONI'],
    validations: {
      onPresistence: [validators.required],
    },
  },
  speseIndennitaSedeSecondaria: {
    key: 'speseIndennitaSedeSecondaria',
    label: 'Spese indennità sede secondaria',
    type: 'transazione',
    default: {
      nome: 'Spese indennità sede secondaria',
      tipo: 'USCITA',
    },
    version: '1.0',
    sezione: ProcedimentoEnumsV1.sezione['RIEPILOGO_TRANSAZIONI'],
    validations: {
      onPresistence: [validators.required],
    },
  },
};

export default ProcedimentoMetadataV1;
