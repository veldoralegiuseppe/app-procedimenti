import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useDialog } from './useDialog';
import { useModelArrayStore } from '@shared/hooks';

export const useOptionsAutocomplete = ({
  initialValue,
  onChange,
  filterFn,
  optionsStore,
  onBlur,
  groupBy,
  creatable = true,
}) => {
  const { addItem, removeItemByValue, findItem, getItems } = useModelArrayStore(optionsStore);
  const [value, setValue] = useState(initialValue);
  const { open, dialogValue, openDialog, closeDialog, setDialogValue } = useDialog();
  const [options, setOptions] = useState([]);
  const items = getItems();
  
  useEffect(() => {
  const filtered = filterFn ? filterFn(items) : items;
   setOptions(getOptions(filtered));
  }, [items, filterFn]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  
  const handleChange = useCallback(
    (event, option, newValue, reason) => {
      if (option?.key === 'add') {
        setDialogValue(option);
        openDialog();
      } else {
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
    (newOption, callback) => {
      const option = getOptions([newOption])[0];
      console.log('handleAddOption', option);
      addItem(option);
      callback?.(option);
    },
    [addItem]
  );

  const handleRemoveOption = useCallback(
    (optionToRemove) => {
      removeItemByValue(optionToRemove);
    },
    [removeItemByValue]
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
    loading: false,
  };
};
