import { useContext, useEffect, useState } from 'react';

import { ModalContext, WalletScreeningContext } from 'contexts';
import SuspiciousAddressModal from 'components/SuspiciousAddressModal';

export default () => {
  const { isSuspiciousAddress, checkedAddress } = useContext(WalletScreeningContext);
  const {
    isSuspiciousAddressModalOpen,
    openSuspiciousAddressModal,
    closeSuspiciousAddressModal,
    isPasswordModalOpen,
  } = useContext(ModalContext);
  const [lastAddress, setLastAddress] = useState(null);

  useEffect(() => {
    if (isPasswordModalOpen) return;
    if (isSuspiciousAddress && lastAddress !== checkedAddress) {
      openSuspiciousAddressModal();
    }
    setLastAddress(checkedAddress);
  }, [
    isSuspiciousAddress, openSuspiciousAddressModal,
    checkedAddress, lastAddress, isPasswordModalOpen,
  ]);

  return (
    <SuspiciousAddressModal
      isOpen={isSuspiciousAddressModalOpen}
      close={closeSuspiciousAddressModal}
    />
  );
}
