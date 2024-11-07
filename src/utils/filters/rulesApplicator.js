import { calculateValueByActiveRule } from '@model/regola';

const applyRules = (context) => {
    const {procedimento} = context;
    Object.keys(procedimento).forEach((key) => {
        const value = calculateValueByActiveRule(key, context)
        procedimento[key] = value != null ? value : procedimento[key];
    });

    return context;
}

export const rulesApplicator = {
    process: (context) => {
        console.log('rulesApplicator', context);
        return applyRules(context);
    }
}