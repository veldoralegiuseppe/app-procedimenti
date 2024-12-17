import React, { useState, useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';

function useDynamicOptions(initialOptions) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    console.log('useDynamicOptions', 'initialOptions', initialOptions);
    if (!_.isEqual(options, initialOptions)) {
      setOptions(initialOptions);
    }
  }, [initialOptions]);
  
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
      if (newOptions.length > 0) {
      console.log('addOptions', 'newOptions', newOptions);
      return [...prevOptions, ...newOptions];
      }
      return prevOptions;
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
