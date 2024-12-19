import { useMemo } from "react";
import {ImportoUtils} from '@shared/utils';
import {FieldTypes} from '@shared/metadata';

const usePersoneTableRow = ({ persone = [] }) => {
  const mapToRow = (persona) => {
    const tipoPersona = persona.type;

    const formatCurrency = (amount) => {
      return ImportoUtils.formattaImporto(amount);
    };

    return {
      anagrafica: tipoPersona === FieldTypes.PERSONA_FISICA ? `${persona.nome} ${persona.cognome}` : persona.denominazione,
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
