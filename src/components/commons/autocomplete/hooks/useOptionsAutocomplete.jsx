import { useState, useEffect } from 'react';
import _ from 'lodash';

export const useOptionsAutocomplete = ({
  initialValue,
  items,
  onChange,
  openDialog,
  setDialogValue,
  groupBy,
}) => {
  const [value, setValue] = useState(initialValue || '');
  const [options, setOptions] = useState(() => getOptions());

  useEffect(() => setOptions(getOptions()), [items]);

  const handleChange = (event, option, newValue) => {
    const value = newValue === 'clear' ? '' : newValue;
    setValue(value);

    if (option?.key === 'add') {
      console.log('aggiunta nuova opzione', option);
      setDialogValue(option);
      openDialog();
    } else {
      console.log('onChange',(value == '' || value == null) ? undefined : value);
      onChange?.((value == '' || value == null) ? undefined : value);
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) return options;
    inputValue = String(inputValue).toUpperCase();

    const filtered = _.filter(options, (option) => {
      if (typeof option.value === 'object') {
        return _.some(option.value, (val) =>
          String(val).toUpperCase().includes(inputValue)
        );
      }
      return String(option.value).toUpperCase().includes(inputValue);
    });
    if (filtered.length === 0) {
      filtered.push({
        key: 'add',
        value: String(inputValue).toUpperCase(),
        label: `Aggiungi "${inputValue}"`,
      });
    }

    return filtered;
  };

  function getOptions(){
    if (groupBy) {
      const groupedItems = _.groupBy(items, (item) => groupBy(item));
      console.log('groupedItems',groupedItems);
      const sortedItems = [];

      Object.keys(groupedItems)
        .sort()
        .forEach((group) => {
          sortedItems.push(...groupedItems[group]);
        });

      return (
        sortedItems.map((option) =>
          option.value ? option : { value: option }
        ) || []
      );
    } else {
      return (
        items.map((option) => (option.value ? option : { value: option })) ||
        []
      );
    }
  };

  return { value, setValue, options, handleChange, filterOptions };
};
