export class Procedimento {
    idProcedimento
    numProtocollo 
    annoProtocollo = '2024'
    dataDeposito = new Date().toDateString()
    dataDepositoLocale 
    sede
    dataOraIncontro
    dataIncontroLocale
    oraIncontroLocale
    oggettoControversia
    valoreControversia

    getProtocollo = () => {return this.numProtocollo+'/'+this.annoProtocollo}
    equals = (p) => {
        if(!p || !p instanceof Procedimento) return false
        // let isEqual = true
        // let keys = Object.keys(p)

        // for(let i=0; i<keys.length; i++){
        //     console.log(`This: ${keys[i]}:${this[keys[i]]}`)
        //     console.log(`P: ${keys[i]}:${p[keys[i]]}`)
        //     if( keys[i] != 'equals' && keys[i] != 'getProtocollo' && !(this[keys[i]] == p[keys[i]]) ){
        //         isEqual = false
        //         break
        //     } 
        // }

        // console.log(`Sono uguali: ${isEqual}`)
        
        return JSON.stringify(this) == JSON.stringify(p)
    }
}