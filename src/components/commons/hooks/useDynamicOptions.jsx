import { useState } from 'react';
import _ from 'lodash';

function useDynamicOptions(initialOptions = []) {
  const [options, setOptions] = useState(initialOptions.map((option) => ({ value: option })));

  const addOption = (newValue) => {
    console.log('newValue', newValue);
    setOptions((prevOptions) => {
      if (!_.some(prevOptions, { value: newValue })) {
        return [...prevOptions, { value: newValue }];
      }
      return prevOptions;
    });
  };

  const removeOption = (optionToRemove) => {
    console.log('valueToRemove', optionToRemove);
    console.log('options', options);
    setOptions((prevOptions) => _.filter(prevOptions, (option) => !_.isEqual(option, optionToRemove)));
  };

  return {
    options,
    addOption,
    removeOption,
  };
}

export default useDynamicOptions;
