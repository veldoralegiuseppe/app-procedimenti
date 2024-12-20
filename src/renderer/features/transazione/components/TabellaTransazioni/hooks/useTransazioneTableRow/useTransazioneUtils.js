import React from 'react';
import { useStoreContext } from '@shared/context';

const useTransazioneUtils = ({ statoChipFlagMap, statoEnums, disabled }) => {

  const storeMap = useStoreContext()
  
  const getNextStatus = React.useCallback(
    (transazione, currentLabel) => {
      const model = storeMap[transazione?.owner]?.getState()?.model
      const updatedTransazione = model[transazione?.key]
      console.log('getNextStatus', transazione, updatedTransazione);

      const nextLabelMap = {
        [statoEnums.SALDATO]: statoEnums.DA_SALDARE,
        [statoEnums.PARZIALMENTE_SALDATO]: statoEnums.SALDATO,
        [statoEnums.DA_SALDARE]: statoEnums.PARZIALMENTE_SALDATO,
      };

      const nextLabel = nextLabelMap[currentLabel];
      const nextStatus = statoChipFlagMap[nextLabel];
      const isParzialmenteSadato = nextStatus === 'yellow';

      let nextMessage = '';
      if (
        disabled?.includes(
          (nome) => nome?.toUpperCase() === transazione.nome?.toUpperCase()
        )
      ) {
        nextMessage = 'Calcolato automaticamente';
      } else if (isParzialmenteSadato) {
        nextMessage = `Rimanente: € ${
          updatedTransazione.importoDovuto - updatedTransazione.importoCorrisposto
        }`;
      }

      return { label: nextLabel, status: nextStatus, message: nextMessage };
    },
    [disabled]
  );

  const getId = (transazione) => ({
    nome: transazione.nome,
  });

  return { getNextStatus, getId };
};

export default useTransazioneUtils;
