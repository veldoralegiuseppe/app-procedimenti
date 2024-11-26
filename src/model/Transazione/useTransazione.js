import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Transazione } from './transazione';
import { useModel } from '@model/hooks/useModel';
import { Pipeline } from '@utils/pipeline';
import { inputValidator } from '@utils/filters/inputValidator';
import { updateValidator } from '@utils/filters/updateValidator';

export const useTransazione = ({initialModel}) => create(
  devtools(
    persist(
      (set, get) => {
        // Inizializza la pipeline una sola volta
        const updateModelPipeline = new Pipeline([]);

        return {
          model: initialModel || new Transazione(),
          touchedFields: {},

          // Usa useModel per il resto delle operazioni
          ...useModel(set, get, {
            onSetProperty: (key, value) => {
              const result = updateModelPipeline.process({ key, value });
              if (result?.error) {
                console.error(`Errore nella pipeline per ${key}:`, result.error);
              }
            },
          }),
        };
      },
      {
        name: 'transazione-store', // Nome dello storage (chiave in localStorage)
        partialize: (state) => ({ model: state.model }), // Salva solo il modello
      }
    ),
    {
      name: 'Transazione Store', // Nome per Redux DevTools
    }
  )
);
