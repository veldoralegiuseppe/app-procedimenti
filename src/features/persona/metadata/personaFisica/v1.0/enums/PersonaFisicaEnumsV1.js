const PersonaFisicaEnumsV1 = {
    sesso: ['UOMO', 'DONNA'],

    sezione: {
      ANAGRAFICA: ['codiceFiscale', 'nome', 'cognome', 'sesso', 'dataNascita', 'provinciaNascita', 'comuneNascita', 'capComuneNascita'],
      DOMICILIO: ['provinciaResidenza', 'comuneResidenza', 'capComuneResidenza', 'indirizzoResidenza'],
      DITTA_INDIVIDUALE: ['partitaIVA'],
      RECAPITI: ['pecEmail'],
      RAPPRESENTANTE_LEGALE: ['nomeRappresentanteLegale', 'cognomeRappresentanteLegale', 'pecEmailRappresentanteLegale'],
      NOTE_AGGIUNTIVE: ['note'],
    },

    ruolo: [{ value: 'PARTE_ISTANTE', label: 'PARTE ISTANTE' }, { value: 'CONTROPARTE', label: 'CONTROPARTE' }],
  };
  
  export default PersonaFisicaEnumsV1;
  