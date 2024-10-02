import { createContext } from 'react';
import { Procedimento } from '@model/procedimento.js';

export const ProcedimentoContext = createContext({
  // Procedimento
  procedimento: new Procedimento(),
  setProcedimento: () => {},

  // Parti e controparti
  persone: [],
  setPersone: () => {},
});
