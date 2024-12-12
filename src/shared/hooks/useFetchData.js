import { useState, useEffect, useCallback } from 'react';

const useFetchData = ({
  url,
  options,
  onResult,
  preload = true,
  cachePolicy,
}) => {
  const [firstRetrieve, setFirstRetrieve] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState({ loading: false, data: null });

  const fetchData = useCallback(async () => {
    if (!firstRetrieve) return;

    try {
      setState({ ...state, loading: true });

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setState({
        data: onResult ? onResult(result) : result,
        loading: false,
      });
    } catch (error) {
      setError(error);
    } finally {
      if (cachePolicy === 'firstRetrieve') {
        setFirstRetrieve(false);
      }
    }
  }, [url, options, onResult, cachePolicy, firstRetrieve, state]);

  useEffect(() => {
    if (preload) fetchData();
  }, [url]);

  return { ...state, error, fetchData };
};

export default useFetchData;
