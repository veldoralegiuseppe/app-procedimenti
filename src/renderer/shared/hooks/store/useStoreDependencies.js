import * as React from 'react';
import { useStoreContext } from '@ui-shared/context';
import { useModelStore } from '@ui-shared/hooks';

const useStoreDependencies = ({
  fieldKey,
  storeType,
  dependencies,
  args,
  callback,
}) => {
  //console.log('useStoreDependencies', {fieldKey, storeType, dependencies, args, callback});
  const store = useStoreContext(storeType);
  const { getPropertyAndDependencies, getProperty } = useModelStore(store);
  const value = getProperty(fieldKey);

  const wrappedDep = React.useMemo(() => {
    if (!dependencies) return {};

    return Object.entries(dependencies).reduce((acc, [key, value]) => {
      acc[key] = {
        namespace: value.namespace,
        callback: (key, oldValue, newValue) => {
          const changes = value.callback({
            key,
            oldValue,
            newValue,
            store,
            ...args,
          });
          callback?.({changes});
        },
      };
      return acc;
    }, {});
  }, [dependencies, args]);

  const {
    unsubscribe
  } = getPropertyAndDependencies(fieldKey, wrappedDep);

  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  const notifyAll = (key, oldValue, newValue) => {
    Object.values(wrappedDep || {}).forEach((dep) => {
      dep.callback(key, oldValue, newValue);
    });
  };

  return {
    value,
    notifyAll,
  };
};

export default useStoreDependencies;
