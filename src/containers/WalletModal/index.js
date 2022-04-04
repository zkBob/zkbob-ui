import { useCallback, useEffect } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';

import WalletModal from 'components/WalletModal';

import connectors from 'connectors';

export default ({ isOpen, onClose }) => {
  const { activate } = useWeb3React();

  const activateConnector = useCallback(async connector => {
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      console.log(error);
      if (error instanceof UnsupportedChainIdError) {
        alert('Wrong network. Please connect to Kovan.');
      }
    }
  }, [activate]);

  const connectWallet = useCallback(async connector => {
    await activateConnector(connector);
    onClose();
  }, [activateConnector, onClose]);

  useEffect(() => {
    async function connect() {
      const isAuthorized = await connectors.injected.connector.isAuthorized();
      if (isAuthorized) {
        activateConnector(connectors.injected.connector);
      }
    }
    connect();
  }, [activateConnector]);

  return (
    <WalletModal
      isOpen={isOpen}
      onClose={onClose}
      connectors={Object.values(connectors)}
      connectWallet={connectWallet}
    />
  );
}
