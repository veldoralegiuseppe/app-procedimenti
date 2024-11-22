import * as React from 'react';
import OptionsAutocomplete from '@components/commons/autocomplete/OptionsAutocomplete';
import useDynamicOptions from '../../commons/hooks/useDynamicOptions';

const TitoliAutocomplete = ({ label, sx }) => {

  const {addOption, options: titoli, removeOption} = useDynamicOptions();
 
  return (
    <OptionsAutocomplete
      label={label || 'Titolo'}
      validations={{ maschile: ['required'] }}
      onFormPopulate={(inputValue) =>
        String(inputValue).endsWith('A')
          ? { maschile: '', femminile: inputValue }
          : { maschile: inputValue, femminile: '' }
      }
      optionModel={['maschile', 'femminile']}
      options={titoli}
      groupBy={(option) =>
        option.maschile && option.femminile
          ? 'Genere specifico'
          : 'Genere comune'
      }
      onSubmit={addOption}
      onDelete={removeOption}
      sx={sx}
    />
  );
};

export default TitoliAutocomplete;
