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

  const retrieve = useCallback(
    async (query, page, limit) =>
      await performOperation(window.databaseAPI.findAll, query, page, limit),
    [performOperation]
  );

  const calculateStatistics = useCallback(
    async (query) =>
      await performOperation(window.databaseAPI.calculateStatistics, query),
    [performOperation]
  );

  return {
    create,
    retrieve,
    calculateStatistics,
    loading,
    error,
  };
};

export default useDatabase;
