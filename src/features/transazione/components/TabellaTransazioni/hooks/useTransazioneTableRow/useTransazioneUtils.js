import React from 'react';


const useTransazioneUtils = ({statoChipFlagMap, statoEnums, disabled}) => {

    const getNextStatus = React.useCallback((transazione, currentLabel) => {
  
        const nextLabelMap = {
          [statoEnums.SALDATO]: statoEnums.DA_SALDARE,
          [statoEnums.PARZIALMENTE_SALDATO]: statoEnums.SALDATO,
          [statoEnums.DA_SALDARE]: statoEnums.PARZIALMENTE_SALDATO,
        };
    
        const nextLabel = nextLabelMap[currentLabel];
        const nextStatus = statoChipFlagMap[nextLabel];
        const isParzialmenteSadato = nextStatus === 'yellow';
    
        let nextMessage = '';
        if (disabled?.includes((nome) => nome?.toUpperCase() === transazione.nome?.toUpperCase())) {
          nextMessage = 'Calcolato automaticamente';
        } else if (isParzialmenteSadato) {
          nextMessage = `Rimanente: € ${
            transazione.importoDovuto - transazione.importoCorrisposto
          }`;
        }
    
        return { label: nextLabel, status: nextStatus, message: nextMessage };
      }, [disabled]);

      const getId = (transazione) => ({
        nome: transazione.nome,
      });

    return {getNextStatus, getId};
};

export default useTransazioneUtils;
