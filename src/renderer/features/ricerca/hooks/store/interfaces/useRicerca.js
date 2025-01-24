import { useModel } from '@ui-shared/hooks';
import _ from 'lodash';

const ricercaModel = {
  query: {},
  queryResult: {},
  updates: {},
};

const useRicerca = ({ set, get, subscribe, initialModel, options = {} }) => {
  const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';

  const modelInterface = useModel({
    set,
    get,
    subscribe,
    options,
    initialModel: _.merge(ricercaModel, initialModel),
  });

  return {
    // Interfaccia funzionale del model store
    ...modelInterface,

    getUpdate: (key, namespace, predicate) => {
      const path = [rootPath, 'updates'];

      if (_.isArray(namespace)) _.concat(path, namespace);
      else if (namespace) path.push(namespace);

      if (key) path.push(key);

      let target = _.get(state, path);
      if(predicate) target = _.filter(target, predicate);

      return target;
    },

    setUpdate: (changes, key, namespace, merge = false, predicate) => {
     
      // Costruisce il path per l'aggiornamento
      const path = [rootPath, 'updates'];

      if (_.isArray(namespace)) _.concat(path, namespace);
      else if (namespace) path.push(namespace);

      if (key) path.push(key);

      // Update effettivo
      set(
        produce((state) => {
          let target = _.get(state, path);
         
          if(predicate && target) {
            let keyOrIndex

            if(_.isObject(target)) keyOrIndex = _.findKey(target, predicate);
            else if (_.isArray(target)) keyOrIndex = _.findIndex(target, predicate);

            if(keyOrIndex) path.push(keyOrIndex);
          }

          if(!target) _.set(state, path, changes);
          else if(merge) _.merge(target, changes);
          else _.set(state, path, changes);
        })
      );
    },
  };
};

export default useRicerca;
