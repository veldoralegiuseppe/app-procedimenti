import { useState } from 'react';
import _ from 'lodash';

function useDynamicOptions(initialOptions = []) {
  const [options, setOptions] = useState(initialOptions);

  const addOption = (newValue) => {
    console.log('newValue', newValue);
    setOptions((prevOptions) => {
      if (!_.some(prevOptions, newValue)) {
        return [...prevOptions, newValue];
      }
      return prevOptions;
    });
  };

  const removeOption = (optionToRemove) => {
    setOptions((prevOptions) => {
      const newOptions = _.filter(prevOptions, (option) => !_.isEqual(option, optionToRemove));
      return newOptions;
    });
  };

  return {
    options,
    addOption,
    removeOption,
  };
}

export default useDynamicOptions;
