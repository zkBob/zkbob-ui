import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import { useContract, useAccount, useProvider, useBalance } from 'wagmi';
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
  const { refetch: getNativeBalance } = useBalance({
    address: account,
    chainId: currentPool.chainId,
  });
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [nativeBalance, setNativeBalance] = useState(ethers.constants.Zero);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const updateBalance = useCallback(async () => {
    setIsLoadingBalance(true);
    let balance = ethers.constants.Zero;
    let nativeBalance = ethers.constants.Zero;
    if (account && token) {
      try {
        [balance, nativeBalance] = await Promise.all([
          token.balanceOf(account),
          getNativeBalance().then(({ data: { value } }) => value),
        ]);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenBalanceContext.updateBalance' } });
        showLoadingError('wallet balance');
      }
    }
    setBalance(balance);
    setNativeBalance(nativeBalance);
    setIsLoadingBalance(false);
  }, [token, account, getNativeBalance]);

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
