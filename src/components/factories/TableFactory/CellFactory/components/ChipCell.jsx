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
const ChipCell = ({ value }) => {
    const { value: label, status: state } = value;
    const statusArray = ['error', 'warning', 'correct'];
    const [status, setStatus] = React.useState(state);

    const statusOptions = {
        error: { color: '#ffcccb', textColor: '#b71c1c' },
        warning: { color: '#fff3cd', textColor: '#856404' },
        correct: { color: '#c8e6c9', textColor: '#2e7d32' },
    };

    const chipStyles = {
        backgroundColor: statusOptions[status].color,
        color: statusOptions[status].textColor,
        cursor: 'pointer',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: statusOptions[status].color,
        },
    };

    const handleChipClick = () => {
        setStatus((prevStato) => {
            const currentIndex = statusArray.indexOf(prevStato);
            return statusArray[(currentIndex + 1) % statusArray.length];
        });
    };

    return (
        <Chip
            size="small"
            label={label || ''}
            onClick={handleChipClick}
            sx={chipStyles}
        />
    );
};

ChipCell.propTypes = {
    value: PropTypes.shape({
        value: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['error', 'warning', 'correct']).isRequired,
    }).isRequired,
};

export default ChipCell;
