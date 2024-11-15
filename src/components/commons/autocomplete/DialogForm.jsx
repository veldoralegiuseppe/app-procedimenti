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
import _ from 'lodash';

const DialogForm = ({
  open,
  dialogTitle,
  dialogDescriptionText,
  dialogValue,
  onClose,
  onSubmit,
  label,
  validations,
}) => {
  const [inputsValue, setInputsValue] = React.useState(dialogValue.value);
  const [inputsValidity, setInputsValidity] = React.useState({});
  const [isFormValid, setIsFormValid] = React.useState(false);
  console.log('inputsValue', inputsValue);

  React.useEffect(() => {
    setInputsValue(dialogValue.value);
  }, [dialogValue]);

  React.useEffect(() => {
    setIsFormValid(Object.values(inputsValidity).every(Boolean));
  }, [inputsValue, inputsValidity]);

  const handleFieldChange = (key, value, isValid) => {
    const newInputsValue = key ? { ...inputsValue, [key]: value } : value;
    const newInputsValidity = key ? { ...inputsValidity, [key]: isValid } : isValid;

    if(!_.isEqual(newInputsValue, inputsValue)) setInputsValue(newInputsValue);
    if(!_.isEqual(newInputsValidity, inputsValidity)) setInputsValidity(newInputsValidity);
  };

  const handleSubmit = () => {
    onSubmit(inputsValue);
    onClose();
  };

  const renderForm = () => {
    if (typeof inputsValue === 'string') {
      return (
        <TextFieldWithValidation
          key={`input-${label}`}
          label={label}
          value={inputsValue}
          validations={validations?.[label]}
          onValueChange={(value, isValid) =>
            handleFieldChange(null, value, isValid)
          }
        />
      );
    } else if (inputsValue && typeof inputsValue === 'object') {
      return (
        <div style={{ display: 'flex', minWidth: '3rem', gap: '1.5rem', padding: '1rem' }}>
          {Object.entries(inputsValue).map(([key, value]) => (
            <TextFieldWithValidation
              key={`${key}-${value}`}
              label={key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
              value={value}
              validations={validations?.[key]}
              onValueChange={(val, isValid) => handleFieldChange(key, val, isValid)}
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
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={handleSubmit} disabled={!isFormValid}>
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogForm;
