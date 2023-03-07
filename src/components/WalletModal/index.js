import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Link from 'components/Link';

import { tokenSymbol } from 'utils/token';

import { CONNECTORS_ICONS } from 'constants';

const getConnectorName = connector => {
  if (connector.name === 'WalletConnectLegacy') return 'WalletConnect v1';
  if (connector.name === 'WalletConnect') return 'WalletConnect v2';
  return connector.name;
}

export default ({ isOpen, onClose, connectors, connectWallet }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect web3 wallet">
      <Text>
        Connect your wallet to deposit {tokenSymbol()} into your zkAccount.{' '}
        If you are creating a new zkAccount, your wallet is used{' '}
        to derive a private encryption key for the zkBob application.
      </Text>
      {connectors.map((connector, index) => connector.ready &&
        <WalletConnector
          key={index}
          onClick={() => connectWallet(connector)}
        >
          <WalletConnectorName>{getConnectorName(connector)}</WalletConnectorName>
          <WalletConnectorIcon src={CONNECTORS_ICONS[connector.name]} />
        </WalletConnector>
      )}
      <Text>
        By connecting a wallet, you agree to zkBob<br />
        <Link href="https://docs.zkbob.com/zkbob-overview/compliance-and-security">
          Terms of Service
        </Link>
      </Text>
    </Modal>
  );
};

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

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
