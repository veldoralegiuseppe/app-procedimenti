import * as React from 'react';
import { OptionsAutocomplete } from '@shared/components';
import { useDynamicOptions } from '@shared/hooks';

const TitoliAutocomplete = ({ label, sx, onBlur }) => {
  const { addOption, options: titoli, removeOption } = useDynamicOptions();

  return (
    <OptionsAutocomplete
      label={label || 'Titolo'}
      validations={{
        maschile: ['required', 'onlyAlphabetic'],
        femminile: ['onlyAlphabetic'],
      }}
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
      onBlur={onBlur}
      sx={sx}
    />
  );
};

export default TitoliAutocomplete;
