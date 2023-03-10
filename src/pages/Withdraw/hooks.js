import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';

export const useMaxAmountExceeded = (amount, maxTransferable, limit = ethers.constants.Zero) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      setMaxAmountExceeded(amount.gt(maxTransferable) || amount.gt(limit));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Withdraw.useMaxAmountExceeded' } });
    }
  }, [amount, maxTransferable, limit]);

  return maxAmountExceeded;
};
