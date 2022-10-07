import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import Button from 'components/Button';

import { TX_STATUSES } from 'constants';

import { ReactComponent as CheckIcon } from 'assets/check-circle.svg';
import { ReactComponent as CrossIcon } from 'assets/cross-circle.svg';

import { tokenSymbol } from 'utils/token';

const titles = {
  [TX_STATUSES.APPROVE_TOKENS]: 'Please approve tokens',
  [TX_STATUSES.SIGN_MESSAGE]: 'Please sign a message',
  [TX_STATUSES.WAITING_FOR_APPROVAL]: 'Waiting for approval transaction',
  [TX_STATUSES.GENERATING_PROOF]: 'Generating a proof',
  [TX_STATUSES.WAITING_FOR_RELAYER]: 'Waiting for relayer',
  [TX_STATUSES.DEPOSITED]: 'Deposit is completed',
  [TX_STATUSES.TRANSFERRED]: 'Transfer is completed',
  [TX_STATUSES.WITHDRAWN]: 'Withdrawal is completed',
  [TX_STATUSES.REJECTED]: 'Transaction was rejected',
  [TX_STATUSES.SIGNATURE_EXPIRED]: 'Signature expired',
};

const descriptions = {
  [TX_STATUSES.DEPOSITED]: 'To increase the level of privacy, consider keeping the tokens in the zero knowledge pool for some time before withdrawal.',
  [TX_STATUSES.TRANSFERRED]: `Your ${tokenSymbol(true)} transfer has been completed within the zero knowledge pool.`,
  [TX_STATUSES.WITHDRAWN]: `Your ${tokenSymbol(true)} withdrawal from the zero knowledge pool has been completed.`,
  [TX_STATUSES.SIGNATURE_EXPIRED]: `Your signature has expired. Please try again.`,
};

const SUCCESS_STATUSES = [TX_STATUSES.DEPOSITED, TX_STATUSES.TRANSFERRED, TX_STATUSES.WITHDRAWN];
const FAILURE_STATUSES = [TX_STATUSES.REJECTED, TX_STATUSES.SIGNATURE_EXPIRED];

export default ({ isOpen, onClose, status }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={[...SUCCESS_STATUSES, ...FAILURE_STATUSES].includes(status) ? onClose : null}
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
        else return <Spinner />;
      })()}
      {descriptions[status] && (
        <Description>{descriptions[status]}</Description>
      )}
      {status === TX_STATUSES.DEPOSITED && (
        <OkButton onClick={onClose}>Got it!</OkButton>
      )}
    </Modal>
  );
};

const Description = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin: 16px 0;
`;

const SignDescription = styled(Description)`
  margin-top: -10px;
`;

const OkButton = styled(Button)`
  width: 100%;
`;
