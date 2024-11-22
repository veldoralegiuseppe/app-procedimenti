import { useMemo, useCallback, useContext, useState } from 'react';
import _ from 'lodash';
import { ProcedimentoContext } from '@context/Procedimento';

/**
 * Hook per gestire la logica di FormContainer.
 * @param {Object} config - Configurazione del form.
 * @param {Array|string} sezioni - Sezioni da visualizzare.
 * @returns {Object} Logica del form container.
 */
const useFormContainer = (config, sezioni) => {
  const [errors, setErrors] = useState({});
  const { model, modelClass, renderOverrides } = config;
  const { handleInputChange } = useContext(ProcedimentoContext) || {};

  // Estrae i metadati dal modello
  const metadati = useMemo(() => {

    if(typeof modelClass?.getMetadati === 'function') 
        return modelClass.getMetadati();

    if(typeof model?.getMetadati === 'function')
        return model.getMetadati();
    
    console.error('FormContainer: impossibile estrarre i metadati dal modello.');
    return null;
  }, [model]);

  // Valida il modello e le props chiave
  const isMissingProps = useMemo(() => {
    if (!metadati || !model || !handleInputChange) return true;
    return false;
  }, [metadati, model, handleInputChange]);

  // Raggruppa i campi per sezione
  const campiPerSezione = useMemo(() => {
    if (!metadati) return {};
    return _.omit(_.groupBy(metadati, 'sezione'), undefined);
  }, [metadati]);

  // Filtra le sezioni da includere
  const filteredSezioni = useMemo(() => {
    if (!sezioni) return Object.entries(campiPerSezione);
    const isArray = Array.isArray(sezioni);
    return Object.entries(campiPerSezione).filter(([sezione]) =>
      isArray ? sezioni.includes(sezione) : sezioni[sezione]
    );
  }, [campiPerSezione, sezioni]);

  // Callback per aggiornare il modello
  const updateModel = useCallback(
    (changes) => {
      if (!handleInputChange) {
        console.error(
          "FormContainer: 'handleInputChange' non è disponibile nel contesto."
        );
        return;
      }
      setErrors(handleInputChange(changes, metadati || []));
    },
    [handleInputChange, metadati]
  );

  return {
    errors,
    renderOverrides,
    filteredSezioni,
    updateModel,
    isMissingProps,
  };
};

export default useFormContainer;
