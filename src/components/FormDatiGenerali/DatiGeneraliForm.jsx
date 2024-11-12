import * as React from 'react';
import ComponentFactory from '../factories/ComponentFactory';
import Grid from '@mui/material/Grid2';

const DatiGeneraliForm = ({errors, metadati, touchField, onChange, sezione, procedimento}) => {

    const campiSezione = Object.values(metadati).filter((campo) => String(campo.sezione).toLowerCase() === String(sezione).toLowerCase());

    return (
        <Grid container size={{xs: 12}}>
            {campiSezione.map((campo) => (
                <Grid>
                    <ComponentFactory.InputFactory
                        fieldKey={campo.key}
                        value={procedimento[campo.key]}
                        label={campo.label}
                        error={!!errors[campo.key]}
                        helperText={errors[campo.key]}
                        onChange={onChange}
                        options={campo.options}
                    />
                </Grid>
            ))}
        </Grid>
    );


}

export default DatiGeneraliForm;