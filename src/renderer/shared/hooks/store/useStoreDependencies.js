import * as React from 'react';
import { useStoreContext } from '@ui-shared/context';
import { useModelStore } from '@ui-shared/hooks';
import _ from 'lodash';

const useStoreDependencies = ({
  fieldKey,
  getMethod = 'getProperty',
  getMethodArgs = {},
  storeType,
  store: inputStore,
  dependencies,
  args,
  callback,
}) => {
 
  if(_.isUndefined(storeType) && !_.isFunction(inputStore))
   console.warn('useStoreDependencies storeType is undefined and inputStore is not a function', fieldKey, inputStore, storeType);

  const defaultStore = _.isString(storeType) ? useStoreContext(storeType) : null;
  const store = inputStore || defaultStore;
  const storeInterface = _.isFunction(store) ? useModelStore(store) : null;
  console.log('useStoreDependencies', {fieldKey, getMethod, getMethodArgs, storeInterface, dependencies})
  const value = store?.(state => state?.[getMethod]?.({ key: fieldKey, ...getMethodArgs }));

  const wrappedDep = React.useMemo(() => {
    if (!dependencies) return {};

    return Object.entries(dependencies).reduce((acc, [key, value]) => {
      acc[key] = {
        depKey: value?.depKey || key,
        namespace: value?.namespace,
        predicate: value?.predicate,
        rootDep: value?.rootDep,
        callback: (key, oldValue, newValue) => {
          console.log('callback', { key, oldValue, newValue });
          const changes = value.callback({
            key,
            oldValue,
            newValue,
            store,
            ...args,
          });
          callback?.({ changes });
        },
      };
      return acc;
    }, {});
  }, [dependencies, args]);

  const { unsubscribe = () => {} } =
    storeInterface?.getPropertyAndDependencies?.({
      key: fieldKey,
      dependencies: wrappedDep,
    }) || {};

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
