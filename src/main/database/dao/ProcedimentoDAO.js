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
    const pipeline = [
      // Step 1: Filtra i documenti iniziali
      { $match: query },

      // Step 2: Raggruppa le spese esterne a livello di documento
      {
        $group: {
          _id: null, // Raggruppa tutti i procedimenti
          totaleCompensoMediatoreDovuto: {
            $sum: '$compensoMediatore.importoDovuto',
          },
          totaleCompensoMediatoreCorrisposto: {
            $sum: '$compensoMediatore.importoCorrisposto',
          },
          totaleSpeseAvvioSedeSecondariaDovuto: {
            $sum: '$speseAvvioSedeSecondaria.importoDovuto',
          },
          totaleSpeseAvvioSedeSecondariaCorrisposto: {
            $sum: '$speseAvvioSedeSecondaria.importoCorrisposto',
          },
          totaleSpeseIndennitaSedeSecondariaDovuto: {
            $sum: '$speseIndennitaSedeSecondaria.importoDovuto',
          },
          totaleSpeseIndennitaSedeSecondariaCorrisposto: {
            $sum: '$speseIndennitaSedeSecondaria.importoCorrisposto',
          },
          persone: { $first: "$persone" },
        },
      },

      // Step 3: Esplodi l'array "persone"
      { $unwind: '$persone' },

      // Step 4: Calcola il totale delle spese per ogni persona
      {
        $addFields: {
          'persone.totalDovuto': {
            $add: [
              '$persone.speseAvvio.importoDovuto',
              '$persone.spesePostali.importoDovuto',
              '$persone.speseIndennita.importoDovuto',
              '$persone.speseMancatoAccordo.importoDovuto',
              '$persone.spesePositivoPrimoIncontro.importoDovuto',
              '$persone.spesePositivoOltrePrimoIncontro.importoDovuto',
            ],
          },
          'persone.totalCorrisposto': {
            $add: [
              '$persone.speseAvvio.importoCorrisposto',
              '$persone.spesePostali.importoCorrisposto',
              '$persone.speseIndennita.importoCorrisposto',
              '$persone.speseMancatoAccordo.importoCorrisposto',
              '$persone.spesePositivoPrimoIncontro.importoCorrisposto',
              '$persone.spesePositivoOltrePrimoIncontro.importoCorrisposto',
            ],
          },
        },
      },

      // Step 5: Raggruppa i dati per ruolo
      {
        $group: {
          _id: "$persone.ruolo", // Raggruppa per ruolo
          totalDovuto: { $sum: "$persone.totalDovuto" },
          totalCorrisposto: { $sum: "$persone.totalCorrisposto" },
          totaleCompensoMediatoreDovuto: { $first: "$totaleCompensoMediatoreDovuto" },
          totaleCompensoMediatoreCorrisposto: { $first: "$totaleCompensoMediatoreCorrisposto" },
          totaleSpeseAvvioSedeSecondariaDovuto: { $first: "$totaleSpeseAvvioSedeSecondariaDovuto" },
          totaleSpeseAvvioSedeSecondariaCorrisposto: { $first: "$totaleSpeseAvvioSedeSecondariaCorrisposto" },
          totaleSpeseIndennitaSedeSecondariaDovuto: { $first: "$totaleSpeseIndennitaSedeSecondariaDovuto" },
          totaleSpeseIndennitaSedeSecondariaCorrisposto: { $first: "$totaleSpeseIndennitaSedeSecondariaCorrisposto" },
        },
      },

      // Step 6: Raggruppa i dati globali
      {
        $group: {
          _id: null,
          incassoPartiDovuto: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'PARTE ISTANTE'] }, '$totalDovuto', 0],
            },
          },
          incassoPartiCorrisposto: {
            $sum: {
              $cond: [
                { $eq: ['$_id', 'PARTE ISTANTE'] },
                '$totalCorrisposto',
                0,
              ],
            },
          },
          incassoContropartiDovuto: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'CONTROPARTE'] }, '$totalDovuto', 0],
            },
          },
          incassoContropartiCorrisposto: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'CONTROPARTE'] }, '$totalCorrisposto', 0],
            },
          },

          // Passa direttamente le spese esterne senza risommare
          totaleCompensoMediatoreDovuto: {
            $first: '$totaleCompensoMediatoreDovuto',
          },
          totaleCompensoMediatoreCorrisposto: {
            $first: '$totaleCompensoMediatoreCorrisposto',
          },
          totaleSpeseAvvioSedeSecondariaDovuto: {
            $first: '$totaleSpeseAvvioSedeSecondariaDovuto',
          },
          totaleSpeseAvvioSedeSecondariaCorrisposto: {
            $first: '$totaleSpeseAvvioSedeSecondariaCorrisposto',
          },
          totaleSpeseIndennitaSedeSecondariaDovuto: {
            $first: '$totaleSpeseIndennitaSedeSecondariaDovuto',
          },
          totaleSpeseIndennitaSedeSecondariaCorrisposto: {
            $first: '$totaleSpeseIndennitaSedeSecondariaCorrisposto',
          },
        },
      },

      // Step 7: Proietta il risultato finale
      {
        $project: {
          _id: 0,
          incassoPartiDovuto: 1,
          incassoPartiCorrisposto: 1,
          incassoContropartiDovuto: 1,
          incassoContropartiCorrisposto: 1,
          totaleCompensoMediatoreDovuto: 1,
          totaleCompensoMediatoreCorrisposto: 1,
          totaleSpeseAvvioSedeSecondariaDovuto: 1,
          totaleSpeseAvvioSedeSecondariaCorrisposto: 1,
          totaleSpeseIndennitaSedeSecondariaDovuto: 1,
          totaleSpeseIndennitaSedeSecondariaCorrisposto: 1,
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
