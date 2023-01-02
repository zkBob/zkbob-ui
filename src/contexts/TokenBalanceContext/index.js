import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers, Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import * as Sentry from '@sentry/react';

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { library, account } = useWeb3React();
  const [balance, setBalance] = useState(ethers.constants.Zero);

  const updateBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    if (account) {
      try {
        const tokenABI = ['function balanceOf(address) pure returns (uint256)'];
        const token = new Contract(TOKEN_ADDRESS, tokenABI, library);
        balance = await token.balanceOf(account);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenBalanceContext.updateBalance' } });
      }
    }
    setBalance(balance);
  }, [library, account]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <TokenBalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </TokenBalanceContext.Provider>
  );
};
