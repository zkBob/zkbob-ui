import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

import { TransactionModalContext, ModalContext, TokenBalanceContext } from 'contexts';

import { TX_STATUSES } from 'constants';

import zp from './zp.js';
import { TxType } from 'zkbob-client-js';

import { tokenSymbol } from 'utils/token';

const { formatEther, parseEther } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

const defaultLimits = {
  dailyDepositLimitPerAddress: { total: 10000, available: 10000 },
  dailyDepositLimit: { total: 100000, available: 100000 },
  dailyWithdrawalLimit: { total: 100000, available: 100000 },
  poolSizeLimit: { total: 1000000, available: 1000000 },
};

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library } = useWeb3React();
  const { openTxModal, setTxStatus } = useContext(TransactionModalContext);
  const { openPasswordModal, closePasswordModal } = useContext(ModalContext);
  const { updateBalance: updateTokenBalance } = useContext(TokenBalanceContext);
  const [zkAccount, setZkAccount] = useState(null);
  const [zkAccountId, setZkAccountId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [isLoadingZkAccount, setIsLoadingZkAccount] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [limits, setLimits] = useState(defaultLimits);

  const loadZkAccount = useCallback(async mnemonic => {
    let zkAccount = null;
    let zkAccountId = null;
    if (mnemonic) {
      setBalance(0);
      setHistory(null);
      setIsLoadingZkAccount(true);
      zkAccount = await zp.createAccount(mnemonic);
      zkAccountId = ethers.utils.id(mnemonic);
    }
    setZkAccount(zkAccount);
    setZkAccountId(zkAccountId);
    setIsLoadingZkAccount(false);
  }, []);

  const unlockAccount = useCallback(password => {
    try {
        const cipherText = window.localStorage.getItem('seed');
        const mnemonic = AES.decrypt(cipherText, password).toString(Utf8);
        if (!ethers.utils.isValidMnemonic(mnemonic)) throw new Error('invalid mnemonic');
        closePasswordModal();
        loadZkAccount(mnemonic);
    } catch (error) {
        throw new Error('Incorrect password');
    }
  }, [loadZkAccount, closePasswordModal]);

  const fromShieldedAmount = useCallback(shieldedAmount => {
    const wei = zkAccount.shieldedAmountToWei(TOKEN_ADDRESS, shieldedAmount);
    return Number(formatEther(wei));
  }, [zkAccount]);

  const toShieldedAmount = useCallback(amount => {
    const wei = BigInt(parseEther(String(amount)));
    return zkAccount.weiToShieldedAmount(TOKEN_ADDRESS, wei);
  }, [zkAccount]);

  const updateBalance = useCallback(async () => {
    let balance = 0;
    if (zkAccount) {
      setIsLoadingState(true);
      balance = await zkAccount.getTotalBalance(TOKEN_ADDRESS);
      console.log('Raw Pool balance:', balance);
      balance = fromShieldedAmount(balance);
      console.log('Pool balance:', balance);
    }
    setBalance(balance);
    setIsLoadingState(false);
  }, [zkAccount, fromShieldedAmount]);

  const updateHistory = useCallback(async () => {
    let history = [];
    let isPending = false;
    let pendingActions = [];
    if (zkAccount) {
      setIsLoadingHistory(true);
      history = await zkAccount.getAllHistory(TOKEN_ADDRESS);
      history = history.reverse().map(item => ({ ...item, amount: fromShieldedAmount(item.amount) }));
      pendingActions = history.filter(item => item.pending && item.type !== 2);
      isPending = pendingActions.length > 0;
      console.log('Pending:', isPending);
      console.log('History:', history);
    }
    setHistory(history);
    setPendingActions(pendingActions);
    setIsPending(isPending);
    setIsLoadingHistory(false);
  }, [zkAccount, fromShieldedAmount]);

  const updateLimits = useCallback(async () => {
    let limits = defaultLimits;
    if (zkAccount) {
      setIsLoadingLimits(true);
    }
    setLimits(limits);
    setIsLoadingLimits(false);
  }, [zkAccount]);

  const updatePoolData = useCallback(() => {
    updateBalance();
    updateHistory();
    updateLimits();
  }, [updateBalance, updateHistory, updateLimits]);

  const deposit = useCallback(async (amount) => {
    openTxModal();
    try {
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, shieldedAmount, TxType.Deposit, false);
      await zp.deposit(library.getSigner(0), zkAccount, shieldedAmount, fee, setTxStatus);
      toast.success(`Deposited ${amount} ${tokenSymbol()}.`);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.log(error);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, library, openTxModal,
    setTxStatus, updateTokenBalance, toShieldedAmount,
  ]);

  const transfer = useCallback(async (to, amount) => {
    openTxModal();
    try {
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, shieldedAmount, TxType.Transfer, false);
      await zp.transfer(zkAccount, to, shieldedAmount, fee, setTxStatus);
      toast.success(`Transferred ${amount} ${tokenSymbol(true)}.`);
      updatePoolData();
    } catch (error) {
      console.log(error);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, openTxModal,
    setTxStatus, toShieldedAmount,
  ]);

  const withdraw = useCallback(async (to, amount) => {
    openTxModal();
    try {
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, shieldedAmount, TxType.Withdraw, false);
      await zp.withdraw(zkAccount, to, shieldedAmount, fee, setTxStatus);
      toast.success(`Withdrawn ${amount} ${tokenSymbol()}.`);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.log(error);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, openTxModal,
    setTxStatus, updateTokenBalance, toShieldedAmount,
  ]);

  const generateAddress = useCallback(() => {
    if (!zkAccount) return;
    return zkAccount.generateAddress(TOKEN_ADDRESS);
  }, [zkAccount]);

  const getMaxTransferable = useCallback(async () => {
    if (!zkAccount) return null;
    const max = await zkAccount.calcMaxAvailableTransfer(TOKEN_ADDRESS, false);
    return fromShieldedAmount(max);
  }, [zkAccount, fromShieldedAmount]);

  const estimateFee = useCallback(async (amount, txType) => {
    if (!zkAccount) return null;
    try {
      const max = await getMaxTransferable();
      if (txType !== TxType.Deposit && amount > max) {
        amount = max;
      }
      const { total, txCnt } = await zkAccount.feeEstimate(TOKEN_ADDRESS, toShieldedAmount(amount), txType, false);
      return { fee: fromShieldedAmount(total), numberOfTxs: txCnt };
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [zkAccount, toShieldedAmount, fromShieldedAmount, getMaxTransferable]);

  const saveZkAccountMnemonic = useCallback(async (mnemonic, password) => {
    const cipherText = await AES.encrypt(mnemonic, password).toString()
    window.localStorage.setItem('seed', cipherText);
    loadZkAccount(mnemonic);
  }, [loadZkAccount]);

  const removeZkAccountMnemonic = useCallback(async () => {
    window.localStorage.removeItem('seed');
    setZkAccount(null);
    setZkAccountId(null);
    setBalance(0);
    setHistory([]);
  }, []);

  useEffect(() => {
    updatePoolData();
  }, [updatePoolData]);

  useEffect(() => {
    if (isPending) {
      const interval = 5000; // 5 seconds
      const intervalId = setInterval(() => {
        updatePoolData();
        updateTokenBalance();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [isPending, updatePoolData, updateTokenBalance]);

  useEffect(() => {
    const seed = window.localStorage.getItem('seed');
    if (seed && !zkAccount) {
      openPasswordModal();
    }
  }, []);

  return (
    <ZkAccountContext.Provider
      value={{
        zkAccount, zkAccountId, balance, saveZkAccountMnemonic, deposit,
        withdraw, transfer, generateAddress, history, unlockAccount,
        isLoadingZkAccount, isLoadingState, isLoadingHistory, isPending, pendingActions,
        removeZkAccountMnemonic, updateBalance, updateHistory,
        estimateFee, getMaxTransferable, isLoadingLimits, limits,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};
