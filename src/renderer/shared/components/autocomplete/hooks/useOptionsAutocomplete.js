import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDialog } from './useDialog';
import { useCreateStore } from '@ui-shared/hooks';
import { useModelArrayStore, useModelArray } from '@ui-shared/hooks';
import _ from 'lodash';

export const useOptionsAutocomplete = ({
  initialValue,
  onChange,
  filterFn,
  optionsOrStore,
  onBlur,
  groupBy,
  extractOption,
  creatable = true,
}) => {

  const store = useCreateStore({
    storeInterface: useModelArray,
    initialItems: _.isArray(optionsOrStore) ? optionsOrStore : [],
  });

  const { addItem, removeItemByValue, findItem, getItems } = useModelArrayStore(_.isArray(optionsOrStore) ? store : optionsOrStore);
  const [value, setValue] = useState(initialValue);
  const { open, dialogValue, openDialog, closeDialog, setDialogValue } = useDialog();
  const [options, setOptions] = useState([]);
  const items = getItems();

  useEffect(() => {
    const filtered = filterFn ? filterFn(items) : items;
    const filteredOptions = getOptions(filtered);
    console.log('filteredOptions', {items, filtered, filteredOptions})
   
    setOptions(filteredOptions);
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
        console.log('handleChange', { newValue, option });
    
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

  function mapToOption(item) {
    let optionWithValueField = item.value
      ? item
      : extractOption?.(item) || { value: item };
    if (
      typeof optionWithValueField !== 'object' ||
      !optionWithValueField.value
    ) {
      throw new Error(
        'optionWithValueField must be an object with a "value" field'
      );
    }
    return optionWithValueField;
  }

  function getOptions(items) {
    let resultItems;

    if (groupBy) {
      const groupedItems = _.groupBy(items, (item) => groupBy((item?.value || item), item));
      const sortedItems = [];

      Object.keys(groupedItems)
        .sort()
        .forEach((group) => {
          sortedItems.push(...groupedItems[group]);
        });

      resultItems = sortedItems?.map((item) => mapToOption(item)) || [];
    } else {
      resultItems = items?.map((item) => mapToOption(item)) || [];
    }

    let optionsWithId = resultItems?.map((item, index) => {
      console.log('resultItems', item);
      if (_.isUndefined(item.id)) {
        return { ...item, id: _.get(items, [index, 'id']) || index};
      }
      return item;
    });

    console.log('itemsWithId', optionsWithId);

    return optionsWithId;
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
