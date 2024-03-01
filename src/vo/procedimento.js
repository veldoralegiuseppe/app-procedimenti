export class Procedimento {
    idProcedimento
    numProtocollo
    annoProtocollo
    dataDeposito
    dataDepositoLocale
    sede
    dataOraIncontro
    dataIncontroLocale
    oraIncontroLocale
    oggettoControversia
    valoreControversia

    getProtocollo = () => {return this.numProtocollo+'/'+this.annoProtocollo}
}