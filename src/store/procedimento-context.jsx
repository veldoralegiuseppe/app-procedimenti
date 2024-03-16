import { createContext } from "react";
import { Procedimento } from "/src/vo/procedimento.js";

export const ProcedimentoContext = createContext({
   procedimento: [new Procedimento(), undefined],
   parti: {personeFisiche: [],}

})