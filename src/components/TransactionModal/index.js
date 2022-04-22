import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';

import { TX_STATUSES } from 'constants';

import { ReactComponent as CheckIcon } from 'assets/check-circle.svg';
import { ReactComponent as CrossIcon } from 'assets/cross-circle.svg';

const titles = {
  [TX_STATUSES.APPROVE_TOKENS]: 'Please approve tokens',
  [TX_STATUSES.SIGN_MESSAGE]: 'Please sign a message',
  [TX_STATUSES.WAITING_FOR_APPROVAL]: 'Waiting for approval transaction',
  [TX_STATUSES.GENERATING_PROOF]: 'Generating a proof',
  [TX_STATUSES.WAITING_FOR_RELAYER]: 'Waiting for relayer',
  [TX_STATUSES.DEPOSITED]: 'Deposit complete',
  [TX_STATUSES.TRANSFERRED]: 'Transfer complete',
  [TX_STATUSES.WITHDRAWN]: 'Withdrawal complete',
  [TX_STATUSES.REJECTED]: 'Transaction rejected',
};

const SUCCESS_STATUSES = [TX_STATUSES.DEPOSITED, TX_STATUSES.TRANSFERRED, TX_STATUSES.WITHDRAWN];

export default ({ isOpen, onClose, status }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={[...SUCCESS_STATUSES, TX_STATUSES.REJECTED].includes(status) ? onClose : null}
      title={titles[status]}
    >
      {(() => {
        if (SUCCESS_STATUSES.includes(status)) return <CheckIcon />
        else if (status === TX_STATUSES.REJECTED) return <CrossIcon />
        else return <Spinner />;
      })()}
    </Modal>
  );
};
