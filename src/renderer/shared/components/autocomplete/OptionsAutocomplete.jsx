import * as React from 'react';

import { useOptionsAutocomplete } from './hooks/useOptionsAutocomplete';
import { useValidation } from './hooks/useValidation';
import AutocompleteWrapper from './components/AutocompleteWrapper';
import DialogForm from './components/DialogForm';
import _ from 'lodash';

/**
 * Componente OptionsAutocomplete
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {string} props.label - L'etichetta per l'autocomplete.
 * @param {function} props.onChange - Funzione chiamata quando il valore cambia.
 * @param {function} props.onSubmit - Funzione chiamata quando viene creata una nuova opzione.
 * @param {function} props.onDelete - Funzione chiamata quando viene eliminata un'opzione.
 * @param {Array} props.options - Le opzioni disponibili per l'autocomplete.
 * @param {Object} props.sx - Stili personalizzati per il componente.
 * @param {any} [props.value=null] - Il valore iniziale dell'autocomplete.
 * @param {boolean} [props.error=false] - Indica se c'è un errore.
 * @param {string} [props.helperText=''] - Testo di aiuto mostrato sotto l'input.
 * @param {string} [props.dialogDescriptionText=''] - Testo descrittivo per il dialogo.
 * @param {string} [props.dialogTitle='Crea'] - Titolo del dialogo.
 * @param {function} props.groupBy - Funzione per raggruppare le opzioni.
 * @param {React.Element} props.dialogForm - Il form visualizzato nel dialogo.
 * @param {Object} props.validations - Le validazioni per il form del dialogo.
 * @param {function} props.onFormPopulate - Funzione per popolare il form del dialogo.
 *
 * @returns {React.Element} Il componente OptionsAutocomplete.
 */
const OptionsAutocomplete = ({
  label,
  onChange,
  onBlur,
  onOpen,
  optionsStore,
  isOptionEqualToValue = (option, value) => _.isEqual(option.value === value),
  sx,
  value: initialValue = '',
  helperText = '',
  filterFn, 
  dialogDescriptionText = '',
  dialogTitle = 'Crea',
  groupBy,
  dialogForm,
  disabled = false,
  validations,
  onFormPopulate,
  optionModel,
  deletable = true,
  creatable = true,
  extractValue,
  freeSolo,
}) => {

  const {
    value,
    setValue,
    openDialog,
    options,
    handleChange,
    filterOptions,
    addOption,
    removeOption,
    open,
    dialogValue,
    closeDialog,
    setDialogValue,
    loading,
  } = useOptionsAutocomplete({
    initialValue,
    onChange,
    optionsStore,
    onBlur,
    isOptionEqualToValue,
    groupBy,
    creatable,
    filterFn,
    extractValue,
  });

  const { isFormValid, errorMessage, validateInput } =
    useValidation(optionModel);

  // Handlers
  const onCreationSubmit = React.useCallback(
    (newOption, fristTruthyKey) => {
      console.log('aggiunta nuova opzione', newOption, fristTruthyKey);
      const newValue = fristTruthyKey ? newOption[fristTruthyKey] : newOption;

      addOption(newOption, () => {
        handleChange(null, null, newValue);
        setValue(newValue);
        closeDialog();
      });
    },
    [addOption, handleChange, setValue, closeDialog]
  );

  const onCreationAbort = React.useCallback(() => {
    //console.log('abort creazione nuova opzione ');
    closeDialog();
    setValue(null);
    setDialogValue({ value: null });
    onBlur?.(undefined);
  }, [closeDialog, setValue, setDialogValue, onBlur]);

  const onOptionSelected = React.useCallback(
    (option, newValue) => {
      //console.log('onOptionSelected', option, newValue);
      if (option?.key === 'add') {
        const newOption = {};

        const isString =
          !optionModel ||
          (Array.isArray(optionModel) && optionModel.length === 1);

        if (isString) {
          newOption.value = newValue;
        } else {
          newOption.value = {};

          if (onFormPopulate) newOption.value = onFormPopulate(newValue);
          else {
            (optionModel || Object.keys(options[0].value)).forEach(
              (key, index) => {
                newOption.value[key] = index === 0 ? newValue : '';
              }
            );
          }
        }

        option.value = newOption.value;
        setDialogValue(option);
        openDialog();
      }
      else {
        handleChange(null, option, newValue);
        setValue(newValue);
      }
     
    },
    [optionModel, onFormPopulate, handleChange, setValue]
  );

  const onOptionDelete = React.useCallback(
    (option) => {
      //console.log('onOptionDelete', option);
      removeOption(option);

      const isSameValue =
        typeof option.value === 'string' && _.isEqual(option.value, value);
      const isSameObject =
        _.isEqual(option.value, value) ||
        _.some(option.value, (val, key) => _.isEqual(val, value));

      if (isSameValue || isSameObject) handleChange(null, null, null, 'clear');
    },
    [removeOption, value, handleChange]
  );

  // Stabilizzazione 
  const [equalToValue] = React.useState(() => isOptionEqualToValue);

  return (
    <React.Fragment>
      <AutocompleteWrapper
        label={label}
        value={value}
        isOptionEqualToValue={equalToValue}
        options={options}
        disabled={disabled}
        onOpen={onOpen}
        handleChange={handleChange}
        onDelete={onOptionDelete}
        onBlur={onBlur}
        sx={sx}
        loading={loading}
        helperText={helperText}
        groupBy={groupBy}
        filterOptions={filterOptions}
        onOptionSelected={onOptionSelected}
        deletable={deletable}
        freeSolo={
          freeSolo != undefined ? freeSolo : options?.length ? true : false
        }
      />
      <DialogForm
        open={open}
        dialogTitle={dialogTitle}
        dialogDescriptionText={dialogDescriptionText}
        dialogForm={dialogForm}
        dialogValue={dialogValue}
        setDialogValue={setDialogValue}
        isFormValid={isFormValid}
        errorMessage={errorMessage}
        validateInput={validateInput}
        onClose={closeDialog}
        onSubmit={onCreationSubmit}
        onAbort={onCreationAbort}
        validations={validations}
        label={label}
        optionModel={optionModel}
      />
    </React.Fragment>
  );
};

export default OptionsAutocomplete;
