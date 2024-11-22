import { immerable } from 'immer';
import _ from 'lodash';

export class Transazione {
  static [immerable] = true;

  static stati = {
    SALDATO: 'SALDATO',
    DA_SALDARE: 'DA SALDARE',
    PARZIALMENTE_SALDATO: 'PARZIALMENTE SALDATO',
  };

  static tipi = {
    USCITA: 'USCITA',
    ENTRATA: 'ENTRATA',
  };

  #stato;
  #tipo;
  #importoDovuto;
  #importoCorrisposto;
  #nome;

  constructor({ nome, tipo, importoDovuto, importoCorrisposto, stato }) {
    this.#nome = nome;
    this.#tipo = Transazione.tipi[tipo?.toUpperCase()] || Object.values(Transazione.tipi).includes(tipo?.toUpperCase()) ? tipo.toUpperCase() : Transazione.tipi.ENTRATA;
    this.#importoDovuto = importoDovuto || 0;
    this.#importoCorrisposto = importoCorrisposto || 0;
    this.stato = Transazione.stati[stato] || Object.values(Transazione.stati).includes(stato) ? stato : Transazione.stati.DA_SALDARE;
    this.validateImporti();
  }

  // Static methods
  static getMetadati(key) {
    const result = { ...metadati, className: this.name };
    return key ? result[key] : result;
  }

  // Getter and setter
  get nome() {
    return this.#nome;
  }

  get stato() {
    return this.#stato;
  }

  set stato(stato) {
    const newStato =
      Transazione.stati[stato] ||
      (Object.values(Transazione.stati).includes(stato) ? stato : this.#stato);

    switch (newStato) {
      case Transazione.stati.SALDATO:
        this.#stato = newStato;
        this.importoCorrisposto = this.importoDovuto;
        break;

      case Transazione.stati.PARZIALMENTE_SALDATO:
        this.#stato = newStato;
        break;

      case Transazione.stati.DA_SALDARE:
        this.#stato = newStato;
        this.importoCorrisposto = 0;
        break;

      default:
        console.error(`Stato ${newStato} non valido`);
        break;
    }
  }

  get tipo() {
    return this.#tipo;
  }

  set tipo(tipo) {
    this.#tipo =
      Transazione.tipi[tipo] || Object.values(Transazione.tipi).includes(tipo)
        ? tipo
        : this.#tipo;
  }

  get importoDovuto() {
    return this.#importoDovuto;
  }

  get importoCorrisposto() {
    return this.#importoCorrisposto;
  }

  set importoCorrisposto(importoCorrisposto) {
    if (importoCorrisposto < 0 || importoCorrisposto > this.importoDovuto) {
      throw new Error('Importo non valido');
    }

    this.#importoCorrisposto = importoCorrisposto;
  }

  // Validate
  validateImporti(){
    if (this.#importoDovuto < 0 || this.#importoCorrisposto < 0) {
      throw new Error('Importo non valido');
    }

    if (this.#importoCorrisposto > this.#importoDovuto) {
      throw new Error('Importo corrisposto maggiore di importo dovuto');
    }
  }

  validate() {
    switch (this.#stato) {
      case Transazione.stati.SALDATO:
        if (this.#importoDovuto !== this.#importoCorrisposto) {
          throw new Error('Importo dovuto e corrisposto diversi');
        }
        break;

      case Transazione.stati.PARZIALMENTE_SALDATO:
        if (this.#importoCorrisposto === 0) {
          throw new Error('Importo corrisposto nullo');
        }
        break;

      case Transazione.stati.DA_SALDARE:
        if (this.#importoCorrisposto !== 0) {
          throw new Error('Importo corrisposto diverso da zero');
        }
        break;

      default:
        throw new Error('Stato non valido');
    }
  }

  // Equals 
  equals(otherInstance, key) {
    if (!(otherInstance instanceof Transazione)) {
      throw new Error('Il parametro deve essere un\'istanza della classe Transazione');
    }
  
    if (key) {
      // Se viene specificata una chiave, confronta la proprietà corrispondente
      const thisValue = this[`#${key}`] || this[key];
      const otherValue = otherInstance[`#${key}`] || otherInstance[key];
  
      // Usa Lodash per confrontare i valori
      return _.isEqual(thisValue, otherValue);
    }
  
    // Confronto generale: confronta tutte le proprietà private e pubbliche
    return (
      _.isEqual(this.#nome, otherInstance.#nome) &&
      _.isEqual(this.#tipo, otherInstance.#tipo) &&
      _.isEqual(this.#importoDovuto, otherInstance.#importoDovuto) &&
      _.isEqual(this.#importoCorrisposto, otherInstance.#importoCorrisposto) &&
      _.isEqual(this.#stato, otherInstance.#stato)
    );
  }
  
}

// Constants
export const statoChipFlagMap = {
  [Transazione.stati.SALDATO]: 'green',
  [Transazione.stati.PARZIALMENTE_SALDATO]: 'yellow',
  [Transazione.stati.DA_SALDARE]: 'red',
};

const metadati = {};
