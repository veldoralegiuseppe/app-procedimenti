import ProcedimentoEnums from './enums/ProcedimentoEnums';
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
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    validations: {
      onPresistence: [validators.required, validators.isProtocollo],
    },
  },
  dataDeposito: {
    key: 'dataDeposito',
    label: 'Data deposito',
    type: 'date',
    default: dayjs().format('YYYY-MM-DD'),
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    validations: {
      onPresistence: [validators.required, validators.isDate],
    },
  },
  valoreControversia: {
    key: 'valoreControversia',
    label: 'Valore controversia',
    type: 'number',
    default: 0,
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
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
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    options: ProcedimentoEnums.oggettoControversia,
    validations: {
      onPresistence: [validators.required],
    },
  },
  sedeDeposito: {
    key: 'sedeDeposito',
    label: 'Sede deposito',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    validations: {
      onPresistence: [validators.required],
    },
  },
  sedeSvolgimento: {
    key: 'sedeSvolgimento',
    label: 'Sede svolgimento',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
  },
  causaleDemandata: {
    key: 'causaleDemandata',
    label: 'Causale demandata',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    options: ProcedimentoEnums.causaleDemandata,
  },
  esitoMediazione: {
    key: 'esitoMediazione',
    label: 'Esito mediazione',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[ISTANZA_MEDIAZIONE],
    options: ProcedimentoEnums.esitoMediazione,
  },
  dataOraIncontro: {
    key: 'dataOraIncontro',
    label: 'Data e ora incontro',
    type: 'datetime',
    sezione: ProcedimentoEnums.sezione[FISSAZIONE_INCONTRO],
    validations: {
      onPresistence: [validators.isDateTime],
    },
  },
  modalitaSvolgimento: {
    key: 'modalitaSvolgimento',
    label: 'Modalità svolgimento',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[FISSAZIONE_INCONTRO],
    options: ProcedimentoEnums.modalitaSvolgimento,
  },
  titoloMediatore: {
    key: 'titoloMediatore',
    label: 'Titolo mediatore',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[MEDIATORE],
    options: ProcedimentoEnums.titoliMediatore,
  },
  nomeMediatore: {
    key: 'nomeMediatore',
    label: 'Nome mediatore',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[MEDIATORE],
    validations: {
      onPresistence: [validators.onlyAlphabetic],
    },
  },
  cognomeMediatore: {
    key: 'cognomeMediatore',
    label: 'Cognome mediatore',
    type: 'string',
    sezione: ProcedimentoEnums.sezione[MEDIATORE],
    validations: {
      onPresistence: [validators.onlyAlphabetic],
    },
  },
  compensoMediatore: {
    key: 'compensoMediatore',
    label: 'Spese mediatore',
    type: 'number',
    default: new Transazione({
      nome: 'Spese mediatore',
      tipo: 'USCITA',
    }),
    sezione: ProcedimentoEnums.sezione[RIEPILOGO_TRANSAZIONI],
    validations: {
      onPresistence: [validators.required],
    },
  },
  speseAvvioSedeSecondaria: {
    key: 'speseAvvioSedeSecondaria',
    label: 'Spese avvio sede secondaria',
    type: 'Transazione',
    default: new Transazione({
      nome: 'Spese avvio sede secondaria',
      tipo: 'USCITA',
    }),
    sezione: ProcedimentoEnums.sezione[RIEPILOGO_TRANSAZIONI],
    validations: {
      onPresistence: [validators.required],
    },
  },
  speseIndennitaSedeSecondaria: {
    key: 'speseIndennitaSedeSecondaria',
    label: 'Spese indennità sede secondaria',
    type: 'Transazione',
    default: new Transazione({
      nome: 'Spese indennità sede secondaria',
      tipo: 'USCITA',
    }),
    sezione: ProcedimentoEnums.sezione[RIEPILOGO_TRANSAZIONI],
    validations: {
      onPresistence: [validators.required],
    },
  },
};

export default ProcedimentoMetadataV1;
