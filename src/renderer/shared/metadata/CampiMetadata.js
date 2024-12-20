import FieldTypes from "./enums/FieldTypes"
import InputTypes from "./enums/InputTypes"

const CampiMetadata = {
    key: {
        isRequired: () => true,
        type: 'string',
        description: 'Identificatore del campo'
    },
    type: {
        isRequired: () => true,
        description: 'Tipo del campo',
        enums: FieldTypes
    },
    inputType: {
        isRequired: () => false,
        type: 'string',
        description: 'Tipo di input di default del campo',
        enums: InputTypes
    },
    label: {
        isRequired: () => true,
        type: 'string',
        description: 'Etichetta del campo'
    },
    options: {
        isRequired: (fieldMeta) => fieldMeta.type === InputTypes.SELECT || fieldMeta.type === InputTypes.AUTOCOMPLETE,
        type: 'array',
        description: 'Opzioni del campo'
    },
    default: {
        isRequired: () => false,
        type: 'any',
        description: 'Valore iniziale del campo'
    },
    validations: {
        isRequired: () => false,
        type: 'array',
        description: 'Validatori del campo',
        hooks: ['onPresistence', 'onConstruction']
    },
    version: {
        isRequired: (fieldMeta) => fieldMeta.type === FieldTypes.PERSONA || fieldMeta.type === FieldTypes.TRANSAZIONE,
        type: 'array',
        description: 'Versione del FieldType di default (se non tipo primitivo)'
    },
    sezione: {
        isRequired: () => false,
        type: 'string',
        description: 'Sezione logica del model di cui il campo fa parte',
    }
}

export default CampiMetadata