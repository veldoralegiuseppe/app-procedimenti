import { useState, useEffect, useCallback } from 'react';
import { useDialog } from './useDialog';
import { useDynamicOptions } from '@shared/hooks';
import _ from 'lodash';

export const useOptionsAutocomplete = ({
  initialValue,
  onChange,
  options: initialOptions = [],
  fetchOptions,
  onBlur,
  isLoading,
  groupBy,
  creatable = true,
}) => {
  const [loading, setLoading] = useState(isLoading);
  const { options, addOption, removeOption, addOptions } = useDynamicOptions(initialOptions);
  const [value, setValue] = useState(initialValue);
  const { open, dialogValue, openDialog, closeDialog, setDialogValue } =  useDialog();

  useEffect(() => {
    if (!_.isEqual(value, initialValue)) setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (fetchOptions?.length) 
      addOptions(getOptions(fetchOptions));
  
    if (!_.isEqual(loading, isLoading)) 
      setLoading(isLoading);
  }, [fetchOptions, isLoading]);

  const handleChange = useCallback(
    (event, option, newValue, reason) => {
      if (option?.key === 'add') {
        setDialogValue(option);
        openDialog();
      } else {
        //console.log('onChange', !newValue ? undefined : newValue, option);
        onChange?.(!newValue ? undefined : newValue, option);
        onBlur?.(!newValue ? undefined : newValue, option);
        if (reason === 'clear') setValue(null);
      }
    },
    [setDialogValue, openDialog, onChange, onBlur]
  );

  const filterOptions = useCallback(
    (options, { inputValue }) => {
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
      if (filtered.length === 0 && creatable) {
        filtered.push({
          key: 'add',
          value: String(inputValue).toUpperCase(),
          label: `Aggiungi "${inputValue}"`,
        });
      }

      return filtered;
    },
    [creatable]
  );

  const handleAddOption = useCallback(
    (newOption) => {
      addOption(getOptions([newOption])[0]);
    },
    [addOption, setValue, closeDialog]
  );

  const handleRemoveOption = useCallback(
    (option) => {
      removeOption(option);
    },
    [removeOption]
  );

  function getOptions(items) {
    let resultItems;

    if (groupBy) {
      const groupedItems = _.groupBy(items, (item) => groupBy(item));
      const sortedItems = [];

      Object.keys(groupedItems)
        .sort()
        .forEach((group) => {
          sortedItems.push(...groupedItems[group]);
        });

      resultItems =
        sortedItems?.map((option) =>
          option.value ? option : { value: option }
        ) || [];
    } else {
      resultItems =
        items?.map((option) => (option.value ? option : { value: option })) ||
        [];
    }

    let itemsWithId = resultItems?.map((item, index) => {
      if (!item.id) {
        return { ...item, id: index + 1 };
      }
      return item;
    });

    //console.log('itemsWithId', itemsWithId);

    return itemsWithId;
  }

  return {
    value,
    setValue,
    options,
    handleChange,
    filterOptions,
    addOption: handleAddOption,
    removeOption: handleRemoveOption,
    open,
    dialogValue,
    openDialog,
    closeDialog,
    setDialogValue,
    loading,
  };
};
