import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAccount, useSigner, useNetwork, useSwitchNetwork } from 'wagmi';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import * as Sentry from "@sentry/react";
import {
  TxType, TxDepositDeadlineExpiredError,
  HistoryRecordState, HistoryTransactionType,
} from 'zkbob-client-js';
import { ProverMode } from 'zkbob-client-js/lib/config';

import {
  TransactionModalContext, ModalContext, PoolContext,
  TokenBalanceContext, SupportIdContext,
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
  dailyDepositLimitPerAddress: null,
  dailyDepositLimit: null,
  dailyWithdrawalLimit: null,
  poolSizeLimit: null,
};

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const { currentPool, setCurrentPool } = useContext(PoolContext);
  const previousPool = usePrevious(currentPool);
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const currentChainId = config.pools[currentPool].chainId;
  const { data: signer } = useSigner({ chainId: currentChainId });
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: currentChainId,
    throwForSwitchChainNotSupported: true,
  });
  const { openTxModal, setTxStatus, setTxAmount, setTxError } = useContext(TransactionModalContext);
  const { openPasswordModal, closePasswordModal, closeAllModals } = useContext(ModalContext);
  const { updateBalance: updateTokenBalance } = useContext(TokenBalanceContext);
  const { supportId, updateSupportId } = useContext(SupportIdContext);
  const [zkClient, setZkClient] = useState(null);
  const [zkAccount, setZkAccount] = useState(null);
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [history, setHistory] = useState(null);
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
  const [maxTransferable, setMaxTransferable] = useState(ethers.constants.Zero);
  const [loadingPercentage, setLoadingPercentage] = useState(null);
  const [relayerVersion, setRelayerVersion] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [giftCard, setGiftCard] = useState(null);

  useEffect(() => {
    if (zkClient || !supportId || !currentPool) return;
    async function create() {
      try {
        const zkClient = await zp.createClient(currentPool, supportId);
        setZkClient(zkClient);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.createZkClient' } });
        showLoadingError('zk-client');
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
      setHistory(null);
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
    setLoadingPercentage(0);
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
        showLoadingError('zkAccount balance');
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
    let atomicTxFee = ethers.constants.Zero;
    if (zkAccount) {
      if (currentPool !== previousPool) {
        setHistory([]);
        setIsPendingIncoming(false);
        setIsPending(false);
        setPendingActions([]);
      }
      setIsLoadingHistory(true);
      try {
        [history, atomicTxFee] = await Promise.all([
          zkClient.getAllHistory(),
          zkClient.atomicTxFee(),
        ]);
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
        history = await Promise.all(history.map(async item => ({
          ...item,
          highFee: item.fee.gt(await fromShieldedAmount(atomicTxFee)),
        })));
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
  }, [zkAccount, zkClient, fromShieldedAmount, currentPool, previousPool]);

  const updateLimits = useCallback(async () => {
    if (!zkClient) return;
    setIsLoadingLimits(true);
    let limits = defaultLimits;
    try {
      const data = await zkClient.getLimits(account);
      limits = {
        singleDepositLimit: await fromShieldedAmount(BigInt(data.deposit.components.singleOperation)),
        dailyDepositLimitPerAddress: {
          total: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.total)),
          available: await fromShieldedAmount(BigInt(data.deposit.components.dailyForAddress.available))
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

  const updateMaxTransferable = useCallback(async () => {
    let maxTransferable = ethers.constants.Zero;
    if (zkAccount) {
      try {
        const max = await zkClient.calcMaxAvailableTransfer(false);
        maxTransferable = await fromShieldedAmount(max);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'ZkAccountContext.updateMaxTransferable' } });
      }
    }
    setMaxTransferable(maxTransferable);
  }, [zkAccount, zkClient, fromShieldedAmount]);

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
  ]), [updateBalance, updateHistory, updateLimits]);

  const deposit = useCallback(async (amount) => {
    openTxModal();
    setTxAmount(amount);
    try {
      if (chain.id !== currentChainId) {
        setTxStatus(TX_STATUSES.SWITCH_NETWORK);
        try {
          await switchNetworkAsync();
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit.switchNetwork' } });
          setTxStatus(TX_STATUSES.WRONG_NETWORK);
          return;
        }
      }
      const shieldedAmount = await toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkClient.feeEstimate([shieldedAmount], TxType.Deposit, false);
      await zp.deposit(signer, zkClient, shieldedAmount, fee, setTxStatus);
      updatePoolData();
      setTimeout(updateTokenBalance, 5000);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit' } });
      if (error instanceof TxDepositDeadlineExpiredError) {
        setTxStatus(TX_STATUSES.SIGNATURE_EXPIRED);
      } if (error?.message?.includes('Internal account validation failed')) {
        setTxStatus(TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT);
      } else {
        setTxError(error.message);
        setTxStatus(TX_STATUSES.REJECTED);
      }
    }
  }, [
    zkClient, updatePoolData, signer, openTxModal, setTxAmount,
    setTxStatus, updateTokenBalance, toShieldedAmount, setTxError,
    chain, switchNetworkAsync, currentChainId,
  ]);

  const transfer = useCallback(async (to, amount) => {
    openTxModal();
    try {
      setTxAmount(amount);
      const shieldedAmount = await toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkClient.feeEstimate([shieldedAmount], TxType.Transfer, false);
      await zp.transfer(zkClient, [{ destination: to, amountGwei: shieldedAmount }], fee, setTxStatus);
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

  const transferMulti = useCallback(async data => {
    openTxModal();
    try {
      setTxAmount(data.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero));
      const transfers = await Promise.all(data.map(async ({ address, amount }) => ({
        destination: address,
        amountGwei: await toShieldedAmount(amount)
      })));
      const shieldedAmounts = transfers.map(tr => tr.amountGwei);
      const { totalPerTx: fee } = await zkClient.feeEstimate(shieldedAmounts, TxType.Transfer, false);
      await zp.transfer(zkClient, transfers, fee, setTxStatus, true);
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

  const withdraw = useCallback(async (to, amount) => {
    openTxModal();
    setTxAmount(amount);
    try {
      const shieldedAmount = await toShieldedAmount(amount);
      const { totalPerTx: fee } = await zkClient.feeEstimate([shieldedAmount], TxType.Withdraw, false);
      await zp.withdraw(zkClient, to, shieldedAmount, fee, setTxStatus);
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

  const estimateFee = useCallback(async (amounts, txType) => {
    if (!zkClient) return null;
    try {
      if (!zkAccount) {
        let atomicTxFee = await zkClient.atomicTxFee();
        atomicTxFee = await fromShieldedAmount(atomicTxFee);
        return { fee: atomicTxFee, numberOfTxs: 1, insufficientFunds: false };
      }
      const shieldedAmounts = await Promise.all(amounts.map(async amount => await toShieldedAmount(amount)));
      const { total, txCnt, insufficientFunds } = await zkClient.feeEstimate(shieldedAmounts, txType, false);
      return { fee: await fromShieldedAmount(total), numberOfTxs: txCnt, insufficientFunds };
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.estimateFee' } });
      return null;
    }
  }, [zkClient, toShieldedAmount, fromShieldedAmount, zkAccount]);

  const initializeGiftCard = useCallback(async code => {
    if (!zkClient) return false;
    const parsed = await zkClient.giftCardFromCode(code);
    parsed.balance = await fromShieldedAmount(parsed.balance);
    setGiftCard(parsed);
    return true;
  }, [zkClient, fromShieldedAmount]);

  const deleteGiftCard = () => setGiftCard(null);

  const redeemGiftCard = useCallback(async () => {
    try {
      const targetPool = giftCard.poolAlias;
      if (currentPool !== targetPool) {
        await switchToPool(targetPool);
      }
      const proverExists = config.pools[targetPool].delegatedProverUrls.length > 0;
      const jobId = await zkClient.redeemGiftCard({
        sk: giftCard.sk,
        pool: targetPool,
        birthindex: Number(giftCard.birthIndex),
        proverMode: proverExists ? ProverMode.DelegatedWithFallback : ProverMode.Local,
      });
      await zkClient.waitJobTxHash(jobId);
      deleteGiftCard();
      updatePoolData();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'ZkAccountContext.redeemGiftCard' } });
      throw error;
    }
  }, [zkClient, giftCard, switchToPool, currentPool, updatePoolData]);

  const decryptMnemonic = password => {
    const cipherText = window.localStorage.getItem('seed');
    const mnemonic = AES.decrypt(cipherText, password).toString(Utf8);
    if (!ethers.utils.isValidMnemonic(mnemonic)) throw new Error('invalid mnemonic');
    return mnemonic;
  }

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
  }, [zkClient, loadZkAccount, closePasswordModal]);

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
    clearState();
    closeAllModals();
    const seed = window.localStorage.getItem('seed');
    if (seed) openPasswordModal();
  }, [openPasswordModal, clearState, closeAllModals]);

  useEffect(() => {
    updatePoolData();
  }, [updatePoolData, currentPool]);

  useEffect(() => {
    loadMinTxAmount();
  }, [loadMinTxAmount, currentPool]);

  useEffect(() => {
    updateMaxTransferable();
  }, [updateMaxTransferable, balance, currentPool]);

  useEffect(() => {
    if (isPending || isPendingIncoming) {
      const interval = 5000; // 5 seconds
      const intervalId = setInterval(() => {
        updatePoolData();
        updateTokenBalance();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [isPending, isPendingIncoming, updatePoolData, updateTokenBalance]);

  useEffect(() => {
    loadRelayerVersion();
    const interval = 3600 * 1000; // 1 hour
    const intervalId = setInterval(loadRelayerVersion, interval);
    return () => clearInterval(intervalId);
  }, [loadRelayerVersion]);

  useEffect(() => {
    const seed = window.localStorage.getItem('seed');
    if (seed && !zkAccount) {
      openPasswordModal();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        zkAccount, balance, saveZkAccountMnemonic, deposit, isPoolSwitching,
        withdraw, transfer, generateAddress, history, unlockAccount, transferMulti,
        isLoadingZkAccount, isLoadingState, isLoadingHistory, isPending, pendingActions,
        removeZkAccountMnemonic, updatePoolData, minTxAmount, loadingPercentage,
        estimateFee, maxTransferable, isLoadingLimits, limits, changePassword, verifyPassword,
        verifyShieldedAddress, decryptMnemonic, relayerVersion, isDemo, updateLimits, lockAccount,
        switchToPool, giftCard, initializeGiftCard, deleteGiftCard, redeemGiftCard,
      }}
    >
      {children}
    </ZkAccountContext.Provider>
  );
};
