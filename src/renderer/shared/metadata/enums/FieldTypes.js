import { ModelTypes } from '@shared/metadata'

const FieldTypes = {
    STRING: 'string',
    NUMBER: 'number',
    DATE: 'date',
    DATE_TIME: 'dateTime',
    BOOLEAN: 'boolean',
    ...ModelTypes,
    PERSONE: 'persone',
}

export default FieldTypes;