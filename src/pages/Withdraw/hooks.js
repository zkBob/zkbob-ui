import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';

const { BigNumber } = ethers;

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

const CONVERTION_PAIRS = {
  'BOB-optimism': {
    chainId: 10,
    toTokenSymbol: 'ETH',
    fromTokenAddress: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
    toTokenAddress: '0x4200000000000000000000000000000000000006',
  },
  'BOB-polygon': {
    chainId: 137,
    toTokenSymbol: 'MATIC',
    fromTokenAddress: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
    toTokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
};

CONVERTION_PAIRS['BOB-goerli'] = CONVERTION_PAIRS['BOB-optimism'];

async function getTokenPriceWithPairToBobFrom1inch(pair, amount) {
  const response = await fetch(`https://api.1inch.exchange/v3.0/${pair.chainId}/quote?fromTokenAddress=${pair.fromTokenAddress}&toTokenAddress=${pair.toTokenAddress}&amount=${amount.toString()}`);
  const json = await response.json();
  return {
    price: BigNumber.from(json.toTokenAmount),
    decimals: json.toToken.decimals,
  };
}

export const useConvertion = (currentPool) => {
  const [price, setPrice] = useState(ethers.constants.Zero);
  const [decimals, setDecimals] = useState(18);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    async function getPrice() {
      try {
        const { price, decimals } = await getTokenPriceWithPairToBobFrom1inch(
          CONVERTION_PAIRS[currentPool],
          ethers.utils.parseEther('1'),
        );
        setPrice(price);
        setDecimals(decimals);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Withdraw.useConvertion' } });
      }
    }
    setPrice(ethers.constants.Zero);
    setDecimals(18);
    setExist(!!CONVERTION_PAIRS[currentPool]);
    if (!CONVERTION_PAIRS[currentPool]) return;
    getPrice();
    const interval = setInterval(getPrice, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [currentPool]);

  return { exist, price, decimals, ...CONVERTION_PAIRS[currentPool] };
};
