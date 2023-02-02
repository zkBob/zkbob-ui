import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import Button from 'components/Button';

import { TX_STATUSES, NETWORKS } from 'constants';

import { ReactComponent as CheckIconDefault } from 'assets/check-circle.svg';
import { ReactComponent as CrossIconDefault } from 'assets/cross-circle.svg';

import { tokenSymbol } from 'utils/token';
import { formatNumber } from 'utils';

const titles = {
  [TX_STATUSES.APPROVE_TOKENS]: 'Please approve tokens',
  [TX_STATUSES.SIGN_MESSAGE]: 'Please sign a message',
  [TX_STATUSES.WAITING_FOR_APPROVAL]: 'Waiting for approval transaction',
  [TX_STATUSES.GENERATING_PROOF]: 'Generating a proof',
  [TX_STATUSES.WAITING_FOR_RELAYER]: 'Waiting for relayer',
  [TX_STATUSES.DEPOSITED]: 'Deposit sent',
  [TX_STATUSES.TRANSFERRED]: 'Transfer sent',
  [TX_STATUSES.TRANSFERRED_MULTI]: 'Multitransfer sent',
  [TX_STATUSES.WITHDRAWN]: 'Withdrawal sent',
  [TX_STATUSES.REJECTED]: 'Transaction was rejected',
  [TX_STATUSES.SIGNATURE_EXPIRED]: 'Signature expired',
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT]: 'Suspicious wallet connected',
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL]: 'Suspicious recipient address',
  [TX_STATUSES.WRONG_NETWORK]: 'Wrong network',
  [TX_STATUSES.SWITCH_NETWORK]: 'Please switch the network',
};

const descriptions = {
  [TX_STATUSES.DEPOSITED]: amount => (
    <span>
      Your <b>{formatNumber(amount, 18)} {tokenSymbol()}</b> deposit to the zero knowledge pool is in process.<br /><br />
      To increase the level of privacy, consider keeping the tokens in the zero knowledge pool for some time before withdrawal.
    </span>
  ),
  [TX_STATUSES.TRANSFERRED]: amount => (
    <span>
      Your <b>{formatNumber(amount, 18)} {tokenSymbol()}</b> transfer within the zero knowledge pool is in process.
    </span>
  ),
  [TX_STATUSES.TRANSFERRED_MULTI]: amount => (
    <span>
      Your <b>{formatNumber(amount, 18)} {tokenSymbol()}</b> multitransfer within the zero knowledge pool is in process.
    </span>
  ),
  [TX_STATUSES.WITHDRAWN]: amount => (
    <span>
      Your <b>{formatNumber(amount, 18)} {tokenSymbol()}</b> withdrawal from the zero knowledge pool is in process.
    </span>
  ),
  [TX_STATUSES.SIGNATURE_EXPIRED]: () => (
    <span>
      Your signature has expired. Please try again.
    </span>
  ),
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT]: () => (
    <span>
      We found that your wallet was involved in suspicious activities.{' '}
      Because of this, you can't use this wallet at zkBob. Please, try another wallet.
    </span>
  ),
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL]: () => (
    <span>
      We found that the recipient's address was involved in suspicious activities.{' '}
      Because of this, you can't withdraw funds to this address.
    </span>
  ),
  [TX_STATUSES.WRONG_NETWORK]: () => (
    <span>
      Failed to switch the network.{' '}
      Please connect your wallet to {NETWORKS[process.env.REACT_APP_NETWORK].name} and try again.
    </span>
  ),
};

const SUCCESS_STATUSES = [
  TX_STATUSES.DEPOSITED,
  TX_STATUSES.TRANSFERRED,
  TX_STATUSES.TRANSFERRED_MULTI,
  TX_STATUSES.WITHDRAWN,
];
const FAILURE_STATUSES = [
  TX_STATUSES.REJECTED,
  TX_STATUSES.SIGNATURE_EXPIRED,
  TX_STATUSES.WRONG_NETWORK,
];
const SUSPICIOUS_ACCOUNT_STATUSES = [
  TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT,
  TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL,
];

export default ({ isOpen, onClose, status, amount, error, supportId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={[
        ...SUCCESS_STATUSES,
        ...FAILURE_STATUSES,
        ...SUSPICIOUS_ACCOUNT_STATUSES,
      ].includes(status) ? onClose : null}
      title={titles[status]}
    >
      {status === TX_STATUSES.SIGN_MESSAGE && (
        <SignDescription>
          You need to sign a message allowing the contract to use your tokens for the deposit.
        </SignDescription>
      )}
      {(() => {
        if (SUCCESS_STATUSES.includes(status)) return <CheckIcon />
        else if (FAILURE_STATUSES.includes(status)) return <CrossIcon />
        else if (SUSPICIOUS_ACCOUNT_STATUSES.includes(status)) return null
        else return <Spinner />;
      })()}
      {descriptions[status] && (
        <Description>{descriptions[status](amount)}</Description>
      )}
      {(status === TX_STATUSES.REJECTED && error) && (
        <Description>{error}</Description>
      )}
      {(FAILURE_STATUSES.includes(status)) && (
        <Description>Support ID: {supportId}</Description>
      )}
      {status === TX_STATUSES.DEPOSITED && (
        <OkButton onClick={onClose}>Got it!</OkButton>
      )}
      {SUSPICIOUS_ACCOUNT_STATUSES.includes(status) && (
        <OkButton onClick={onClose}>Okay</OkButton>
      )}
    </Modal>
  );
};

const Description = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SignDescription = styled(Description)`
  margin-top: -10px;
`;

const OkButton = styled(Button)`
  width: 100%;
`;

const CheckIcon = styled(CheckIconDefault)`
  margin-bottom: 16px;
`;

const CrossIcon = styled(CrossIconDefault)`
  margin-bottom: 16px;
`;
