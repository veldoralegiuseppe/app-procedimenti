import * as React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import _ from 'lodash';

const RiepilogoTransazioniFormContainerComponent = ({onChange}) => {
  const { transazioni } = useTransazioniProcedimento();
 
  return (
    <TabellaTransazioni
      transazioni={transazioni}
      onChange={onChange}
      disabled={['Incasso parti', 'Incasso controparti']}
    />
  );
};

const RiepilogoTransazioniFormContainer = React.memo(
  RiepilogoTransazioniFormContainerComponent
);
RiepilogoTransazioniFormContainer.whyDidYouRender = true;

export default RiepilogoTransazioniFormContainer;
