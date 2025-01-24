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
  console.log('useStoreDependencies', {fieldKey, storeType, dependencies, args, callback});
  const store = useStoreContext(storeType);
  const { getPropertyAndDependencies, getProperty } = useModelStore(store);
  const value = getProperty?.({key: fieldKey});

  const wrappedDep = React.useMemo(() => {
    if (!dependencies) return {};

    return Object.entries(dependencies).reduce((acc, [key, value]) => {
      acc[key] = {
        depKey: value?.depKey || key,
        namespace: value?.namespace,
        predicate: value?.predicate,
        rootDep: value?.rootDep,
        callback: (key, oldValue, newValue) => {
          console.log('callback', {key, oldValue, newValue});
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
    unsubscribe = () => {}
  } = getPropertyAndDependencies?.({key: fieldKey, dependencies: wrappedDep}) || {};

  React.useEffect(() => {
    return () => {
      console.log('useStoreDependencies unsubscribe', fieldKey);
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
