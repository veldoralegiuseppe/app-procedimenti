import { useState, useEffect, useMemo } from 'react';
import { useStoreContext } from '@ui-shared/context';
import { ModelFactory } from '@ui-shared/components';
import _ from 'lodash';

// Hook per calcolare se il modello è stato modificato
export const useModelChanged = ({ modelType, version }) => {
  const [initModel] = useState(() =>
    ModelFactory.create({ type: modelType, version })
  );
  const [modified, setModified] = useState({});

  const store = useStoreContext(modelType);
  const lastUpdate = store((state) => state.lastUpdate);

  useEffect(() => {
    if (lastUpdate === null) {
      setModified({});
      return;
    }
    
    console.log('lastUpdate', lastUpdate);

    const [key, value] = Object.entries(lastUpdate)[0];
    const initValue = initModel[key];

    const isModified = typeof initValue === 'object'
      ? !_.isEqual(initValue[Object.keys(value)[0]], Object.values(value)[0])
      : !_.isEqual(initValue, value);
    
    setModified((prev) => isModified ? { ...prev, [key]: value } : _.omit(prev, key));
  }, [lastUpdate, initModel]);

  return _.isEmpty(modified);
};
