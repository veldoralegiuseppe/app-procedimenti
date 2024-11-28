import { calculateValueByActiveRule } from '@features/regola';

const applyRules = (context) => {
    const {procedimento} = context;
    Object.keys(procedimento).forEach((key) => {
        const value = calculateValueByActiveRule(key, context)
        procedimento[key] = value != null ? value : procedimento[key];
    });

    return context;
}

const rulesApplicator = {
    process: (context) => {
        console.log('rulesApplicator', context);
        return applyRules(context);
    }
}

export default rulesApplicator;