import * as React from 'react';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useModelStore } from '@shared/hooks';
import { useStoreContext } from '@shared/context';

const RiepilogoTransazioniFormContainerComponent = () => {
 
  const { transazioni, totali } = useTransazioniProcedimento();
  const {procedimentoStore} = useStoreContext()
  const {setProperty} = useModelStore(procedimentoStore)

  const onChange = React.useCallback((index, changes) => {
    
    const fieldKey = transazioni[index].key;
    console.log('onChange', index, changes, transazioni[index], fieldKey);
    setProperty(fieldKey, changes);
    setTimeout(() => {
      console.log('procedimentoStore', procedimentoStore.getState().model);
    }, 600);
});

  return (
    <TabellaTransazioni transazioni={transazioni} totali={totali} onChange={onChange}/>
  );
};

const RiepilogoTransazioniFormContainer = React.memo(RiepilogoTransazioniFormContainerComponent);
RiepilogoTransazioniFormContainer.whyDidYouRender = true;
export default RiepilogoTransazioniFormContainer;
