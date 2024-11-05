class Target {
  constructor(key, label, type) {
    this.key = key;
    this.label = label;
    this.type = type;
  }
}

class Espressione {
  constructor(target, formula) {
    this.target = target;
    this.formula = formula;
  }
}

class Condizione {
  constructor(campo, operatore, valore) {
    this.campo = campo;
    this.operatore = operatore;
    this.valore = valore;
  }
}

class Regola {
  constructor(espressione, condizioni, stato = 'DISATTIVA') {
    this.espressione = espressione;
    this.condizioni = condizioni;
    this.stato = stato;
  }
}

// Costanti
const operatoriMap = {
  number: {
    '>': (a, b) => a > b,
    '≥': (a, b) => a >= b,
    '<': (a, b) => a < b,
    '≤': (a, b) => a <= b,
    '=': (a, b) => a === b,
    'compreso tra': (a, b) => a >= b[0] && a <= b[1],
  },
  string: {
    '=': (a, b) => a === b,
    contiene: (a, b) => a.includes(b),
    'non contiene': (a, b) => !a.includes(b),
  },
};

function getVariabiliPredefinite(tipo = 'number') {
  const checkContext = (context) => {
    if (!context || !context.persone || !Array.isArray(context.persone))
      throw new Error('Il contesto deve contenere un array di persone.');
  };

  const checkPersone = (persone) => {
    if (!persone || !Array.isArray(persone))
      throw new Error('Il contesto deve contenere un array di persone.');
  };

  const variabiliNumeriche = [
    {
      key: 'sommaSpesePostaliParti',
      label: 'SOMMA SPESE POSTALI DELLE PARTI',
      sezione: 'PARTI',
      value: (context) => {
        checkContext(context);
        const { persone } = context;
        checkPersone(persone);

        console.log(persone);

        return persone
          .filter(
            (persona) =>
              persona.isParteIstante &&
              typeof persona.spesePostali === 'number' &&
              persona.spesePostali >= 0
          )
          .reduce((acc, curr) => acc + curr.spesePostali, 0);
      },
    },
    {
      key: 'sommaSpesePostaliControparti',
      label: 'SOMMA SPESE POSTALI DELLE CONTROPARTI',
      sezione: 'CONTROPARTI',
      value: (context) => {
        checkContext(context);
        const { persone } = context;
        checkPersone(persone);

        return persone
          .filter((persona) => !persona.isParteIstante && persona.spesePostali)
          .reduce((acc, curr) => acc + curr.spesePostali, 0);
      },
    },
  ];

  switch (tipo) {
    case 'number':
      return variabiliNumeriche;
    default:
      return null;
  }
}

// Validazione
function validateSintassi(regola) {
  const messaggi = [];

  if (!regola.espressione.target || !regola.espressione.formula) {
    messaggi.push('Espressione non valida: target o formula mancanti.');
  }

  if (!regola.condizioni || regola.condizioni.length === 0) {
    messaggi.push('Condizioni non valide: almeno una condizione è richiesta.');
  } else
    for (let cond of regola.condizioni) {
      if (
        !cond.campo ||
        !cond.operatore ||
        cond.valore === undefined ||
        cond.valore === null
      ) {
        messaggi.push(
          'Condizione non valida: campo, operatore o valore mancanti.'
        );
      }
    }

  if (regola.stato !== 'ATTIVA' && regola.stato !== 'DISATTIVA') {
    messaggi.push('Stato non valido: deve essere "ATTIVA" o "DISATTIVA".');
  }

  if (messaggi.length > 0) {
    return {
      messaggio: messaggi.join('\n'),
      applicabile: false,
    };
  }

  return {
    messaggio: null,
    applicabile: true,
  };
}

function validateConflitti(regola, regole) {
  if (!regola || !regole || regole.length === 0) return null;

  const conflitti = checkConflicts(regola, regole);
  const messaggi = [];

  if (conflitti) {
    messaggi.push(
      `Conflitto rilevato: la regola proposta è in contrasto con ${
        conflitti.length
      } ${conflitti.length > 1 ? 'regole esistenti' : 'regola esistente'}:\n` +
        conflitti
          .slice(0, 2)
          .map(
            (conflict, index) =>
              `Regola ${index + 1}: ${getEspressioneCondizione(conflict)}`
          )
          .join('; ') +
        (conflitti.length > 2
          ? `; e altre ${conflitti.length - 2} regole.`
          : '.')
    );
  }

  if (messaggi.length > 0) {
    return {
      messaggio: messaggi.join('\n'),
      applicabile: false,
    };
  }

  return {
    messaggio: null,
    applicabile: true,
  };
}

function checkConflicts(regola, regole) {
  const conflitti = regole.filter((r) => areRulesConflicting(regola, r));
  return conflitti.length > 0 ? conflitti : null;
}

