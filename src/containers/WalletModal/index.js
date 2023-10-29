import { useContext } from 'react';

import { ModalContext, PoolContext } from 'contexts';
import WalletModal from 'components/WalletModal';

export default () => {
  const { isWalletModalOpen, closeWalletModal } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);
  return (
    <WalletModal
      isOpen={isWalletModalOpen}
      close={closeWalletModal}
      currentPool={currentPool}
    />
  );
}
