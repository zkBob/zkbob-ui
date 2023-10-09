import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { TransactionModalContext, WalletContext } from 'contexts';

import { TX_STATUSES, PERMIT2_CONTRACT_ADDRESS } from 'constants';
import tokenAbi from 'abis/token.json';


export default (pool, tokenAddress, amount, balance, type = 'permit2') => {
  const { openTxModal, closeTxModal, setTxStatus, setTxError } = useContext(TransactionModalContext);
  const { address: account, chain, switchNetwork, callContract, waitForTx } = useContext(WalletContext);
  const [allowance, setAllowance] = useState(ethers.constants.Zero);

  const contractForApproval = useMemo(() =>
    type === 'permit2' ? PERMIT2_CONTRACT_ADDRESS : pool.poolAddress,
    [type, pool.poolAddress]
  );
  const isApproved = useMemo(() => allowance.gte(amount), [allowance, amount]);

  const updateAllowance = useCallback(async () => {
    if (!account || !tokenAddress || tokenAddress === ethers.constants.AddressZero) {
      setAllowance(ethers.constants.Zero);
      return;
    }
    const allowance = await callContract(tokenAddress, tokenAbi, 'allowance', [account, contractForApproval]);
    setAllowance(allowance);
  }, [account, callContract, tokenAddress, contractForApproval]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, balance]);

  const approve = useCallback(async () => {
    try {
      openTxModal();
      if (chain.id !== pool.chainId) {
        setTxStatus(TX_STATUSES.SWITCH_NETWORK);
        try {
          await switchNetwork();
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, { tags: { method: 'hooks.useApproval.approve.switchNetwork' } });
          setTxStatus(TX_STATUSES.WRONG_NETWORK);
          return;
        }
      }
      setTxStatus(TX_STATUSES.APPROVE_TOKENS);
      const tx = await callContract(tokenAddress, tokenAbi, 'approve', [contractForApproval, ethers.constants.MaxUint256], true);
      setTxStatus(TX_STATUSES.WAITING_FOR_TRANSACTION);
      await waitForTx(tx);
      closeTxModal();
      updateAllowance();
    } catch (error) {
      Sentry.captureException(error, { tags: { method: 'hooks.useApproval.approve' } });
      const message = error.message?.includes('user rejected transaction')
        ? 'User denied transaction signature'
        : error.message;
      setTxError(message || error);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    openTxModal, setTxStatus, setTxError, switchNetwork, chain,
    waitForTx, updateAllowance, pool.chainId, tokenAddress, closeTxModal,
    callContract, contractForApproval,
  ]);

  return { isApproved, approve, updateAllowance };
}
