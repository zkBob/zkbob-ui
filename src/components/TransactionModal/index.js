import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';

import { TX_STATUSES } from 'constants';

import { ReactComponent as CheckIconDefault } from 'assets/check-circle.svg';

const titles = {
  [TX_STATUSES.APPROVE_TOKENS]: 'Please approve tokens',
  [TX_STATUSES.WAITING_FOR_APPROVAL]: 'Waiting for approval transaction',
  [TX_STATUSES.GENERATING_PROOF]: 'Generating a proof',
  [TX_STATUSES.WAITING_FOR_RELAYER]: 'Waiting for relayer',
  [TX_STATUSES.DEPOSITED]: 'Deposited',
  [TX_STATUSES.TRANSFERRED]: 'Transferred',
  [TX_STATUSES.WITHDRAWN]: 'Withdrawn',
};

const SUCCESS_STATUSES = [TX_STATUSES.DEPOSITED, TX_STATUSES.TRANSFERRED, TX_STATUSES.WITHDRAWN];

export default ({ isOpen, onClose, status }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[status]}
    >
      {SUCCESS_STATUSES.includes(status) ? (
        <CheckIcon />
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};

const CheckIcon = styled(CheckIconDefault)`
  margin-top: 10px;
`;
