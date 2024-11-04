import { Comune } from '@model/comune.js';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

export class PersonaFisica {
  codiceFiscale;
  cognome;
  nome;
  dataNascita;
  luogoDiNascita = new Comune();
  sesso;
  residenza = new Comune();
  indirizzoResidenza;
  partitaIVA;
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

  // Definizione di funzione tradizionale per mantenere il contesto di 'this'
  getDataNascitaLocale() {
    return this.dataNascita ? dayjs(this.dataNascita).format('DD/MM/YYYY') : null;
  }

  equals(p) {
    if (!p || !(p instanceof PersonaFisica)) return false;
    return JSON.stringify(this) === JSON.stringify(p);
  }

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

export class PersonaFisicaMetadata {
  codiceFiscale = {
    key: 'codiceFiscale',
    label: 'Codice Fiscale',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  cognome = {
    key: 'cognome',
    label: 'Cognome',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  nome = {
    key: 'nome',
    label: 'Nome',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  dataNascita = {
    key: 'dataNascita',
    label: 'Data di Nascita',
    type: 'date',
    descrizione: 'PERSONA FISICA',
  };
  luogoDiNascita = {
    key: 'luogoDiNascita',
    label: 'Luogo di Nascita',
    type: 'Comune',
    descrizione: 'PERSONA FISICA',
  };
  sesso = {
    key: 'sesso',
    label: 'Sesso',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  residenza = {
    key: 'residenza',
    label: 'Residenza',
    type: 'Comune',
    descrizione: 'PERSONA FISICA',
  };
  indirizzoResidenza = {
    key: 'indirizzoResidenza',
    label: 'Indirizzo di Residenza',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  partitaIVA = {
    key: 'partitaIVA',
    label: 'Partita IVA',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  pecEmail = {
    key: 'pecEmail',
    label: 'PEC Email',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  rappresentanteLegale = {
    key: 'rappresentanteLegale',
    label: 'Rappresentante Legale',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  rappresentanteLegalePecEmail = {
    key: 'rappresentanteLegalePecEmail',
    label: 'PEC Email del Rappresentante Legale',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  speseAvvio = {
    key: 'speseAvvio',
    label: 'Spese di Avvio',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  spesePostali = {
    key: 'spesePostali',
    label: 'Spese Postali',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  pagamentoIndennita = {
    key: 'pagamentoIndennita',
    label: 'Pagamento Indennità',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  importoMancatoAccordo = {
    key: 'importoMancatoAccordo',
    label: 'Importo Mancato Accordo',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  importoPositivoPrimoIncontro = {
    key: 'importoPositivoPrimoIncontro',
    label: 'Importo Positivo Primo Incontro',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  importoPositivoOltrePrimoIncontro = {
    key: 'importoPositivoOltrePrimoIncontro',
    label: 'Importo Positivo Oltre Primo Incontro',
    type: 'number',
    descrizione: 'PERSONA FISICA',
  };
  note = {
    key: 'note',
    label: 'Note',
    type: 'string',
    descrizione: 'PERSONA FISICA',
  };
  isParteIstante = {
    key: 'isParteIstante',
    label: 'È Parte Istante',
    type: 'boolean',
    descrizione: 'PERSONA FISICA',
  };
}
