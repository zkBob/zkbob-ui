import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import useZeroPool from 'hooks/useZeroPool';

const { formatUnits } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library } = useWeb3React();
  const zp = useZeroPool();
  const [zkAccount, setZkAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  const loadZkAccount = useCallback(async () => {
    const privateKey = window.localStorage.getItem('zkAccountKey');
    let zkAccount = null;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey);
      zkAccount = await zp.createAccount(privateKey);
      zkAccount.address = wallet.address;
      console.log('Private address: ', zkAccount.generateAddress(TOKEN_ADDRESS));
    }
    setZkAccount(zkAccount);
  }, [zp.createAccount]);

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
    await zp.deposit(library.getSigner(0), zkAccount, amount);
    updateBalance();
  }, [zkAccount, updateBalance, library, zp.deposit]);

  const transfer = useCallback(async (to, amount) => {
    await zp.transfer(zkAccount, to, amount);
    updateBalance();
  }, [zkAccount, updateBalance, zp.transfer]);

  const withdraw = useCallback(async (to, amount) => {
    await zp.withdraw(zkAccount, to, amount);
    updateBalance();
  }, [zkAccount, updateBalance, zp.withdraw]);

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
    <ZkAccountContext.Provider value={{ zkAccount, balance, saveZkAccountKey, deposit, withdraw, transfer }}>
      {children}
    </ZkAccountContext.Provider>
  );
};
