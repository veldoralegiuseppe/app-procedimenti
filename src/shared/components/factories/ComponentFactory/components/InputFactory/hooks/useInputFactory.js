import { useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { rest } from 'lodash';

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
    (changes, ...rest) => {
      props?.onChange?.(changes, ...rest);
    },
    [props?.onChange]
  );
  const handleBlur = useCallback(
    (changes, ...rest) => {
      props?.onBlur?.(changes, ...rest);
    },
    [props?.onBlur]
  );
  const handleErrors = useCallback((errors) => {
    console.log('errors', {[fieldKey]: errors});
    props?.onError?.({[fieldKey]: errors});
  }, []);

  // Memorizzazione dei common props
  const commonProps = useMemo(
    () => ({
      ...props,
      label: props?.label || '',
      error: props?.error,
      helperText: props?.helperText || '',
      onChange: (change, ...rest) => {handleChanges({ [fieldKey]: change?.target?.value ?? change }, ...rest)},
      sx: { ...inputStyles, ...props?.sx },
      onBlur: (change, ...rest) => {
        handleBlur({ [fieldKey]: change?.target?.value ?? change }, ...rest)
      },
      onError: handleErrors,
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
