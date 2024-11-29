import { useModelStore } from '@shared/hooks';
import { useMemo, useCallback } from 'react';

const useInputFactory = ({
  store,
  fieldKey,
  onChange,
  onBlur,
  theme,
  ...props
}) => {
  // Legge il valore direttamente dallo store
  const {getProperty} = useModelStore(store);
  const value = getProperty(fieldKey);

  // Memoizzazione degli styles
  const inputStyles = useMemo(
    () => ({
      margin: '0',
      backgroundColor: theme?.palette.background.default,
      width: '168px',
      maxWidth: '30rem',
      minWidth: '133px',
      height: '36px',
    }),
    [theme]
  );

  // Memoizzazione degli handler
  const handleChanges = useCallback(
    (changes) => {
      if (onChange) onChange(changes);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (change) => {
      if (onBlur) onBlur({ [fieldKey]: change });
    },
    [onBlur, fieldKey]
  );

  // Memoizzazione dei common props
  const commonProps = useMemo(
    () => ({
      label: props.label || '',
      value: value !== undefined ? value : '',
      error: props.error,
      helperText: props.helperText || '',
      onChange: (change) => handleChanges({ [fieldKey]: change }),
      sx: { ...inputStyles, ...props.sx },
      onBlur: handleBlur,
      options: props.options,
      size: 'small',
      ...props,
    }),
    [value, props, inputStyles, handleChanges, handleBlur]
  );

  return {
    value,
    commonProps,
  };
};

export default useInputFactory;
