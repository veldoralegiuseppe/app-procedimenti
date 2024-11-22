import React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { Procedimento } from '@model/procedimento';
import {produce} from 'immer';

export const useModelManager = () => {
  // Stati per ciascun tipo di modello
  const [procedimento, setProcedimento] = useState(new Procedimento());
  const [persone, setPersone] = React.useState([]);
  const [regole, setRegole] = React.useState([]);

  // Mappatura della classe al rispettivo setter
  const modelSetters = useMemo(() => ({
    Procedimento: setProcedimento,
  }), []);

  // Funzione per ottenere il setter per una specifica classe
  const getSetter = useCallback((className) => {
    const setter = modelSetters[className];
    if (!setter) {
      throw new Error(`Setter non trovato per la classe: ${className}`);
    }
    return setter;
  }, [modelSetters]);

  // Mappatura dei modelli iniziali per ciascuna classe
  const initialModels = useMemo(() => ({
    Procedimento: new Procedimento(),
  }), []);

  const updateModel = ({ model, key, value }) => {
    const setter = getSetter( model.constructor.name);

    setter((prev) => {
      return produce(prev, draft => {
      draft[key] = value;
      });
    });
  };

  const resetModel = (model) => {
  
    if (!model) {
      console.error('Model non definito');
      return;
    }

    const className = model.constructor.name;
    const setter = getSetter(className);

    setter(initialModels[className]);
  }

  const getTouchedFields = (model) => {
    return null;
  }

  const isModified = (model) => {
    return null;
  }
  
  return {
    models: { procedimento, persone, regole },
    updateModel,
    resetModel,
    initialModels,
  };
};
