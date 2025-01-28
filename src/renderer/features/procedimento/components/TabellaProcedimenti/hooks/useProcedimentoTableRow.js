import { useMemo } from 'react';
import { ImportoUtils } from '@ui-shared/utils';
import { ModelTypes } from '@shared/metadata';
import {TransazioneEnumsV1 as transazioneEnums  } from '@shared/metadata';
import dayjs from 'dayjs';

const useProcedimentoTableRow = ({ procedimenti: entities = [] }) => {
  console.log('entities', entities)
 
  const mapToRow = (procedimento) => {
   
    const formatCurrency = (amount) => {
      return ImportoUtils.formattaImporto(amount);
    };

    const statoChipFlagMap = {
      [transazioneEnums.stato.SALDATO]: 'green',
      [transazioneEnums.stato.PARZIALMENTE_SALDATO]: 'yellow',
      [transazioneEnums.stato.DA_SALDARE]: 'red',
    };

    const getStatus = (procedimento) => {
      const statoTransazioni = Object.values(procedimento)
      .filter((field) => field?.type === ModelTypes.TRANSAZIONE).map(transazione => transazione.stato);

      let stato = transazioneEnums.stato.DA_SALDARE;

      if (statoTransazioni.includes(transazioneEnums.stato.PARZIALMENTE_SALDATO)) {
        stato = transazioneEnums.stato.PARZIALMENTE_SALDATO;
      } else if (statoTransazioni.every(stato => stato === transazioneEnums.stato.DA_SALDARE)) {
        stato = transazioneEnums.stato.DA_SALDARE;
      } 

      let chipColor = statoChipFlagMap[stato];
      //console.log('status', { stato, chipColor });
      return { value: stato, status: chipColor };
    };

    return {
      numProtocollo: procedimento.numProtocollo,
      dataDeposito: dayjs(procedimento.dataDeposito).format('DD/MM/YYYY'),
      oggettoControversia: procedimento.oggettoControversia,
      valoreControversia: formatCurrency(procedimento.valoreControversia),
      mediatore: procedimento.nomeMediatore && procedimento.cognomeMediatore ? `${procedimento.nomeMediatore} ${procedimento.cognomeMediatore}` : '-',
      esitoMediazione: procedimento.esitoMediazione || '-',
      azioni: '',
      // statoPagamenti: {
      //   ...getStatus(procedimento),
      //   owner: FieldTypes.PROCEDIMENTO,
      //   statusLabelMap: statoChipFlagMap,
      //   sx: { minWidth: '92.3px' },
      //   disabled: true,
      // },
    };
  };

  const rows = useMemo(() => entities.map(mapToRow), [entities]);
  return { data: rows };
};

export default useProcedimentoTableRow;
