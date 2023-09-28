import { useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import { TransactionModalContext, WalletContext } from 'contexts';

import { TX_STATUSES, PERMIT2_CONTRACT_ADDRESS } from 'constants';
import { useMemo } from 'react';


const TOKEN_ABI = [
  'function allowance(address, address) pure returns (uint256)',
  'function approve(address, uint256) returns (bool)',
];

export default (chainId, tokenAddress, amount, balance) => {
  const { openTxModal, closeTxModal, setTxStatus, setTxError } = useContext(TransactionModalContext);
  const { address: account, provider, signer, chain, switchNetwork } = useContext(WalletContext);
  const [allowance, setAllowance] = useState(ethers.constants.Zero);

  const isApproved = useMemo(() => allowance.gte(amount), [allowance, amount]);

  const updateAllowance = useCallback(async () => {
    if (!account || !tokenAddress || tokenAddress === ethers.constants.AddressZero) {
      setAllowance(ethers.constants.Zero);
      return;
    }
    const token = new ethers.Contract(tokenAddress, TOKEN_ABI, provider);
    token.allowance(account, PERMIT2_CONTRACT_ADDRESS).then(allowance => {
      setAllowance(allowance);
    });
  }, [account, provider, tokenAddress]);

  useEffect(() => {
    updateAllowance();
  }, [updateAllowance, balance]);

  const approve = useCallback(async () => {
    try {
      openTxModal();
      if (chain.id !== chainId) {
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
      const token = new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
      const tx = await token.approve(PERMIT2_CONTRACT_ADDRESS, ethers.constants.MaxUint256);
      setTxStatus(TX_STATUSES.WAITING_FOR_TRANSACTION);
      await tx.wait();
      closeTxModal();
      updateAllowance();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'hooks.useApproval.approve' } });
      const message = error.message.includes('user rejected transaction')
        ? 'User denied transaction signature'
        : error.message;
      setTxError(message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    openTxModal, setTxStatus, setTxError, switchNetwork, chain,
    signer, updateAllowance, chainId, tokenAddress, closeTxModal,
  ]);

  return { isApproved, approve, updateAllowance };
}
