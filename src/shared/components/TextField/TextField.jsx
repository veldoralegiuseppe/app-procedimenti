import { CssTextField } from '@shared/theme';
import { useErrorValidations } from '@shared/hooks';
import React from 'react';
import _ from 'lodash';

const TextField = ({
  label: lbl,
  value: initValue = '',
  onChange: callback,
  onBlur,
  onError,
  inputValidations = [],
  ...props
}) => {
  const [value, setValue] = React.useState(initValue);
  const { errors, validate } = useErrorValidations(onError);
  const [label] = React.useState(lbl);

  React.useEffect(() => {
    if (!_.isEqual(initValue, value)) {
      setValue(initValue);
    }
  }, [initValue]);

  const onChange = React.useCallback(
    (e) => {
      const value = e.target.value;
      setValue(e.target.value);
      validate(value, inputValidations);
      callback(e, errors);
    },
    [callback]
  );

  return (
    <CssTextField
      {...props}
      label={label}
      value={value}
      error={Object.keys(errors).length > 0}
      helperText={Object.values(errors)[0] || ''}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default TextField;
