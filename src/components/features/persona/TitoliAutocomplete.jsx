import * as React from 'react';
import OptionsAutocomplete from '@components/commons/OptionsAutocomplete';
import FormTitoloPersona from '@components/forms/dialogs/FormTitoloPersona';

const TitoliAutocomplete = ({ label, sx }) => {
  const [titoli, setTitoli] = React.useState([
    { maschile: 'AVV', femminile: 'AVV.SSA' },
  ]);

  return (
    <OptionsAutocomplete
      label={label || ''}
      options={titoli
        .sort((a, b) => (a.femminile ? 1 : -1))
        .map((titolo) => ({ value: titolo }))}
      groupBy={(option) =>
        !!option.key ? null : !option.value.femminile ? 'Genere comune' : 'Genere specifico'
      }
      filterOptions={(options, inputValue) => {
        console.log('filterOptions', options);
        if (!options) return [];
        if (!inputValue) return options;
        return options.filter(
          (option) =>
            option.value.maschile
              .toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            option.value.femminile
              ?.toLowerCase()
              .includes(inputValue.toLowerCase())
        );
      }}
      dialogForm={<FormTitoloPersona />}
      onSubmit={(option) => {
        console.log('onSubmit', option);
        setTitoli([
          ...titoli,
          {
            ...(option.maschile && { maschile: option.maschile }),
            ...(option.femminile && { femminile: option.femminile }),
          },
        ]);
      }}
      onDelete={(option) => {
        console.log('onDelete', option);
        setTitoli(titoli.filter((titolo) => titolo !== option.value));
      }}
      sx={sx}
    />
  );
};

export default TitoliAutocomplete;
