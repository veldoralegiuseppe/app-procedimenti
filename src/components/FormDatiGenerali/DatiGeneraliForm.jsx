import * as React from 'react';
import {Procedimento} from '@model/procedimento';
import ComponentFactory from '../factories/ComponentFactory';
import Grid from '@mui/material/Grid2';

const DatiGeneraliForm = ({errors, touchField, onChange, sezione, procedimento}) => {

    const metadati = Procedimento.getMetadati();
    const campiSezione = Object.values(metadati).filter((campo) => campo.sezione === sezione);

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