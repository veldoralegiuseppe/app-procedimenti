import { useMetadata } from '@shared/hooks';

const useGenerateInputProps = ({
  modelType: type,
  modelVersion: version,
  overrides,
}) => {
  const { metadata, enums } = useMetadata({ type, version });

  const getInputProps = (fieldKey) => {
    const field = metadata?.[fieldKey];

    if (field && typeof field === 'object') {
      const key = fieldKey;
      const value = field;

      return {
        ...value,
        required: value.inputValidations?.some(v => v.name === 'required'),
        ...overrides?.common,
        ...overrides?.[key],
        owner: metadata.type,
      };
    }

    return null;
  };

  const getInputPropsArray = (keysOrSection) => {
    const keys = !keysOrSection
      ? Object.keys(metadata)
      : Array.isArray(keysOrSection)
      ? keysOrSection
      : enums?.sezione?.[keysOrSection] || [];

    return keys
      .map((key) => getInputProps(key))
      .filter((props) => props !== null);
  };

  return {
    getInputProps,
    getInputPropsArray,
  };
};

export default useGenerateInputProps;
