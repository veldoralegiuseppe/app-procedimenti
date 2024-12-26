import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ModifyIcon from '@mui/icons-material/Edit';
import { ButtonTypes } from '@ui-shared/metadata';

const buttonStyles = {
  OUTLINED: {
    width: '90px',
    color: '#467bae',
    border: '.9px solid #467bae',
    '&:hover': {
      backgroundColor: '#6ea5da29',
      border: '.9px solid #467bae',
    },
  },
  PRIMARY: {
    width: '90px',
    color: 'white',
    backgroundColor: '#467bae',
    '&:hover': { backgroundColor: '#3d6f9f', color: 'white' },
  },
  DELETE: {
    width: '90px',
    color: 'white',
    backgroundColor: '#d32f2f',
    '&:hover': { backgroundColor: '#b71c1c', color: 'white' },
  },
};

const ButtonFactory = ({
  type,
  onClick,
  text,
  size,
  disabled: initialDisabled = false,
}) => {
  const [disabled, setDisabled] = useState(initialDisabled);

  useEffect(() => {
    if (disabled !== initialDisabled) setDisabled(initialDisabled);
  }, [initialDisabled]);

  const renderButton = () => {
    const getButtonProps = () => {
      switch (type) {
        case ButtonTypes.OUTLINED:
          return {
            variant: 'outlined',
            sx: buttonStyles.OUTLINED,
            startIcon: (
              <ArrowBackOutlinedIcon
                sx={{ color: disabled ? '#b3b3b3' : '#467bae' }}
              />
            ),
          };
        case ButtonTypes.CREATE:
          return {
            variant: 'contained',
            sx: buttonStyles.PRIMARY,
            startIcon: (
              <AddIcon sx={{ color: disabled ? '#b3b3b3' : 'white' }} />
            ),
          };
        case ButtonTypes.DELETE:
          return {
            variant: 'contained',
            sx: buttonStyles.DELETE,
            startIcon: (
              <DeleteIcon sx={{ color: disabled ? '#b3b3b3' : 'white' }} />
            ),
          };
        case ButtonTypes.MODIFY:
          return {
            variant: 'contained',
            sx: buttonStyles.PRIMARY,
            startIcon: (
              <ModifyIcon sx={{ color: disabled ? '#b3b3b3' : 'white' }} />
            ),
          };
        case ButtonTypes.PRIMARY:
          return {
            variant: 'contained',
            sx: buttonStyles.PRIMARY,
          };
        default:
          return {};
      }
    };

    const buttonProps = getButtonProps();

    return (
      <Button
        {...buttonProps}
        size={size}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </Button>
    );
  };

  return <React.Fragment>{renderButton()}</React.Fragment>;
};

export default ButtonFactory;
