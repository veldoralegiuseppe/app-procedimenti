import { useState, useEffect, useCallback, useRef } from 'react';
import { CacheFetchPolicies } from '@shared/metadata';

const useFetchData = ({ cachePolicy = CacheFetchPolicies.NO_CACHE } = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  // Cache interna per gestire i dati
  const cacheRef = useRef({});

  const fetchData = useCallback(
    async ({ url, options, onResult }) => {
      setLoading(true);
      setError(undefined);

      try {
        // Controlla se i dati sono già in cache
        if (cachePolicy === CacheFetchPolicies.CACHE_FIRST && cacheRef.current[url]) {
          console.log('Restituendo dati dalla cache:', cacheRef.current[url]);
          setLoading(false);
          return cacheRef.current[url];
        }

        // Effettua la fetch
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const result = await response.json();
        const parsedResult = onResult ? onResult(result) : result;

        // Aggiorna la cache
        if (cachePolicy !== CacheFetchPolicies.NO_CACHE) {
          cacheRef.current[url] = parsedResult;
        }

        // Aggiorna lo stato
        setData(parsedResult);
        setLoading(false);

        return parsedResult;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err; // Propaga l'errore
      }
    },
    [cachePolicy]
  );

  return { data, loading, error, fetchData };
};

export default useFetchData;
