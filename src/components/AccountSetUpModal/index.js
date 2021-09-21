import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Modal from 'components/Modal';
import Button from 'components/Button';

import CreateMnemonic from 'components/AccountSetUpModal/CreateMnemonic';
import ConfirmMnemonic from 'components/AccountSetUpModal/ConfirmMnemonic';

const options = [
  {
    title: 'I already have a seed phrase',
    description: 'Import your existing account using 12 word seed phrase',
    actionText: 'Restore account',
    action: 'restore',
  },
  {
    title: 'Set up a new account',
    description: 'This will create a new account and seed phrase',
    actionText: 'Set up account',
    action: 'create',
  },
  {
    title: 'Create a new account',
    description: 'Create account using a wallet private key',
    actionText: 'Create account',
    action: 'generate',
  },
];

export default ({ isOpen, onClose }) => {
  const [action, setAction] = useState();
  const [wallet, setWallet] = useState();
  const setNextAction = useCallback(nextAction => {
    if (nextAction === 'create') {
      const wallet = ethers.Wallet.createRandom();
      setWallet(wallet);
    }
    setAction(nextAction);
  }, []);
  const confirmMnemonic = useCallback(() => {
    window.localStorage.setItem('zkAccountKey', wallet.privateKey);
    setAction(null);
    onClose();
  }, [wallet, onClose]);
  let title = null;
  let state = null;
  let prevAction = null;
  if (action === 'create') {
    title = 'Set up account';
    state = <CreateMnemonic mnemonic={wallet?.mnemonic?.phrase} next={() => setAction('confirm')} />;
    prevAction = null;
  } else if (action === 'confirm') {
    title = 'Confirm seed phrase';
    state = <ConfirmMnemonic mnemonic={wallet?.mnemonic?.phrase} confirmMnemonic={confirmMnemonic} />;
    prevAction = 'create';
  } else {
    title = 'Set up account';
    state = (
      <>
        {options.map(option =>
          <OptionContainer>
            <Title>{option.title}</Title>
            <Description>{option.description}</Description>
            <Button small onClick={() => setNextAction(option.action)}>
              {option.actionText}
            </Button>
          </OptionContainer>
        )}
      </>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onBack={() => setAction(prevAction)}
      title={title}
    >
      {state}
    </Modal>
  );
};

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 24px;
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Description = styled(Title)`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
`;
