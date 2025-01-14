const BaseDAO = require('./BaseDAO');
const { PersonaEnumsV1, ModelTypes } = require('@shared/metadata');

class ProcedimentoDAO extends BaseDAO {
  constructor(Model) {
    super(Model);
    this.Model = Model; // Salva il riferimento al modello
  }

  async create(procedimento) {
    console.log('ProcedimentoDAO create', procedimento);

    // Esegui la validazione
    this.validate(procedimento);

    // Imposta `_id` come `numProtocollo`
    procedimento['_id'] = procedimento.numProtocollo;

    return await super.create(procedimento);
  }

  async calculateStatistics(query = {}) {
    const pipelineTransazioniGlobali = [
      {
        $project: {
          transazioni: {
            $filter: {
              input: { $objectToArray: '$$ROOT' }, // Converte la root in un array di chiavi-valori
              as: 'field',
              cond: { $eq: ['$$field.v.type', 'transazione'] }, // Filtra gli oggetti con type = "transazione"
            },
          },
        },
      },
      { $unwind: '$transazioni' },
      {
        $group: {
          _id: '$transazioni.v.key',
          transazione: { $mergeObjects: '$transazioni.v' },
          importoDovuto: { $sum: '$transazioni.v.importoDovuto' },
          importoCorrisposto: { $sum: '$transazioni.v.importoCorrisposto' },
        },
      },
      {
        $project: {
          _id: 0,
          transazione: {
            $mergeObjects: [
              '$transazione',
              {
                importoDovuto: '$importoDovuto',
                importoCorrisposto: '$importoCorrisposto',
                owner: null,
                stato: {
                  $cond: [
                    { $eq: ['$importoCorrisposto', '$importoDovuto'] },
                    'SALDATO',
                    {
                      $cond: [
                        { $eq: ['$importoCorrisposto', 0] },
                        'DA SALDARE',
                        'PARZIALMENTE SALDATO',
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ];

    const pipelineTransazioniPersone = [
      { $unwind: { path: '$persone', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          transazioni: {
            $filter: {
              input: { $objectToArray: '$persone' }, // Converte ogni persona in un array di chiavi-valori
              as: 'field',
              cond: { $eq: ['$$field.v.type', 'transazione'] }, // Filtra i sotto-oggetti con type = "transazione"
            },
          },
        },
      },
      { $unwind: '$transazioni' },
      {
        $group: {
          _id: { key: '$transazioni.v.key', owner: '$persone.type' },
          transazione: { $mergeObjects: '$transazioni.v' },
          importoDovuto: { $sum: '$transazioni.v.importoDovuto' },
          importoCorrisposto: { $sum: '$transazioni.v.importoCorrisposto' },
        },
      },
      {
        $project: {
          _id: 0,
          transazione: {
            $mergeObjects: [
              '$transazione',
              {
                importoDovuto: '$importoDovuto',
                importoCorrisposto: '$importoCorrisposto',
                owner: null,
                stato: {
                  $cond: [
                    { $eq: ['$importoCorrisposto', '$importoDovuto'] },
                    'SALDATO',
                    {
                      $cond: [
                        { $eq: ['$importoCorrisposto', 0] },
                        'DA SALDARE',
                        'PARZIALMENTE SALDATO',
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ];

    const pipelineMediatore = [
      // Filtra solo i documenti con mediatori definiti
      // {
      //   $match: {
      //     nomeMediatore: { $exists: true, $ne: null },
      //     cognomeMediatore: { $exists: true, $ne: null },
      //   },
      // },
      // Raggruppa per nome e cognome del mediatore
      {
        $group: {
          _id: {
            nomeMediatore: '$nomeMediatore',
            cognomeMediatore: '$cognomeMediatore',
          },
          count: { $sum: 1 }, // Conta il numero di procedimenti per ogni mediatore
        },
      },
      // Proietta il risultato finale
      {
        $project: {
          _id: 0,
          nomeMediatore: '$_id.nomeMediatore',
          cognomeMediatore: '$_id.cognomeMediatore',
          count: 1,
        },
      },
    ];

    const pipelineFasceValoreControversia = [
      {
        $match: {
          valoreControversia: { $type: 'number' }, // Considera solo valori numerici
        },
      },
      {
        $addFields: {
          fascia: {
            $switch: {
              branches: [
                {
                  case: { $lte: ['$valoreControversia', 1000] },
                  then: 'Fino a €1.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 1000] },
                      { $lte: ['$valoreControversia', 5000] },
                    ],
                  },
                  then: 'Da €1.001 a €5.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 5000] },
                      { $lte: ['$valoreControversia', 10000] },
                    ],
                  },
                  then: 'Da €5.001 a €10.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 10000] },
                      { $lte: ['$valoreControversia', 25000] },
                    ],
                  },
                  then: 'Da €10.001 a €25.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 25000] },
                      { $lte: ['$valoreControversia', 50000] },
                    ],
                  },
                  then: 'Da €25.001 a €50.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 50000] },
                      { $lte: ['$valoreControversia', 150000] },
                    ],
                  },
                  then: 'Da €50.001 a €150.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 150000] },
                      { $lte: ['$valoreControversia', 250000] },
                    ],
                  },
                  then: 'Da €150.001 a €250.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 250000] },
                      { $lte: ['$valoreControversia', 500000] },
                    ],
                  },
                  then: 'Da €250.001 a €500.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 500000] },
                      { $lte: ['$valoreControversia', 1500000] },
                    ],
                  },
                  then: 'Da €500.001 a €1.500.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 1500000] },
                      { $lte: ['$valoreControversia', 2500000] },
                    ],
                  },
                  then: 'Da €1.500.001 a €2.500.000',
                },
                {
                  case: {
                    $and: [
                      { $gt: ['$valoreControversia', 2500000] },
                      { $lte: ['$valoreControversia', 5000000] },
                    ],
                  },
                  then: 'Da €2.500.001 a €5.000.000',
                },
              ],
              default: 'Oltre €5.000.000',
            },
          },
        },
      },
      {
        $group: {
          _id: '$fascia', // Raggruppa per fascia calcolata
          count: { $sum: 1 }, // Conta i documenti per fascia
        },
      },
      {
        $project: {
          fascia: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ];

    const pipelineEsito = [
      {
        $group: {
          _id: '$esitoMediazione',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          esito: '$_id',
          count: 1,
        },
      },
    ];

    const pipeline = [
      { $match: query },
      {
        $facet: {
          transazioniGlobali: pipelineTransazioniGlobali,
          transazioniPersone: pipelineTransazioniPersone,
          mediatori: pipelineMediatore,
          esiti: pipelineEsito,
          valoriControversie: pipelineFasceValoreControversia,
        },
      },
      {
        $project: {
          transazioniGlobali: 1,
          transazioniPersone: 1,
          mediatori: 1,
          esiti: 1,
          valoriControversie: 1,
        },
      },
    ];

    const statistics = await this.Model.aggregate(pipeline).exec();
    return statistics[0] || {};
  }

  validate(procedimento) {
    const regexProtocollo = /^[0-9]{6}\/[0-9]{4}$/;

    if (
      !procedimento.numProtocollo ||
      !regexProtocollo.test(procedimento.numProtocollo)
    ) {
      throw new Error('Il numero di protocollo è obbligatorio');
    }

    if (
      !Array.isArray(procedimento.persone) ||
      procedimento.persone.length === 0
    ) {
      throw new Error('Deve essere specificata almeno una parte e controparte');
    }

    const hasParte = procedimento.persone.some(
      (persona) => persona.ruolo === PersonaEnumsV1.ruolo.PARTE_ISTANTE
    );
    const hasControparte = procedimento.persone.some(
      (persona) => persona.ruolo === PersonaEnumsV1.ruolo.CONTROPARTE
    );

    if (!hasParte) {
      throw new Error('Deve essere specificata almeno una parte');
    }

    if (!hasControparte) {
      throw new Error('Deve essere specificata almeno una controparte');
    }

    procedimento.persone.forEach((persona) => {
      if (persona.tipoPersona === ModelTypes.PERSONA_FISICA) {
        if (!persona.nome || !persona.cognome) {
          throw new Error('Le persone fisiche devono avere nome e cognome');
        }
      } else if (persona.tipoPersona === ModelTypes.PERSONA_GIURIDICA) {
        if (!persona.denominazione) {
          throw new Error(
            'Le persone giuridiche devono avere la denominazione'
          );
        }
      }
    });
  }
}

module.exports = ProcedimentoDAO;
