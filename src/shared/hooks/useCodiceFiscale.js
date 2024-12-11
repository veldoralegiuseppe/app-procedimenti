import React from "react";
const CodiceFiscaleUtils = require("@marketto/codice-fiscale-utils");
import belfioreConnector from "@marketto/belfiore-connector-embedded";

const useCodiceFiscale = () => {

    const codiceFiscaleUtils = React.useRef(null);
    
    React.useEffect(() => {
        console.log(CodiceFiscaleUtils)
       codiceFiscaleUtils.current = new CodiceFiscaleUtils(belfioreConnector);
    }, []);

    const isValid = (codiceFiscale) => {
        return CodiceFiscaleUtils.Validator.codiceFiscale(codiceFiscale).valid
    }

    const getLuogoNascita = (codiceFiscale) => {
        return codiceFiscaleUtils.parser.cfToBirthPlace(codiceFiscale);
    }
   
    const decode = async (codiceFiscale) => {
        return await codiceFiscaleUtils.parser.cfDecode(codiceFiscale);
    }

    return { isValid, getLuogoNascita, decode };
};

export default useCodiceFiscale;