import {Provincia} from '@ui-shared/components';

export class Comune {
    codice
    nome
    nomeStraniero
    codiceCatastale
    cap
    prefisso
    provincia = new Provincia()
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