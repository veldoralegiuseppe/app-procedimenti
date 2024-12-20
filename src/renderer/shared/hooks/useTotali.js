import { useState, useCallback } from 'react';
import { isEqual } from 'lodash';

const useTotali = ({ calculateTotali }) => {
  const [totali, setTotali] = useState(() => calculateTotali?.() || []);

  const updateTotali = useCallback(() => {
    const newTotali = calculateTotali();

    setTotali((prevTotali) => {
      if (!isEqual(prevTotali, newTotali)) {
        console.log('newTotali', newTotali);
        return newTotali;
      }
      return prevTotali;
    });
  }, [calculateTotali]);

  return { totali, updateTotali };
};

export default useTotali;
