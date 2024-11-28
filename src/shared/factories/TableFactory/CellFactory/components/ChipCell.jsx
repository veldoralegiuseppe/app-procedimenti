import * as React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

/**
 * Componente ChipCell che visualizza un Chip con uno stato cliccabile.
 * @param {Object} props - Le proprietà del componente.
 * @param {Object} props.value - L'oggetto contenente il valore e lo stato del Chip.
 * @param {string} props.value.value - Il testo da visualizzare nel Chip.
 * @param {string} props.value.status - Lo stato iniziale del Chip (error, warning, correct).
 * @param {function} [props.onClick] - La funzione da eseguire al click sul Chip.
 * @param {Object} [props.row] - La riga della tabella associata al Chip.
 * @param {Object} [props.sx] - Le proprietà di stile aggiuntive.
 * 
 */
const ChipCell = ({ value: label, status, onClick, row, sx }) => {
  
  const statusFlagOptions = React.useMemo(() => ({
    red: { color: '#ffcccb', textColor: '#b71c1c' },
    yellow: { color: '#fff3cd', textColor: '#856404' },
    green: { color: '#c8e6c9', textColor: '#2e7d32' },
  }), []);

  const chipStyles = React.useMemo(() => ({
    backgroundColor: statusFlagOptions[status].color,
    color: statusFlagOptions[status].textColor,
    cursor: 'pointer',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: statusFlagOptions[status].color,
    },
    ...sx,
  }), [status, sx, statusFlagOptions]);

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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  status: PropTypes.oneOf(['red', 'yellow', 'green']).isRequired,
  onClick: PropTypes.func,
  row: PropTypes.object,
  sx: PropTypes.object,
};

export default ChipCell;
