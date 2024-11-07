import { getApplicableRules } from '@model/regola';

const updateStateRules = (context) => {
    const {regole} = context;
    const regoleApplicabili = getApplicableRules(context);
    console.log('regoleApplicabili', regoleApplicabili);
    regole.forEach((regola) => {
        regola.isApplicata = regoleApplicabili.includes(regola) && regola.stato === 'ATTIVA';
    });
    return context;
}

export const stateRulesUpdater = {
    process: (context) => {
        console.log('stateRulesUpdater', context);
        return updateStateRules(context);
    }
}