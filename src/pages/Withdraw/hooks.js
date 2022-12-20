import { useState, useEffect } from 'react';

export const useMaxAmountExceeded = (amount, maxTransferable, limit) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      setMaxAmountExceeded(amount.gt(maxTransferable) || amount.gt(limit));
    } catch (error) {
      console.error(`Withdraw.useMaxAmountExceeded():\n`, error);
    }
  }, [amount, maxTransferable, limit]);

  return maxAmountExceeded;
};
