const PersonaFisicaEnumsV1 = {
    sesso: ['Uomo', 'Donna'],

    sezione: {
      ANAGRAFICA: ['codiceFiscale', 'nome', 'cognome', 'sesso', 'dataNascita', 'provinciaNascita', 'comuneNascita', 'capComuneNascita'],
      DOMICILIO: ['provinciaResidenza', 'comuneResidenza', 'capComuneResidenza'],
      DITTA_INDIVIDUALE: ['partitaIVA'],
      RECAPITI: ['pecEmail'],
      RAPPRESENTANTE_LEGALE: ['nomeRappresentanteLegale', 'cognomeRappresentanteLegale', 'pecEmailRappresentanteLegale'],
      NOTE_AGGIUNTIVE: ['note'],
    },
  };
  
  export default PersonaFisicaEnumsV1;
  