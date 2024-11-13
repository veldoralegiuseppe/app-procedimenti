import React, { useEffect } from 'react';
import { CssTextField, labelColor } from '@theme/MainTheme';
import { useTheme } from '@mui/material/styles';

const FormTitoloPersona = ({
  dialogValue,
  setDialogValue,
  onFormValidityChange,
}) => {
  const theme = useTheme();
  const [isFemminile, setIsFemminile] = React.useState(
    String(dialogValue.value || '').endsWith('A')
  );
  const [selectedValue, setSelectedValue] = React.useState(dialogValue.value);
  console.log('selectedValue', selectedValue);

  useEffect(() => {
    setIsFemminile(String(dialogValue.value || '').endsWith('A'));
    setDialogValue((prevState) => ({
      ...prevState,
      maschile: isFemminile ? '' : dialogValue.value,
      femminile: isFemminile ? dialogValue.value : '',
      value: selectedValue,
    }));
  }, [dialogValue.value, setDialogValue]);

  useEffect(() => {
    onFormValidityChange(Boolean(dialogValue.maschile));
    setSelectedValue(
      isFemminile ? dialogValue.femminile : dialogValue.maschile
    );
  }, [dialogValue.maschile, dialogValue.femminile, onFormValidityChange]);

  const handleChange = (field) => (event) => {
    setDialogValue((prevState) => ({
      ...prevState,
      [field]: event.target.value.toUpperCase(),
    }));
  };

  return (
    <>
      <CssTextField
        error={!dialogValue.maschile}
        helperText={!dialogValue.maschile ? 'Campo obbligatorio' : ''}
        autoFocus
        required
        margin="dense"
        id="input-text-maschile"
        value={dialogValue.maschile || ''}
        onChange={handleChange('maschile')}
        label="Maschile"
        type="text"
        variant="standard"
        sx={{
          margin: '1.5rem 0 0 0',
          '& .MuiInput-underline:before': {
            borderBottomColor: labelColor,
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomWidth: '1px',
            borderBottomColor: theme.palette.primary.main + ' !important',
          },
        }}
      />
      <CssTextField
        margin="dense"
        id="input-text-femminile"
        value={dialogValue.femminile || ''}
        onChange={handleChange('femminile')}
        label="Femminile"
        type="text"
        variant="standard"
        sx={{
          margin: '1.5rem 0 0 0',
          '& .MuiInput-underline:before': {
            borderBottomColor: labelColor,
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomWidth: '1px',
            borderBottomColor: theme.palette.primary.main + ' !important',
          },
        }}
      />
    </>
  );
};

export default FormTitoloPersona;
