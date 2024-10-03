import { Comune } from '@model/comune.js';

export class PersonaFisica {
  codiceFiscale;
  cognome;
  nome;
  dataNascita;
  dataNascitaLocale;
  luogoDiNascita = new Comune();
  sesso;
  residenza = new Comune();
  indirizzo;
  partitaIVA;
  denominazione;
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

  getTotaleSpese = () => {
    return (
      Number(this.speseAvvio) +
      Number(this.spesePostali) +
      Number(this.pagamentoIndennita) +
      Number(this.importoMancatoAccordo) +
      Number(this.importoPositivoPrimoIncontro) +
      Number(this.importoPositivoOltrePrimoIncontro)
    );
  };
}
