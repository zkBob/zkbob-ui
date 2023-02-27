import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi'

import IncreasedLimitsModal from 'components/IncreasedLimitsModal';

import { ModalContext, IncreasedLimitsContext, ZkAccountContext } from 'contexts';

import { INCREASED_LIMITS_STATUSES } from 'constants';

export default () => {
  const { address: account } = useAccount();
  const {
    isIncreasedLimitsModalOpen, closeIncreasedLimitsModal,
    isWalletModalOpen, openWalletModal,
  } = useContext(ModalContext);
  const { status, updateStatus } = useContext(IncreasedLimitsContext);
  const { updateLimits } = useContext(ZkAccountContext);

  useEffect(() => {
    if (isIncreasedLimitsModalOpen && account) {
      const interval = 5000; // 5 seconds
      const intervalId = setInterval(() => {
        updateStatus();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [isIncreasedLimitsModalOpen, account, updateStatus]);

  useEffect(() => {
    if ([INCREASED_LIMITS_STATUSES.ACTIVE, INCREASED_LIMITS_STATUSES.RESYNC].includes(status)) {
      closeIncreasedLimitsModal();
      updateLimits();
    }
  }, [status, closeIncreasedLimitsModal, updateLimits]);

  return (
    <IncreasedLimitsModal
      isOpen={isIncreasedLimitsModalOpen}
      onClose={closeIncreasedLimitsModal}
      isWalletModalOpen={isWalletModalOpen}
      openWalletModal={openWalletModal}
      account={account}
    />
  );
}
