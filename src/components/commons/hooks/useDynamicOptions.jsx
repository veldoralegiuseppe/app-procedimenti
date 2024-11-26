import { useState, useCallback } from 'react';
import _ from 'lodash';

function useDynamicOptions(initialOptions = []) {
  const [options, setOptions] = useState(initialOptions);

  const addOption = useCallback((newValue) => {
    console.log('newValue', newValue);
    setOptions((prevOptions) => {
      if (!_.some(prevOptions, newValue)) {
        return [...prevOptions, newValue];
      }
      return prevOptions;
    });
  }, []);

  const removeOption = useCallback((optionToRemove) => {
    setOptions((prevOptions) => {
      const newOptions = _.filter(
        prevOptions,
        (option) => !_.isEqual(option, optionToRemove)
      );
      return newOptions;
    });
  }, []);

  return {
    options,
    addOption,
    removeOption,
  };
}

export default useDynamicOptions;
