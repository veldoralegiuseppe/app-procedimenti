import { useModel } from '@ui-shared/hooks';
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
    const modifichePath = _.concat(modificheRoot, numProtocollo, path);
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
    updateDefaultModel = 'auto',
  }) => {
    console.log('setProcedimentoAndPersone', {
      procedimento,
      persone,
      updateDefaultModel,
    });
    if (_.isUndefined(procedimento)) return;

    /*
    let updateProcedimentoDefault
    let updatePersoneDefault
   
    if(_.isBoolean(updateDefaultModel)){
      updateProcedimentoDefault = updateDefaultModel;
      updatePersoneDefault = updateDefaultModel;

      modelInterface.setProperty({
        value: procedimento,
        merge: false,
        updateDefaultModel: updateProcedimentoDefault,
        root: _.concat(modelInterface.modelRoot, procedimentoRoot),
      });
  
      modelInterface.setProperty({
        value: persone,
        merge: false,
        updateDefaultModel: updatePersoneDefault,
        root: _.concat(modelInterface.modelRoot, personeRoot),
      });
    }
    else if(_.isEqual(updateDefaultModel, 'auto')){
      let procedimentoObj = _.cloneDeep(procedimento);
      let personeArr = _.cloneDeep(persone);

      const modificheProcedimento = getModifiche({numProtocollo: procedimentoObj.numProtocollo, path: 'procedimento'});
      const modifichePersone = getModifiche({numProtocollo: procedimentoObj.numProtocollo, path: 'persone'});

      const procedimentoIsModified = !(_.isEmpty(modificheProcedimento) || _.isUndefined(modificheProcedimento));
      const personeIsModified = !(_.isEmpty(modifichePersone) || _.isUndefined(modifichePersone));

      if(procedimentoIsModified) _.merge(procedimentoObj, modificheProcedimento);
      if(personeIsModified) _.merge(personeArr, modifichePersone);

      console.log('setProcedimentoAndPersone', {procedimentoIsModified, personeIsModified, procedimentoObj, personeArr, modificheProcedimento, modifichePersone});

      modelInterface.setProperty({
        value: procedimentoObj,
        merge: false,
        updateDefaultModel: true,
        root: _.concat(modelInterface.modelRoot, procedimentoRoot),
      });
  
      modelInterface.setProperty({
        value: personeArr,
        merge: false,
        updateDefaultModel: persone,
        root: _.concat(modelInterface.modelRoot, personeRoot),
      });
    }
    */

    // Caricamento semplice (viene aperto sempre lo stesso procedimento)
    // Procedimento = procedimento originale proveniente dalla query

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

    _.merge(procedimentoAggiornato, modificheProcedimento);
    _.merge(personeAggiornate, modifichePersone);

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
  };
};

export default useRicerca;
