import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import _ from 'lodash';

const DialogFormComponent = ({
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
  const [inputsValue, setInputsValue] = useState(null);
  const [firstTruthyKey, setFirstTruthyKey] = useState(null);
  const [inputsValidity, setInputsValidity] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { validateInput } = useValidation();

  // Inizializza `inputsValue` solo quando `dialogValue` cambia
  useEffect(() => {
    if (!dialogValue?.value) return;

    if (typeof dialogValue.value === 'string') {
      setInputsValue(dialogValue.value);
    } else {
      const firstKey = Object.keys(dialogValue.value).find(
        (key) => dialogValue.value[key]
      );
      setFirstTruthyKey(firstKey || null);
      setInputsValue(dialogValue.value);
    }
  }, [dialogValue]);

  // Valida `inputsValue` solo quando cambia
  useEffect(() => {
    if (!inputsValue) return;

    if (typeof inputsValue === 'string') {
      const inputValidations = Array.isArray(validations)
        ? validations
        : validations
        ? [validations]
        : [];
      const errorMessage = validateInput(
        inputsValue,
        inputValidations
      ).errorMessage;

      setInputsValidity({
        [label.toLowerCase()]: errorMessage,
      });
    } else if (typeof inputsValue === 'object') {
      const newInputsValidity = Object.entries(inputsValue).reduce(
        (acc, [key, value]) => {
          const inputValidations = validations?.[key];
          acc[key] = validateInput(value, inputValidations).errorMessage;
          return acc;
        },
        {}
      );
      setInputsValidity(newInputsValidity);
    }
  }, [inputsValue, validateInput, validations, label]);

  // Calcola la validità del form
  useEffect(() => {
    setIsFormValid(Object.values(inputsValidity).every((value) => !value));
  }, [inputsValidity])
  
  // Funzione per gestire i cambiamenti negli input
  const handleChanges = useCallback((key, value) => {
    setInputsValue((prev) => {
      const newInputsValue = key
        ? {
            ...prev,
            [key]: value,
          }
        : value;
      return _.isEqual(prev, newInputsValue) ? prev : newInputsValue;
    });
  }, []);

  // Funzione per inviare il form
  const handleSubmit = useCallback(() => {
    onSubmit(inputsValue, firstTruthyKey);
    onClose();
  }, [onSubmit, inputsValue, firstTruthyKey, onClose]);

  // Memorizza il contenuto del form
  const renderForm = useMemo(() => {
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
    }

    if (inputsValue && typeof inputsValue === 'object') {
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
          ))}{' '}
        </div>
      );
    }

    return null;
  }, [inputsValue, inputsValidity, label, validations, handleChanges]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> {dialogTitle} </DialogTitle>{' '}
      <DialogContent>
        <DialogContentText> {dialogDescriptionText} </DialogContentText>{' '}
        {renderForm}{' '}
      </DialogContent>{' '}
      <DialogActions>
        <Button onClick={onAbort}> Annulla </Button>{' '}
        <Button onClick={handleSubmit} disabled={!isFormValid}>
          Aggiungi{' '}
        </Button>{' '}
      </DialogActions>{' '}
    </Dialog>
  );
};

const DialogForm = React.memo(DialogFormComponent, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    _.isEqual(prevProps.dialogValue, nextProps.dialogValue)
  );
});

//DialogForm.whyDidYouRender = true;

export default DialogForm;
