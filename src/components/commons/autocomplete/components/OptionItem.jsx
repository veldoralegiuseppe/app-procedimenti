import React from 'react';
import { Button, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

const OptionItem = ({ option, onDelete, onOptionSelected }) => {
  const theme = useTheme();

  const handleButtonClick = (option, value) => {
    console.log('handleButtonClick', option, value);
    if (onOptionSelected) {
      onOptionSelected(option, value);
    }
    document.activeElement.blur();
  };

  const renderButtons = () => {
    if (typeof option.value === 'object' && option.value !== null) {
      return React.Children.toArray(
        Object.entries(option.value).map(([subKey, subValue], subIndex) => {
          const buttonKey = `button-${subKey}-${JSON.stringify(
            subValue
          )}-${subIndex}`;
          return subValue && (
            <Button
              key={buttonKey}
              variant="text"
              sx={{
                width: '100%',
                margin: '0 .5rem',
                '&:hover': {
                  backgroundColor: theme.palette.dropdown.hover,
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => handleButtonClick(option, subValue)}
            >
              {subValue}
            </Button>
          );
        })
      );
    } else if (option.key === 'add' || typeof option.value === 'string') {
      const buttonKey = `button-${option.key || 'defaultKey'}-${
        option.value || 'defaultValue'
      }`;
      return React.Children.toArray(
        <Button
          key={buttonKey}
          variant="text"
          sx={{
            width: '100%',
            margin: '0 .5rem',
            '&:hover': {
              backgroundColor: theme.palette.dropdown.hover,
              color: theme.palette.primary.main,
            },
          }}
          onClick={() => handleButtonClick(option, option.value)}
        >
          {option.label || option.value}
        </Button>
      );
    }
    return null;
  };

  return (
    <li
      style={{ backgroundColor: 'transparent', padding: '0' }}
      key={`li-${option.key || 'defaultKey'}-${JSON.stringify(
        option.value || ''
      )}`}
      onClick={(event) => event.preventDefault()}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-evenly',
        }}
      >
        {option.key !== 'add' && (
          <IconButton
            key={`delete-${option.key || 'defaultKey'}-${JSON.stringify(
              option.value || 'defaultValue'
            )}`}
            sx={{ fontSize: '1rem', color: '#e67a0fb3' }}
            onClick={() => onDelete(option)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        )}
        {renderButtons()}
      </div>
    </li>
  );
};

export default OptionItem;
