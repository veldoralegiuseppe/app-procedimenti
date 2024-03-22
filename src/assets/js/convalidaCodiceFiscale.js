import {COMUNI_ESTERI, findComuneByCodiceCatastale} from "./comuni.js"
import { Comune } from "/src/vo/comune.js";

const MESI = { A: '01', B: '02', C: '03', D: '04', E: '05', H: '06', L: '07', M: '08', P: '09', R: '10', S: '11', T: '12' };

/**
 * Ritorna il comune derivato dal codice fiscale
 * @param {*} codiceFiscale 
 * @returns Comune
 */
export function comuneCf (codiceFiscale) { 
	return codiceFiscale.charAt(12).toUpperCase() === 'Z' 
	? new Comune ({nome: COMUNI_ESTERI.get(codiceFiscale.substring(11,15).toUpperCase()), provincia: {nome: 'Stato estero'}}) 
	: new Comune(findComuneByCodiceCatastale(codiceFiscale.substring(11,15).toUpperCase()))
}

/**
 * Ritorna la data di nascita derivata dal codice fiscale
 * @param {*} codiceFiscale 
 * @returns Data di nascita
 */
export function dataCf (codiceFiscale) {
	let [ anno, giorno ] = [ codiceFiscale.substring(6,8), codiceFiscale.substring(9,11) ];
	if (giorno>40) {
		giorno -= 40;
		giorno = "0" + giorno;
	}
	return (anno < 20 ? "20" : "19" ) + anno + "-" + MESI[codiceFiscale.charAt(8)] + "-" + giorno;
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
	let reg = /^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    return reg.test(codiceFiscale)
}
