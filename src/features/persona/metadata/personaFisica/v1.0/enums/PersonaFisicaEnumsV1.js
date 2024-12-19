import PersonaEnumsV1 from "../../../v1.0/enums/PersonaEnumsV1";

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

    ruolo: Object.entries(PersonaEnumsV1.ruolo).map(([value, label]) => ({label, value})),
  };
  
  export default PersonaFisicaEnumsV1;
  