function areRulesConflicting(regola1, regola2) {
  // Verifica che i target siano uguali; altrimenti, non c'è conflitto
  if (regola1.espressione.target.key !== regola2.espressione.target.key)
    return false;

  const condizioni1 = regola1.condizioni;
  const condizioni2 = regola2.condizioni;

  // Trova le condizioni sovrapposte o identiche tra regola1 e regola2
  const overlappingConditions = condizioni1.filter((cond1) => {
    return condizioni2.some((cond2) => areConditionsOverlapping(cond1, cond2));
  });

  console.log('Condizioni sovrapposte:', overlappingConditions);

  // Verifica se il numero di condizioni sovrapposte corrisponde a n e m
  const n = condizioni1.length;
  const m = condizioni2.length;

  // Se il numero di condizioni sovrapposte è uguale al numero totale di condizioni in entrambe le regole
  return (
    overlappingConditions.length === n && overlappingConditions.length === m
  );
}

function areConditionsOverlapping(cond1, cond2) {
  if (cond1.campo.key !== cond2.campo.key) return false; // I campi devono essere gli stessi

  const campoType = typeof cond1.valore;

  if (campoType === 'number') {
    return isNumberConditionOverlapping(cond1, cond2);
  } else if (campoType === 'string') {
    return isStringConditionConflicting(cond1, cond2);
  }

  return false;
}

function isNumberConditionOverlapping(cond1, cond2) {
  // Ottieni i range per cond1 e cond2
  const range1 = getConditionRange(cond1);
  const range2 = getConditionRange(cond2);

  // Verifica la sovrapposizione dei range
  return (
    (range1.min <= range2.max && range1.max >= range2.min) ||
    (range2.min <= range1.max && range2.max >= range1.min)
  );
}

function getConditionRange(cond) {
  const jsOperatorMap = {
    '>': '>',
    '≥': '>=',
    '<': '<',
    '≤': '<=',
    '=': '===',
  };
  const oper = jsOperatorMap[cond.operatore] || cond.operatore;
  const valore = cond.valore;
  const valoreMin = cond.valoreMin;

  switch (oper) {
    case '>':
      return { min: valore + 0.01, max: Infinity };
    case '>=':
      return { min: valore, max: Infinity };
    case '<':
      return { min: -Infinity, max: valore - 0.01 };
    case '<=':
      return { min: -Infinity, max: valore };
    case '===':
      return { min: valore, max: valore };
    case 'compreso tra':
      return { min: valoreMin, max: valore };
    default:
      throw new Error(`Operatore non supportato: ${oper}`);
  }
}

function isStringConditionConflicting(cond1, cond2) {
  const oper1 = cond1.operatore;
  const oper2 = cond2.operatore;
  const valore1 = cond1.valore;
  const valore2 = cond2.valore;

  if (
    (oper1 === 'contiene' && oper2 === 'contiene') ||
    (oper1 === 'non contiene' && oper2 === 'non contiene')
  ) {
    return valore1 === valore2;
  }

  if (oper1 === '=' && oper2 === '=') {
    return valore1 === valore2;
  }

  return false;
}

// Funzioni di utilità
function getEspressioneCondizione(regola) {
  if (!regola || !regola.condizioni) return null;

  return regola.condizioni
    .map((c) => `( ${c.campo.label} ${c.operatore} ${c.valore} )`)
    .join(' && ');
}

function getEspressione(regola) {
  if (!regola || !regola.condizioni) return null;

  return regola.espressione.formula;
}

function getActiveRule(targetKey, regole) {
  // Filtra le regole attive con il target specificato
  const regoleAttive = regole.filter(
    (r) => r.espressione.target.key === targetKey && r.stato === 'ATTIVA'
  );

  // Trova la regola più specifica (con il maggior numero di condizioni)
  return regoleAttive.sort((a, b) => b.condizioni.length - a.condizioni.length)[0] || null;
}

function calculateValueByActiveRule(targetKey, context) {
  const activeRule = getActiveRule(targetKey, context.regole);
  if (!activeRule) return null;

  const { espressione } = activeRule;
  const { target, formula } = espressione;
  console.log('Formula originale:', formula);

  // Usa una regex per catturare sequenze di parole separate da spazi
  const evaluatedFormula = formula.replace(/([A-Z\s]+)/g, (match) => {
    // Trova la variabile con un nome esattamente corrispondente
    const variabile = getVariabiliPredefinite(target.type).find(
      (v) => v.label.trim() === match.trim()
    );

    if (variabile) {
      try {
        // Calcola il valore della variabile utilizzando il contesto
        return variabile.value(context);
      } catch (error) {
        console.error(`Errore nel calcolo della variabile "${match}":`, error);
        return match; // Mantieni il nome della variabile se si verifica un errore
      }
    }
    return match; // Mantieni il nome della variabile se non viene trovata
  });

  console.log('Formula sostituita:', evaluatedFormula);

  // Esegui la formula con le variabili sostituite
  try {
    return eval(evaluatedFormula);
  } catch (error) {
    console.error('Errore durante la valutazione della formula:', error);
    return null;
  }
}


export {
  operatoriMap,
  Target,
  Regola,
  Condizione,
  Espressione,
  validateSintassi,
  getVariabiliPredefinite,
  getEspressioneCondizione,
  getEspressione,
  validateConflitti,
  calculateValueByActiveRule,
};
