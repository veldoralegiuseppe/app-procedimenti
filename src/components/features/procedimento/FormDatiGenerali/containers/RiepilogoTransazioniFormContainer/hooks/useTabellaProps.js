import { useMemo } from 'react';

const useTabellaProps = ({transazioni, totali, metadati, onBlur}) => {
  

  return useMemo(() => {
    return {
      data: transazioni,
      rowConfig: {
        disabled: ['Incasso parti', 'Incasso controparti'],
      },
      totali: totali,
      onBlur: onBlur,
      metadati: metadati,
    };
  }, [transazioni, totali]);
};

export { useTabellaProps };