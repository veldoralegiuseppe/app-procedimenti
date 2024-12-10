import * as React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import _ from 'lodash';

const RiepilogoTransazioniFormContainerComponent = ({onChange: onChangeCallback,}) => {
  const { transazioni } = useTransazioniProcedimento();
  const onChange = React.useCallback(
    (index, changes) => {
      const fieldKey = transazioni[index].key;
      onChangeCallback?.({ fieldKey, changes });
    },
    [transazioni]
  );

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
