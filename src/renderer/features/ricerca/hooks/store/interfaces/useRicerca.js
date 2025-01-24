import { useModel } from '@ui-shared/hooks';
import _ from 'lodash';

const ricercaModel = {
  query: {},
  queryResult: {},
  procedimento: {},
  persone: [],
};

const useRicerca = ({ set, get, subscribe, initialModel, options = {} }) => {
  const modelInterface = useModel({
    set,
    get,
    subscribe,
    options,
    initialModel: _.merge({}, ricercaModel, initialModel),
  });

  const queryRoot = modelInterface.buildRoot('query');
  const queryResultRoot = modelInterface.buildRoot('queryResult');
  const procedimentoRoot = modelInterface.buildRoot('procedimento');
  const personeRoot = modelInterface.buildRoot('persone');
  
  const setQuery = ({ key, value, validations }) => {
    modelInterface.setProperty({
      key,
      value,
      validations,
      merge: true,
      root: _.concat(modelInterface.modelRoot, queryRoot),
    });
  };

  const setQueryResult = (result) => {
    modelInterface.setProperty({
      value: result,
      merge: false,
      root: _.concat(modelInterface.modelRoot, queryResultRoot),
    });
  };

  const getQueryResult = ({ key, namespace, predicate }) => {
    console.log('getQueryResult', key, namespace, predicate);
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, queryResultRoot),
      key,
      namespace,
      predicate,
    });
  };

  const setProcedimento = (procedimento) => {
    modelInterface.setProperty({
      value: procedimento,
      merge: false,
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
    });
  };

  const setProcedimentoProperty = ({
    key,
    value,
    validations,
    namespace,
    predicate,
  }) => {
    modelInterface.setProperty({
      key,
      value,
      validations,
      namespace,
      predicate,
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
    });
  };

  const getProcedimento = () => {
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
    });
  };

  const setPersone = (persone) => {
    modelInterface.setProperty({
      value: persone,
      merge: false,
      root: _.concat(modelInterface.modelRoot, personeRoot),
    });
  };

  const setPersonaProperty = ({
    key,
    value,
    validations,
    predicate,
    index,
  }) => {
    modelInterface.setProperty({
      key,
      value,
      validations,
      namespace: [index],
      predicate,
      root: _.concat(modelInterface.modelRoot, personeRoot),
    });
  };

  const getPersone = () => {
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, personeRoot),
    });
  };

  const getChangeProcedimento = () => {
    return modelInterface.getChange({namespace: procedimentoRoot});
  }

  const getChangePersone = () => {
    return modelInterface.getChange({namespace: personeRoot});
  }


  return {
    // Interfaccia funzionale del model store
    ...modelInterface,

    // Funzioni specifiche del modello
    setQuery,
    setQueryResult,
    getQueryResult,
    setProcedimento,
    setProcedimentoProperty,
    getProcedimento,
    setPersone,
    setPersonaProperty,
    getPersone,
    getChangeProcedimento,
    getChangePersone,
  };
};

export default useRicerca;
