import { Comune } from '/src/vo/comune.js';

export class PersonaGiuridica {
    partitaIVA;
    denominazione;
    sedeLegale = new Comune(); 
    pecEmail;
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
