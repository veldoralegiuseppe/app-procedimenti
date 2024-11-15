import * as React from 'react';
import OptionsAutocomplete from '@components/commons/OptionsAutocomplete';

const TitoliAutocomplete = ({ label, sx }) => {
  const [titoli, setTitoli] = React.useState([
    { maschile: 'AVV', femminile: 'AVV.SSA' },
  ]);

  return (
    <OptionsAutocomplete
      label={label || 'Titolo'}
      validations={{ maschile: ['required'] }}
      onFormPopulate={(inputValue) =>
        String(inputValue).endsWith('A')
          ? { maschile: '', femminile: inputValue }
          : { maschile: inputValue, femminile: '' }
      }
      options={titoli}
      groupBy={(option) =>
        option.maschile && option.femminile
          ? 'GENERE SPECIFICO'
          : 'GENERE COMUNE'
      }
      onSubmit={(option) => {
        //console.log('onSubmit', option);
        setTitoli([...titoli, option]);
      }}
      onDelete={(option) => {
        //console.log('onDelete', option);
        setTitoli(titoli.filter((titolo) => titolo !== option));
      }}
    />
  );
};

export default TitoliAutocomplete;
