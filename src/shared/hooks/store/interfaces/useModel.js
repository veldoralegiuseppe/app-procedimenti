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
const useModel = ({ set, get, subscribe, initialModel = {}, options = {} }) => {
  const rootPath = options?.namespace ? `${options.namespace}.model` : 'model';

  return {
    model: initialModel,
    lastUpdate: null,
    errors: {},

    // Imposta una proprietà del modello
    setProperty: (key, value) => {
      const path = `${rootPath}.${key}`;
      set(
        produce((state) => {
          // Recupera l'oggetto target attuale dal percorso
          const target = _.get(state, path, {});

          if (_.isObject(value)) {
            // Aggiorna l'oggetto unendo il valore esistente con quello nuovo
            const updatedValue = _.merge({}, target, value);
            // Imposta una nuova reference per il target
            _.set(state, path, updatedValue);
          } else {
            // Per valori non oggetto, aggiorna direttamente
            _.set(state, path, value);
          }
        })
      );

      set(
        produce((state) => {
          state.lastUpdate = { [key]: value };
        })
      );

      // Chiama la callback opzionale se definita
      if (options?.onSetProperty) {
        options.onSetProperty(key, value);
      }

      console.log('lastUpdate', get().lastUpdate);
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

      set(
        produce((state) => {
          state.lastUpdate = null;
        })
      );

      if (options?.onResetModel) {
        options.onResetModel(newModel);
      }

      //console.log('lastUpdate', get().lastUpdate);
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
      return _.get(get(), rootPath);
    },

    // Ottiene una proprietà e le sue dipendenze
    getPropertyAndDependencies: (key, dependencies) => {
      //console.log('getPropertyAndDependencies', key, dependencies);
      const path = `${rootPath}.${key}`;
      const value = _.get(get(), path);

      // Calcola le dipendenze
      // const dependenciesMap = dependencies
      //   ? Object.entries(dependencies).reduce((acc, [depKey, namespace]) => {
      //       const fieldPath = namespace ? `${namespace}.${depKey}` : depKey;
      //       const depPath = `${rootPath}.${fieldPath}`;
      //       acc[depKey] = _.get(get(), depPath);
      //       return acc;
      //     }, {})
      //   : {};

      // Gestisce la reattività
      const unsubscribeCallbacks = [];

      if (dependencies) {
        Object.entries(dependencies).forEach(([depKey, value]) => {
          const { namespace, callback } = value;
          const fieldPath = namespace ? `${namespace}.${depKey}` : depKey;
          const depPath = `${rootPath}.${fieldPath}`;

          const unsubscribe = subscribe(
            (state) => {
              //console.log('Selettore per ' + depKey + ' resituisce', _.get(state, depPath));
              return _.get(state, depPath);
            },

            (newValue, oldValue) => {
              //console.log(`Callback per ${depKey}:`, { newValue, oldValue });
              if (!_.isEqual(newValue, oldValue)) {
                //console.log(`Callback attivata per ${depKey}`);
                callback?.(depKey, oldValue, newValue);
              } else {
                //console.log(`Nessun cambiamento rilevato per ${depKey}`);
              }
            }
          );
          unsubscribeCallbacks.push(unsubscribe);
        });
      }

      // Restituisce il valore e la possibilità di disiscriversi
      return {
        value,
        //dependencies: dependenciesMap,
        unsubscribe: () =>
          unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe()),
      };
    },

    // Imposta gli errori del model
    setErrors: (key, errors) => {
      set(
        produce((state) => {
          state.errors[key] = errors;
        })
      );
    },
    
  };
};

export default useModel;
