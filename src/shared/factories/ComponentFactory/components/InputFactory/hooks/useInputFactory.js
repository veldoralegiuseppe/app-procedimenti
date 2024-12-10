import { useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

const useInputFactory = ({ fieldKey, ...props }) => {
  const theme = useTheme();
 
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
    [props?.onChange]
  );
  const handleBlur = useCallback(
    (changes) => {
      props?.onBlur?.(changes);
    },
    [props?.onBlur]
  );

  // Memorizzazione dei common props
  const commonProps = useMemo(
    () => ({
      ...props,
      label: props?.label || '',
      error: props?.error,
      helperText: props?.helperText || '',
      onChange: (change) => {handleChanges({ [fieldKey]: change?.target?.value ?? change })},
      sx: { ...inputStyles, ...props?.sx },
      onBlur: (change) => {
        handleBlur({ [fieldKey]: change?.target?.value ?? change })
      },
      options: props?.options,
      size: 'small',
      key: fieldKey+'-input',
    }),
    [props, inputStyles, handleChanges, handleBlur]
  );

  return {
    commonProps,
  };
};

export default useInputFactory;
