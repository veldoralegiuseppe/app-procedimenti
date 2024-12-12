import { useState, useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';

function useDynamicOptions(initialOptions) {
  const [options, setOptions] = useState(initialOptions || []);

  const addOption = useCallback((newValue) => {
    //console.log('newValue', newValue);
    setOptions((prevOptions) => {
      if (!_.some(prevOptions, newValue)) {
        //console.log('opzioni', [...prevOptions, newValue]);
        return [...prevOptions, newValue];
      }
      return prevOptions;
    });
  }, [setOptions]);

  const addOptions = useCallback((newValues) => {
    setOptions((prevOptions) => {
      const newOptions = _.filter(
        newValues,
        (newValue) => !_.some(prevOptions, newValue)
      );
      //console.log('addOptions', newValues, newOptions);
      return [...prevOptions, ...newOptions];
    });
  }
  , [setOptions]);

  const removeOption = useCallback((optionToRemove) => {
    setOptions((prevOptions) => {
      const newOptions = _.filter(
        prevOptions,
        (option) => !_.isEqual(option, optionToRemove)
      );
      //console.log('removeOption', optionToRemove, newOptions);
      return newOptions;
    });
  }, [setOptions]);

  return {
    options,
    addOption,
    addOptions,
    removeOption,
  };
}

export default useDynamicOptions;
