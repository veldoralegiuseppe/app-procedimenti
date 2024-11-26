import { useMemo, useCallback } from 'react';
import { useStore } from '@components/commons/hooks/useStore';
import _ from 'lodash';

/**
 * Hook generico per gestire la logica di un FormContainer basato su useModel.
 * @param {Object} params - Parametri per il hook.
 * @param {Function} params.useStore - Funzione dello store Zustand che implementa useModel.
 * @param {Object} params.config - Configurazione del form.
 * @param {Array|string} params.sezioni - Sezioni da visualizzare.
 * @returns {Object} Logica del form container.
 * @returns {Object} return.errors - Gli errori ora possono essere gestiti a livello superiore o tramite validazione.
 * @returns {Object} return.renderOverrides - Override di rendering definiti nella configurazione.
 * @returns {Array} return.filteredSezioni - Sezioni filtrate da visualizzare.
 * @returns {Object} return.touchedFields - Campi toccati nel form.
 * @returns {Function} return.updateModel - Callback per aggiornare il modello.
 * @returns {Function} return.onBlur - Callback per tracciare i campi toccati.
 * @returns {Function} return.handleReset - Funzione per resettare il modello.
 */
const useFormContainer = ({ useStore: store, config, sezioni }) => {
  // Leggi le funzioni direttamente dallo store
  const { touchedFields, setProperty, resetModel, setTouchedFields } = useStore(store);
  
  // Estrai i metadati dal modello
  const metadati = useMemo(() => {
    if (typeof config?.model?.class?.getMetadati === 'function') {
      return config.model.class.getMetadati();
    }

    console.error(
      'FormContainer: impossibile estrarre i metadati dal modello.'
    );
    return null;
  }, [config?.model?.class]);

  // Crea una mappa sezione -> campi
  const campiPerSezione = useMemo(() => {
    if (!metadati) return {};

    return Object.entries(metadati).reduce((acc, [key, campo]) => {
      if (campo.sezione) {
        acc[campo.sezione] = acc[campo.sezione] || [];
        acc[campo.sezione].push(campo);
      }
      return acc;
    }, {});
  }, [metadati]);

  // Filtra le sezioni dalla mappa
  const filteredSezioni = useMemo(() => {
    if (!sezioni) return Object.entries(campiPerSezione);

    const isSezioneIncluded = (sezione) =>
      Array.isArray(sezioni) ? sezioni.includes(sezione) : sezioni[sezione];

    return Object.entries(campiPerSezione).filter(([sezione]) =>
      isSezioneIncluded(sezione)
    );
  }, [campiPerSezione, sezioni]);

  // Callback per aggiornare il modello
  const updateModel = useCallback(
    (changes) => {
      console.log('useFormContainer updateModel changes:', changes);
      Object.entries(changes)
        .map(([key, value]) => {
          const valueOrEvent = value?.target?.value || value;
          return [key, !valueOrEvent ? undefined : valueOrEvent];
        })
        .forEach(([key, value]) => {
          setProperty(key, value);
        });
    },
    [setProperty]
  );

  // Callback per tracciare i campi toccati
  const onBlur = useCallback(
    (changes) => {
      setTouchedFields((prev) => {
        const updatedTouchedFields = _.cloneDeep(prev);

        Object.entries(changes).forEach(([key, value]) => {
          if (!_.isEqual(updatedTouchedFields[key], value)) {
            updatedTouchedFields[key] = value;
          }
        });

        return updatedTouchedFields;
      });

      config.onBlur?.(changes);
    },
    [setTouchedFields, config.onBlur]
  );

  return {
    errors: {}, // Gli errori ora possono essere gestiti a livello superiore o tramite validazione.
    renderOverrides: config.renderOverrides,
    filteredSezioni,
    touchedFields,
    updateModel,
    onBlur,
    handleReset: resetModel,
  };
};

export default useFormContainer;
