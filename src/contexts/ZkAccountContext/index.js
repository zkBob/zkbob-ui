import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { createAccount, withdrawFromPool, depositToPool } from './utils/account';

const { formatUnits } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library } = useWeb3React();
  const [zkAccount, setZkAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  const loadZkAccount = useCallback(async () => {
    const privateKey = window.localStorage.getItem('zkAccountKey');
    let zkAccount = null;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey);
      zkAccount = await createAccount(privateKey);
      zkAccount.address = wallet.address;
    }
    setZkAccount(zkAccount);
  }, [library]);

  const updateBalance = useCallback(async () => {
    let balance = 0;
    if (zkAccount) {
      balance = await zkAccount.getTotalBalance(TOKEN_ADDRESS);
      balance = Number(formatUnits(BigNumber.from(balance), 18));
      console.log('Pool balance:', balance);
    }
    setBalance(balance);
  }, [zkAccount]);

  const deposit = useCallback(async (amount) => {
    await depositToPool(library.getSigner(0), zkAccount, amount);
    updateBalance();
  }, [zkAccount, updateBalance, library]);

  const withdraw = useCallback(async (to, amount) => {
    await withdrawFromPool(zkAccount, to, amount);
    updateBalance();
  }, [zkAccount, updateBalance]);

  useEffect(() => {
    updateBalance();
  }, [zkAccount]);

  useEffect(() => {
    loadZkAccount();
  }, [loadZkAccount]);

  const saveZkAccountKey = useCallback(privateKey => {
    window.localStorage.setItem('zkAccountKey', privateKey);
    loadZkAccount();
  }, [loadZkAccount]);

  return (
    <ZkAccountContext.Provider value={{ zkAccount, balance, withdraw, saveZkAccountKey, deposit }}>
      {children}
    </ZkAccountContext.Provider>
  );
};
