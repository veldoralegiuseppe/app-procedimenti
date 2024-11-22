import * as React from 'react';
import { useDialog } from './hooks/useDialog';
import { useOptionsAutocomplete } from './hooks/useOptionsAutocomplete';
import { useValidation } from './hooks/useValidation';
import AutocompleteWrapper from './components/AutocompleteWrapper';
import DialogForm from './components/DialogForm';
import PropTypes from 'prop-types';
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
  onSubmit,
  onDelete,
  options: items,
  sx,
  value: initialValue = null,
  error = false,
  helperText = '',
  dialogDescriptionText = '',
  dialogTitle = 'Crea',
  groupBy,
  dialogForm,
  validations,
  onFormPopulate,
  optionModel,
}) => {
  
  // Hooks
  const { open, dialogValue, openDialog, closeDialog, setDialogValue } =
    useDialog();

  const { value, setValue, options, handleChange, filterOptions } =
    useOptionsAutocomplete({
      initialValue,
      items,
      onChange,
      openDialog,
      setDialogValue,
      groupBy,
    });

  const { isFormValid, errorMessage, validateInput } = useValidation();

  // Handlers
  const onCreationSubmit = (newOption, fristTruthyKey) => {
    //console.log('aggiunta nuova opzione', newOption, fristTruthyKey);
    const newValue = fristTruthyKey ? newOption[fristTruthyKey] : newOption;
   
    onSubmit?.(newOption);
    handleChange(null, null, newValue);
    setValue(newValue);
    closeDialog();
  };

  const onCreationAbort = () => {
    closeDialog();
    setValue(null);
    setDialogValue({ value: null });
    onBlur?.(undefined)
  };

  const onOptionSelected = (option, newValue) => {
    if (option?.key === 'add') {
      const newOption = {};

      const isString = !optionModel || Array.isArray(optionModel) && optionModel.length === 1;
      
      if (isString) {
        newOption.value = newValue;
      } else {
        newOption.value = {};

        if (onFormPopulate) newOption.value = onFormPopulate(newValue);
        else {
          (optionModel || Object.keys(options[0].value)).forEach((key, index) => {
            newOption.value[key] = index === 0 ? newValue : '';
          });
        }
      }
     
      option.value = newOption.value;
    }
    handleChange(null, option, newValue);
    setValue(newValue);
  };

  const onOptionDelete = (option) => {
    //console.log('onOptionDelete', option);
    onDelete?.(option.value);

    const isSameValue = typeof option.value === 'string' && _.isEqual(option.value, value);
    const isSameObject = _.isEqual(option.value, value) || _.some(option.value, (val, key) => _.isEqual(val, value));
    
    if(isSameValue || isSameObject) handleChange(null, null, null, 'clear');
  };

  return (
    <React.Fragment>
      <AutocompleteWrapper
        label={label}
        value={value}
        options={options}
        handleChange={handleChange}
        onDelete={onOptionDelete}
        onBlur={onBlur}
        sx={sx}
        error={error}
        helperText={helperText}
        groupBy={groupBy ? (option) => groupBy?.(option?.value) : null}
        filterOptions={filterOptions}
        onOptionSelected={onOptionSelected}
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

OptionsAutocomplete.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])
  ),
  sx: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  dialogDescriptionText: PropTypes.string,
  dialogTitle: PropTypes.string,
  groupBy: PropTypes.func,
  filterOptions: PropTypes.func,
  dialogForm: PropTypes.element,
  validations: PropTypes.oneOfType([PropTypes.array, PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))]),
  onFormPopulate: PropTypes.func,
};

export default OptionsAutocomplete;
