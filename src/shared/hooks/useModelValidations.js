import { ModelFactory } from '@shared/components';
import useErrorValidations from './useErrorValidations';

// NON è TESTAT E NON SO SE FUNZIONA, SERVIREBBE SOLO PER CONVALIDARE LA LOGICA
const useModelValidations = ({ modelType, validationTypes = [] }) => {
  const metadati = ModelFactory.getMetadata();
  const { errors, hasErrors, setErrors } = useErrorValidations();
  const store = useStoreContext(modelType);
  const model = store((state) => state.model);

  const validateModel = (model) => {
    const modelErrors = {};
    const modelMetadata = metadati[model.type]?.[model.version] || {};

    Object.keys(model).forEach((key) => {
      const fieldValidations = [];
      validationTypes.forEach((validationType) => {
        const validations = modelMetadata.validations?.[validationType];
        if (validations) fieldValidations.push(...validations);
      });

      if (fieldValidations.length > 0) {
        const fieldErrors = hasErrors(model[key], fieldValidations);
        if (Object.keys(fieldErrors).length > 0) {
          modelErrors[key] = fieldErrors;
        }
      }

      if (
        model[key] &&
        typeof model[key] === 'object' &&
        !Array.isArray(model[key])
      ) {
        const nestedModelErrors = validateModel(model[key]);
        if (Object.keys(nestedModelErrors).length > 0) {
          modelErrors[key] = { ...modelErrors[key], ...nestedModelErrors };
        }
      }
    });

    return modelErrors;
  };

  React.useEffect(() => {
    if (model) {
      const modelErrors = validateModel(model);
      setErrors(modelErrors);
    }
  }, [model]);

  return { errors };
};

export default useModelValidations;
