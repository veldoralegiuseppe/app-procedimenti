import { useMemo } from 'react';

const useTabellaProps = (transazioni, totali, metadati) => {
  

  return useMemo(() => {
    return {
      data: transazioni,
      rowConfig: {
        disabled: ['Incasso parti', 'Incasso controparti'],
      },
      totali: totali,
      metadati: metadati,
    };
  }, [transazioni, totali]);
};

export { useTabellaProps };