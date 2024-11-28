import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { useProcedimento } from '@features/procedimento';
import { usePersone } from '@features/persona';

const useGlobalStore = ({ procedimento, persone=[] }) =>
  create(
    devtools((set, get) => ({

      // Slice per Procedimento
      procedimento: {
        ...useProcedimento({ set, get, initialProcedimento: procedimento, options: {namespace: 'procedimento'} }),
      },

      // Slice per Parti e Controparti
      persone: {
        ...usePersone({ set, get, initialPersone: persone, options: {namespace: 'persone'} }),
      },

    })),
    { name: 'global-store' }
  );
