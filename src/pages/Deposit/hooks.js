import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import { ZkAccountContext } from 'contexts';

import { minBigNumber } from 'utils';

export const useDepositLimit = () => {
  const { limits } = useContext(ZkAccountContext);
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    try {
      const minLimit = minBigNumber(
        limits.singleDepositLimit,
        limits.dailyDepositLimitPerAddress.available,
        limits.dailyDepositLimit.available,
        limits.poolSizeLimit.available,
      );
      setDepositLimit(minLimit);
    } catch (error) {
      console.error(`Deposit.useDepositLimit():\n`, error);
    }
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
      console.error(`Deposit.useMaxAmountExceeded():\n`, error);
    }
  }, [amount, balance, fee, limit]);

  return maxAmountExceeded;
};
