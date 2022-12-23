import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';

export const useMaxAmountExceeded = (amount, maxTransferable) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      setMaxAmountExceeded(amount.gt(maxTransferable));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'SingleTransfer.useMaxAmountExceeded' } });
    }
  }, [amount, maxTransferable]);

  return maxAmountExceeded;
};
