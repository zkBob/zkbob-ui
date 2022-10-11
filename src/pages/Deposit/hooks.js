import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import { ZkAccountContext } from 'contexts';

import { minBigNumber } from 'utils';

export const useDepositLimit = () => {
  const { limits } = useContext(ZkAccountContext);
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    const minLimit = minBigNumber(
      limits.dailyDepositLimitPerAddress.available,
      limits.dailyDepositLimit.available,
      limits.poolSizeLimit.available,
    );
    setDepositLimit(minLimit);
  }, [limits]);

  return depositLimit;
};

export const useMaxAmountExceeded = (amount, balance, fee, limit) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    const exceeded = !balance.isZero() && (amount.gt(balance.sub(fee)) || amount.gt(limit));
    setMaxAmountExceeded(exceeded);
  }, [amount, balance, fee, limit]);

  return maxAmountExceeded;
};
