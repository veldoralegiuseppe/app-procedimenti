import { useState, useCallback } from 'react';

const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performOperation = useCallback(async (operation, ...args) => {
    console.log('performOperation', operation, args);
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Database operation error:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    (collection, data) =>
      performOperation(window.databaseAPI.create, collection, data),
    [performOperation]
  );

  return {
    create,
    loading,
    error,
  };
};

export default useDatabase;
