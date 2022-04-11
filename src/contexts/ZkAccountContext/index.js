import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

import { TransactionModalContext } from 'contexts';

import { TX_STATUSES } from 'constants';

import zp from './zp.js';

const { formatUnits } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library } = useWeb3React();
  const { openTxModal, setTxStatus } = useContext(TransactionModalContext);
  const [zkAccount, setZkAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState(null);
  const [isLoadingZkAccount, setIsLoadingZkAccount] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadZkAccount = useCallback(async () => {
    const privateKey = window.localStorage.getItem('zkAccountKey');
    let zkAccount = null;
    if (privateKey) {
      setIsLoadingZkAccount(true);
      const wallet = new ethers.Wallet(privateKey);
      zkAccount = await zp.createAccount(privateKey);
      zkAccount.address = wallet.address;
    }
    setZkAccount(zkAccount);
    setIsLoadingZkAccount(false);
  }, []);

  const updateBalance = useCallback(async () => {
    let balance = 0;
    if (zkAccount) {
      setIsLoadingState(true);
      balance = await zkAccount.getTotalBalance(TOKEN_ADDRESS);
      balance = Number(formatUnits(BigNumber.from(balance), 18));
      console.log('Pool balance:', balance);
    }
    setBalance(balance);
    setIsLoadingState(false);
  }, [zkAccount]);

  const updateHistory = useCallback(async () => {
    let history = [];
    if (zkAccount) {
      setIsLoadingHistory(true);
      history = await zkAccount.getAllHistory(TOKEN_ADDRESS);
      history = history.reverse();
      console.log('History:', history);
    }
    setHistory(history);
    setIsLoadingHistory(false);
  }, [zkAccount]);

  const deposit = useCallback(async (amount) => {
    openTxModal();
    try {
      await zp.deposit(library.getSigner(0), zkAccount, amount, setTxStatus);
      toast.success(`Deposited ${amount} DAI.`);
      updateBalance();
    } catch (error) {
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [zkAccount, updateBalance, library, openTxModal, setTxStatus]);

  const transfer = useCallback(async (to, amount) => {
    openTxModal();
    try {
      await zp.transfer(zkAccount, to, amount, setTxStatus);
      toast.success(`Transferred ${amount} shDAI.`);
      updateBalance();
    } catch (error) {
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [zkAccount, updateBalance, openTxModal, setTxStatus]);

  const withdraw = useCallback(async (to, amount) => {
    openTxModal();
    try {
      await zp.withdraw(zkAccount, to, amount, setTxStatus);
      toast.success(`Withdrawn ${amount} DAI.`);
      updateBalance();
    } catch (error) {
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [zkAccount, updateBalance, openTxModal, setTxStatus]);

  const generateAddress = useCallback(() => {
    if (!zkAccount) return;
    return zkAccount.generateAddress(TOKEN_ADDRESS);
  }, [zkAccount]);

  useEffect(() => {
    updateBalance();
    updateHistory();
  }, [zkAccount]);

  useEffect(() => {
    loadZkAccount();
  }, [loadZkAccount]);

  const saveZkAccountKey = useCallback(privateKey => {
    window.localStorage.setItem('zkAccountKey', privateKey);
    loadZkAccount();
  }, [loadZkAccount]);

  return (
    <ZkAccountContext.Provider
      value={{
        zkAccount, balance, saveZkAccountKey, deposit,
        withdraw, transfer, generateAddress, history,
        isLoadingZkAccount, isLoadingState, isLoadingHistory,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};
