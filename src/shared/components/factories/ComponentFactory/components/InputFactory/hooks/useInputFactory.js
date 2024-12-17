import { useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useStoreContext } from '@shared/context';
import { useModelStore } from '@shared/hooks';
import { maxHeight } from '@mui/system';

const useInputFactory = ({
  fieldKey,
  owner,
  updateOnChange = false,
  ...props
}) => {
  const theme = useTheme();
  const store = useStoreContext(owner);
  const { setProperty, getFieldErrors } = useModelStore(store);
  const errors = getFieldErrors(fieldKey) || {};
  const hasError = typeof Object.values(errors)[0] === 'string';
  const errorMessage = hasError ? Object.values(errors)[0] : '';

  // Memorizzazione degli styles
  const inputStyles = useMemo(() => {
    const helperTextHeight = 20;
    const smallSizeHeight = 34.13

    return {
      margin: '0',
      backgroundColor: theme?.palette.background.default,
      width: '168px',
      minHeight: `${smallSizeHeight + helperTextHeight}px`,
    };
  }, []);

  // Memorizzazione degli handler
  const handleChanges = useCallback(
    (changes, ...rest) => {
      props?.onChange?.(changes, ...rest);
      if (updateOnChange) {
        Object.entries(changes).forEach(([key, value]) => {
          setProperty(key, value, props?.inputValidations);
        });
      }
    },
    [props?.onChange]
  );
  const handleBlur = useCallback(
    (changes, ...rest) => {
      if (!updateOnChange) {
        Object.entries(changes).forEach(([key, value]) => {
          console.log('handleBlur', key, value, props?.inputValidations);
          setProperty(key, value, props?.inputValidations);
        });
      }
      props?.onBlur?.(changes, ...rest);
    },
    [props?.onBlur]
  );
  const handleErrors = useCallback((errors) => {
    //console.log('errors', {[fieldKey]: errors});
    props?.onError?.({ [fieldKey]: errors });
  }, []);

  // Memorizzazione dei common props
  const commonProps = useMemo(
    () => ({
      ...props,
      label: props?.label || '',
      error: props?.error,
      onChange: (change, ...rest) => {
        handleChanges({ [fieldKey]: change?.target?.value ?? change }, ...rest);
      },
      sx: { ...inputStyles, ...props?.sx },
      onBlur: (change, ...rest) => {
        handleBlur({ [fieldKey]: change?.target?.value ?? change }, ...rest);
      },
      onError: handleErrors,
      error: hasError,
      helperText: errorMessage || props?.helperText || '',
      options: props?.options,
      size: 'small',
      key: fieldKey + '-input',
      fieldKey,
      owner,
    }),
    [props, inputStyles, handleChanges, handleBlur, errors]
  );

  return {
    commonProps,
  };
};

export default useInputFactory;
