import * as React from 'react';
import { FormContainer } from '@shared/components';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useTabellaProps } from './hooks/useTabellaProps';
import { ModelFactory } from '@shared/factories';

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
        [ModelFactory.getMetadata('procedimento').enums.sezioni[RIEPILOGO_TRANSAZIONI]]: {
          component: (props) => (
            <TabellaTransazioni {...{ ...props, ...tabellaProps }} />
          ),
        },
      },
    };
  }, [tabellaProps]);

  const configOverride = React.useMemo(
    () => ({
      ...config,
      renderOverrides,
    }),
    [config, renderOverrides]
  );

  return (
    <FormContainer
      config={configOverride}
      sezioni={[ModelFactory.getMetadata('procedimento').enums.sezioni[RIEPILOGO_TRANSAZIONI]]}
      store={procedimentoStore}
    />
  );
};

export default RiepilogoTransazioniFormContainer;
