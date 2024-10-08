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
