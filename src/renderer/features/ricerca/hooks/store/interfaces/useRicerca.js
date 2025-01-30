import { useModel } from '@ui-shared/hooks';
import { extractTransazioni } from '@features/transazione';
import _ from 'lodash';

const ricercaModel = {
  query: {},
  queryResult: {},
  procedimento: {},
  persone: [],
  modifiche: {},
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
  const modificheRoot = modelInterface.buildRoot('modifiche');

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

    console.log('setProcedimentoProperty', {
      key,
      value,
      validations,
      namespace,
      predicate,
      state: _.get(get(), _.concat(modelInterface.modelRoot, procedimentoRoot)),
    });
  };

  const getProcedimento = () => {
    console.log('getProcedimento', {
      state: _.get(get(), _.concat(modelInterface.modelRoot, procedimentoRoot)),
    });
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
    });
  };

  const getProcedimentoProperty = ({ key, namespace }) => {
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
      key,
      namespace,
    });
  };

  const setPersonaProperty = ({
    key,
    value,
    validations,
    predicate,
    index,
  }) => {
    console.log('setPersonaProperty', {
      key,
      value,
      validations,
      predicate,
      index,
    });
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

  const getPersona = ({ index }) => {
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, personeRoot),
      namespace: [index],
    });
  };

  const getPersonaProperty = ({ key, index }) => {
    console.log('getPersonaProperty', key, index);
    return modelInterface.getProperty({
      root: _.concat(modelInterface.modelRoot, personeRoot),
      key,
      namespace: [index],
    });
  };

  const getChangeProcedimento = () => {
    //console.log('getChangeProcedimento', _.concat(modelInterface.lastUpdateRoot, procedimentoRoot));
    return modelInterface.getChange({ namespace: procedimentoRoot });
  };

  const getChangePersone = () => {
    return modelInterface.getChange({ namespace: personeRoot });
  };

  const saveModifiche = () => {
    const numProtocollo = modelInterface.getProperty({
      root: _.concat(
        modelInterface.modelRoot,
        procedimentoRoot,
        'numProtocollo'
      ),
    });
    if (_.isUndefined(numProtocollo)) return;

    const changeProcedimento = getChangeProcedimento();
    const changePersone = getChangePersone();
    if (_.isUndefined(changeProcedimento) && _.isUndefined(changePersone))
      return;

    let modificheCorrenti = _.cloneDeep(
      _.get(get(), _.concat(['model'], modificheRoot), {})
    );
    _.set(modificheCorrenti, numProtocollo, {
      procedimento: changeProcedimento,
      persone: changePersone,
    });

    console.log('saveModifiche', {
      modificheCorrenti,
      numProtocollo,
      changeProcedimento,
      changePersone,
    });

    modelInterface.setProperty({
      value: modificheCorrenti,
      namespace: modificheRoot,
    });
  };

  const getModifiche = ({ numProtocollo, path }) => {
    const modifichePath = _.concat(
      modificheRoot,
      numProtocollo,
      path ? path : []
    );
    const modifiche = modelInterface.getProperty({ namespace: modifichePath });
    console.log('getModifiche', {
      numProtocollo,
      modifichePath,
      modifiche,
      state: _.get(get(), modifichePath),
    });
    return modifiche;
  };

  const setProcedimentoAndPersone = ({
    procedimento,
    persone,
    includeUpdates = true,
  }) => {
    if (_.isUndefined(procedimento)) return;

    // Gestione delle modifiche pregresse
    let procedimentoAggiornato = _.cloneDeep(procedimento);
    let personeAggiornate = _.cloneDeep(persone);

    const modificheProcedimento = getModifiche({
      numProtocollo: procedimento.numProtocollo,
      path: 'procedimento',
    });
    const modifichePersone = getModifiche({
      numProtocollo: procedimento.numProtocollo,
      path: 'persone',
    });

    _.merge(
      procedimentoAggiornato,
      includeUpdates ? modificheProcedimento : {}
    );
    _.merge(personeAggiornate, includeUpdates ? modifichePersone : {});

    modelInterface.setProperty({
      value: procedimentoAggiornato,
      merge: false,
      updateDefaultModel: procedimento,
      root: _.concat(modelInterface.modelRoot, procedimentoRoot),
    });

    modelInterface.setProperty({
      value: personeAggiornate,
      merge: false,
      updateDefaultModel: persone,
      root: _.concat(modelInterface.modelRoot, personeRoot),
    });
  };

  const hasModifiche = ({ numProtocollo, indexPersona }) => {
    if (_.isUndefined(numProtocollo)) return false;

    const modifiche = getModifiche({ numProtocollo });
    if (_.isUndefined(indexPersona)) return !_.isEmpty(modifiche);

    const modifichePersona = _.get(modifiche, ['persone', indexPersona], {});
    return !_.isEmpty(modifichePersona);
  };

  const getTransazioniModificate = ({ numProtocollo }) => {
    let result = {};

    if (_.isUndefined(numProtocollo)) return result;

    const procedimento = getProcedimento();
    const persone = getPersone();
    const modifiche = getModifiche({ numProtocollo });
    const modificheProcedimento = _.get(modifiche, 'procedimento', {});
    const modifichePersone = _.get(modifiche, ['persone'], []);

    let transazioniProc = extractTransazioni(procedimento);

    let transazioniProcModificate = _.transform(transazioniProc, (acc, t) => {
      if (_.has(modificheProcedimento, t.key)) {
        acc.push(_.merge({}, t, modificheProcedimento[t.key]));
      }
      return acc;
    });

    _.set(result, 'procedimento', transazioniProcModificate);

    let transazioniPersone = _.map(persone, (persona) =>
      extractTransazioni(persona)
    );

    //console.log('getTransazioniModificate', {transazioniPersone, modifichePersone});

    let transazioniPersoneModificate = transazioniPersone.flatMap((tArray, index) => {
      let modifichePersona = _.get(modifichePersone, index, {});
      return _.transform(tArray, (acc, t) => {
        if (_.has(modifichePersona, t.key)) {
          acc.push(_.merge({}, t, modifichePersona[t.key]));
        }
        return acc;
      });
    });

    _.set(
      result,
      'persone',
      transazioniPersoneModificate
    );

    return result;
  };

  return {
    // Interfaccia funzionale del model store
    ...modelInterface,

    // Roots
    roots: {
      query: queryRoot,
      queryResult: queryResultRoot,
      procedimento: procedimentoRoot,
      persone: personeRoot,
      modifiche: modificheRoot,
    },

    // Funzioni specifiche del modello
    setQuery,
    setQueryResult,
    getQueryResult,
    setProcedimentoAndPersone,
    setProcedimentoProperty,
    getProcedimento,
    setPersonaProperty,
    getPersone,
    getChangeProcedimento,
    getChangePersone,
    getPersona,
    getProcedimentoProperty,
    getPersonaProperty,
    saveModifiche,
    hasModifiche,
    getModifiche,
    getTransazioniModificate,
  };
};

export default useRicerca;
