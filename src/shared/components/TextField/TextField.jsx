import { CssTextField, labelColor } from '@shared/theme';
import React from 'react';
import _ from 'lodash';

const TextField = ({
  label: lbl,
  value: initValue = '',
  onChange: callback,
  onBlur,
  ...props
}) => {
  const [value, setValue] = React.useState(initValue);
  const [label] = React.useState(lbl);

  React.useEffect(() => {
    if (!_.isEqual(initValue, value)) {
      setValue(initValue);
    }
  }, [initValue]);

  const onChange = React.useCallback(
    (e) => {
      setValue(e.target.value);
      callback(e);
    },
    [callback]
  );

  return (
    <CssTextField
      {...props}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default TextField;
