import _ from 'lodash';
import { produce } from 'immer';

/**
 * Interfaccia funzionale di uno model store.
 *
 * @param {Function} set - Funzione per aggiornare lo stato del modello.
 * @param {Function} get - Funzione per ottenere lo stato corrente del modello.
 * @param {Object} [options={}] - Opzioni aggiuntive per la configurazione del model store.
 * @param {string} [options.namespace] - Namespace opzionale per isolare una parte del modello.
 * @param {Function} [options.onSetProperty] - Callback opzionale chiamata dopo aver impostato una proprietà.
 * @param {Function} [options.onRemoveProperty] - Callback opzionale chiamata dopo aver rimosso una proprietà.
 * @param {Function} [options.onResetModel] - Callback opzionale chiamata dopo aver resettato il modello.
 *
 * @returns {Object} Metodi per interagire con il model store.
 * @returns {Function} setProperty - Imposta una proprietà del modello.
 * @returns {Function} removeProperty - Rimuove una proprietà dal modello.
 * @returns {Function} resetModel - Resetta il modello.
 * @returns {Function} getProperty - Ottiene una proprietà dal modello.
 * @returns {Function} getProperties - Ottiene più proprietà dal modello.
 * @returns {Function} getModel - Ottiene l'intero modello o un sottoinsieme se namespace è definito.
 */
const useModel = ({ set, get, initialModel = {}, options = {} }) => {
  const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';

  return {
    model: initialModel,

    // Imposta una proprietà del modello
    setProperty: (key, value) => {
      const path = `${rootPath}.${key}`;
      set(
        produce((state) => {
          if (_.isObject(value)) {
            const target = _.get(state, path, {});
            _.set(state, path, _.merge({}, target, value));
          } else {
            _.set(state, path, value);
          }
        })
      );

      if (options?.onSetProperty) {
        options.onSetProperty(key, value);
      }
    },

    // Rimuove una proprietà dal modello
    removeProperty: (key) => {
      const path = `${rootPath}.${key}`;
      set(
        produce((state) => {
          _.unset(state, path);
        })
      );

      if (options?.onRemoveProperty) {
        options.onRemoveProperty(key);
      }
    },

    // Resetta il modello
    resetModel: (newModel) => {
      set(
        produce((state) => {
          _.set(state, rootPath, _.cloneDeep(newModel));
        })
      );

      if (options?.onResetModel) {
        options.onResetModel(newModel);
      }
    },

    // Ottiene una proprietà dal modello
    getProperty: (key, namespace) => {
      const fieldPath = namespace ? `${namespace}.${key}` : key;
      const path = `${rootPath}.${fieldPath}`;
      return _.get(get(), path);
    },

    // Ottiene più proprietà dal modello
    getProperties: (keys) => {
      return keys.map((key) => {
        const path = `${rootPath}.${key}`;
        return _.get(get(), path);
      });
    },

    // Ottiene l'intero modello o un sottoinsieme se namespace è definito
    getModel: () => {
      return _.cloneDeep(_.get(get(), rootPath));
    },

    // Ottiene una proprietà e le sue dipendenze
    getPropertyAndDependencies: (key, dependencies) => {
      const path = `${rootPath}.${key}`;
      const value = _.get(get(), path);

      const dependenciesMap = Object.entries(dependencies).reduce((acc, [key, namespace]) => {
        const fieldPath = namespace ? `${namespace}.${key}` : key;
        const path = `${rootPath}.${fieldPath}`;
        acc[key] = _.get(get(), path);
        return acc;
      }, {});

      return {
        value,
        dependenciesMap,
      };
    },
  };
};

export default useModel;
