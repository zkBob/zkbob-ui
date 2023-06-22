import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';
import { useContract, useProvider } from 'wagmi';

import config from 'config';

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
  'BOB-optimism': 'ETH',
  'BOB-goerli': 'ETH',
  'BOB-polygon': 'MATIC',
};

const POOL_CONTRACT_ABI = ['function tokenSeller() pure returns (address)'];
const SWAP_CONTRACT_ABI = ['function quoteSellForETH(uint256) pure returns (uint256)'];

export const useConvertion = (currentPool) => {
  const provider = useProvider({ chainId: config.pools[currentPool].chainId });
  const poolContract = useContract({
    address: config.pools[currentPool].poolAddress,
    abi: POOL_CONTRACT_ABI,
    signerOrProvider: provider
  });
  const [price, setPrice] = useState(ethers.constants.Zero);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    async function getPrice() {
      try {
        const swapContractAddress = await poolContract.tokenSeller();
        const exist = swapContractAddress !== ethers.constants.AddressZero;
        setExist(exist);
        if (!exist) return;
        const swapContract = new ethers.Contract(swapContractAddress, SWAP_CONTRACT_ABI, provider);
        const price = await swapContract.quoteSellForETH(ethers.constants.WeiPerEther);
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
  }, [poolContract, provider]);

  return { exist, price, decimals: 18, toTokenSymbol: NATIVE_TOKENS[currentPool] };
};
