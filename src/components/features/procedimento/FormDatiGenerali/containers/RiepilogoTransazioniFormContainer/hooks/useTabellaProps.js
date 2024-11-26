import { useMemo } from 'react';
import { useTransazioni } from '@model/Transazione/useTransazioni';

const useTabellaProps = ({transazioni, totali, onBlur}) => {
  

  return useMemo(() => {
    return {
      store: useTransazioni(transazioni),
      disabled: ['Incasso parti', 'Incasso controparti'],
      totali: totali,
      onBlur: onBlur,
    };
  }, [transazioni, totali]);
};

export { useTabellaProps };