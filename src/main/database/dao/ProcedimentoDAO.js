const BaseDAO = require('./BaseDAO');

class ProcedimentoDAO extends BaseDAO {
    constructor(Model) {
        super(Model);
    }

    async create(procedimento){

        console.log('ProcedimentoDAO create', procedimento)
        if(!procedimento.numProtocollo)
            throw new Error('Il numero di protocollo è obbligatorio');

        procedimento['_id'] = procedimento.numProtocollo;
        return await super.create(procedimento);
    }
}

module.exports = ProcedimentoDAO;