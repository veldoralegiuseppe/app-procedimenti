import dayjs from 'dayjs';

const validators = {
    required: (value) => !!value || 'Campo obbligatorio',
    onlyNumber: (value) => !isNaN(value) || 'Deve essere un numero',
    minValueNumber: (min) => (value) => value >= min || `Deve essere maggiore o uguale a ${min}`,
    minLength: (min) => (value) => (value.length >= min) || `Deve contenere almeno ${min} caratteri`,
    regex: (pattern) => (value) => pattern.test(value) || 'Formato non valido',
    onlyAlphabetic: (value) => !value || /^[a-zA-ZÀ-ÿ\s']+$/.test(value) || 'Caratteri non validi',
    onlyAlphanumeric: (value) => !value || /^[a-zA-Z0-9À-ÿ\s']+$/.test(value) || 'Caratteri non validi',
    isDate: (value) => dayjs(value, 'YYYY-MM-DD', true).isValid() || 'Data non valida',
    isDateTime: (value) => dayjs(value, 'YYYY-MM-DDTHH:mm', true).isValid() || 'Data e ora non valide',
    isProtocollo: (value) => /^[0-9]{6}\/[0-9]{4}$/.test(value) || 'Formato protocollo non valido',
    isCodiceFiscale: (value) => !value || /^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i.test(value) || 'Codice fiscale non valido',
    isEmail: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'Email non valida',
};

export default validators;
  