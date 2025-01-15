import React from 'react';
import { useTransazioniProcedimento } from '@features/procedimento';
import { TabellaTransazioni } from '@features/transazione';

const RiepilogoSpese = ({ procedimento }) => {
  const { getTransazioni } = useTransazioniProcedimento();
  const transazioni = React.useMemo(() => getTransazioni(), [procedimento]);

  return (
    <>{procedimento && <TabellaTransazioni transazioni={transazioni} />}</>
  );
};

export default RiepilogoSpese;
