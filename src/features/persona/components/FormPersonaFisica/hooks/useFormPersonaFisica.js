import { useCallback } from 'react';
import { FieldTypes } from '@shared/metadata';
import { useGenerateInputProps } from '@shared/hooks';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@shared/context';

// Fetch props
const fetchCommonProps = {
  // decorator: 'withDataFetch'
  decorator: 'withDataFetch',
  preload: false,
  cachePolicy: 'firstRetrieve',
  dataProp: 'fetchOptions',
  fetchFnProp: 'onOpen',
  onResult: (result) => {
    //console.log(result);
    return result?.map((luogo) => ({
      value: luogo.nome,
      payload: luogo,
    }));
  },
  httpOptions: {
    method: 'GET',
    accept: 'application/json',
  },
};
const fetchComuni = {
  ...fetchCommonProps,
  sx: { width: '20rem' },
  disabled: true,
  helperText: 'Seleziona una provincia',
};
const fetchProvince = {
  ...fetchCommonProps,
  url: 'https://axqvoqvbfjpaamphztgd.functions.supabase.co/province',
};
const provinciaDependency = {
  callback: ({ key, oldValue, newValue: provincia, props, store }) => {
    return {
      disabled: !provincia,
      helperText: !provincia ? 'Seleziona una provincia' : '',
      url: `https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni/provincia/${provincia}`,
    };
  },
};

// CAP
const capProps = {
  disabled: true,
  helperText: 'Calcolato automaticamente',
};

const useFormPersonaFisica = () => {
  const store = useStoreContext(FieldTypes.PERSONA_FISICA);
  const { setProperty } = usePersonaStore(store);

  const handleChange = useCallback(
    (changes) => {
      console.log('handleChange', changes);
      Object.entries(changes).forEach(([key, value]) => {
        setProperty(key, value);
      });
    },
    [setProperty]
  );

  const getComuneProps = (key) => {
    const isComuneNascita = key === 'comuneNascita';

    return {
      ...fetchComuni,
      dependencies: {
        [isComuneNascita ? 'provinciaNascita' : 'provinciaResidenza']:
          provinciaDependency,
      },
      onBlur: (change, option) => {
        console.log('onBlur', change, option);
        const cap = option?.payload?.cap;
        handleChange(change);
        if (cap)
          setProperty(
            isComuneNascita ? 'capComuneNascita' : 'capComuneResidenza',
            cap
          );
      },
    };
  };

  const propsOverrides = {
    common: {
      onBlur: handleChange,
    },

    codiceFiscale: {
      size: { xs: 12 },
    },

    provinciaNascita: {
      ...fetchProvince,
    },

    comuneNascita: {
      ...getComuneProps('comuneNascita'),
    },

    capComuneNascita: {
      ...capProps,
    },

    comuneResidenza: {
      ...getComuneProps('comuneResidenza'),
    },

    provinciaResidenza: {
      ...fetchProvince,
    },

    capComuneResidenza: {
      ...capProps,
    },
  };

  const { getInputPropsArray } = useGenerateInputProps({
    modelType: FieldTypes.PERSONA_FISICA,
    overrides: propsOverrides,
  });

  return {
    getInputPropsArray,
  };
};

export default useFormPersonaFisica;
