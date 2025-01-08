class BaseDAO {
  constructor(model) {
    this.Model = model;
  }

  async create(data) {
    console.log('BaseDAO create', data);
    return await this.Model.create(data);
  }

  async findById(id) {
    return await this.Model.findById(id);
  }

  async findAll(query = {}, page = 0, limit = 0) {
    let results = [];
    let totalDocuments = 0;
    let totalPages = 0;
    //console.log('BaseDAO findAll', query, page, limit, this.Model);

    if (page > 0 && limit > 0) {
      // Calcola quanti documenti saltare
      const skip = (page - 1) * limit;

      // Esegui la query paginata
      results = await this.Model.find(query).skip(skip).limit(limit).lean().exec();

      // Conta il numero totale di documenti
      totalDocuments = await this.Model.countDocuments(query);

      // Calcola il numero totale di pagine
      totalPages = Math.ceil(totalDocuments / limit);
    } else {
      // Restituisci tutti i documenti senza paginazione
      results = await this.Model.find(query).lean().exec();

      // Conta il numero totale di documenti
      totalDocuments = results.length;

      // Con una sola pagina per tutti i risultati
      totalPages = 1;
      page = 1; // Setta la pagina corrente a 1
    }

    // Restituisci sempre la stessa struttura
    console.log('BaseDAO findAll results', {
      results, // I risultati della query
      totalDocuments, // Numero totale di documenti
      totalPages, // Numero totale di pagine
      currentPage: page, // Pagina corrente
    });
    return {
      results, // I risultati della query
      totalDocuments, // Numero totale di documenti
      totalPages, // Numero totale di pagine
      currentPage: page, // Pagina corrente
    };
  }

  async updateById(id, data) {
    return await this.Model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await this.Model.findByIdAndDelete(id);
  }
}

module.exports = BaseDAO;
