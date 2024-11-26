import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Procedimento } from '@model/Procedimento/procedimento';
import { useModel } from '@model/hooks/useModel';
import { Pipeline } from '@utils/pipeline';
import { inputValidator } from '@utils/filters/inputValidator';
import { updateValidator } from '@utils/filters/updateValidator';

export const useProcedimento = create(
  devtools(
    persist(
      (set, get) => {
        // Inizializza la pipeline una sola volta
        const updateModelPipeline = new Pipeline([]);

        return {
          model: new Procedimento().toJSON(),
          touchedFields: {},

          // Usa useModel per il resto delle operazioni
          ...useModel(set, get, {
            onSetProperty: (key, value) => {
              const result = updateModelPipeline.process({ key, value });
              if (result?.error) {
                console.error(
                  `Errore nella pipeline per ${key}:`,
                  result.error
                );
              }
            },
          }),
        };
      },
      {
        name: 'procedimento-store', // Nome dello storage (chiave in localStorage)
        partialize: (state) => ({ model: state.model }), // Salva solo il modello
      }
    ),
    {
      name: 'Procedimento Store', // Nome per Redux DevTools
    }
  )
);
