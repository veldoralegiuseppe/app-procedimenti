
const ProcedimentoDAO = require('./ProcedimentoDAO');
const { ModelTypes } = require('@shared/metadata');

class DAOFactory {

    static daoMap = {
        [ModelTypes.PROCEDIMENTO]: ProcedimentoDAO,
    }

    constructor() {
    }

    static getDAO(modelType) {
        if (!this.daoMap[modelType]) {
            throw new Error(`DAO for model type ${modelType} not found`);
        }
        return this.daoMap[modelType];
    }
}

module.exports = DAOFactory;