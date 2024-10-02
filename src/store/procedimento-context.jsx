import { createContext } from 'react';
import { Procedimento } from '/src/vo/procedimento.js';

export const ProcedimentoContext = createContext({
  // Procedimento
  procedimento: new Procedimento(),
  setProcedimento: () => {},

  // Parti e controparti
  persone: [],
  setPersone: () => {},
});
