import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

import { TransactionModalContext, ModalContext, TokenBalanceContext } from 'contexts';

import { TX_STATUSES } from 'constants';

import zp from './zp.js';
import { TxType } from 'zkbob-client-js';

import { tokenSymbol } from 'utils/token';

const { parseEther, formatEther } = ethers.utils;

const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
const POOL_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const ZkAccountContext = createContext({ zkAccount: null });

const defaultLimits = {
  dailyDepositLimitPerAddress: { total: parseEther('10000'), available: parseEther('0') },
  dailyDepositLimit: { total: parseEther('100000'), available: parseEther('0') },
  dailyWithdrawalLimit: { total: parseEther('100000'), available: parseEther('0') },
  poolSizeLimit: { total: parseEther('1000000'), available: parseEther('0') },
};

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { library } = useWeb3React();
  const { openTxModal, setTxStatus } = useContext(TransactionModalContext);
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

  const loadZkAccount = useCallback(async mnemonic => {
    let zkAccount = null;
    let zkAccountId = null;
    if (mnemonic) {
      setBalance(ethers.constants.Zero);
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
    return BigNumber.from(wei);
  }, [zkAccount]);

  const toShieldedAmount = useCallback(wei => {
    return zkAccount.weiToShieldedAmount(TOKEN_ADDRESS, wei.toBigInt());
  }, [zkAccount]);

  const updateBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    if (zkAccount) {
      setIsLoadingState(true);
      balance = await zkAccount.getTotalBalance(TOKEN_ADDRESS);
      balance = fromShieldedAmount(balance);
      console.log('Pool balance:', formatEther(balance));
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
      const data = await zkAccount.getLimits(TOKEN_ADDRESS, POOL_ADDRESS);
      limits = {
        dailyDepositLimitPerAddress: {
          total: fromShieldedAmount(BigInt(data.deposit.components.daylyForAddress.total)),
          available: fromShieldedAmount(BigInt(data.deposit.components.daylyForAddress.available))
        },
        dailyDepositLimit: {
          total: fromShieldedAmount(BigInt(data.deposit.components.daylyForAll.total)),
          available: fromShieldedAmount(BigInt(data.deposit.components.daylyForAll.available))
        },
        dailyWithdrawalLimit: {
          total: fromShieldedAmount(BigInt(data.withdraw.components.daylyForAll.total)),
          available: fromShieldedAmount(BigInt(data.withdraw.components.daylyForAll.available))
        },
        poolSizeLimit: {
          total: fromShieldedAmount(BigInt(data.deposit.components.poolLimit.total)),
          available: fromShieldedAmount(BigInt(data.deposit.components.poolLimit.available))
        },
      };
    }
    setLimits(limits);
    setIsLoadingLimits(false);
  }, [zkAccount, fromShieldedAmount]);

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
      if (txType !== TxType.Deposit && amount.gt(max)) {
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
    setBalance(ethers.constants.Zero);
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
