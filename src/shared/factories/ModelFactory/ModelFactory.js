class ModelFactory {
  #version;
  #metadata;

  constructor(version = null, metadata = {}) {
    this.#version = version || Object.keys(metadata).pop();

    if (!metadata[this.#version]) {
      throw new Error(`Versione ${version} della transazione non supportata`);
    }

    this.#metadata = metadata;
  }

  create(initialValues = {}) {
    const model = {};

    Object.entries(this.#metadata).forEach(([key, value]) => {
      model[key] = initialValues[key] || value.default;
      const validations =
        value.validations?.[
          initialValues[key] ? 'onRetrieval' : 'onConstruction'
        ] || {};

      validations.forEach((validation) => {
        const error = validation(model[key]);
        if (error) {
          throw new Error(`Errore di validazione per ${key}: ${error}`);
        }
      });
    });

    model.version = this.#version;
    return model;
  }

  get metadata() {
    return this.#metadata;
  }
}

export default ModelFactory;
