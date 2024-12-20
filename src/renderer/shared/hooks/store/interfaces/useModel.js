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
    errors: null,

    // Imposta una proprietà del modello
    setProperty: (key, value, validations) => {
      const path = `${rootPath}.${key}`;

      // Aggiorna il model
      set(
        produce((state) => {
          const target = _.get(state, path);

          if (_.isObject(value)) {
            const updatedValue = _.merge({}, target, value);
            if (!_.isEqual(target, updatedValue)) {
              console.log('updatedValue', target, updatedValue);
              _.set(state, path, updatedValue); // Imposta una nuova reference solo se ci sono cambiamenti
            }
          } else {
            //console.log('isEqual', 'target', target, 'value', value, _.isEqual(target, value));
            if (!_.isEqual(target, value)) {
              console.log(
                'updatedValue:',
                'key',
                key,
                'path',
                path,
                'target',
                target,
                'value',
                value
              );
              _.set(state, path, value); // Imposta solo se il valore è diverso
            }
          }
        })
      );

      // Aggiorna lastUpdate
      set(
        produce((state) => {
          let hasChanged;

          if (_.isObject(value)) {
            hasChanged = Object.entries(value).some(
              ([subKey, subValue]) =>
                !_.isEqual(_.get(initialModel, `${key}.${subKey}`), subValue)
            );
          } else {
            hasChanged = !_.isEqual(_.get(initialModel, key), value);
          }

          if (hasChanged) {
            if (!state.lastUpdate) {
              state.lastUpdate = {};
            }
            _.merge(state.lastUpdate, { [key]: value });
          } else {
            if (_.isObject(value)) {
              Object.entries(value).forEach(([subKey, subValue]) => {
                _.unset(state.lastUpdate, `${key}.${subKey}`);
              });
              if (_.isEmpty(_.get(state.lastUpdate, key))) {
                _.unset(state.lastUpdate, key);
              }
            } else {
              _.unset(state.lastUpdate, key);
            }

            if (_.isEmpty(state.lastUpdate)) {
              state.lastUpdate = null;
            }
          }
        })
      );

      // Aggiorna gli errori
      if (validations) {
        const newErrors = validations.reduce((acc, validation) => {
          const errorMessage = validation(value);
          if (typeof errorMessage === 'string') {
            acc[validation.name || validation.toString()] = errorMessage;
          }
          return acc;
        }, {});

        set(
          produce((state) => {
            if (_.isEmpty(newErrors)) {
              console.log('nessun errore rilevato', newErrors);
              _.unset(state.errors, key);
            } else {
              if (!state.errors) {
                state.errors = {};
              }
                if (!_.isEqual(_.get(state.errors, key), newErrors)) {
                _.merge(state.errors, { [key]: newErrors });
                }
            }

            if (_.isEmpty(state.errors)) {
              state.errors = null;
            }
          })
        );
      }

      // Chiama la callback opzionale se definita
      if (options?.onSetProperty) {
        options.onSetProperty(key, value);
      }

      //console.log('persona', get().model);
      //console.log('lastUpdate', get().lastUpdate);
      //console.log('errors', get().errors);
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
          _.set(state, rootPath, _.cloneDeep(newModel || initialModel));
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

      console.log('modello resettato', get().model);
    },

    // Ottiene una proprietà dal modello
    getProperty: (key, namespace) => {
      const fieldPath = namespace ? `${namespace}.${key}` : key;
      const path = `${rootPath}.${fieldPath}`;
      return _.get(get(), path);
    },

    // Ottiene più proprietà dal modello
    getProperties: (keys) => {
      const objResult = keys.reduce((acc, key) => {
        const path = `${rootPath}.${key}`;
        acc[key] = _.get(get(), path);
        return acc;
      }, {});

      return objResult;
    },

    // Ottiene l'intero modello o un sottoinsieme se namespace è definito
    getModel: () => {
      return _.get(get(), rootPath);
    },

    // Ottiene una proprietà e le sue dipendenze
    getPropertyAndDependencies: (key, dependencies) => {
      const path = `${rootPath}.${key}`;
      const value = _.get(get(), path);

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

    // Imposta gli errori del model: DA RIFATTORIZZARE
    setErrors: (key, errors) => {
      set(
        produce((state) => {
          state.errors[key] = errors;
        })
      );
    },

    // Ottiene gli errori del model
    getFieldErrors: (key) => {
      return get().errors?.[key];
    },
  };
};

export default useModel;
