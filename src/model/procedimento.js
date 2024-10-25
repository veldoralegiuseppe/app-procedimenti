import dayjs from 'dayjs';
import 'dayjs/locale/it';

export class Procedimento {
  constructor({
    numProtocollo,
    annoProtocollo = String(new Date().getFullYear()),
    dataDeposito = new Date().toDateString(),
    sedeDeposito,
    sedeSvolgimento,
    dataOraIncontro = null,
    oggettoControversia,
    valoreControversia = 0,
    esitoMediazione,
    modalitaSvolgimento,
    nomeMediatore,
    cognomeMediatore,
    titoloMediatore,
    totaleIncontri = 0,
    isDemandata = false,
    causaleDemandata,
    materiaCausaleDemandata,
  } = {}) {
    this.numProtocollo = numProtocollo;
    this.annoProtocollo = annoProtocollo;
    this.dataDeposito = dataDeposito;
    this.sedeDeposito = sedeDeposito;
    this.sedeSvolgimento = sedeSvolgimento;
    this.dataOraIncontro = dataOraIncontro;
    this.oggettoControversia = oggettoControversia;
    this.valoreControversia = valoreControversia;
    this.esitoMediazione = esitoMediazione;
    this.modalitaSvolgimento = modalitaSvolgimento;
    this.totaleIncontri = totaleIncontri;
    this.nomeMediatore = nomeMediatore;
    this.cognomeMediatore = cognomeMediatore;
    this.titoloMediatore = titoloMediatore; 
    this.isDemandata = isDemandata;
    this.causaleDemandata = causaleDemandata;
    this.materiaCausaleDemandata = materiaCausaleDemandata;
  }

  getProtocollo() {
    return this.numProtocollo && this.annoProtocollo
      ? `${this.numProtocollo}/${this.annoProtocollo}`
      : null;
  }

  equals(p) {
    if (!p || !(p instanceof Procedimento)) return false;
    return JSON.stringify(this) === JSON.stringify(p);
  }

  getDataDepositoLocale() {
    return this.dataDeposito
      ? dayjs(this.dataDeposito).format('DD/MM/YYYY')
      : null;
  }

  getDataOraIncontroLocale() {
    return this.dataOraIncontro
      ? dayjs(this.dataOraIncontro).format('DD/MM/YYYY HH:mm')
      : null;
  }
}
