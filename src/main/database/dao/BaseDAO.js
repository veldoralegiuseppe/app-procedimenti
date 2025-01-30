const calculatePagination = (page, limit) => {
  const currentPage = Math.max(page, 1);
  const pageSize = Math.max(limit, 0);
  const skip = (currentPage - 1) * pageSize;
  return { skip, limit: pageSize, currentPage };
};

class BaseDAO {
  constructor(model) {
    this.Model = model;
  }

  async create(data) {
    console.log('BaseDAO create', data);
    return await this.Model.create(data)?.lean();
  }

  async findById(id) {
    return await this.Model.findById(id)?.lean();
  }

  async findAll(query = {}, page = 0, limit = 0, customAggregations = []) {
    if (customAggregations.length > 0) {
      return await this.#_findAllWithAggregation(query, page, limit, customAggregations);
    } else {
      return await this.#_findAll(query, page, limit);
    }
  }
  
  async #_findAll(query = {}, page = 0, limit = 0) {
    let results = [];
    let totalDocuments = 0;
    let totalPages = 0;

    // Calcola i parametri di paginazione utilizzando la funzione helper
    const {
      skip,
      limit: pageSize,
      currentPage,
    } = calculatePagination(page, limit);

    if (pageSize > 0) {
      // Esegui la query paginata
      results = await this.Model.find(query)
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec();

      // Conta il numero totale di documenti
      totalDocuments = await this.Model.countDocuments(query);

      // Calcola il numero totale di pagine
      totalPages = Math.ceil(totalDocuments / pageSize);
    } else {
      // Restituisci tutti i documenti senza paginazione
      results = await this.Model.find(query).lean().exec();

      // Conta il numero totale di documenti
      totalDocuments = results.length;

      // Con una sola pagina per tutti i risultati
      totalPages = 1;
    }

    // Restituisci sempre la stessa struttura
    return {
      results, // I risultati della query
      totalDocuments, // Numero totale di documenti
      totalPages, // Numero totale di pagine
      currentPage, // Pagina corrente
    };
  }

  async #_findAllWithAggregation(query = {}, page = 0, limit = 0, customAggregations = []) {
    const {
      skip,
      limit: pageSize,
      currentPage,
    } = calculatePagination(page, limit);

    const aggregationPipeline = [
      { $match: query },

      ...customAggregations,

      {
        $group: {
          _id: null,
          totalDocuments: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: this.Model.collection.name,
          pipeline: [
            { $match: query },
            { $sort: { _id: -1 } },
            ...(pageSize > 0 ? [{ $skip: skip }, { $limit: pageSize }] : []),
          ],
          as: 'results',
        },
      },

      {
        $project: {
          _id: 0, // Escludi l'ID dal risultato
          totalDocuments: 1, // Totale documenti
          results: 1, // Documenti paginati
          customStats: '$$ROOT', // Includi tutto il documento (inclusi i campi custom)
        },
      },
    ];

    const aggregationResults = await this.Model.aggregate(
      aggregationPipeline
    ).exec();

    const aggregatedData = aggregationResults[0] || {
      totalDocuments: 0,
      results: [],
    };

    const totalPages =
      pageSize > 0 ? Math.ceil(aggregatedData.totalDocuments / pageSize) : 1;

    return {
      ...aggregatedData, // Include tutti i campi calcolati dalla pipeline
      totalPages, // Mantieni il numero totale di pagine
      currentPage, // Mantieni la pagina corrente
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
