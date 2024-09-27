import { Comune } from '/src/vo/comune.js';

export class PersonaFisica {
    codiceFiscale;
    cognome;
    nome;
    dataNascita;
    dataNascitaLocale;
    comuneNascita = new Comune(); 
    provinciaNascita;
    sesso;
    comuneResidenza = new Comune();  
    indirizzo;
    pec;
    email;
    partitaIVA;
    denominazione;
    assistenzaLegale;
    speseAvvio;
    spesePostali;
    pagamentoIndennita;
    note;

    equals = (p) => {
        if (!p || !(p instanceof PersonaFisica)) return false;
        return JSON.stringify(this) === JSON.stringify(p);
    };
}
