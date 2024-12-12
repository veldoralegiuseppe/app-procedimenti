import React from 'react';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

const OptionItemComponent = ({
  option,
  onDelete,
  onOptionSelected,
  deletable = true,
}) => {
  const theme = useTheme();
  //console.log('OptionItemComponent', option, id);

  const handleButtonClick = (option, value) => {
    if (onOptionSelected) {
      onOptionSelected(option, value);
    }
    document.activeElement.blur();
  };

  const renderButtons = () => {
    //console.log('renderButtons', option);
    if (typeof option.value === 'object' && option.value !== null) {
      return React.Children.toArray(
        Object.entries(option.value).map(([subKey, subValue], subIndex) => {
          const buttonKey = `button-${option.id}-${subKey}-${JSON.stringify(
            subValue
          )}-${subIndex}`;
          return (
            subValue && (
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
            )
          );
        })
      );
    } else if (option.key === 'add' || typeof option.value === 'string') {
      //console.log('option', option);
      const buttonKey = `button-${option.key || 'defaultKey'}-${option.value || 'defaultValue'}`;
      return React.Children.toArray(
        <Button
          key={`${buttonKey}-${option.id}`}
          variant="text"
          sx={{
            width: '100%',
            margin: '0 .5rem',
            justifyContent: 'flex-start',
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
        {option.key !== 'add' && deletable && (
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

const OptionItem = React.memo(OptionItemComponent, (prevProps, nextProps) => {
  // Condidero dinamiche le props: option
  return _.isEqual(prevProps.option, nextProps.option)
});

export default OptionItem;
