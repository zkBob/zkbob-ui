import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { minBigNumber } from 'utils';

export const useDepositLimit = (limits, isNative) => {
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    let minLimit = ethers.constants.Zero;
    try {
      minLimit = minBigNumber(
        limits[isNative ? 'singleDirectDepositLimit': 'singleDepositLimit'],
        limits[isNative ? 'dailyDirectDepositLimitPerAddress' : 'dailyDepositLimitPerAddress']?.available,
        limits.dailyDepositLimit?.available,
        limits.poolSizeLimit?.available,
      );
    } catch (error) {}
    setDepositLimit(minLimit);
  }, [limits, isNative]);

  return depositLimit;
};

export const useMaxAmountExceeded = (amount, balance, fee, limit) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      const exceeded = !balance.isZero() && (amount.gt(balance.sub(fee)) || amount.gt(limit));
      setMaxAmountExceeded(exceeded);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.useMaxAmountExceeded' } });
    }
  }, [amount, balance, fee, limit]);

  return maxAmountExceeded;
};
