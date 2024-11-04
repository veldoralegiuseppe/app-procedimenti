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
  constructor(espressione, condizioni, stato = "DISATTIVA") {
    this.espressione = espressione;
    this.condizioni = condizioni;
    this.stato = stato;
  }
}

function validateRegola(regola) {
  const messaggi = [];

  if (!regola.espressione.target || !regola.espressione.formula) {
    messaggi.push('Espressione non valida: target o formula mancanti.');
  }

  if (!regola.condizioni || regola.condizioni.length === 0) {
    messaggi.push('Condizioni non valide: almeno una condizione è richiesta.');
  } else
    for (let cond of regola.condizioni) {
      if (!cond.campo || !cond.operatore || !cond.valore) {
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

function getVariabiliPredefinite(tipo = 'number') {

  const checkContext = (context) => { 
    if (!context || !context.persone || !Array.isArray(context.persone))
      throw new Error('Il contesto deve contenere un array di persone.');
  }

  const checkPersone = (persone) => {
    if (!persone || !Array.isArray(persone))
      throw new Error('Il contesto deve contenere un array di persone.');
  }

  const variabiliNumeriche = [
    {
      key: 'sommaSpesePostaliParti',
      label: 'SOMMA SPESE POSTALI DELLE PARTI',
      sezione: 'PARTI',
      value: (context) => {
        checkContext(context);
        const {persone} = context;
        checkPersone(persone);

        console.log(persone);

        return persone
          .filter((persona) => persona.isParteIstante && typeof persona.spesePostali === 'number' && persona.spesePostali >= 0)
          .reduce((acc, curr) => acc + curr.spesePostali, 0);
      },
    },
    {
      key: 'sommaSpesePostaliControparti',
      label: 'SOMMA SPESE POSTALI DELLE CONTROPARTI',
      sezione: 'CONTROPARTI',
      value: (context) => {
        checkContext(context);
        const {persone} = context;
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

export {
  Target,
  Regola,
  Condizione,
  Espressione,
  validateRegola,
  getVariabiliPredefinite,
};
