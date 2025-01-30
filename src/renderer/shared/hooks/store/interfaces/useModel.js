import _ from 'lodash';
import { produce } from 'immer';

const getStoreSchema = (initialModel) => ({
  model: _.cloneDeep(initialModel),
  lastUpdate: null,
  errors: null,
  unsubscribeCallbacks: null,
  initialModel: _.cloneDeep(initialModel),
});

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
  const buildRoot = (root) => {
    let newRoot = [];

    const addToRoot = (value) => {
      if (_.isString(value)) newRoot = _.concat(newRoot, _.toPath(value));
      else if (_.isArray(value)) newRoot = _.concat(newRoot, value);
    };

    addToRoot(_.get(options, ['namespace']));
    addToRoot(root);

    return newRoot;
  };
  const hasSchema = (root) => _.get(options, ['schema', root]);
  const modelRoot = buildRoot('model');
  const lastUpdateRoot = buildRoot('lastUpdate');
  const errorsRoot = buildRoot('errors');
  const initialModelRoot = buildRoot('initialModel');

  const initializePath = ({ root, key, namespace }) => {
    let path = !_.isUndefined(root) ? buildRoot(root) : modelRoot;

    if (_.isArray(namespace)) path = _.concat(path, namespace);
    else if (_.isString(namespace)) path = _.concat(path, _.toPath(namespace));
    if (_.isString(key)) path = _.concat(path, _.toPath(key));

    console.log('initializePath', { root, key, namespace, path });
    return path;
  };

  const buildPath = ({ root, key, namespace, predicate }) => {
    const path = initializePath({ root, key, namespace });
    let target = _.get(get(), path);

    if (_.isUndefined(target)) {
      if (hasSchema(path[0]) || _.isFunction(predicate))
        throw new Error(`Il path '[${path}]' non esiste nel ${path[0]}`);
      return { path, exists: false };
    }

    if (_.isFunction(predicate)) {
      let keyOrIndex;

      if (_.isObject(target)) keyOrIndex = _.findKey(target, predicate);
      else if (_.isArray(target)) keyOrIndex = _.findIndex(target, predicate);

      if (keyOrIndex) {
        path.push(keyOrIndex);
        target = _.get(get(), path);
      } else
        throw new Error(
          `Il path '[${path}]' esteso con la funzione di ricerca non esiste nel ${path[0]}`
        );
    }

    return { path, exists: true, target };
  };

  const checkValidation = (value, validations) => {
    console.log('checkValidation', value, validations);
    if (!validations) return {};

    const newErrors = validations.reduce((acc, validation) => {
      const errorMessage = validation(value);
      if (_.isString(errorMessage)) {
        acc[validation.name || validation.toString()] = errorMessage;
      }
      return acc;
    }, {});

    return newErrors;
  };

  const deepDifference = (objA, objB) => {
    return _.transform(objA, (result, value, key) => {
      if (!_.isEqual(value, objB[key])) {
        result[key] =
          _.isObject(value) && _.isObject(objB[key])
            ? deepDifference(value, objB[key])
            : value;
      }
    });
  };

  const isSubset = (objA, objB) => {
    return _.every(objA, (value, key) => _.isEqual(value, _.get(objB, key)));
  };

  const updateDefaultModel = (state, { path, changes, updateDefaultModel }) => {
    const defaultModelRoot = _.concat(initialModelRoot, path.slice(1));
    const defaultValue = _.get(state, defaultModelRoot);
    const newDefaultValue = _.isBoolean(updateDefaultModel)
      ? changes
      : updateDefaultModel;

    if (!_.isEqual(defaultValue, newDefaultValue))
      _.set(state, defaultModelRoot, newDefaultValue);
  };

  const updateLastChanges = (state, { path, changes }) => {
    const lastChangesPath = _.concat(lastUpdateRoot, path.slice(1));
    const defaultModelRoot = _.concat(initialModelRoot, path.slice(1));
    const defaultValue = _.get(state, defaultModelRoot);
    const difference = deepDifference(changes, defaultValue);
    const hasChanged = !_.isEmpty(difference);

    if (hasChanged) {
      // Verifico che i cambiamenti non siano già stati registrati
      const lastChanges = _.get(state, lastChangesPath);

      if (!isSubset(difference, lastChanges)) {
        _.set(state, lastChangesPath, _.merge({}, lastChanges, difference));
      }
    } else {
      _.unset(state, lastChangesPath);
      if (_.isEmpty(_.get(state, lastUpdateRoot)))
        _.set(state, lastUpdateRoot, null);
    }
  };

  const updateError = (state, { path, changes, isChanged, validations }) => {
    const errorsPath = _.concat(errorsRoot, path.slice(1));

    if (isChanged && _.isArray(validations)) {
      _.set(state, errorsPath, checkValidation(changes, validations));
    }
  };

  const updateModel = (
    state,
    {
      path,
      value: mergedValue,
      changes,
      validations,
      updateDefaultModel: updateDefault,
    }
  ) => {
    const currentValue = _.get(state, path);
    const newValue = mergedValue;
    const isChanged = !_.isEqual(currentValue, newValue);
    console.log('updateModel', path, currentValue, newValue);

    if (isChanged) {
      if (updateDefault === true || _.isObject(updateDefault))
        updateDefaultModel(state, {
          path,
          changes,
          updateDefaultModel: updateDefault,
        });

      _.set(state, path, newValue);
    }

    updateLastChanges(state, { path, changes });
    updateError(state, { path, changes, isChanged, validations });
  };

  const update = (state, { path, ...rest }) => {
    const root = path[0];

    switch (root) {
      case 'model':
        updateModel(state, { path, ...rest });
        break;
      case 'errors':
        updateError(state, { path, ...rest });
        break;
    }
  };

  // Imposta una proprietà del modello
  const setProperty = ({
    key,
    value,
    validations,
    namespace,
    merge = true,
    predicate,
    root = modelRoot,
    updateDefaultModel = false,
  }) => {
    const { path } = buildPath({ root, key, namespace, predicate });

    set(
      produce((draft) => {
        //console.log('statoPrima', _.cloneDeep(draft));
        let changes = _.cloneDeep(value);
        let newValue = _.cloneDeep(value);

        if (merge) {
          newValue = _.isObject(value)
            ? _.merge({}, _.get(draft, path), value)
            : value;
        }

        update(draft, {
          path,
          changes,
          value: newValue,
          validations,
          updateDefaultModel,
        });
        console.log('statoDopo', _.cloneDeep(draft));
      })
    );

    // Chiama la callback opzionale se definita
    if (options?.onSetProperty) {
      options.onSetProperty(key, value);
    }

    //console.log('persona', get().model);
    //console.log('lastUpdate', get().lastUpdate);
    //console.log('errors', get().errors);
  };

  // Rimuove una proprietà
  const removeProperty = ({ root = modelRoot, key, namespace, predicate }) => {
    const { path, exists } = buildPath({ root, key, namespace, predicate });
    if (!exists) return;

    set(
      produce((state) => {
        _.unset(state, path);
      })
    );

    if (options?.onRemoveProperty) {
      options.onRemoveProperty(key);
    }
  };

  // Resetta il modello
  const resetModel = (newModel) => {
    set(
      produce((state) => {
        _.set(
          state,
          modelRoot,
          _.cloneDeep(newModel || _.get(state, initialModelRoot))
        );
        state.lastUpdate = null;
        state.errors = null;
      })
    );

    if (options?.onResetModel) {
      options.onResetModel(newModel);
    }

    console.log('modello resettato', get().model);
  };

  // Ottiene una proprietà dal modello
  const getProperty = ({ key, namespace, predicate, root = modelRoot }) => {
    try {
      const { target } = buildPath({ root, key, namespace, predicate });
      return target;
    } catch (err) {
      return undefined;
    }
  };

  // Ottiene più proprietà
  const getProperties = ({ paths, root = modelRoot }) => {
    const check = (value) => {
      const isValid =
        _.isString(value) ||
        _.has(value, 'key') ||
        _.has(value, 'namespace') ||
        _.has(value, 'predicate');

      if (!isValid)
        throw new Error(
          'Ogni oggetto deve avere almeno una chiave tra key, namespace o predicate'
        );
    };

    const objResult = _.reduce(
      paths,
      (acc, value) => {
        check(value);
        const { key, namespace, predicate } = value;
        try {
          const { target, path } = buildPath({
            root,
            key,
            namespace,
            predicate,
          });
          _.set(acc, path, target);
        } catch (err) {}

        return acc;
      },
      {}
    );

    return objResult;
  };

  // Trova le proprietà che soddisfano il predicato
  const findProperties = ({ root = modelRoot, key, namespace, predicate }) => {
    const path = initializePath({ root, key, namespace });
    let results = _.get(get(), path);

    if (_.isFunction(predicate)) results = _.filter(results, predicate);

    return results;
  };

  // Ottiene l'intero modello o un sottoinsieme se namespace è definito
  const getModel = () => {
    return _.get(get(), modelRoot);
  };

  // Ottiene una proprietà e le sue dipendenze
  const getPropertyAndDependencies = ({
    key,
    namespace,
    predicate,
    dependencies,
    rootValue = modelRoot,
  }) => {
    const value = getProperty({ key, namespace, predicate, rootValue });
    const unsubscribeCallbacks =
      getProperty({ root: 'unsubscribeCallbacks' }) || {};

    if (dependencies) {
      Object.entries(dependencies).forEach(([depName, props]) => {
        const {
          depKey,
          namespace,
          predicate,
          callback,
          rootDep = modelRoot,
        } = props;

        console.log('getPropertyAndDependencies', {
          depKey,
          namespace,
          predicate,
          callback,
          rootDep,
        });

        const subscriptionKey = `${key}-${depKey}`;
        if (unsubscribeCallbacks?.[subscriptionKey]) {
          console.log(`Subscription for ${subscriptionKey} already exists`);
          return;
        }

        const unsubscribe = subscribe(
          (state) => {
            const depValue = getProperty({
              key: depKey,
              namespace,
              root: rootDep,
              predicate,
            });
            return depValue;
          },
          (newValue, oldValue) => {
            if (!_.isEqual(newValue, oldValue)) {
              callback?.(depKey, oldValue, newValue);
            }
          }
        );

        set(
          produce((draft) => {
            if (!draft.unsubscribeCallbacks) {
              draft.unsubscribeCallbacks = {};
            }
            draft.unsubscribeCallbacks[subscriptionKey] = unsubscribe;
          })
        );
      });
    }

    // Restituisce il valore e la possibilità di disiscriversi
    return {
      value,
      unsubscribe: () => {
        Object.values(unsubscribeCallbacks).forEach((unsubscribe) =>
          unsubscribe()
        );
      },
    };
  };

  // Imposta gli errori
  const setErrors = ({ key, errors, namespace, predicate }) => {
    setProperty({
      key,
      value: errors,
      validations: null,
      namespace,
      merge: false,
      predicate,
      root: 'errors',
    });
  };

  // Ottiene gli errori
  const getFieldErrors = ({ key, namespace, predicate }) => {
    return getProperty({ key, namespace, predicate, root: 'errors' });
  };

  // Ottiene gli updates rispetto a initialModels
  const getChange = ({ key, namespace, predicate }) => {
    const change = getProperty({
      key,
      namespace,
      predicate,
      root: lastUpdateRoot,
    });
    console.log('getChange', { key, namespace, predicate, change });
    return change;
  };

  return {
    modelRoot,
    lastUpdateRoot,
    errorsRoot,
    initialModelRoot,
    buildRoot,
    initializePath,
    ...getStoreSchema(initialModel),
    setProperty,
    removeProperty,
    resetModel,
    getProperty,
    getProperties,
    getModel,
    getPropertyAndDependencies,
    setErrors,
    getFieldErrors,
    findProperties,
    getChange,
  };
};

export default useModel;
