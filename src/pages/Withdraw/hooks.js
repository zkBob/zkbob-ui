import { useState, useEffect, useContext } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';

import WalletContext from 'contexts/WalletContext';

import poolABI from 'abis/pool.json';
import swapABI from 'abis/swap.json';

export const useMaxAmountExceeded = (amount, maxWithdrawable, limit = ethers.constants.Zero) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      setMaxAmountExceeded(amount.gt(maxWithdrawable) || amount.gt(limit));
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Withdraw.useMaxAmountExceeded' } });
    }
  }, [amount, maxWithdrawable, limit]);

  return maxAmountExceeded;
};

const NATIVE_TOKENS = {
  'BOB2USDC-optimism': 'ETH',
  'BOB2USDC-goerli': 'ETH',
  'BOB2USDC-polygon': 'MATIC',
  'USDT-tron': 'TRX',
};

export const useConvertion = (currentPool) => {
  const { callContract, isTron } = useContext(WalletContext);
  const [price, setPrice] = useState(ethers.constants.Zero);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    async function getPrice() {
      try {
        let swapContractAddress = ethers.constants.AddressZero;
        try {
          swapContractAddress = await callContract(currentPool.poolAddress, poolABI, 'tokenSeller');
        } catch (error) {}
        const exist = swapContractAddress !== ethers.constants.AddressZero;
        setExist(exist);
        if (!exist) return;
        const price = await callContract(swapContractAddress, swapABI, 'quoteSellForETH', [
          ethers.utils.parseUnits('1', currentPool.tokenDecimals),
        ]);
        setPrice(price);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Withdraw.useConvertion' } });
      }
    }
    setPrice(ethers.constants.Zero);
    setExist(false);
    getPrice();
    const interval = setInterval(getPrice, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [callContract, currentPool, isTron]);

  return { exist, price, decimals: isTron ? 6 : 18, toTokenSymbol: NATIVE_TOKENS[currentPool.alias] };
};
