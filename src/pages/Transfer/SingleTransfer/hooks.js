import { useState, useEffect } from 'react';

export const useMaxAmountExceeded = (amount, maxTransferable) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      setMaxAmountExceeded(amount.gt(maxTransferable));
    } catch (error) {
      console.error(`SingleTransfer.useMaxAmountExceeded():\n`, error);
    }
  }, [amount, maxTransferable]);

  return maxAmountExceeded;
};
