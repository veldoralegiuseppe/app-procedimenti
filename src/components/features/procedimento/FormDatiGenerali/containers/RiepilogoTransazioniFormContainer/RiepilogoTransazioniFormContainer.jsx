import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import { SEZIONI } from '@model/Procedimento/procedimento';
import TabellaTransazioni from '@components/features/transazione/TabellaTransazioni/TabellaTransazioni';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useTabellaProps } from './hooks/useTabellaProps';

const RiepilogoTransazioniFormContainer = ({
  config = {},
  procedimentoStore,
}) => {
  // Hooks
  const { transazioni, totali } = useTransazioniProcedimento(procedimentoStore);
  const tabellaProps = useTabellaProps({
    transazioni,
    totali,
    onBlur: config?.onBlur,
  });

  // Config
  const renderOverrides = React.useMemo(() => {
    return {
      sezioni: {
        [SEZIONI.RIEPILOGO_TRANSAZIONI]: {
          component: (props) => (
            <TabellaTransazioni {...{ ...props, ...tabellaProps }} />
          ),
        },
      },
    };
  }, [tabellaProps]);

  const configOverride = React.useMemo(() => ({
    ...config,
    renderOverrides,
  }), [config, renderOverrides]);

  console.log('tabellaProps', tabellaProps);

  return (
    <FormContainer
      config={configOverride}
      sezioni={[SEZIONI.RIEPILOGO_TRANSAZIONI]}
      store={procedimentoStore}
    />
  );
};

export default RiepilogoTransazioniFormContainer;
