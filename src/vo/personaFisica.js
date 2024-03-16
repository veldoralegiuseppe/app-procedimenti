export class PersonaFisica {
    codiceFiscale
    cognome
    nome
    dataNascita
    dataNascitaLocale
    comuneNascita
    sesso
    comuneResidenza
    indirizzo
    cap
    pec
    email
    partitaIVA
    denominazione
    assistenzaLegale
    speseAvvio
    spesePostali
    pagamentoIndennita
    note
    
    equals = (p) => {
        if(!p || !p instanceof PersonaFisica) return false
        return JSON.stringify(this) == JSON.stringify(p)
    }
}