import dayjs from 'dayjs';
import 'dayjs/locale/it';

export class Procedimento {
  numProtocollo;
  annoProtocollo;
  dataDeposito = new Date().toDateString();
  sede;
  sedeSvolgimento;
  dataOraIncontro = null;
  oggettoControversia;
  valoreControversia = 0;

  getProtocollo = () => {
    return (this.numProtocollo && this.annoProtocollo) ? (this.numProtocollo + '/' + this.annoProtocollo) : null;
  };

  equals = (p) => {
    if (!p || !p instanceof Procedimento) return false;
    return JSON.stringify(this) == JSON.stringify(p);
  };

  getDataDepositoLocale = () => {
    return this.dataDeposito ? dayjs(this.dataDeposito).format('DD/MM/YYYY') : null;
  }

  getDataOraIncontroLocale = () => {
    return this.dataOraIncontro ? dayjs(this.dataOraIncontro).format('DD/MM/YYYY HH:mm') : null;
  }
}
