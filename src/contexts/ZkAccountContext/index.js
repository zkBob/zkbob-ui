import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as Sentry from "@sentry/react";
import {
  TxDepositDeadlineExpiredError, ClientState,
  HistoryRecordState, HistoryTransactionType,
} from 'zkbob-client-js';
import { ProverMode } from 'zkbob-client-js/lib/config';
import { toast } from 'react-toastify';
import { Trans } from 'react-i18next';

import {
  TransactionModalContext, ModalContext, PoolContext,
  TokenBalanceContext, SupportIdContext, WalletContext,
} from 'contexts';

import { TX_STATUSES } from 'constants';
import { showLoadingError } from 'utils';
import { usePrevious } from 'hooks';
import config from 'config';

import zp from './zp.js';
import { aggregateFees, splitDirectDeposits } from './utils.js';

const ZkAccountContext = createContext({ zkAccount: null });

const defaultLimits = {
  singleDepositLimit: null,
  singleDirectDepositLimit: null,
  dailyDepositLimitPerAddress: null,
  dailyDirectDepositLimitPerAddress: null,
  dailyDepositLimit: null,
  dailyWithdrawalLimit: null,
  poolSizeLimit: null,
};

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { currentPool, setCurrentPool } = useContext(PoolContext);
  const previousPoolAlias = usePrevious(currentPool.alias);
  const {
    address: account, chain, switchNetwork,
    sign, signTypedData, sendTransaction,
  } = useContext(WalletContext);
  const { openTxModal, setTxStatus, setTxAmount, setTxError } = useContext(TransactionModalContext);
  const { openPasswordModal, closePasswordModal, closeAllModals } = useContext(ModalContext);
  const { updateBalance: updateTokenBalance } = useContext(TokenBalanceContext);
  const { supportId, updateSupportId } = useContext(SupportIdContext);
  const [zkClient, setZkClient] = useState(null);
  const [zkAccount, setZkAccount] = useState(null);
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [history, setHistory] = useState([]);
  const [isPendingIncoming, setIsPendingIncoming] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [isPoolSwitching, setIsPoolSwitching] = useState(false);
  const [isLoadingZkAccount, setIsLoadingZkAccount] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingLimits, setIsLoadingLimits] = useState(false);
  const [limits, setLimits] = useState(defaultLimits);
  const [minTxAmount, setMinTxAmount] = useState(ethers.constants.Zero);
  const [loadingPercentage, setLoadingPercentage] = useState(null);
  const [relayerVersion, setRelayerVersion] = useState(null);
  const [isDemo] = useState(false);
  const [giftCard, setGiftCard] = useState(null);
  const [giftCardTxHash, setGiftCardTxHash] = useState(null);
  const [pendingDirectDeposits, setPendingDirectDeposits] = useState([]);

  function updateLoadingPercentage(state, progress) {
    if (state === ClientState.StateUpdatingContinuous) {
      setLoadingPercentage(progress);
    } else {
      setLoadingPercentage(null);
    }
  }

  useEffect(() => {
    if (zkClient || !supportId || !currentPool) return;
    async function create() {
      try {
        const zkClient = await zp.createClient(currentPool.alias, supportId, updateLoadingPercentage);
        setZkClient(zkClient);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.createZkClient' } });
        showLoadingError('zkClient');
      }
    }
    create();
  }, [zkClient, currentPool, supportId]);

  const switchToPool = useCallback(async poolId => {
    if (!zkClient) return;
    setIsPoolSwitching(true);
    await zkClient.switchToPool(poolId);
    setCurrentPool(poolId);
    setIsPoolSwitching(false);
  }, [zkClient, setCurrentPool]);

  const loadZkAccount = useCallback(async (secretKey, birthIndex, useDelegatedProver = false) => {
    setZkAccount(null);
    if (zkClient && secretKey) {
      setBalance(ethers.constants.Zero);
      setHistory([]);
      setIsLoadingZkAccount(true);
      try {
        await zp.createAccount(zkClient, secretKey, birthIndex, useDelegatedProver);
        const zkAccount = ethers.utils.id(secretKey);
        setZkAccount(zkAccount);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.loadZkAccount' } });
        showLoadingError('zkAccount');
      }
    }
    setIsLoadingZkAccount(false);
  }, [zkClient]);

  const fromShieldedAmount = useCallback(async shieldedAmount => {
    if (!zkClient) return BigNumber.from(0);
    const wei = await zkClient.shieldedAmountToWei(shieldedAmount);
    return BigNumber.from(wei);
  }, [zkClient]);

  const toShieldedAmount = useCallback(wei => {
    if (!zkClient) return BigInt(0);
    return zkClient.weiToShieldedAmount(wei.toBigInt());
  }, [zkClient]);

  const updateBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    if (zkAccount) {
      setIsLoadingState(true);
      try {
        balance = await zkClient.getTotalBalance();
        balance = await fromShieldedAmount(balance);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateBalance' } });
        showLoadingError('zkAccountBalance');
      }
    }
    setBalance(balance);
    setIsLoadingState(false);
  }, [zkAccount, zkClient, fromShieldedAmount]);

  const updateHistory = useCallback(async () => {
    let history = [];
    let isPendingIncoming = false;
    let isPending = false;
    let pendingActions = [];
    if (zkAccount) {
      if (currentPool.alias !== previousPoolAlias) {
        setHistory([]);
        setIsPendingIncoming(false);
        setIsPending(false);
        setPendingActions([]);
      }
      setIsLoadingHistory(true);
      try {
        history= await zkClient.getAllHistory();
        history = await Promise.all(history.map(async item => ({
          ...item,
          failed: [HistoryRecordState.RejectedByRelayer, HistoryRecordState.RejectedByPool].includes(item.state),
          actions: await Promise.all(item.actions.map(async action => ({
            ...action,
            amount: await fromShieldedAmount(action.amount)
          }))),
          fee: await fromShieldedAmount(item.fee),
        })));
        history = splitDirectDeposits(history);
        history = aggregateFees(history);
        history = history.reverse();
        isPendingIncoming = !!history.find(item =>
          item.state === HistoryRecordState.Pending && item.type === HistoryTransactionType.TransferIn
        );
        pendingActions = history.filter(item =>
          item.state === HistoryRecordState.Pending && item.type !== HistoryTransactionType.TransferIn
        );
        isPending = pendingActions.length > 0;
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateHistory' } });
        showLoadingError('history');
      }
    }
    setHistory(history);
    setPendingActions(pendingActions);
    setIsPending(isPending);
    setIsPendingIncoming(isPendingIncoming);
    setIsLoadingHistory(false);
  }, [zkAccount, zkClient, fromShieldedAmount, currentPool, previousPoolAlias]);

  const updatePendingDirectDeposits = useCallback(async () => {
    let pendingDirectDeposits = [];
    if (zkAccount) {
      try {
        pendingDirectDeposits = await zkClient.getPendingDDs();
        pendingDirectDeposits = await Promise.all(pendingDirectDeposits.map(async item => ({
          ...item,
          type: HistoryTransactionType.DirectDeposit,
          actions: [{
            to: item.destination,
            amount: await fromShieldedAmount(item.amount),
          }],
          fee: await fromShieldedAmount(item.fee),
        })));
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updatePendingDirectDeposits' } });
      }
    }
    setPendingDirectDeposits(pendingDirectDeposits);
  }, [zkAccount, zkClient, fromShieldedAmount]);


  const updateLimits = useCallback(async () => {
    if (!zkClient) return;
    setIsLoadingLimits(true);
    let limits = defaultLimits;
    try {
      const data = await zkClient.getLimits(account);
      limits = {
        singleDepositLimit: await fromShieldedAmount(BigInt(data.deposit.components.singleOperation)),
        singleDirectDepositLimit: await fromShieldedAmount(BigInt(data.dd.components.singleOperation)),
        dailyDepositLimitPerAddress: {
          total: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.total)),
          available: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.available))
        },
        dailyDirectDepositLimitPerAddress: {
          total: await fromShieldedAmount(BigInt(data.dd.components.dailyForAddress.total)),
          available: await fromShieldedAmount(BigInt(data.dd.components.dailyForAddress.available))
        },
        dailyDepositLimit: {
          total: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAll.total)),
          available: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAll.available))
        },
        dailyWithdrawalLimit: {
          total: await fromShieldedAmount(BigInt(data.withdraw.components.dailyForAll.total)),
          available: await fromShieldedAmount(BigInt(data.withdraw.components.dailyForAll.available))
        },
        poolSizeLimit: {
          total: await fromShieldedAmount(BigInt(data.deposit.components.poolLimit.total)),
          available: await fromShieldedAmount(BigInt(data.deposit.components.poolLimit.available))
        },
      };
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateLimits' } });
      showLoadingError('limits');
    }
    setLimits(limits);
    setIsLoadingLimits(false);
  }, [zkClient, account, fromShieldedAmount]);

  const calcMaxTransferable = useCallback(async (type, relayerFee, amountToConvert = ethers.constants.Zero) => {
    let max = ethers.constants.Zero;
    if (zkAccount) {
      try {
        const amountToConvertShielded = await toShieldedAmount(amountToConvert);
        max = await zkClient.calcMaxAvailableTransfer(type, relayerFee, amountToConvertShielded, false);
        max = await fromShieldedAmount(max);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.calcMaxTransferable' } });
      }
    }
    return max;
  }, [zkAccount, zkClient, fromShieldedAmount, toShieldedAmount]);

  const loadMinTxAmount = useCallback(async () => {
    let minTxAmount = ethers.constants.Zero;
    if (zkAccount) {
      try {
        minTxAmount = await zkClient.minTxAmount();
        minTxAmount = await fromShieldedAmount(minTxAmount);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.loadMinTxAmount' } });
      }
    }
    setMinTxAmount(minTxAmount);
  }, [zkAccount, zkClient, fromShieldedAmount]);

  const loadRelayerVersion = useCallback(async () => {
    if (!zkClient) return;
    let version = null;
    try {
      const data = await zkClient.getRelayerVersion();
      version = data.ref;
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.loadRelayerVersion' } });
    }
    setRelayerVersion(version);
  }, [zkClient]);

  const updatePoolData = useCallback(() => Promise.all([
    updateBalance(),
    updateHistory(),
    updateLimits(),
    updatePendingDirectDeposits(),
  ]), [updateBalance, updateHistory, updateLimits, updatePendingDirectDeposits]);

  const deposit = useCallback(async (amount, relayerFee, isNative) => {
    openTxModal();
    setTxAmount(amount);
    try {
      if (chain.id !== currentPool.chainId && !currentPool.isTron) {
        setTxStatus(TX_STATUSES.SWITCH_NETWORK);
        try {
          await switchNetwork();
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit.switchNetwork' } });
          setTxStatus(TX_STATUSES.WRONG_NETWORK);
          return;
        }
      }
      const shieldedAmount = await toShieldedAmount(amount);
      if (isNative) {
        await zp.directDeposit(account, sendTransaction, zkClient, shieldedAmount, setTxStatus);
      } else {
        await zp.deposit(account, sign, signTypedData, zkClient, shieldedAmount, relayerFee, setTxStatus);
      }
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit' } });
      let message = error?.message;
      if (error instanceof TxDepositDeadlineExpiredError) {
        setTxStatus(TX_STATUSES.SIGNATURE_EXPIRED);
      } else if (message?.includes('Internal account validation failed')) {
        setTxStatus(TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT);
      } else {
        if (message?.includes('user rejected transaction')) {
          message = 'User rejected transaction.';
        } else if (message?.includes('user rejected signing')) {
          message = 'User rejected message signing.';
        }
        setTxError(message);
        setTxStatus(TX_STATUSES.REJECTED);
      }
    }
  }, [
    zkClient, updatePoolData, signTypedData, openTxModal, setTxAmount,
    setTxStatus, updateTokenBalance, toShieldedAmount, setTxError,
    chain, switchNetwork, currentPool, sendTransaction, account, sign,
  ]);

  const transfer = useCallback(async (to, amount, relayerFee) => {
    openTxModal();
    try {
      setTxAmount(amount);
      const shieldedAmount = await toShieldedAmount(amount);
      await zp.transfer(zkClient, [{ destination: to, amountGwei: shieldedAmount }], relayerFee, setTxStatus);
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.transfer' } });
      setTxError(error.message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkClient, updatePoolData, openTxModal, setTxError,
    setTxStatus, toShieldedAmount, setTxAmount,
  ]);

  const transferMulti = useCallback(async (data, relayerFee) => {
    openTxModal();
    try {
      setTxAmount(data.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero));
      const transfers = await Promise.all(data.map(async ({ address, amount }) => ({
        destination: address,
        amountGwei: await toShieldedAmount(amount)
      })));
      await zp.transfer(zkClient, transfers, relayerFee, setTxStatus, true);
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.transferMulti' } });
      setTxError(error.message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    zkClient, updatePoolData, openTxModal, setTxError,
    setTxStatus, toShieldedAmount, setTxAmount,
  ]);

  const withdraw = useCallback(async (to, amount, amountToConvert, relayerFee) => {
    openTxModal();
    setTxAmount(amount);
    try {
      const shieldedAmount = await toShieldedAmount(amount);
      const shieldedAmountToConvert = await toShieldedAmount(amountToConvert);
      await zp.withdraw(zkClient, to, shieldedAmount, shieldedAmountToConvert, relayerFee, setTxStatus);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.withdraw' } });
      if (error?.message?.includes('Internal account validation failed')) {
        setTxStatus(TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL);
      } else {
        setTxError(error.message);
        setTxStatus(TX_STATUSES.REJECTED);
      }
    }
  }, [
    zkClient, updatePoolData, openTxModal, setTxAmount, setTxError,
    setTxStatus, updateTokenBalance, toShieldedAmount,
  ]);

  const generateAddress = useCallback(() => {
    if (!zkAccount) return;
    return zkClient.generateAddress();
  }, [zkAccount, zkClient]);

  const verifyShieldedAddress = useCallback(address => {
    if (!zkAccount) return false;
    return zkClient.verifyShieldedAddress(address);
  }, [zkClient, zkAccount]);

  const estimateFee = useCallback(async (amounts, txType, amountToConvert = ethers.constants.Zero) => {
    if (!zkClient) return null;
    try {
      let directDepositFee = ethers.constants.Zero;
      try {
        directDepositFee = await fromShieldedAmount(await zkClient.directDepositFee());
      } catch (error) {
        if (!error.message.includes('No direct deposit processer initialized')) throw error;
      }
      if (!zkAccount) {
        let atomicTxFee = await zkClient.atomicTxFee(txType);
        atomicTxFee = await fromShieldedAmount(atomicTxFee);
        return { fee: atomicTxFee, numberOfTxs: 1, insufficientFunds: false, directDepositFee };
      }
      const shieldedAmounts = await Promise.all(amounts.map(async amount => await toShieldedAmount(amount)));
      const shieldedAmountToConvert = await toShieldedAmount(amountToConvert);
      const {
        total,
        txCnt,
        insufficientFunds,
        relayerFee,
      } = await zkClient.feeEstimate(shieldedAmounts, txType, shieldedAmountToConvert, false);
      return {
        fee: await fromShieldedAmount(total),
        numberOfTxs: txCnt,
        insufficientFunds,
        relayerFee,
        directDepositFee,
      };
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.estimateFee' } });
      return null;
    }
  }, [zkClient, toShieldedAmount, fromShieldedAmount, zkAccount]);

  const initializeGiftCard = useCallback(async code => {
    if (!zkClient) return false;
    const parsed = await zkClient.giftCardFromCode(code);
    parsed.parsedBalance = await fromShieldedAmount(parsed.balance);
    setGiftCard(parsed);
    return true;
  }, [zkClient, fromShieldedAmount]);

  const deleteGiftCard = () => setGiftCard(null);

  const redeemGiftCard = useCallback(async () => {
    try {
      if (currentPool.alias !== giftCard.poolAlias) {
        await switchToPool(giftCard.poolAlias);
      }
      const proverExists = config.pools[giftCard.poolAlias].delegatedProverUrls.length > 0;
      const jobId = await zkClient.redeemGiftCard(
        giftCard,
        proverExists ? ProverMode.DelegatedWithFallback : ProverMode.Local,
      );
      const txHash = await zkClient.waitJobTxHash(jobId);
      setGiftCardTxHash(txHash);
      deleteGiftCard();
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.redeemGiftCard' } });
      throw error;
    }
  }, [zkClient, giftCard, switchToPool, currentPool, updatePoolData]);

  const getSeed = () => {
    const seed = window.localStorage.getItem('seed');
    const hasPassword = !ethers.utils.isValidMnemonic(seed);
    return { seed, hasPassword };
  };

  const decryptMnemonic = useCallback(password => {
    const { seed } = getSeed();
    const mnemonic = AES.decrypt(seed, password).toString(Utf8);
    if (!ethers.utils.isValidMnemonic(mnemonic)) throw new Error('invalid mnemonic');
    return mnemonic;
  }, []);

  const unlockAccount = useCallback(password => {
    if (!zkClient) return false;
    try {
        const mnemonic = decryptMnemonic(password);
        closePasswordModal();
        loadZkAccount(mnemonic);
        return true;
    } catch (error) {
        throw new Error('Incorrect password');
    }
  }, [zkClient, loadZkAccount, closePasswordModal, decryptMnemonic]);

  const verifyPassword = useCallback(password => {
    try {
      decryptMnemonic(password);
      return true;
    } catch (error) {
      return false;
    }
  }, [decryptMnemonic]);

  const setPassword = useCallback(password => {
    const { seed, hasPassword } = getSeed();
    if (hasPassword) {
      console.error('Password already set');
      return;
    }
    const cipherText = AES.encrypt(seed, password).toString();
    window.localStorage.setItem('seed', cipherText);
  }, []);

  const removePassword = useCallback(password => {
    const mnemonic = decryptMnemonic(password);
    window.localStorage.setItem('seed', mnemonic);
  }, [decryptMnemonic]);

  const saveZkAccountMnemonic = useCallback((mnemonic, password, isNewAccount) => {
    let seed = mnemonic;
    if (password) {
      seed = AES.encrypt(mnemonic, password).toString();
    }
    window.localStorage.setItem('seed', seed);
    loadZkAccount(mnemonic, isNewAccount ? -1 : undefined);
  }, [loadZkAccount]);

  const clearState = useCallback(() => {
    setZkAccount(null);
    setBalance(ethers.constants.Zero);
    setHistory([]);
    updateSupportId();
  }, [updateSupportId]);

  const removeZkAccountMnemonic = useCallback(async () => {
    if (zkAccount) {
      await zkClient.cleanState();
      await zkClient.logout();
    }
    window.localStorage.removeItem('seed');
    clearState();
  }, [zkAccount, zkClient, clearState]);

  const lockAccount = useCallback(() => {
    const { seed, hasPassword } = getSeed();
    if (seed) {
      closeAllModals();
      if (hasPassword) {
        clearState();
        openPasswordModal();
      } else {
        updateSupportId();
      }
    }
  }, [openPasswordModal, clearState, closeAllModals, updateSupportId]);

  useEffect(() => {
    updatePoolData();
  }, [updatePoolData, currentPool]);

  useEffect(() => {
    loadMinTxAmount();
  }, [loadMinTxAmount, currentPool]);

  useEffect(() => {
    if (isPending || isPendingIncoming || giftCardTxHash || pendingDirectDeposits.length > 0) {
      if (giftCardTxHash) {
        const tx = history.find(item => item.txHash === giftCardTxHash);
        if (tx && tx.state !== HistoryRecordState.Pending) {
          setGiftCardTxHash(null);
          toast.success(
            <span>
              <b><Trans i18nKey="successNotification.title" /></b><br />
              <Trans i18nKey="successNotification.description" />
            </span>
          );
        }
      }
      const interval = (isPending || isPendingIncoming || giftCardTxHash) ? 5000 : 30000; // 5 seconds or 30 seconds
      const intervalId = setInterval(() => {
        updatePoolData();
        updateTokenBalance();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [
    isPending, isPendingIncoming, updatePoolData, updateTokenBalance,
    giftCardTxHash, history, pendingDirectDeposits,
  ]);

  useEffect(() => {
    loadRelayerVersion();
    const interval = 3600 * 1000; // 1 hour
    const intervalId = setInterval(loadRelayerVersion, interval);
    return () => clearInterval(intervalId);
  }, [loadRelayerVersion]);

  useEffect(() => {
    const { seed, hasPassword } = getSeed();
    if (seed && hasPassword && !zkAccount) {
      openPasswordModal();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const { seed, hasPassword } = getSeed();
    if (seed && !hasPassword && !zkAccount) {
      if (zkClient) {
        loadZkAccount(seed);
      } else {
        setIsLoadingZkAccount(true);
      }
    }
  }, [loadZkAccount, zkClient, zkAccount]);

  useEffect(() => {
    if (isDemo) {
      const params = new URLSearchParams(window.location.search);
      const privateKey = params.get('code');
      const birthIndex = Number(params.get('index'));
      loadZkAccount(privateKey, birthIndex, true);
    }
  }, [isDemo, loadZkAccount]);

  return (
    <ZkAccountContext.Provider
      value={{
        zkAccount, balance, saveZkAccountMnemonic, deposit, isPoolSwitching, getSeed,
        withdraw, transfer, generateAddress, history, unlockAccount, transferMulti,
        isLoadingZkAccount, isLoadingState, isLoadingHistory, isPending, pendingActions,
        removeZkAccountMnemonic, updatePoolData, minTxAmount, loadingPercentage,
        estimateFee, isLoadingLimits, limits, calcMaxTransferable,
        setPassword, verifyPassword, removePassword, pendingDirectDeposits,
        verifyShieldedAddress, decryptMnemonic, relayerVersion, isDemo, updateLimits, lockAccount,
        switchToPool, giftCard, initializeGiftCard, deleteGiftCard, redeemGiftCard, isPendingIncoming,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};
