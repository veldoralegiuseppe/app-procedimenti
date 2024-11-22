import { getActiveRules } from '@model/regola';
import _ from 'lodash';

const isUpdateApplicable = (key, context) => {
  const regoleAttive = getActiveRules(context);

  const regolaCampo = regoleAttive.find(
    (rule) =>
      rule.stato === 'ATTIVA' &&
      rule.isApplicata &&
      rule.espressione.target.key === key
  );

  if (!regolaCampo) return true;
  else return regolaCampo;
};

export const updateValidator = {
  process: ({ key, value, model, context, ...rest }) => {
    const errorMessage = rest.errorMessage || {};

    // TODO: spostare questa logica in un filtro specifico
    // const isUpdatable = isUpdateApplicable(key, context);
    // if (isUpdatable !== true) error[key] = 'Campo non modificabile';

    if (!errorMessage[key] && rest?.updateModel) {
      try {
        rest.updateModel();
      } catch (e) {
        console.error(e);
      }
    }

    return { key, value, model, context, ...rest };
  },
};
