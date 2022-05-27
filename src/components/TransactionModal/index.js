import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import Button from 'components/Button';

import { TX_STATUSES } from 'constants';

import { ReactComponent as CheckIcon } from 'assets/check-circle.svg';
import { ReactComponent as CrossIcon } from 'assets/cross-circle.svg';

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
};

const descriptions = {
  [TX_STATUSES.DEPOSITED]: 'To increase the level of privacy, consider keeping the tokens in the zero knowledge pool for some time before withdrawal.',
  [TX_STATUSES.TRANSFERRED]: 'Your shDAI transfer has been completed within the zero knowledge pool.',
  [TX_STATUSES.WITHDRAWN]: 'Your shDAI withdrawal from the zero knowledge pool has been completed.',
};

const SUCCESS_STATUSES = [TX_STATUSES.DEPOSITED, TX_STATUSES.TRANSFERRED, TX_STATUSES.WITHDRAWN];

export default ({ isOpen, onClose, status }) => {
  const history = useHistory();
  const goTo = useCallback(path => {
    onClose();
    history.push(path);
  }, [history, onClose]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={[...SUCCESS_STATUSES, TX_STATUSES.REJECTED].includes(status) ? onClose : null}
      title={titles[status]}
    >
      {status === TX_STATUSES.SIGN_MESSAGE && (
        <SignDescription>
          You need to sign a message to prove the ownership of the account from which the deposit will be made.
        </SignDescription>
      )}
      {(() => {
        if (SUCCESS_STATUSES.includes(status)) return <CheckIcon />
        else if (status === TX_STATUSES.REJECTED) return <CrossIcon />
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
