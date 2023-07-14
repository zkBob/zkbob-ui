import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';
import { useContract, useProvider } from 'wagmi';

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
  'BOB2USDC-goerli': 'ETH',
  'BOB-polygon': 'MATIC',
};

const POOL_CONTRACT_ABI = ['function tokenSeller() pure returns (address)'];
const SWAP_CONTRACT_ABI = ['function quoteSellForETH(uint256) pure returns (uint256)'];

export const useConvertion = (currentPool) => {
  const provider = useProvider({ chainId: currentPool.chainId });
  const poolContract = useContract({
    address: currentPool.poolAddress,
    abi: POOL_CONTRACT_ABI,
    signerOrProvider: provider
  });
  const [price, setPrice] = useState(ethers.constants.Zero);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    async function getPrice() {
      try {
        let swapContractAddress = ethers.constants.AddressZero;
        try {
          swapContractAddress = await poolContract.tokenSeller();
        } catch (error) {}
        const exist = swapContractAddress !== ethers.constants.AddressZero;
        setExist(exist);
        if (!exist) return;
        const swapContract = new ethers.Contract(swapContractAddress, SWAP_CONTRACT_ABI, provider);
        const price = await swapContract.quoteSellForETH(ethers.utils.parseUnits('1', currentPool.tokenDecimals));
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
  }, [poolContract, provider, currentPool]);

  return { exist, price, decimals: 18, toTokenSymbol: NATIVE_TOKENS[currentPool.alias] };
};
