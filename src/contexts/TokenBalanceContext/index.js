import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers, BigNumber, Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';

const { formatUnits } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const TokenBalanceContext = createContext({ balance: null });

export default TokenBalanceContext;

export const TokenBalanceContextProvider = ({ children }) => {
  const { library, account } = useWeb3React();
  const [balance, setBalance] = useState(0);

  const updateBalance = useCallback(async () => {
    let balance = 0;
    if (account) {
      const tokenABI = ['function balanceOf(address) pure returns (uint256)'];
      const token = new Contract(TOKEN_ADDRESS, tokenABI, library);
      balance = await token.balanceOf(account);
      balance = Number(formatUnits(BigNumber.from(balance), 18));
      console.log('Balance:', balance);
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
