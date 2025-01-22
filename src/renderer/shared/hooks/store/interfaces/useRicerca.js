import { useModel } from '@ui-shared/hooks';
import _ from 'lodash';

const useRicerca = ({ set, get, subscribe, initialModel, options = {} }) => {
  const modelInterface = useModel({
    set,
    get,
    subscribe,
    options,
    initialModel,
  });

  return {
    // Interfaccia funzionale del model store
    ...modelInterface,
  };
};

export default useRicerca;
