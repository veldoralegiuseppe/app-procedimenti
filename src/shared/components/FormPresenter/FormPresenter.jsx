import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import useFormPresenter from './hooks/useFormPresenter';
import _ from 'lodash';

/**
 * Componente FormPresenter
 *
 * Questo componente è responsabile della presentazione di una form con campi dinamici.
 *
 * ## Prestazioni
 * Il componente è ottimizzato in modo da causare un re-render di FormComponent solo al cambiamento
 * dello style, in tal caso il re-render sarà propagato ai children di FormComponent, o della size del container Grid, in tal caso il re-render è
 * limitato a FormComponent stesso.
 * Nonostante ciò, usare il componente FormPresenter per molti campi (inputPropsArray lungo) potrebbe portare ad un tempo di rendering 
 * superiore a 16ms, dunque è consigliabile scomporre la form in più componenti FormPresenter.
 *
 * Nota:
 * Si assume che nelle gli input all'interno di FormComponent utilizzino uno store Zustand in modo da avere re-render
 * basati sui rispettivi selettori che siano indipendenti dal re-render di FormComponent stesso.
 * In altre parole anche se FormComponent non ha un re-render questo non impedisce ai suoi children di aggiornarsi.
 *
 * @component
 * @param {Object[]} inputPropsArray - Array statico di oggetti che rappresentano le props di input per rispettivi campi.
 * @param {string} inputPropsArray[].key - Chiave univoca per il campo nello store.
 * @param {string} inputPropsArray[].store - Store Zustand da cui gli input leggono i dati.
 * @param {string} inputPropsArray[].inputType - Tipo di input da renderizzare.
 * @param {string} inputPropsArray[].component - Componente da renderizzare (sovrascrive inputType).
 * @param {string} [inputPropsArray[].label] - Etichetta opzionale per il campo.
 * @param {string} [inputPropsArray[].sx] - Styling.
 * @param {string} [inputPropsArray[].size] - Oggetto size del component Grid.
 * @param {function} [inputPropsArray[].onChange] - Funzione di callback chiamata quando il valore del campo cambia.
 * @param {function} [inputPropsArray[].onBlur] - Funzione di callback chiamata sull'evento onBlur.
 * @param {string} [titolo=''] - Titolo statico e opzionale del modulo.
 *
 * @returns {JSX.Element} Il componente FormPresenter.
 */
const FormPresenter = ({ inputPropsArray: inputProps = [], titolo = '' }) => {
  const [inputPropsArray] = React.useState(inputProps);
  const [titoloForm] = React.useState(titolo);
  const { renderFields } = useFormPresenter(inputPropsArray);

  return (
    <Grid
      container
      sx={{ columnGap: '1rem', rowGap: '1.7rem' }}
      size={{ xs: 12 }}
    >
      {/* Titolo */}
      {titoloForm && (
        <Grid
          size={{ xs: 12 }}
          sx={{
            height: '2rem',
            borderBottom: `1px solid #467bae`,
          }}
        >
          <Typography sx={{ fontSize: '1.2rem', color: '#467bae' }}>
            {titolo}
          </Typography>
        </Grid>
      )}

      {/* Componenti */}
      {renderFields}
    </Grid>
  );
};

export default FormPresenter;
