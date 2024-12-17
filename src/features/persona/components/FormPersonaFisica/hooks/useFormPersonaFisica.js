import { useCallback, useEffect, useState } from 'react';
import { FieldTypes, CacheFetchPolicies } from '@shared/metadata';
import {
  useGenerateInputProps,
  useCodiceFiscale,
  useFetchData,
  useModelArray,
  useCreateStore,
  useModelArrayStore,
} from '@shared/hooks';
import { validators } from '@utils';
import { usePersonaStore } from '@features/persona';
import { useStoreContext } from '@shared/context';
import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

dayjs.locale('it');

// CAP
const capProps = {
  disabled: true,
  helperText: 'Calcolato automaticamente',
};

const useFormPersonaFisica = () => {
  const personaFisicaStore = useStoreContext(FieldTypes.PERSONA_FISICA);
  const { setProperty } = usePersonaStore(personaFisicaStore);
  const provinciaStore = useCreateStore({ storeInterface: useModelArray });
  const comuneResidenzaStore = useCreateStore({
    storeInterface: useModelArray,
  });
  const comuneNascitaStore = useCreateStore({ storeInterface: useModelArray });

  const { addItems: addProvince } = useModelArrayStore(provinciaStore);
  const { resetItems: resetComuniNascita } = useModelArrayStore(comuneNascitaStore);
  const { resetItems: resetComuniResidenza } = useModelArrayStore(comuneResidenzaStore);
  const { fetchData: fetchProvince } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });
  const { fetchData: fetchComuni } = useFetchData({
    cachePolicy: CacheFetchPolicies.CACHE_FIRST,
  });
  const { decodeLuogoNascitaAsync, decodeDataNascita, decodeGenere } = useCodiceFiscale();

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
          value: luogo.nome,
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
          value: luogo.nome,
          payload: luogo,
        }));
      },
    }).then((comuni) => {
      resetComuniNascita(comuni);
      resetComuniResidenza(comuni);
    });
  }, []);

  const getComuneProps = (key) => {
    const isComuneNascita = key === 'comuneNascita';

    const codiceFiscaleDependency = {
      callback: ({ key, oldValue, newValue, props, store }) => {
        // Controllo se il codice fiscale è valido
        const isCodiceFiscaleValid =
          newValue && validators.isCodiceFiscale(newValue) === true;

        // Decodifico il comune di nascita ed il cap
        decodeLuogoNascitaAsync(newValue).then((result) => {
          console.log('getLuogoNascita', result);
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

        console.log('disabled', isCodiceFiscaleValid);
        // return {
        //   disabled: isCodiceFiscaleValid,
        // };
      },
    };

    return {
      sx: { width: '29.2rem' },
      disabled: true,
      helperText: 'Seleziona una provincia',
      optionsStore: isComuneNascita ? comuneNascitaStore : comuneResidenzaStore,
      dependencies: {
        [isComuneNascita ? 'provinciaNascita' : 'provinciaResidenza']: {
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
            if (!_.isEqual(oldProvincia, provincia)) {
              // Comune
              setProperty(key, undefined);

              // CAP
              setProperty(
                isComuneNascita ? 'capComuneNascita' : 'capComuneResidenza',
                undefined
              );
            }

            console.log(
              'props provincia',
              comuneProps,
              'isComuneDisabled',
              !provincia || comuneProps?.disabled
            );

            return {
              disabled: !provincia || isCodiceFiscaleValid,
              helperText: !provincia ? 'Seleziona una provincia' : '',
              filterFn,
            };
          },
        },
        ...(isComuneNascita ? { codiceFiscale: codiceFiscaleDependency } : {}),
      },
      onBlur: (change, option) => {
        console.log('onBlur', change, option);
        const cap = option?.payload?.cap;

        setProperty(
          isComuneNascita ? 'capComuneNascita' : 'capComuneResidenza',
          cap
        );
      },
    };
  };

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

            console.log('dataNascitaDisabled', isCodiceFiscaleValid);

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

            return {
              disabled: isCodiceFiscaleValid,
              value: genere ? (genere === 'M' ? 'UOMO' : 'DONNA') : undefined,
            };
          },
        },
      },
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
      optionsStore: provinciaStore,
    },

    capComuneResidenza: {
      ...capProps,
    },

    pecEmailRappresentanteLegale: {
      sx: { width: '29.2rem' },
    },

    pecEmail: {
      sx: { width: '29.2rem' },
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
