import { Comune } from "@shared/components";

export class PersonaGiuridica {
  partitaIVA;
  denominazione;
  sedeLegale = new Comune();
  indirizzoSedeLegale;
  pecEmail;
  rappresentanteLegale;
  rappresentanteLegalePecEmail;
  speseAvvio = 0;
  spesePostali = 0;
  pagamentoIndennita = 0;
  importoMancatoAccordo = 0;
  importoPositivoPrimoIncontro = 0;
  importoPositivoOltrePrimoIncontro = 0;
  note;
  isParteIstante;

  equals = (p) => {
    if (!p || !(p instanceof PersonaFisica)) return false;
    return JSON.stringify(this) === JSON.stringify(p);
  };

  getTotaleSpese() {
    return (
      Number(this.speseAvvio) +
      Number(this.spesePostali) +
      Number(this.pagamentoIndennita) +
      Number(this.importoMancatoAccordo) +
      Number(this.importoPositivoPrimoIncontro) +
      Number(this.importoPositivoOltrePrimoIncontro)
    );
  }
}

export class PersonaGiuridicaMetadata {
  partitaIVA = {
    key: 'partitaIVA',
    label: 'Partita IVA',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  denominazione = {
    key: 'denominazione',
    label: 'Denominazione',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  sedeLegale = {
    key: 'sedeLegale',
    label: 'Sede Legale',
    type: 'Comune',
    descrizione: 'PERSONA GIURIDICA',
  };
  indirizzoSedeLegale = {
    key: 'indirizzoSedeLegale',
    label: 'Indirizzo Sede Legale',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  pecEmail = {
    key: 'pecEmail',
    label: 'PEC Email',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  rappresentanteLegale = {
    key: 'rappresentanteLegale',
    label: 'Rappresentante Legale',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  rappresentanteLegalePecEmail = {
    key: 'rappresentanteLegalePecEmail',
    label: 'Rappresentante Legale PEC Email',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  speseAvvio = {
    key: 'speseAvvio',
    label: 'Spese Avvio',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  spesePostali = {
    key: 'spesePostali',
    label: 'Spese Postali',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  pagamentoIndennita = {
    key: 'pagamentoIndennita',
    label: 'Pagamento Indennità',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  importoMancatoAccordo = {
    key: 'importoMancatoAccordo',
    label: 'Importo Mancato Accordo',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  importoPositivoPrimoIncontro = {
    key: 'importoPositivoPrimoIncontro',
    label: 'Importo Positivo Primo Incontro',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  importoPositivoOltrePrimoIncontro = {
    key: 'importoPositivoOltrePrimoIncontro',
    label: 'Importo Positivo Oltre Primo Incontro',
    type: 'number',
    descrizione: 'PERSONA GIURIDICA',
  };
  note = {
    key: 'note',
    label: 'Note',
    type: 'string',
    descrizione: 'PERSONA GIURIDICA',
  };
  isParteIstante = {
    key: 'isParteIstante',
    label: 'È Parte Istante',
    type: 'boolean',
    descrizione: 'PERSONA GIURIDICA',
  };
}
