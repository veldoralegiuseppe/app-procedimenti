import React from 'react';
import { CodiceFiscaleUtils } from '@marketto/codice-fiscale-utils';
import belfioreConnector from '@marketto/belfiore-connector-embedded';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

dayjs.locale('it');

const useCodiceFiscale = () => {
  const codiceFiscaleUtils = React.useRef(null);

  React.useEffect(() => {
    codiceFiscaleUtils.current = new CodiceFiscaleUtils(belfioreConnector);
  }, []);

  const isValidAsync = React.useCallback(async (codiceFiscale) => {
    const isValid = await codiceFiscaleUtils.current.validator.codiceFiscale(
      codiceFiscale
    ).valid;
    return isValid || 'Codice fiscale non valido';
  }, []);

  const decodeLuogoNascitaAsync = React.useCallback((codiceFiscale) => {
    return codiceFiscaleUtils.current.parser.cfToBirthPlace(codiceFiscale);
  }, []);

  const decodeAsync = React.useCallback(async (codiceFiscale) => {
    return await codiceFiscaleUtils.current.parser.cfDecode(codiceFiscale);
  }, []);

  const encodeAsync = React.useCallback(
    async ({ nome, cognome, dataNascita, sesso, comuneNascita }) => {
      const birthDate = dayjs(dataNascita);
      const year = birthDate.year();
      const month = birthDate.month() + 1; // Month is 0 based
      const day = birthDate.date();

      return await codiceFiscaleUtils.current.parser.encodeCf({
        lastName: 'VELDORALE',
        firstName: 'GIUSEPPE',
        year: 1997,
        month: 5,
        day: 16,
        gender: 'M',
        place: 'F138',
      });
    },
    []
  );

  const decodeDataNascita = React.useCallback((codiceFiscale) => {
    
    const day = codiceFiscaleUtils.current.parser.cfToBirthDay(codiceFiscale); 
    const month = codiceFiscaleUtils.current.parser.cfToBirthMonth(codiceFiscale)+1; 
    const year = codiceFiscaleUtils.current.parser.cfToBirthYear(codiceFiscale); 

    console.log('day', day, 'month', month, 'year', year);

    return dayjs(`${year}-${month}-${day}`);
  }, []);

  const decodeGenere = React.useCallback((codiceFiscale) => {
    return codiceFiscaleUtils.current.parser.cfToGender(codiceFiscale);
  }, []);

  return { isValidAsync, decodeLuogoNascitaAsync, decodeAsync, encodeAsync, decodeDataNascita, decodeGenere };
};

export default useCodiceFiscale;
