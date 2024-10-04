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
    return this.numProtocollo + '/' + this.annoProtocollo;
  };
  equals = (p) => {
    if (!p || !p instanceof Procedimento) return false;
    return JSON.stringify(this) == JSON.stringify(p);
  };

  getDataDepositoLocale = () => {
    return dayjs(dataDeposito).format('DD/MM/YYYY');
  }

  getDataOraIncontroLocale = () => {
    return dayjs(dataOraIncontro).format('DD/MM/YYYY HH:mm');
  }
}
