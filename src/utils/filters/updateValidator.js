import { getActiveRules } from '@model/regola';

const isUpdateApplicable = (key, context) => {
  const regoleAttive = getActiveRules(context);

  const regolaCampo = regoleAttive.find(
    (rule) =>
      rule.stato === 'ATTIVA' &&
      rule.isApplicata &&
      rule.espressione.target.key === key
  );

  if (!regolaCampo) return true 
  else return regolaCampo
};

export const updateValidator = {
  process: ({key, valore, metadati, context, errorMessage }) => {
    if(errorMessage[key]) return {key, valore, metadati, context, errorMessage };
    const isUpdatable = isUpdateApplicable(key, context);

    if (isUpdatable !== true) error[key] = 'Campo non modificabile';
    return {key, valore, metadati, context, errorMessage };
  },
};
