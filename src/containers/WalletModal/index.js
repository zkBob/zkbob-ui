import { useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector, NoEthereumProviderError } from '@web3-react/injected-connector';

import WalletModal from 'components/WalletModal';

const injected = new InjectedConnector({ supportedChainIds: [1, 100] });

export default ({ isOpen, onClose }) => {
  const { activate, active, connector, chainId, account } = useWeb3React();

  const connectWallet = useCallback(async () => {
    await activate(injected, undefined, true);
    onClose();
  }, [activate, onClose]);

  useEffect(() => {
    async function connect() {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        await activate(injected, undefined, true);
      }
    }
    connect();
  }, [activate]);

  return (
    <WalletModal
      isOpen={isOpen}
      onClose={onClose}
      connectWallet={connectWallet}
    />
  );
}
