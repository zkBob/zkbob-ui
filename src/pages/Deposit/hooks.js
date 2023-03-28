import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { ZkAccountContext } from 'contexts';

import { minBigNumber } from 'utils';

export const useDepositLimit = () => {
  const { limits } = useContext(ZkAccountContext);
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    let minLimit = ethers.constants.Zero;
    try {
      minLimit = minBigNumber(
        limits.singleDepositLimit,
        limits.dailyDepositLimitPerAddress?.available,
        limits.dailyDepositLimit?.available,
        limits.poolSizeLimit?.available,
      );
    } catch (error) {}
    setDepositLimit(minLimit);
  }, [limits]);

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
