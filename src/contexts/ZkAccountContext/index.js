import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as Sentry from "@sentry/react";

import { TransactionModalContext, ModalContext, TokenBalanceContext } from 'contexts';

import { TX_STATUSES } from 'constants';

import zp from './zp.js';
import { TxType, TxDepositDeadlineExpiredError, InitState } from 'zkbob-client-js';
import { HistoryRecordState } from 'zkbob-client-js/lib/history';

const { parseEther } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

const defaultLimits = {
  singleDepositLimit: parseEther('0'),
  dailyDepositLimitPerAddress: { total: parseEther('10000'), available: parseEther('0') },
  dailyDepositLimit: { total: parseEther('100000'), available: parseEther('0') },
  dailyWithdrawalLimit: { total: parseEther('100000'), available: parseEther('0') },
  poolSizeLimit: { total: parseEther('1000000'), available: parseEther('0') },
};

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library, account } = useWeb3React();
  const { openTxModal, setTxStatus, setTxAmount, setTxError } = useContext(TransactionModalContext);
  const { openPasswordModal, closePasswordModal } = useContext(ModalContext);
  const { updateBalance: updateTokenBalance } = useContext(TokenBalanceContext);
  const [zkAccount, setZkAccount] = useState(null);
  const [zkAccountId, setZkAccountId] = useState(null);
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [history, setHistory] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [isLoadingZkAccount, setIsLoadingZkAccount] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [limits, setLimits] = useState(defaultLimits);
  const [minTxAmount, setMinTxAmount] = useState(ethers.constants.Zero);
  const [maxTransferable, setMaxTransferable] = useState(ethers.constants.Zero);
  const [loadingPercentage, setLoadingPercentage] = useState(null);

  const updateLoadingStatus = status => {
    let loadingPercentage = null;
    if (status.state === InitState.DownloadingParams) {
      const { loaded, total } = status.download;
      loadingPercentage = Math.round(loaded / total * 100);
    }
    setLoadingPercentage(loadingPercentage);
  };

  const loadZkAccount = useCallback(async (mnemonic, isNewAccount = false) => {
    let zkAccount = null;
    let zkAccountId = null;
    if (mnemonic) {
      setBalance(ethers.constants.Zero);
      setHistory(null);
      setIsLoadingZkAccount(true);
      try {
        zkAccount = await zp.createAccount(mnemonic, updateLoadingStatus, isNewAccount);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.loadZkAccount' } });
      }
      zkAccountId = ethers.utils.id(mnemonic);
    }
    setZkAccount(zkAccount);
    setZkAccountId(zkAccountId);
    setIsLoadingZkAccount(false);
    setLoadingPercentage(0);
  }, []);

  const fromShieldedAmount = useCallback(shieldedAmount => {
    const wei = zkAccount.shieldedAmountToWei(TOKEN_ADDRESS, shieldedAmount);
    return BigNumber.from(wei);
  }, [zkAccount]);

  const toShieldedAmount = useCallback(wei => {
    return zkAccount.weiToShieldedAmount(TOKEN_ADDRESS, wei.toBigInt());
  }, [zkAccount]);

  const updateBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    if (zkAccount) {
      setIsLoadingState(true);
      try {
        balance = await zkAccount.getTotalBalance(TOKEN_ADDRESS);
        balance = fromShieldedAmount(balance);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateBalance' } });
      }
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
      try {
        history = await zkAccount.getAllHistory(TOKEN_ADDRESS);
        history = history.reverse().map(item => ({
          ...item,
          failed: [HistoryRecordState.RejectedByRelayer, HistoryRecordState.RejectedByPool].includes(item.state),
          actions: item.actions.map(action => ({ ...action, amount: fromShieldedAmount(action.amount) })),
        }));
        pendingActions = history.filter(item => item.state === HistoryRecordState.Pending && item.type !== 2);
        isPending = pendingActions.length > 0;
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateHistory' } });
      }
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
      try {
        const data = await zkAccount.getLimits(TOKEN_ADDRESS, account);
        limits = {
          singleDepositLimit: fromShieldedAmount(BigInt(data.deposit.components.singleOperation)),
          dailyDepositLimitPerAddress: {
            total: fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.total)),
            available: fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.available))
          },
          dailyDepositLimit: {
            total: fromShieldedAmount(BigInt(data.deposit.components.dailyForAll.total)),
            available: fromShieldedAmount(BigInt(data.deposit.components.dailyForAll.available))
          },
          dailyWithdrawalLimit: {
            total: fromShieldedAmount(BigInt(data.withdraw.components.dailyForAll.total)),
            available: fromShieldedAmount(BigInt(data.withdraw.components.dailyForAll.available))
          },
          poolSizeLimit: {
            total: fromShieldedAmount(BigInt(data.deposit.components.poolLimit.total)),
            available: fromShieldedAmount(BigInt(data.deposit.components.poolLimit.available))
          },
        };
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateLimits' } });
      }
    }
    setLimits(limits);
    setIsLoadingLimits(false);
  }, [zkAccount, account, fromShieldedAmount]);

  const updateMaxTransferable = useCallback(async () => {
    let maxTransferable = ethers.constants.Zero;
    if (zkAccount) {
      try {
        const max = await zkAccount.calcMaxAvailableTransfer(TOKEN_ADDRESS, false);
        maxTransferable = fromShieldedAmount(max);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateMaxTransferable' } });
      }
    }
    setMaxTransferable(maxTransferable);
  }, [zkAccount, fromShieldedAmount]);

  const loadMinTxAmount = useCallback(async () => {
    let minTxAmount = ethers.constants.Zero;
    if (zkAccount) {
      try {
        minTxAmount = await zkAccount.minTxAmount(TOKEN_ADDRESS);
        minTxAmount = fromShieldedAmount(minTxAmount);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.loadMinTxAmount' } });
      }
    }
    setMinTxAmount(minTxAmount);
  }, [zkAccount, fromShieldedAmount]);

  const updatePoolData = useCallback(() => Promise.all([
    updateBalance(),
    updateHistory(),
    updateLimits(),
  ]), [updateBalance, updateHistory, updateLimits]);

  const deposit = useCallback(async (amount) => {
    openTxModal();
    setTxAmount(amount);
    try {
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, [shieldedAmount], TxType.Deposit, false);
      await zp.deposit(library.getSigner(0), zkAccount, shieldedAmount, fee, setTxStatus);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit' } });
      if (error instanceof TxDepositDeadlineExpiredError) {
        setTxStatus(TX_STATUSES.SIGNATURE_EXPIRED);
      } else {
        setTxError(error.message);
        setTxStatus(TX_STATUSES.REJECTED);
      }
    }
  }, [
    zkAccount, updatePoolData, library, openTxModal, setTxAmount,
    setTxStatus, updateTokenBalance, toShieldedAmount, setTxError,
  ]);

  const transfer = useCallback(async (to, amount) => {
    openTxModal();
    try {
      setTxAmount(amount);
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, [shieldedAmount], TxType.Transfer, false);
      await zp.transfer(zkAccount, [{ destination: to, amountGwei: shieldedAmount }], fee, setTxStatus);
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.transfer' } });
      setTxError(error.message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, openTxModal, setTxError,
    setTxStatus, toShieldedAmount, setTxAmount,
  ]);

  const transferMulti = useCallback(async data => {
    openTxModal();
    try {
      setTxAmount(data.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero));
      const transfers = data.map(({ address, amount }) => ({
        destination: address,
        amountGwei: toShieldedAmount(amount)
      }));
      const shieldedAmounts = transfers.map(tr => tr.amountGwei);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, shieldedAmounts, TxType.Transfer, false);
      await zp.transfer(zkAccount, transfers, fee, setTxStatus, true);
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.transferMulti' } });
      setTxError(error.message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, openTxModal, setTxError,
    setTxStatus, toShieldedAmount, setTxAmount,
  ]);

  const withdraw = useCallback(async (to, amount) => {
    openTxModal();
    setTxAmount(amount);
    try {
      const shieldedAmount = toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkAccount.feeEstimate(TOKEN_ADDRESS, [shieldedAmount], TxType.Withdraw, false);
      await zp.withdraw(zkAccount, to, shieldedAmount, fee, setTxStatus);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.withdraw' } });
      setTxError(error.message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkAccount, updatePoolData, openTxModal, setTxAmount, setTxError,
    setTxStatus, updateTokenBalance, toShieldedAmount,
  ]);

  const generateAddress = useCallback(() => {
    if (!zkAccount) return;
    return zkAccount.generateAddress(TOKEN_ADDRESS);
  }, [zkAccount]);

  const verifyShieldedAddress = useCallback(address => {
    if (!zkAccount) return false;
    return zkAccount.verifyShieldedAddress(address);
  }, [zkAccount]);

  const estimateFee = useCallback(async (amounts, txType) => {
    if (!zkAccount) return null;
    try {
      const shieldedAmounts = amounts.map(amount => toShieldedAmount(amount));
      const { total, txCnt, insufficientFunds } = await zkAccount.feeEstimate(TOKEN_ADDRESS, shieldedAmounts, txType, false);
      return { fee: fromShieldedAmount(total), numberOfTxs: txCnt, insufficientFunds };
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.estimateFee' } });
      return null;
    }
  }, [zkAccount, toShieldedAmount, fromShieldedAmount]);

  const decryptMnemonic = password => {
    const cipherText = window.localStorage.getItem('seed');
    const mnemonic = AES.decrypt(cipherText, password).toString(Utf8);
    if (!ethers.utils.isValidMnemonic(mnemonic)) throw new Error('invalid mnemonic');
    return mnemonic;
  }

  const unlockAccount = useCallback(password => {
    try {
        const mnemonic = decryptMnemonic(password);
        closePasswordModal();
        loadZkAccount(mnemonic);
    } catch (error) {
        throw new Error('Incorrect password');
    }
  }, [loadZkAccount, closePasswordModal]);

  const verifyPassword = useCallback(password => {
    try {
      decryptMnemonic(password);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    const mnemonic = decryptMnemonic(oldPassword);
    const cipherText = await AES.encrypt(mnemonic, newPassword).toString();
    window.localStorage.setItem('seed', cipherText);
  }, []);

  const saveZkAccountMnemonic = useCallback(async (mnemonic, password, isNewAccount) => {
    const cipherText = await AES.encrypt(mnemonic, password).toString()
    window.localStorage.setItem('seed', cipherText);
    loadZkAccount(mnemonic, isNewAccount);
  }, [loadZkAccount]);

  const removeZkAccountMnemonic = useCallback(async () => {
    if (zkAccount) {
      await zkAccount.cleanState(TOKEN_ADDRESS);
    }
    window.localStorage.removeItem('seed');
    setZkAccount(null);
    setZkAccountId(null);
    setBalance(ethers.constants.Zero);
    setHistory([]);
  }, [zkAccount]);

  useEffect(() => {
    updatePoolData();
  }, [updatePoolData]);

  useEffect(() => {
    loadMinTxAmount();
  }, [loadMinTxAmount]);

  useEffect(() => {
    updateMaxTransferable();
  }, [updateMaxTransferable, balance]);

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
        withdraw, transfer, generateAddress, history, unlockAccount, transferMulti,
        isLoadingZkAccount, isLoadingState, isLoadingHistory, isPending, pendingActions,
        removeZkAccountMnemonic, updatePoolData, minTxAmount, loadingPercentage,
        estimateFee, maxTransferable, isLoadingLimits, limits, changePassword, verifyPassword,
        verifyShieldedAddress,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};
