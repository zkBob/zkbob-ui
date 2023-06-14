import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import { useContract, useAccount, useProvider } from 'wagmi';
import * as Sentry from '@sentry/react';

import { PoolContext } from 'contexts';

import { showLoadingError } from 'utils';

const TOKEN_ABI = ['function balanceOf(address) pure returns (uint256)'];

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { address: account } = useAccount();
  const { currentPool } = useContext(PoolContext);
  const provider = useProvider({ chainId: currentPool.chainId });
  const token = useContract({
    address: currentPool.tokenAddress,
    abi: TOKEN_ABI,
    signerOrProvider: provider
  });
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const updateBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    let balance = ethers.constants.Zero;
    if (account && token) {
      try {
        balance = await token.balanceOf(account);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenBalanceContext.updateBalance' } });
        showLoadingError('wallet balance');
      }
    }
    setBalance(balance);
    setIsLoadingBalance(false);
  }, [token, account]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <TokenBalanceContext.Provider value={{ balance, updateBalance, isLoadingBalance }}>
      {children}
    </TokenBalanceContext.Provider>
  );
};
