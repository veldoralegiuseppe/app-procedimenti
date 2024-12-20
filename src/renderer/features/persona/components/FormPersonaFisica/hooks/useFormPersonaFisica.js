import { useEffect, useMemo } from 'react';
import { FieldTypes, CacheFetchPolicies } from '@ui-shared/metadata';
import {
  useGenerateInputProps,
  useCodiceFiscale,
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

// CAP
const comuneCommonProps = {
  sx: { width: '29.2rem' },
  disabled: true,
  helperText: 'Seleziona una provincia',
};
const capProps = {
  disabled: true,
  helperText: 'Calcolato automaticamente',
};

const useFormPersonaFisica = () => {
  const personaFisicaStore = useStoreContext(FieldTypes.PERSONA_FISICA);
  const { setProperty, resetModel } = usePersonaStore(personaFisicaStore);
  const provinciaStore = useCreateStore({ storeInterface: useModelArray });
  const comuneResidenzaStore = useCreateStore({
    storeInterface: useModelArray,
  });
  const comuneNascitaStore = useCreateStore({ storeInterface: useModelArray });

  const { addItems: addProvince } = useModelArrayStore(provinciaStore);
  const { resetItems: resetComuniNascita } =
    useModelArrayStore(comuneNascitaStore);
  const { resetItems: resetComuniResidenza } =
    useModelArrayStore(comuneResidenzaStore);
  const { fetchData: fetchProvince } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });
  const { fetchData: fetchComuni } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });
  const { decodeLuogoNascitaAsync, decodeDataNascita, decodeGenere } =
    useCodiceFiscale();

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
      resetComuniNascita(comuni);
      resetComuniResidenza(comuni);
    });
  }, []);

  const propsOverrides = {
    codiceFiscale: {
      size: { xs: 12 },
    },

    provinciaNascita: {
      optionsStore: provinciaStore,
      dependencies: {
        codiceFiscale: {
          callback: ({ key, oldValue, newValue, props, store }) => {
            // Controllo se il codice fiscale è valido
            const isCodiceFiscaleValid =
              newValue && validators.isCodiceFiscale(newValue) === true;

            // Decodifico la provincia di nascita
            decodeLuogoNascitaAsync(newValue).then((result) => {
              const siglaProvincia = result?.province;

              // Trova la provincia corrispondente alla sigla
              const provincia = provinciaStore
                .getState()
                .items.find(
                  (prov) => prov.payload.sigla === siglaProvincia
                )?.value;

              setProperty('provinciaNascita', provincia || undefined);
            });

            return {
              disabled: isCodiceFiscaleValid,
            };
          },
        },
      },
    },

    dataNascita: {
      dependencies: {
        codiceFiscale: {
          callback: ({
            key,
            oldValue,
            newValue: codiceFiscale,
            props,
            store,
          }) => {
            // Controllo se il codice fiscale è valido
            const isCodiceFiscaleValid =
              codiceFiscale &&
              validators.isCodiceFiscale(codiceFiscale) === true;

            // Decodifico la data di nascita
            let dataNascita;
            if (isCodiceFiscaleValid)
              dataNascita = decodeDataNascita(codiceFiscale);

            setProperty('dataNascita', dataNascita?.format('YYYY-MM-DD'));

            return {
              disabled: isCodiceFiscaleValid,
              value: dataNascita,
            };
          },
        },
      },
    },

    sesso: {
      dependencies: {
        codiceFiscale: {
          callback: ({
            key,
            oldValue,
            newValue: codiceFiscale,
            props,
            store,
          }) => {
            // Controllo se il codice fiscale è valido
            const isCodiceFiscaleValid =
              codiceFiscale &&
              validators.isCodiceFiscale(codiceFiscale) === true;

            // Decodifico il genere
            let genere;
            if (isCodiceFiscaleValid) genere = decodeGenere(codiceFiscale);
            genere = genere ? (genere === 'M' ? 'UOMO' : 'DONNA') : undefined;
            setProperty('sesso', genere);

            return {
              disabled: isCodiceFiscaleValid,
              value: genere,
            };
          },
        },
      },
    },

    comuneNascita: {
      ...comuneCommonProps,
      optionsStore: comuneNascitaStore,
      onBlur: (change, option) => {
        const cap = option?.payload?.cap;
        setProperty('comuneNascita', option?.value);
        setProperty('capComuneNascita', cap);
      },
      dependencies: {
        provinciaNascita: {
          callback: ({
            key: provinciaKey,
            oldValue: oldProvincia,
            newValue: provincia,
            props: comuneProps,
            store,
          }) => {
            // Controllo se il codice fiscale è valido
            const codiceFiscale = store.getState().getProperty('codiceFiscale');
            const isCodiceFiscaleValid =
              codiceFiscale &&
              validators.isCodiceFiscale(codiceFiscale) === true;

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
            if (!isCodiceFiscaleValid && !_.isEqual(oldProvincia, provincia)) {
              // Comune
              setProperty('comuneNascita', undefined);

              // CAP
              setProperty('capComuneNascita', undefined);
            }

            return {
              disabled: !provincia || isCodiceFiscaleValid,
              helperText: !provincia ? 'Seleziona una provincia' : '',
              filterFn,
            };
          },
        },
        codiceFiscale: {
          callback: ({ key, oldValue, newValue, props, store }) => {
            // Controllo se il codice fiscale è valido
            const isCodiceFiscaleValid =
              newValue && validators.isCodiceFiscale(newValue) === true;

            // Decodifico il comune di nascita ed il cap
            decodeLuogoNascitaAsync(newValue).then((result) => {

              const comune = comuneNascitaStore
                .getState()
                .items.find(
                  (com) =>
                    String(com.payload.nome).toLowerCase() ===
                      String(result?.name).toLocaleLowerCase() &&
                    String(com.payload.provincia.sigla).toLowerCase() ===
                      String(result?.province).toLowerCase()
                );
              
              setProperty('comuneNascita', comune?.value);
              setProperty('capComuneNascita', comune?.payload?.cap);
            });
          },
        },
      },
    },

    capComuneNascita: {
      ...capProps,
    },

    comuneResidenza: {
      ...comuneCommonProps,
      optionsStore: comuneResidenzaStore,
      onBlur: (change, option) => {
        const cap = option?.payload?.cap;
       
        setProperty('comuneResidenza', option?.value);
        setProperty('capComuneResidenza', cap);
      },
      dependencies: {
        provinciaResidenza: {
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
              // Comune
              setProperty('comuneResidenza', undefined);

              // CAP
              setProperty('capComuneResidenza', undefined);
            }

            return {
              disabled: !provincia,
              helperText: !provincia ? 'Seleziona una provincia' : '',
              filterFn,
            };
          },
        },
      },
    },

    provinciaResidenza: {
      optionsStore: provinciaStore,
    },

    capComuneResidenza: {
      ...capProps,
    },

    indirizzoResidenza: {
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
    modelType: FieldTypes.PERSONA_FISICA,
    overrides: propsOverrides,
  });

  const resetPersonaFisica = useMemo(() => {
    return () => {
      resetModel(
        ModelFactory.create({
          type: FieldTypes.PERSONA_FISICA,
          version: '1.0',
        })
      );
    };
  }, []);

  return {
    getInputPropsArray,
    resetPersonaFisica,
  };
};

export default useFormPersonaFisica;
