import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';

import metaMaskIcon from 'assets/metamask.svg';
import walletConnectIcon from 'assets/walletconnect.svg';

const connectors = [
  {
    name: 'MetaMask',
    icon: metaMaskIcon,
  },
  {
    name: 'WalletConnect',
    icon: walletConnectIcon,
  }
]

export default ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect web3 wallet">
      <Text>
        Your wallet will be used to derive a private key to encrypt your data and sign private transactions.
      </Text>
      {connectors.map(connector =>
        <WalletConnector>
          <WalletConnectorName>{connector.name}</WalletConnectorName>
          <WalletConnectorIcon src={connector.icon} />
        </WalletConnector>
      )}
      <Text>
        By connecting a wallet, you agree to zkBob <Link>Terms of Service</Link>
      </Text>
    </Modal>
  );
};

const Text = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Link = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.button.link.text.color};
  cursor: pointer;
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
