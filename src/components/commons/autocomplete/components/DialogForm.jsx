import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import TextFieldWithValidation from './TextFieldWithValidation';
import { useValidation } from '../hooks/useValidation';
import _, { set } from 'lodash';

const DialogForm = ({
  open,
  dialogTitle,
  dialogDescriptionText,
  dialogValue,
  onClose,
  onSubmit,
  onAbort,
  label,
  validations,
}) => {
  const [inputsValue, setInputsValue] = React.useState(null);
  const [firstTruthyKey, setFristTruthyKey] = React.useState(null);
  const [inputsValidity, setInputsValidity] = React.useState({});
  const [isFormValid, setIsFormValid] = React.useState(false);
  const { validateInput } = useValidation();

  React.useEffect(() => {
    if(!dialogValue.value) return;

    if (typeof dialogValue.value === 'string') {
      setInputsValue(dialogValue.value);
    } else {
      const firstTruthyKey = Object.keys(dialogValue.value).find(
        (key) => dialogValue.value[key]
      );
      setFristTruthyKey(firstTruthyKey || null);
      setInputsValue(dialogValue.value);
    }
  }, [dialogValue]);

  React.useEffect(() => {
    if(!inputsValue) return;

    if (typeof inputsValue === 'string') {
      const inputValidations = !Array.isArray(validations)
        ? Array.of(validations)
        : validations;

      setInputsValidity({
        [label.toLowerCase()]: validateInput(
          dialogValue.value,
          inputValidations
        ).errorMessage,
      });
    } else {
      const newInputsValidity = Object.entries(inputsValue).reduce(
        (acc, [key, value]) => {
          const inputValidations = validations?.[key];
          acc[key] = validateInput(value, inputValidations).errorMessage;
          return acc;
        }, {}
      );
      setInputsValidity(newInputsValidity);
    }
  }, [inputsValue]);

  React.useEffect(() => {
    setIsFormValid(Object.values(inputsValidity).every((value) => value === ''));
  }, [inputsValidity]);

  const handleChanges = (key, value) => {
    const newInputsValue = key ? { ...inputsValue, [key]: value } : value;
    
    if (!_.isEqual(newInputsValue, inputsValue)) setInputsValue(newInputsValue);
  };

  const handleSubmit = () => {
    onSubmit(inputsValue, firstTruthyKey);
    onClose();
  };

  const renderForm = () => {
    if (typeof inputsValue === 'string') {
      return (
        <TextFieldWithValidation
          key={`input-${label}`}
          label={label}
          error={!!inputsValidity[label.toLowerCase()]}
          helperText={inputsValidity[label.toLowerCase()]}
          required={true}
          value={inputsValue}
          onValueChange={(value) => handleChanges(null, value)}
        />
      );
    } else if (inputsValue && typeof inputsValue === 'object') {
      return (
        <div
          style={{
            display: 'flex',
            minWidth: '3rem',
            gap: '1.5rem',
            padding: '1rem',
          }}
        >
          {Object.entries(inputsValue).map(([key, value]) => (
            <TextFieldWithValidation
              key={`${key}-${value}`}
              label={key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              value={value}
              error={!!inputsValidity[key]}
              helperText={inputsValidity[key]}
              required={validations?.[key]?.includes('required')}
              onValueChange={(value) => handleChanges(key, value)}
            />
          ))}
        </div>
      );
    } else return null;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogDescriptionText}</DialogContentText>
        {renderForm()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onAbort}>Annulla</Button>
        <Button onClick={handleSubmit} disabled={!isFormValid}>
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogForm;
