import * as React from 'react';
import { OptionsAutocomplete } from '@shared/components';
import { useCreateStore, useModelArray } from '@shared/hooks';

const TitoliAutocompleteComponent = ({ label, sx, onBlur }) => {
  const titoliStore = useCreateStore({ storeInterface: useModelArray });
  console.log('titoliStore', titoliStore.getState().items);

  return (
    <OptionsAutocomplete
      label={label || 'Titolo'}
      validations={{
        maschile: ['required', 'onlyAlphabetic'],
        femminile: ['onlyAlphabetic'],
      }}
      isOptionEqualToValue={(option, value) => option.value.maschile === value || option.value.femminile === value}
      onFormPopulate={(inputValue) =>
        String(inputValue).endsWith('A')
          ? { maschile: '', femminile: inputValue }
          : { maschile: inputValue, femminile: '' }
      }
      optionModel={['maschile', 'femminile']}
      groupBy={(option) =>
        option.maschile && option.femminile
          ? 'Genere specifico'
          : 'Genere comune'
      }
      optionsStore={titoliStore}
      onBlur={onBlur}
      sx={sx}
    />
  );
};

const TitoliAutocomplete = React.memo(TitoliAutocompleteComponent, () => true);
export default TitoliAutocomplete;
