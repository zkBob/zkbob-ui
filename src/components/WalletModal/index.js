import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Link from 'components/Link';
import WalletConnectors from 'components/WalletConnectors';

import { tokenSymbol } from 'utils/token';

export default ({ isOpen, close }) => {
  return (
    <Modal isOpen={isOpen} onClose={close} title="Connect web3 wallet">
      <Text>
        Connect your wallet to deposit {tokenSymbol()} into your zkAccount.{' '}
        If you are creating a new zkAccount, your wallet is used{' '}
        to derive a private encryption key for the zkBob application.
      </Text>
      <WalletConnectors callback={close} />
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
