import { useState, useEffect } from 'react';

export const useMaxAmountExceeded = (amount, maxTransferable, limit) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    setMaxAmountExceeded(amount.gt(maxTransferable) || amount.gt(limit));
  }, [amount, maxTransferable, limit]);

  return maxAmountExceeded;
};
