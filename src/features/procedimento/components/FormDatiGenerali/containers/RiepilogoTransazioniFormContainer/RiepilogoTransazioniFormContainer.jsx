import * as React from 'react';
import { FormContainer } from '@shared/components';
import { TabellaTransazioni } from '@features/transazione';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useTabellaProps } from './hooks/useTabellaProps';
import { ModelFactory } from '@shared/factories';

const RiepilogoTransazioniFormContainer = ({ config = {} }) => {
  // Hooks
  const { transazioni, totali } = useTransazioniProcedimento();
  const tabellaProps = useTabellaProps({
    transazioni,
    totali,
    onBlur: config?.onBlur,
  });

  // Enums
  const sezioniEnums = ModelFactory.getMetadata('procedimento').enums.sezioni;

  // Config
  const renderOverrides = React.useMemo(() => {
    return {
      sezioni: {
        [sezioniEnums.RIEPILOGO_TRANSAZIONI]: {
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
      sezioni={[sezioniEnums.RIEPILOGO_TRANSAZIONI]}
    />
  );
};

export default RiepilogoTransazioniFormContainer;
