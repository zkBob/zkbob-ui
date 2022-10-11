import { useState, useEffect } from 'react';

export const useMaxAmountExceeded = (amount, maxTransferable) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    setMaxAmountExceeded(amount.gt(maxTransferable));
  }, [amount, maxTransferable]);

  return maxAmountExceeded;
};
