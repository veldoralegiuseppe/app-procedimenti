import { useMemo } from 'react';
import { ImportoUtils } from '@ui-shared/utils';
import { FieldTypes } from '@ui-shared/metadata';
import {TransazioneEnumsV1 as transazioneEnums  } from '@shared/metadata';

const useProcedimentoTableRow = ({ procedimenti: entities = [] }) => {
 
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
      .filter((field) => field?.type === FieldTypes.TRANSAZIONE).map(transazione => transazione.stato);

      let value = transazioneEnums.stato.DA_SALDARE;

      if (statoTransazioni.includes(transazioneEnums.stato.PARZIALMENTE_SALDATO)) {
        return transazioneEnums.stato.PARZIALMENTE_SALDATO;
      } else if (statoTransazioni.every(stato => stato === transazioneEnums.stato.DA_SALDARE)) {
        return transazioneEnums.stato.DA_SALDARE;
      } 

      let status = statoChipFlagMap[value];
      return { value, status };
    };

    return {
      numProtocollo: procedimento.numProtocollo,
      dataDeposito: procedimento.dataDeposito,
      oggettoControversia: procedimento.oggettoControversia,
      valoreControversia: formatCurrency(procedimento.valoreControversia),
      esitoMediazione: procedimento.esitoMediazione,
      statoPagamenti: {
        ...getStatus(procedimento),
        owner: FieldTypes.PROCEDIMENTO,
        statusLabelMap: statoChipFlagMap,
        sx: { minWidth: '92.3px' },
        disabled: true,
      },
    };
  };


  const rows = useMemo(() => entities.map(mapToRow), [entities]);

  return { data: rows };
};

export default useProcedimentoTableRow;
