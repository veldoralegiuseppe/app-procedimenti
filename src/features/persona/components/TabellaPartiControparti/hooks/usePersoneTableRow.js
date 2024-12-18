import { useMemo } from "react";
import {ImportoUtils} from '@shared/utils';

const usePersoneTableRow = ({ persone = [] }) => {
  const mapToRow = (persona) => {
    const formatCurrency = (amount) => {
      return ImportoUtils.formattaImporto(amount);
    };

    return {
      anagrafica: `${persona.nome} ${persona.cognome}`,
      ruolo: persona.ruolo,
      speseAvvio: formatCurrency(persona.speseAvvio?.importoDovuto),
      spesePostali: formatCurrency(persona.spesePostali?.importoDovuto),
      speseIndennita: formatCurrency(persona.speseIndennita?.importoDovuto),
      spesePositivoPrimoIncontro: formatCurrency(persona.spesePositivoPrimoIncontro?.importoDovuto),
      spesePositivoOltrePrimoIncontro: formatCurrency(persona.spesePositivoOltrePrimoIncontro?.importoDovuto),
      speseMancatoAccordo: formatCurrency(persona.speseMancatoAccordo?.importoDovuto),
      totale: formatCurrency([
        persona.speseAvvio?.importoDovuto || 0,
        persona.spesePostali?.importoDovuto || 0,
        persona.speseIndennita?.importoDovuto || 0,
        persona.spesePositivoPrimoIncontro?.importoDovuto || 0,
        persona.spesePositivoOltrePrimoIncontro?.importoDovuto || 0,
        persona.speseMancatoAccordo?.importoDovuto || 0,
      ].reduce((acc, curr) => acc + curr, 0)),
    };
  };
  const rows = useMemo(() => persone.map(mapToRow), [persone]);

  return {data: rows}
};

export default usePersoneTableRow;
