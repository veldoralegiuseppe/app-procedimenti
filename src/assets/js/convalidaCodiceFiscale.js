import {COMUNI, COMUNI_ESTERI} from "./comuni.js"

const MESI = { A: '01', B: '02', C: '03', D: '04', E: '05', H: '06', L: '07', M: '08', P: '09', R: '10', S: '11', T: '12' };

export function comuneCf (codiceFiscale) { return codiceFiscale.charAt(12).toUpperCase() === 'Z' ? COMUNI_ESTERI.get(codiceFiscale.substring(11,15).toUpperCase()) : COMUNI[codiceFiscale.substring(11,15).toUpperCase()]; }

export function dataCf (codiceFiscale) {
	let [ anno, giorno ] = [ codiceFiscale.substring(6,8), codiceFiscale.substring(9,11) ];
	if (giorno>40) {
		giorno -= 40;
		giorno = "0" + giorno;
	}
	return (anno < 20 ? "20" : "19" ) + anno + "-" + MESI[codiceFiscale.charAt(8)] + "-" + giorno;
}

export function sessoCf (codiceFiscale) { return codiceFiscale.substring(9,11) > 40 ? "F" : "M"; }

export function isValid(codiceFiscale){
	let reg = /^(?:[A-Z][AEIOU][AEIOUX]|[AEIOU]X{2}|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    return reg.test(codiceFiscale)
}
