import PersonaEnumsV1 from "./PersonaEnumsV1";

const PersonaGiuridicaEnumsV1 = {
  sezione: {
    PROFILO_SOCIETARIO: ['partitaIVA', 'denominazione'],
    SEDE_LEGALE: [
      'provinciaSedeLegale',
      'comuneSedeLegale',
      'capComuneSedeLegale',
      'indirizzoSedeLegale',
    ],
    RECAPITI: ['pecEmail'],
    RAPPRESENTANTE_LEGALE: [
      'nomeRappresentanteLegale',
      'cognomeRappresentanteLegale',
      'pecEmailRappresentanteLegale',
    ],
    NOTE_AGGIUNTIVE: ['note'],
  },

  ruolo: Object.entries(PersonaEnumsV1.ruolo).map(([value, label]) => ({label, value})),
};

export default PersonaGiuridicaEnumsV1;
