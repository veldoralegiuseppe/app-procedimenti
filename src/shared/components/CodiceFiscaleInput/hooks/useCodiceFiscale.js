import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';

const useCodiceFiscale = () => {

    const isValid = (codiceFiscale) => {
        return CodiceFiscaleUtils.Validator.codiceFiscale(codiceFiscale).valid
    }
   
};