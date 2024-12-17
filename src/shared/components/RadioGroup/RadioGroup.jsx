import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup as MuiRadioGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Componente RadioGroup.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Array} props.options - Un array di oggetti che rappresentano le opzioni del gruppo di radio button.
 * @param {string} props.options[].value - Il valore dell'opzione.
 * @param {string} props.options[].label - L'etichetta dell'opzione.
 * @param {string} props.value - Il valore attualmente selezionato.
 * @param {function} props.onChange - La funzione chiamata quando il valore selezionato cambia.
 *
 * @returns {JSX.Element} Il componente RadioGroup.
 */
const RadioGroup = ({ options, value, onChange }) => {
    const theme = useTheme();
    const labelColor = 'rgb(105 105 105 / 60%)';

    return (
        <FormControl>
            <MuiRadioGroup
                row
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        sx={{
                            marginRight: '4.5rem',
                            '& .MuiTypography-root': {
                                color: theme.palette.text.primary,
                            },
                            '& .MuiRadio-root:not(.Mui-checked) span': {
                                color: labelColor,
                            },
                        }}
                    />
                ))}
            </MuiRadioGroup>
        </FormControl>
    );
};

export default RadioGroup;
