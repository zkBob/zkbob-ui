import { useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import { useAccount, useSigner, useNetwork, useSwitchNetwork, useProvider } from 'wagmi';

import { PoolContext, TransactionModalContext } from 'contexts';

import { minBigNumber } from 'utils';
import { TX_STATUSES } from 'constants';
import { useMemo } from 'react';

export const useDepositLimit = (limits, isNative) => {
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    let minLimit = ethers.constants.Zero;
    try {
      minLimit = minBigNumber(
        limits[isNative ? 'singleDirectDepositLimit': 'singleDepositLimit'],
        limits[isNative ? 'dailyDirectDepositLimitPerAddress' : 'dailyDepositLimitPerAddress']?.available,
        limits.dailyDepositLimit?.available,
        limits.poolSizeLimit?.available,
      );
    } catch (error) {}
    setDepositLimit(minLimit);
  }, [limits, isNative]);

  return depositLimit;
};

export const useMaxAmountExceeded = (amount, balance, fee, limit) => {
  const [maxAmountExceeded, setMaxAmountExceeded] = useState(false);

  useEffect(() => {
    try {
      const exceeded = !balance.isZero() && (amount.gt(balance.sub(fee)) || amount.gt(limit));
      setMaxAmountExceeded(exceeded);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.useMaxAmountExceeded' } });
    }
  }, [amount, balance, fee, limit]);

  return maxAmountExceeded;
};

const TOKEN_ABI = [
  'function allowance(address, address) pure returns (uint256)',
  'function approve(address, uint256) returns (bool)',
];
const PERMIT2_CONTRACT_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

export const useApproval = (amount, balance) => {
  const { openTxModal, setTxStatus, setTxError } = useContext(TransactionModalContext);
  const { currentPool } = useContext(PoolContext);
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner({ chainId: currentPool.chainId });
  const provider = useProvider({ chainId: currentPool.chainId });
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: currentPool.chainId,
    throwForSwitchChainNotSupported: true,
  });
  const [allowance, setAllowance] = useState(ethers.constants.Zero);

  const isApproved = useMemo(() => allowance.gte(amount), [allowance, amount]);

  const updateAllowance = useCallback(async () => {
    if (!account) return;
    const token = new ethers.Contract(currentPool.tokenAddress, TOKEN_ABI, provider);
    token.allowance(account, PERMIT2_CONTRACT_ADDRESS).then(allowance => {
      setAllowance(allowance);
    });
  }, [account, provider, currentPool.tokenAddress]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, balance]);

  const approve = useCallback(async () => {
    try {
      openTxModal();
      if (chain.id !== currentPool.chainId) {
        setTxStatus(TX_STATUSES.SWITCH_NETWORK);
        try {
          await switchNetworkAsync();
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, { tags: { method: 'Deposit.useApproval.approve.switchNetwork' } });
          setTxStatus(TX_STATUSES.WRONG_NETWORK);
          return;
        }
      }
      setTxStatus(TX_STATUSES.APPROVE_TOKENS);
      const token = new ethers.Contract(currentPool.tokenAddress, TOKEN_ABI, signer);
      const tx = await token.approve(PERMIT2_CONTRACT_ADDRESS, ethers.constants.MaxUint256);
      setTxStatus(TX_STATUSES.WAITING_FOR_TRANSACTION);
      await tx.wait();
      setTxStatus(TX_STATUSES.APPROVED);
      updateAllowance();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.useApproval.approve' } });
      const message = error.message.includes('user rejected transaction')
        ? 'User denied transaction signature'
        : error.message;
      setTxError(message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [openTxModal, setTxStatus, setTxError, switchNetworkAsync, chain, currentPool, signer, updateAllowance]);

  return { isApproved, approve, updateAllowance };
}
