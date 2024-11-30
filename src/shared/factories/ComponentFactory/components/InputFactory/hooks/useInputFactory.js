import { useMemo, useCallback } from 'react';

const useInputFactory = ({ fieldKey, ...props }) => {
  // Memorizzazione degli styles
  const inputStyles = useMemo(
    () => ({
      margin: '0',
      backgroundColor: theme?.palette.background.default,
      width: '168px',
      maxWidth: '30rem',
      minWidth: '133px',
      height: '36px',
    }),
    []
  );

  // Memorizzazione degli handler
  const handleChanges = useCallback(
    (changes) => {
      props?.onChange?.(changes);
    },
    [onChange]
  );
  const handleBlur = useCallback(
    (changes) => {
      props?.onBlur?.(changes);
    },
    [onBlur]
  );

  // Memorizzazione dei common props
  const commonProps = useMemo(
    () => ({
      label: props?.label || '',
      error: props?.error,
      helperText: props?.helperText || '',
      onChange: (change) => handleChanges({ [fieldKey]: change }),
      sx: { ...inputStyles, ...props?.sx },
      onBlur: (change) => handleBlur({ [fieldKey]: change }),
      options: props?.options,
      size: 'small',
      ...props,
    }),
    [props, inputStyles, handleChanges, handleBlur]
  );

  return {
    commonProps,
  };
};

export default useInputFactory;
