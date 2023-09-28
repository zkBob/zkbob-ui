import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { PoolContext, WalletContext } from 'contexts';

import { showLoadingError } from 'utils';

const TOKEN_ABI = ['function balanceOf(address) pure returns (uint256)'];

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { address: account, provider, getBalance } = useContext(WalletContext);
  const { currentPool } = useContext(PoolContext);
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [nativeBalance, setNativeBalance] = useState(ethers.constants.Zero);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const updateBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    let balance = ethers.constants.Zero;
    let nativeBalance = ethers.constants.Zero;
    if (account) {
      try {
        const token = new ethers.Contract(currentPool.tokenAddress, TOKEN_ABI, provider);
        [balance, nativeBalance] = await Promise.all([
          token.balanceOf(account),
          getBalance().then(({ data: { value } }) => value),
        ]);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenBalanceContext.updateBalance' } });
        showLoadingError('walletBalance');
      }
    }
    setBalance(balance);
    setNativeBalance(nativeBalance);
    setIsLoadingBalance(false);
  }, [account, getBalance, provider, currentPool.tokenAddress]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <TokenBalanceContext.Provider
      value={{
        balance,
        nativeBalance,
        updateBalance,
        isLoadingBalance: isLoadingBalance,
      }}>
      {children}
    </TokenBalanceContext.Provider>
  );
};
