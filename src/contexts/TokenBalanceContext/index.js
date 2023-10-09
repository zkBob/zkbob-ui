import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { PoolContext, WalletContext } from 'contexts';

import { showLoadingError } from 'utils';
import tokenAbi from 'abis/token.json';

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { address: account, getBalance, callContract } = useContext(WalletContext);
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
        [balance, nativeBalance] = await Promise.all([
          callContract(currentPool.tokenAddress, tokenAbi, 'balanceOf', [account]),
          getBalance(),
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
  }, [account, getBalance, callContract, currentPool.tokenAddress]);

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
