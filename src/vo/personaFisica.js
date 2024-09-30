import { Comune } from '/src/vo/comune.js';

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
    pecEmail;
    partitaIVA;
    denominazione;
    rappresentanteLegale;
    rappresentanteLegalePecEmail;
    speseAvvio = 0;
    spesePostali = 0;
    pagamentoIndennita = 0;
    note;

    equals = (p) => {
        if (!p || !(p instanceof PersonaFisica)) return false;
        return JSON.stringify(this) === JSON.stringify(p);
    };
}
