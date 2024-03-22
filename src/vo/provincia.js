export class Provincia{
    codice
    nome
    sigla
    regione

    constructor(obj) {
        obj && Object.assign(this, obj);
    }
}