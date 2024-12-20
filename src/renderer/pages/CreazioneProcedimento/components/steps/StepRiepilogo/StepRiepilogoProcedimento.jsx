import React from 'react';
import RiepilogoPartiControparti from './components/RiepilogoPartiControparti/RiepilogoPartiControparti';
import RiepilogoSpese from './components/RiepilogoSpese';
import RiepilogoDatiGenerali from './components/RiepilogoDatiGenerali';
import { useStoreContext } from '@ui-shared/context';
import { FieldTypes } from '@ui-shared/metadata';

const StepRiepilogoProcedimento = React.forwardRef((props, ref) => {
  const procedimentoStore = useStoreContext(FieldTypes.PROCEDIMENTO);
  const personeStore = useStoreContext(FieldTypes.PERSONE);

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
