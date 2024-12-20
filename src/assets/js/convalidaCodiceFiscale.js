import {COMUNI_ESTERI, findComuneByCodiceCatastale} from "./comuni.js"
import { Comune } from "@ui-shared/components";
import * as CodiceFiscaleUtils from '@marketto/codice-fiscale-utils';

const MESI = { A: '01', B: '02', C: '03', D: '04', E: '05', H: '06', L: '07', M: '08', P: '09', R: '10', S: '11', T: '12' };

/**
 * Ritorna il comune derivato dal codice fiscale
 * @param {*} codiceFiscale 
 * @returns Comune
 */
export async function comuneCf(codiceFiscale) {
    if (!codiceFiscale || codiceFiscale.length < 15) {
        console.error("Codice fiscale non valido o troppo corto.");
        return null;
    }

    const codiceCatastale = codiceFiscale.substring(11, 15).toUpperCase();

    // Caso per comune estero
    if (codiceFiscale.charAt(12).toUpperCase() === 'Z') {
        const comuneEstero = COMUNI_ESTERI.get(codiceCatastale);
        if (!comuneEstero) {
            console.error(`Comune estero non trovato per il codice: ${codiceCatastale}`);
            return null;
        }
        return new Comune({ nome: comuneEstero.denominazione, provincia: { nome: 'Stato estero' } });
    }

    // Caso per comune italiano (gestione asincrona)
    try {
        const comune = await findComuneByCodiceCatastale(codiceCatastale);
        if (!comune) {
            console.error(`Comune non trovato per il codice catastale: ${codiceCatastale}`);
            return null;
        }
        return new Comune(comune);
    } catch (error) {
        console.error(`Errore durante la ricerca del comune per il codice catastale: ${codiceCatastale}`, error);
        return null;
    }
}


/**
 * Ritorna la data di nascita derivata dal codice fiscale
 * @param {*} codiceFiscale 
 * @returns Data di nascita
 */
export function dataCf(codiceFiscale) {
    // Usa CodiceFiscaleUtils per ottenere la data, se disponibile
    const parsedDate = CodiceFiscaleUtils.Parser.cfToBirthDate(codiceFiscale);
  
    // Se il parser restituisce una data valida, formattala e restituiscila
    if (parsedDate) {
        // Formatta la data nel formato YYYY-MM-DD
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Mesi partono da 0
        const day = parsedDate.getDate().toString().padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    }
  
    // Parsing manuale se il parser non funziona o restituisce null
    const MESI = {
        'A': '01',
        'B': '02',
        'C': '03',
        'D': '04',
        'E': '05',
        'H': '06',
        'L': '07',
        'M': '08',
        'P': '09',
        'R': '10',
        'S': '11',
        'T': '12'
    };
  
    let anno = codiceFiscale.substring(6, 8);
    let giorno = parseInt(codiceFiscale.substring(9, 11), 10);
  
    // Se il giorno è superiore a 40, significa che è una donna, quindi sottrai 40
    if (giorno > 40) {
        giorno = giorno - 40;
    }
  
    // Formatta il giorno per avere due cifre
    let giornoStr = giorno < 10 ? `0${giorno}` : `${giorno}`;
  
    // Ottieni il mese dal codice fiscale
    let mese = MESI[codiceFiscale.charAt(8)];
  
    // Determina se l'anno è del 1900 o del 2000
    let secolo = parseInt(anno, 10) < 20 ? '20' : '19';
  
    // Costruisci la data nel formato YYYY-MM-DD
    return `${secolo}${anno}-${mese}-${giornoStr}`;
}

  

/**
 * Ritorna il sesso derivato dal codice fiscale
 * @param {string} codiceFiscale 
 * @returns Sesso
 */
export function sessoCf (codiceFiscale) { return codiceFiscale.substring(9,11) > 40 ? "F" : "M"; }

/**
 * Controlla la validtà del codice fiscale
 * @param {*} codiceFiscale 
 * @returns 
 */
export function isValid(codiceFiscale){
	//let reg = /^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    //return reg.test(codiceFiscale)
	console.log(`Nome: ${CodiceFiscaleUtils.Parser.cfToFirstName(codiceFiscale)}, Cognome: ${CodiceFiscaleUtils.Parser.cfToLastName(codiceFiscale)}`)
	return CodiceFiscaleUtils.Validator.codiceFiscale(codiceFiscale).valid
}