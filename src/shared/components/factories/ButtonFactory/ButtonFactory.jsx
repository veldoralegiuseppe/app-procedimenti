import React from 'react';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddIcon from '@mui/icons-material/Add';
import { ButtonTypes } from '@shared/metadata';

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
    backgroundColor: '#108d10',
    '&:hover': { backgroundColor: '#119c11', color: 'white' },
  },
};

const ButtonFactory = ({ type, onClick, text }) => {
  const renderButton = () => {
    switch (type) {
      case ButtonTypes.OUTLINED:
        return (
          <Button
            variant="outlined"
            onClick={onClick}
            sx={buttonStyles.OUTLINED}
            startIcon={<ArrowBackOutlinedIcon sx={{ color: '#467bae' }} />}
          >
            {text}
          </Button>
        );
      case ButtonTypes.CREATE:
        return (
          <Button
            variant="contained"
            onClick={onClick}
            sx={buttonStyles.PRIMARY}
            startIcon={<AddIcon sx={{ color: 'white' }} />}
          >
            {text}
          </Button>
        );
      default:
        return null;
    }
  };

  return <React.Fragment>{renderButton()}</React.Fragment>;
};

export default ButtonFactory;
