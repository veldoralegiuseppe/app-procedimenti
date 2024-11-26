import _ from 'lodash';
import { produce } from 'immer';

export const useModel = (set, get, options = {}) => {
  const getNamespace = (key) => {
    return options?.namespace ? `${options.namespace}.${key}` : key;
  };

  return {
    touchedFields: {},

    // Imposta una proprietà del modello
    setProperty: (key, value) => {
      const targetKey = getNamespace(key);
      set(
        produce((state) => {
          _.set(state.model, targetKey, value);
        })
      );

      if (options?.onSetProperty) {
        options.onSetProperty(targetKey, value);
      }
    },

    // Rimuove una proprietà dal modello
    removeProperty: (key) => {
      const targetKey = getNamespace(key);
      set(
        produce((state) => {
          _.unset(state.model, targetKey);
        })
      );

      if (options?.onRemoveProperty) {
        options.onRemoveProperty(targetKey);
      }
    },

    // Resetta il modello
    resetModel: (newModel) => {
      const namespace = options?.namespace;
      set(
        produce((state) => {
          if (namespace) {
            _.set(state.model, namespace, _.cloneDeep(newModel));
          } else {
            state.model = _.cloneDeep(newModel);
          }
        })
      );

      if (options?.onResetModel) {
        options.onResetModel(newModel);
      }
    },

    // Ottiene una proprietà dal modello
    getProperty: (key) => {
      const targetKey = getNamespace(key);
      return _.get(get().model, targetKey);
    },

    // Ottiene più proprietà dal modello
    getProperties: (keys) => {
      return keys.map((key) => {
        return _.get(get().model, getNamespace(key));
      });
    },

    // Ottiene l'intero modello o un sottoinsieme se namespace è definito
    getModel: () => {
      const namespace = options?.namespace;
      return namespace
        ? _.cloneDeep(_.get(get().model, namespace))
        : _.cloneDeep(get().model);
    },

    // Aggiorna i campi toccati
    setTouchedFields: (changes) => {
      const namespace = options?.namespace;
      set(
        produce((state) => {
          const targetTouchedFields = namespace
            ? _.get(state.touchedFields, namespace, {})
            : state.touchedFields;

          Object.entries(changes).forEach(([key, value]) => {
            const targetKey = getNamespace(key);
            if (!_.isEqual(targetTouchedFields[targetKey], value)) {
              _.set(targetTouchedFields, targetKey, value);
            }
          });

          if (namespace) {
            _.set(state.touchedFields, namespace, targetTouchedFields);
          }
        })
      );

      if (options?.onSetTouchedFields) {
        options.onSetTouchedFields(changes);
      }
    },

    // Rimuove un campo toccato
    removeTouchedField: (key) => {
      const targetKey = getNamespace(key);
      const namespace = options?.namespace;
      set(
        produce((state) => {
          if (namespace) {
            const targetTouchedFields = _.get(
              state.touchedFields,
              namespace,
              {}
            );
            delete targetTouchedFields[targetKey];
            _.set(state.touchedFields, namespace, targetTouchedFields);
          } else {
            delete state.touchedFields[targetKey];
          }
        })
      );

      if (options?.onRemoveTouchedField) {
        options.onRemoveTouchedField(targetKey);
      }
    },

    // Ottiene i campi toccati
    getTouchedFields: () => {
      const namespace = options?.namespace;
      const fields = namespace
        ? _.get(get().touchedFields, namespace, {})
        : get().touchedFields;
      return _.cloneDeep(fields);
    },
  };
};
