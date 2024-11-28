import dayjs from 'dayjs';

const validators = {
    required: (value) => !!value || 'Campo obbligatorio',
    onlyNumber: (value) => !isNaN(value) || 'Deve essere un numero',
    minValueNumber: (min) => (value) => value >= min || `Deve essere maggiore o uguale a ${min}`,
    minLength: (min) => (value) => (value.length >= min) || `Deve contenere almeno ${min} caratteri`,
    regex: (pattern) => (value) => pattern.test(value) || 'Formato non valido',
    onlyAlphabetic: (value) => /^[a-zA-ZÀ-ÿ\s']+$/.test(value) || 'Caratteri non validi',
    onlyAlphanumeric: (value) => /^[a-zA-Z0-9À-ÿ\s']+$/.test(value) || 'Caratteri non validi',
    isDate: (value) => dayjs(value, 'YYYY-MM-DD', true).isValid() || 'Data non valida',
    isDateTime: (value) => dayjs(value, 'YYYY-MM-DDTHH:mm', true).isValid() || 'Data e ora non valide',
    isProtocollo: (value) => /^[0-9]{6}\/[0-9]{4}$/.test(value) || 'Formato protocollo non valido',
};

export default validators;
  