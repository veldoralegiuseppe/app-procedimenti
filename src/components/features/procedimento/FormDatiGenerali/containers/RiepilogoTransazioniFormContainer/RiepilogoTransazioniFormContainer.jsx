import * as React from 'react';
import FormContainer from '@components/commons/FormContainer/FormContainer';
import { SEZIONI } from '@model/procedimento';
import TabellaTransazioni from '@components/features/transazione/TabellaTransazioni/TabellaTransazioni';
import { useTransazioniProcedimento } from './hooks/useTransazioniProcedimento';
import { useTabellaProps } from './hooks/useTabellaProps';

const RiepilogoTransazioniFormContainer = ({ config = {} }) => {
  const { model: procedimento, modelClass } = config;
  const metadati = modelClass?.getMetadati();

  // Hooks
  const { transazioni, totali } = useTransazioniProcedimento(
    procedimento,
    metadati
  );
  const tabellaProps = useTabellaProps({transazioni, totali, metadati, onBlur: config?.onBlur});

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
  const configOverride = {
    ...config,
    renderOverrides,
  };

  return (
    <FormContainer
      config={configOverride}
      sezioni={[SEZIONI.RIEPILOGO_TRANSAZIONI]}
    />
  );
};

export default RiepilogoTransazioniFormContainer;
