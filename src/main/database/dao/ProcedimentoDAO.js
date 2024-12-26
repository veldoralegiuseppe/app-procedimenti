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

  validate(procedimento) {
    const regexProtocollo = /^[0-9]{6}\/[0-9]{4}$/;

    if (!procedimento.numProtocollo || !regexProtocollo.test(procedimento.numProtocollo)) {
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
