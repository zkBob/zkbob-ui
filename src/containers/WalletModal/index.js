import { useContext } from 'react';

import { ModalContext } from 'contexts';
import WalletModal from 'components/WalletModal';

export default () => {
  const { isWalletModalOpen, closeWalletModal } = useContext(ModalContext);
  return (
    <WalletModal
      isOpen={isWalletModalOpen}
      close={closeWalletModal}
    />
  );
}
