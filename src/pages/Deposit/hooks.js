import { useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';
import { useContract, useAccount, useSigner, useNetwork, useSwitchNetwork, useProvider } from 'wagmi';

import { ZkAccountContext, PoolContext, TransactionModalContext } from 'contexts';

import { minBigNumber } from 'utils';
import { TX_STATUSES } from 'constants';

export const useDepositLimit = () => {
  const { limits } = useContext(ZkAccountContext);
  const [depositLimit, setDepositLimit] = useState(ethers.constants.Zero);

  useEffect(() => {
    let minLimit = ethers.constants.Zero;
    try {
      minLimit = minBigNumber(
        limits.singleDepositLimit,
        limits.dailyDepositLimitPerAddress?.available,
        limits.dailyDepositLimit?.available,
        limits.poolSizeLimit?.available,
      );
    } catch (error) {}
    setDepositLimit(minLimit);
  }, [limits]);

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

export const useApproval = () => {
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
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!account) return;
    const token = new ethers.Contract(currentPool.tokenAddress, TOKEN_ABI, provider);
    token.allowance(account, PERMIT2_CONTRACT_ADDRESS).then(allowance => {
      console.log(allowance);
      setIsApproved(allowance.eq(ethers.constants.MaxUint256));
    });
  }, [account, provider, currentPool.tokenAddress]);

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
      setIsApproved(true);
      setTxStatus(TX_STATUSES.APPROVED);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Deposit.useApproval.approve' } });
      const message = error.message.includes('user rejected transaction')
        ? 'User denied transaction signature'
        : error.message;
      setTxError(message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [openTxModal, setTxStatus, setTxError, switchNetworkAsync, chain, currentPool, signer]);

  return { isApproved, approve };
}
