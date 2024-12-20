import { useMemo } from 'react';

const useTabellaProps = ({ transazioni, totali, onBlur }) => {
  return useMemo(() => {
    return {
      data: transazioni,
      disabled: ['Incasso parti', 'Incasso controparti'],
      totali: totali,
      onBlur: onBlur,
    };
  }, [transazioni, totali]);
};

export { useTabellaProps };
