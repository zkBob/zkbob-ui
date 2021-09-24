import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import Modal from 'components/Modal';
import Button from 'components/Button';

import Create from 'components/AccountSetUpModal/Create';
import Confirm from 'components/AccountSetUpModal/Confirm';
import Restore from 'components/AccountSetUpModal/Restore';
import Generate from 'components/AccountSetUpModal/Generate';

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

export default ({ isOpen, onClose, saveZkAccountKey }) => {
  const { library } = useWeb3React();
  const [action, setAction] = useState();
  const [wallet, setWallet] = useState();
  const closeModal = useCallback(() => {
    setAction(null);
    setWallet(null);
    onClose();
  }, [onClose]);
  const setNextAction = useCallback(nextAction => {
    if (nextAction === 'create') {
      const wallet = ethers.Wallet.createRandom();
      setWallet(wallet);
    }
    setAction(nextAction);
  }, []);
  const confirmMnemonic = useCallback(() => {
    saveZkAccountKey(wallet.privateKey);
    closeModal();
  }, [wallet, closeModal, saveZkAccountKey]);
  const restore = useCallback(mnemonic => {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    saveZkAccountKey(wallet.privateKey);
    closeModal();
  }, [closeModal, saveZkAccountKey]);
  const generate = useCallback(async () => {
    const signer = library.getSigner();
    const privateKey = (await signer.signMessage('zkAccount')).substring(0, 66);
    saveZkAccountKey(privateKey);
    closeModal();
  }, [library, closeModal, saveZkAccountKey]);
  let title = null;
  let state = null;
  let prevAction = null;
  if (action === 'create') {
    title = 'Set up account';
    state = <Create mnemonic={wallet?.mnemonic?.phrase} next={() => setAction('confirm')} />;
    prevAction = null;
  } else if (action === 'confirm') {
    title = 'Confirm seed phrase';
    state = <Confirm mnemonic={wallet?.mnemonic?.phrase} confirmMnemonic={confirmMnemonic} />;
    prevAction = 'create';
  } else if (action === 'restore') {
    title = 'Restore account';
    state = <Restore restore={restore} />;
    prevAction = null;
  } else if (action === 'generate') {
    title = 'Restore account';
    state = <Generate generate={generate} />;
    prevAction = null;
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
      onClose={closeModal}
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
