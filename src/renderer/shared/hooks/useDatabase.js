import { useState, useCallback } from 'react';

const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
   
    try {
      const result = await operation(...args);
      console.log('result', result);
      //if (!result || typeof result !== 'object' || !result.success) throw new Error(result?.error || 'Unknown error');
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Database operation error:', err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data) =>
      await performOperation(window.databaseAPI.create, data),
    [performOperation]
  );

  return {
    create,
    loading,
    error,
  };
};

export default useDatabase;
