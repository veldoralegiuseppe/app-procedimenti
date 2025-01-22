import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Stepper, PageHeader } from '@ui-shared/components';
import { useDatabase } from '@ui-shared/hooks';
import { StoreTypes } from '@ui-shared/metadata';
import {
  useStoreContext,
  useUtilsContext,
} from '@ui-shared/context';
import StepDatiGeneraliProcedimento from './components/steps/StepDatiGenerali/StepDatiGeneraliProcedimento';
import StepPartiControparti from './components/steps/StepPartiControparti/StepPartiControparti';
import StepRiepilogoProcedimento from './components/steps/StepRiepilogo/StepRiepilogoProcedimento';

const CreaProcedimento = () => {
  const theme = useTheme();
  const helperText = `Completa i passaggi guidati inserendo le informazioni sulla
            mediazione, dati delle parti coinvolte e i dettagli del caso. Al
            termine, verifica i dati e conferma per finalizzare il nuovo
            procedimento.`;

  const steps = [
    { label: 'Dati generali', component: <StepDatiGeneraliProcedimento /> },
    { label: 'Parti e controparti', component: <StepPartiControparti /> },
    { label: 'Riepilogo', component: <StepRiepilogoProcedimento /> },
  ];
  const { create } = useDatabase();
  const stores = useStoreContext();
  const { notify } = useUtilsContext();

  const [reset, setReset] = React.useState(false);

  const onSubmit = () => {
    const procedimentoStore = stores[StoreTypes.PROCEDIMENTO];
    const personeStore = stores[StoreTypes.PERSONE];

    const procedimento = procedimentoStore.getState().getModel();
    const persone = personeStore.getState().getItems();

    const data = { ...procedimento, persone };
    console.log('Finish', data);

    create(data).then(({ success, error }) => {
      if (success) handleSuccess();
      else handleError(error);
    });
  };

  const handleSuccess = () => {
    notify('Procedimento creato con successo', 'success');
    setReset(true);
  };

  const handleStepReset = () => {
    const procedimentoStore = stores[StoreTypes.PROCEDIMENTO];
    const personeStore = stores[StoreTypes.PERSONE];

    procedimentoStore.getState().resetModel();
    personeStore.getState().resetItems([]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setReset(false);
  }

  const handleError = (message) => {
    notify(message, 'error');
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          rowGap: '5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.palette.background.default,
            flexDirection: 'column',
            rowGap: '1.5rem',
            height: 'auto',
            padding: '0',
            borderRadius: '8px',
          }}
        >
          <PageHeader title="Crea procedimento" helperText={helperText} />
          <Stepper steps={steps} onSubmit={onSubmit} reset={reset} onReset={handleStepReset} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(CreaProcedimento);
