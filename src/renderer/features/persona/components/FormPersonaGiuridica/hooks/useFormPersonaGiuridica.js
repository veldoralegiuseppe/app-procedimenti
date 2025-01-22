import { useEffect, useMemo } from 'react';
import { CacheFetchPolicies } from '@ui-shared/metadata';
import { ModelTypes } from '@shared/metadata';
import {
  useGenerateInputProps,
  useFetchData,
  useModelArray,
  useCreateStore,
  useModelArrayStore,
} from '@ui-shared/hooks';
import { ModelFactory } from '@ui-shared/components';
import { validators } from '@utils';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@ui-shared/context';
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

dayjs.locale('it');


const useFormPersonaGiuridica = () => {
  const personaGiuridicaStore = useStoreContext(ModelTypes.PERSONA_GIURIDICA);
  const { setProperty, resetModel } = usePersonaStore(personaGiuridicaStore);
  const provinciaStore = useCreateStore({ storeInterface: useModelArray });
  const comuneStore = useCreateStore({
    storeInterface: useModelArray,
  });


  const { addItems: addProvince } = useModelArrayStore(provinciaStore);
  const { resetItems: resetComuni } = useModelArrayStore(comuneStore);
  const { fetchData: fetchProvince } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });
  const { fetchData: fetchComuni } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });

  // Fetch delle province e dei comuni al caricamento del componente
  useEffect(() => {
    // Fetch delle province
    fetchProvince?.({
      url: 'https://axqvoqvbfjpaamphztgd.functions.supabase.co/province',
      options: {
        method: 'GET',
        headers: { accept: 'application/json' },
      },
      onResult: (result) => {
        //console.log('province', result);
        return result?.map((luogo) => ({
          value: String(luogo.nome).toUpperCase(),
          payload: luogo,
        }));
      },
    }).then((province) => {
      addProvince(province);
    });

    // Fetch dei comuni
    fetchComuni({
      url: 'https://axqvoqvbfjpaamphztgd.functions.supabase.co/comuni',
      options: {
        method: 'GET',
        headers: { accept: 'application/json' },
      },
      onResult: (result) => {
        //console.log('comuni', result);
        return result?.map((luogo) => ({
          value: String(luogo.nome).toUpperCase(),
          payload: luogo,
        }));
      },
    }).then((comuni) => {
      resetComuni(comuni);
    });
  }, []);

 
  const propsOverrides = {
  
    denominazione: {
        sx: { width: '29.2rem' },
    },

    provinciaSedeLegale: {
      optionsStore: provinciaStore,
    },

    comuneSedeLegale: {
      sx: { width: '29.2rem' },
      disabled: true,
      helperText: 'Seleziona una provincia',
      optionsStore: comuneStore,
      dependencies: {
        provinciaSedeLegale: {
          callback: ({
            key: provinciaKey,
            oldValue: oldProvincia,
            newValue: provincia,
            props: comuneProps,
            store,
          }) => {
            // Popola i comuni quando la provincia è selezionata
            const filterFn = provincia
              ? (comuni) =>
                  comuni.filter(
                    (comune) =>
                      String(
                        comune.payload.provincia.nome
                      ).toLocaleLowerCase() ===
                      String(provincia).toLocaleLowerCase()
                  )
              : undefined;

            // Resetta i campo quando la provincia cambia
            if (!_.isEqual(oldProvincia, provincia)) {

              console.log('reset comune e cap')
              // Comune
              setProperty('comuneSedeLegale', undefined);

              // CAP
              setProperty('capComuneSedeLegale', undefined);
            }

            return {
              disabled: !provincia,
              helperText: !provincia ? 'Seleziona una provincia' : '',
              filterFn,
            };
          },
        },
      },
      onBlur: (change, option) => {
        const cap = option?.payload?.cap;
        console.log('capComuneSedeLegale', cap);
        setProperty('comuneSedeLegale', option?.value);
        setProperty('capComuneSedeLegale', cap);
      },
    },

    capComuneSedeLegale: {
        disabled: true,
        helperText: 'Calcolato automaticamente',
    },

    indirizzoSedeLegale: {
      sx: { width: '29.2rem' },
    },

    pecEmailRappresentanteLegale: {
      sx: { width: '29.2rem' },
    },

    note: {
      size: { xs: 12 },
      sx: { minWidth: '100%' },
      inputSize: 'medium',
    },

    pecEmail: {
      sx: { width: '29.2rem' },
    },
  };

  const { getInputPropsArray } = useGenerateInputProps({
    modelType: ModelTypes.PERSONA_GIURIDICA,
    overrides: propsOverrides,
  });

  const resetPersonaGiuridica = useMemo(() => {
    return () => {
      resetModel(
        ModelFactory.create({
          type: ModelTypes.PERSONA_GIURIDICA,
          version: '1.0',
        })
      );
    };
  }, []);

  return {
    getInputPropsArray,
    resetPersonaGiuridica,
  };
};

export default useFormPersonaGiuridica;
