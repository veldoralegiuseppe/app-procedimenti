export class Comune {
    codice
    nome
    nomeStraniero
    codiceCatastale
    cap
    prefisso
    provincia = class {
      nome
      regione
      sigla
    }
    email
    pec
    telefono
    fax
    coordinate = class {
      lat
      lng
    }

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

   
}