import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract, useAccount, useProvider } from 'wagmi';
import * as Sentry from '@sentry/react';

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
const TOKEN_ABI = ['function balanceOf(address) pure returns (uint256)'];

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { address: account } = useAccount();
  const provider = useProvider();
  const token = useContract({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, signerOrProvider: provider });
  const [balance, setBalance] = useState(ethers.constants.Zero);

  const updateBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    if (account && token) {
      try {
        balance = await token.balanceOf(account);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenBalanceContext.updateBalance' } });
      }
    }
    setBalance(balance);
  }, [token, account]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <TokenBalanceContext.Provider value={{ balance, updateBalance }}>
      {children}
    </TokenBalanceContext.Provider>
  );
};
