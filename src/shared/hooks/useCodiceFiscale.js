import React from "react";
import { CodiceFiscaleUtils } from "@marketto/codice-fiscale-utils";
import belfioreConnector from "@marketto/belfiore-connector-embedded";

const useCodiceFiscale = () => {

    const codiceFiscaleUtils = React.useRef(null);
    
    React.useEffect(() => {
       codiceFiscaleUtils.current = new CodiceFiscaleUtils(belfioreConnector);
    }, []);

    const isValidAsync = async (codiceFiscale) => {
        const isValid = await codiceFiscaleUtils.current.validator.codiceFiscale(codiceFiscale).valid;
        return isValid || "Codice fiscale non valido";
    }

    const getLuogoNascita = (codiceFiscale) => {
        return codiceFiscaleUtils.parser.cfToBirthPlace(codiceFiscale);
    }
   
    const decode = async (codiceFiscale) => {
        return await codiceFiscaleUtils.parser.cfDecode(codiceFiscale);
    }

    return { isValidAsync, getLuogoNascita, decode };
};

export default useCodiceFiscale;