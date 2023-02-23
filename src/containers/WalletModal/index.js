import { useCallback, useContext } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { ModalContext } from 'contexts';
import WalletModal from 'components/WalletModal';

export default () => {
  const { isWalletModalOpen, closeWalletModal } = useContext(ModalContext);
  const { connector: activeConnector } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const connectWallet = useCallback(async connector => {
    if (connector.id === activeConnector?.id) {
      await disconnectAsync();
    }
    await connectAsync({ connector });
    closeWalletModal();
  }, [connectAsync, disconnectAsync, activeConnector, closeWalletModal]);

  return (
    <WalletModal
      isOpen={isWalletModalOpen}
      onClose={closeWalletModal}
      connectors={connectors}
      connectWallet={connectWallet}
    />
  );
}
