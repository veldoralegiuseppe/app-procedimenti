import * as React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

/**
 * Componente ChipCell che visualizza un Chip con uno stato cliccabile.
 * @param {Object} props - Le proprietà del componente.
 * @param {Object} props.value - L'oggetto contenente il valore e lo stato del Chip.
 * @param {string} props.value.value - Il testo da visualizzare nel Chip.
 * @param {string} props.value.status - Lo stato iniziale del Chip (error, warning, correct).
 */
const ChipCell = ({ value: label, status, onClick, row }) => {
  
  const statusFlagOptions = {
    red: { color: '#ffcccb', textColor: '#b71c1c' },
    yellow: { color: '#fff3cd', textColor: '#856404' },
    green: { color: '#c8e6c9', textColor: '#2e7d32' },
  };

  const chipStyles = {
    backgroundColor: statusFlagOptions[status].color,
    color: statusFlagOptions[status].textColor,
    cursor: 'pointer',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: statusFlagOptions[status].color,
    },
  };

  return (
    <Chip
      size="small"
      label={label || ''}
      onClick={() => onClick?.(row)}
      sx={chipStyles}
    />
  );
};

ChipCell.propTypes = {
  value: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['red', 'yellow', 'green']).isRequired,
};

export default ChipCell;
