import React from 'react';
import RiepilogoPartiControparti from './components/RiepilogoPartiControparti/RiepilogoPartiControparti';
import RiepilogoSpese from './components/RiepilogoSpese';
import RiepilogoDatiGenerali from './components/RiepilogoDatiGenerali';
import { useStoreContext } from '@ui-shared/context';
import { StoreTypes } from '@ui-shared/metadata';

const StepRiepilogoProcedimento = React.forwardRef((props, ref) => {
  const procedimentoStore = useStoreContext(StoreTypes.PROCEDIMENTO);
  const personeStore = useStoreContext(StoreTypes.PERSONE);

  const procedimento = procedimentoStore.getState().getModel();
  const persone = personeStore.getState().getItems();

  return (
    <div ref={ref} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column',  rowGap: '1.5rem' }}>
      <RiepilogoDatiGenerali procedimento={procedimento} />
      <RiepilogoPartiControparti persone={persone} />
      <RiepilogoSpese persone={persone} />
    </div>
  );
});

export default StepRiepilogoProcedimento;
