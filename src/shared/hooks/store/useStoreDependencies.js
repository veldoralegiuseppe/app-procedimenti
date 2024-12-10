import * as React from 'react';
import { useStoreContext } from '@shared/context';

const useStoreDependencies = ({
  fieldKey,
  storeType,
  dependencies,
  args,
  callback,
}) => {
  const store = useStoreContext(storeType);
  const { getPropertyAndDependencies } = useModelStore(store);

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
  }, [dependencies, properties]);

  const {
    unsubscribe,
    value,
    dependencies: dependenciesValue,
  } = getPropertyAndDependencies(fieldKey, wrappedDep);

  React.useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    value,
    dependenciesValue,
  };
};

export default useStoreDependencies;
