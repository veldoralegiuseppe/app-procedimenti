class Pipeline {
  _filters = [];

  constructor(filters) {
    this._filters = filters ? filters : [];
  }

  /**
   * Aggiunge un filtro alla pipeline.
   * @param {Object} filter - Un oggetto che implementa un metodo process(context).
   */
  addFilter(filter) {
    if (typeof filter.process !== 'function') {
      throw new Error(
        'Il filtro deve implementare un metodo process(context).'
      );
    }
    this._filters.push(filter);
  }

  /**
   * Elabora il contesto passandolo attraverso tutti i filtri in sequenza.
   * @param {Object} context - Il contesto da elaborare.
   * @returns {Object} - Il contesto elaborato.
   */
  process(context) {
    const result = this._filters.reduce((data, filter) => {
      return filter.process(data);
    }, context);

    return result;
  }
}

export default Pipeline;
