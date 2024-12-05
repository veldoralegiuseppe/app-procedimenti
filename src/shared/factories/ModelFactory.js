import { ProcedimentoMetadata } from '@features/procedimento';
import { TransazioneMetadata } from '@features/transazione';
import { FieldTypes, ValidationHooksTypes } from '@shared/metadata';

/**
 * Classe per la creazione di oggetti basati su versioni specifiche e metadati.
 */
export default class ModelFactory {
  static #metadata = {
    [FieldTypes.PROCEDIMENTO]: ProcedimentoMetadata,
    [FieldTypes.TRANSAZIONE]: TransazioneMetadata,
  };

  /**
   * Metodo statico per creare un oggetto secondo il tipo, la versione e i valori iniziali specificati.
   *
   * @param {Object} initialValues - I valori iniziali per il modello.
   * @returns {Object} L'istanza del modello creata.
   * @throws {Error} Se la validazione fallisce per qualsiasi campo.
   */
  static create({ initialValues = {}, type, version }) {
    const model = {};
    const typeMetadata = ModelFactory.#metadata[type];

    if (!typeMetadata) {
      console.error(`Tipo ${type} non supportato`);
      return model;
    }

    const modelVersion = version ? version : Object.keys(typeMetadata).pop();
    const metadata = typeMetadata[modelVersion]?.metadata;

    if (!metadata) {
      console.error(`Versione ${version} di ${type} non supportata`);
      return model;
    }

    // Costruisce l'oggetto in base alla versione
    Object.entries(metadata).forEach(([key, value]) => {

      if(key === 'type'){
        model[key] = value;
      }
      else if (typeof value.type === 'object' && value.type === FieldTypes.TRANSAZIONE || value.type === FieldTypes.PROCEDIMENTO){
        model[key] = ModelFactory.create({
          initialValues: initialValues[key] || value.default || {},
          type: value.type,
          version: value.version,
        });
      }
      else {
        model[key] = initialValues[key] || value.default;
        const validations =
          value.validations?.[
            initialValues[key] ? ValidationHooksTypes.ON_RETRIEVAL : ValidationHooksTypes.ON_CONSTRUCTION
          ] || [];

        validations.forEach((validation) => {
          const errorMessage = validation(model[key]);
          if (errorMessage !== true) {
            throw new Error(
              `Errore di validazione per ${type}[${key}]: ${errorMessage}`
            );
          }
        });
      }
    });

    // Rimuove le key non presenti nella versione indicata
    Object.keys(initialValues).forEach((key) => {
      if (!metadata.hasOwnProperty(key)) {
        delete model[key];
      }
    });

    model.version = modelVersion;
    return model;
  }

  /**
   * Metodo statico per ottienre i metadati per per il tipo e la versione specificati, se non specificati vengono ritornati tutti i metadati.
   *
   * @param {string} type - Il tipo dell'oggetto.
   * @param {string} version - La versione dell'oggetto.
   * @returns {Object} I metadati e gli enums per la versione corrente.
   */
  static getMetadata(type, version) {
    //console.log('type', type, 'version', version)
    if (!type && !version) return ModelFactory.#metadata;

    const typeMetadata = ModelFactory.#metadata[type];
    
    if (!version) return typeMetadata[Object.keys(typeMetadata).pop()];
    return typeMetadata[version];
  }
}
