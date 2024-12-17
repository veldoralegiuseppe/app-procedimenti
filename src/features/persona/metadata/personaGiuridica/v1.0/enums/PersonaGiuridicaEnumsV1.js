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

  ruolo: [
    { value: 'PARTE_ISTANTE', label: 'PARTE ISTANTE' },
    { value: 'CONTROPARTE', label: 'CONTROPARTE' },
  ],
};

export default PersonaGiuridicaEnumsV1;
