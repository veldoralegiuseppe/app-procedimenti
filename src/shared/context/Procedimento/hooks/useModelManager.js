import React, { useState, useMemo, useCallback } from 'react';
import { Procedimento } from '@features/procedimento';
import { produce } from 'immer';
import _ from 'lodash';

export const useModelManager = () => {
  // Inizializzazione memoizzata dei valori iniziali
  const initialProcedimento = useMemo(() => new Procedimento(), []);
  const initialPersone = useMemo(() => [], []);
  const initialRegole = useMemo(() => [], []);

  const [procedimento, setProcedimento] = useState(initialProcedimento);
  const [persone, setPersone] = useState(initialPersone);
  const [regole, setRegole] = useState(initialRegole);

  // Mappatura della classe al rispettivo setter
  const modelSetters = useMemo(
    () => ({
      Procedimento: setProcedimento,
    }),
    []
  );

  // Funzione per ottenere il setter per una specifica classe
  const getSetter = useCallback(
    (className) => {
      const setter = modelSetters[className];
      if (!setter) {
        throw new Error(`Setter non trovato per la classe: ${className}`);
      }
      return setter;
    },
    [modelSetters]
  );

  // Mappatura dei modelli iniziali per ciascuna classe
  const initialModels = useMemo(
    () => ({
      Procedimento: initialProcedimento,
    }),
    [initialProcedimento]
  );

  // Funzione per aggiornare il modello
  const updateModel = useCallback(
    ({ model, key, value }) => {
      const setter = getSetter(model.constructor.name);

      setter((prev) =>
        produce(prev, (draft) => {
          if (!_.isEqual(draft[key], value)) {
            draft[key] = value;
          }
        })
      );
    },
    [getSetter]
  );

  // Funzione per resettare un modello allo stato iniziale
  const resetModel = useCallback(
    (model) => {
      if (!model) {
        console.error('Model non definito');
        return;
      }

      const className = model.constructor.name;
      const setter = getSetter(className);

      setter((prev) => {
        const initial = initialModels[className];
        return _.isEqual(prev, initial) ? prev : initial;
      });
    },
    [getSetter, initialModels]
  );

  // Ottimizzazione del memo per evitare re-render inutili
  const memoizedModels = useMemo(() => {
    const optimizedProcedimento = produce(procedimento, (draft) => {
      return _.isEqual(draft, procedimento) ? procedimento : draft;
    });

    return {
      models: {
        procedimento: optimizedProcedimento,
        persone,
        regole,
      },
      updateModel,
      resetModel,
      initialModels,
    };
  }, [updateModel, resetModel, initialModels]);

  return memoizedModels;
};
