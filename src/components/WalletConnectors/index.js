import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { CONNECTORS_ICONS } from 'constants';

const getConnectorName = connector => {
  if (connector.name === 'WalletConnectLegacy') return 'WalletConnect';
  // if (connector.name === 'WalletConnect') return 'WalletConnect v2';
  return connector.name;
}

export default ({ callback, gaIdPrefix = '' }) => {
  const { connector: activeConnector } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const connectWallet = useCallback(async connector => {
    if (connector.id === activeConnector?.id) {
      await disconnectAsync();
    }
    await connectAsync({ connector });
    callback?.();
  }, [connectAsync, disconnectAsync, activeConnector, callback]);

  return (
    <>
      {connectors.map((connector, index) => connector.ready &&
        <WalletConnector
          key={index}
          onClick={() => connectWallet(connector)}
          data-ga-id={gaIdPrefix + connector.name}
        >
          <WalletConnectorName>{getConnectorName(connector)}</WalletConnectorName>
          <WalletConnectorIcon src={CONNECTORS_ICONS[connector.name]} />
        </WalletConnector>
      )}
    </>
  );
};

const WalletConnector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
`;

const WalletConnectorName = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
`;

const WalletConnectorIcon = styled.img`
  width: 32px;
`;
