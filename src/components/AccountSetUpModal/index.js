import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import md5 from 'js-md5';

import Modal from 'components/Modal';
import Button from 'components/Button';

import Create from 'components/AccountSetUpModal/Create';
import Confirm from 'components/AccountSetUpModal/Confirm';
import Restore from 'components/AccountSetUpModal/Restore';
import Generate from 'components/AccountSetUpModal/Generate';
import Password from 'components/AccountSetUpModal/Password';

export default ({ isOpen, onClose, saveZkAccountMnemonic, openWalletModal }) => {
  const { library, account } = useWeb3React();
  const [action, setAction] = useState();
  const [newMnemonic, setNewMnemonic] = useState();
  const [confirmedMnemonic, setConfirmedMnemonic] = useState();

  const closeModal = useCallback(() => {
    setAction(null);
    setNewMnemonic(null);
    onClose();
  }, [onClose]);

  const setNextAction = useCallback(nextAction => {
    if (nextAction === 'create') {
      const newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      setNewMnemonic(newMnemonic);
    }
    setAction(nextAction);
  }, []);

  const confirmMnemonic = useCallback(() => {
    setConfirmedMnemonic(newMnemonic);
    setAction('password');
  }, [newMnemonic]);

  const restore = useCallback(mnemonic => {
    setConfirmedMnemonic(mnemonic);
    setAction('password');
  }, []);

  const generate = useCallback(async () => {
    const message = 'zkAccount';
    const signedMessage = (await library.send(
      'personal_sign',
      [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), account.toLowerCase()],
    ));
    const newMnemonic = ethers.utils.entropyToMnemonic(md5.array(signedMessage));
    setConfirmedMnemonic(newMnemonic);
    setAction('password');
  }, [library, account]);

  const connectWallet = useCallback(() => {
    closeModal();
    openWalletModal();
  }, [openWalletModal, closeModal]);

  const confirmPassword = useCallback(password => {
    saveZkAccountMnemonic(confirmedMnemonic, password);
    closeModal();
  }, [confirmedMnemonic, saveZkAccountMnemonic]);

  let title = null;
  let state = null;
  let prevAction = null;
  if (action === 'create') {
    title = 'Set up account';
    state = <Create mnemonic={newMnemonic} next={() => setAction('confirm')} />;
    prevAction = null;
  } else if (action === 'confirm') {
    title = 'Confirm seed phrase';
    state = <Confirm mnemonic={newMnemonic} confirmMnemonic={confirmMnemonic} />;
    prevAction = 'create';
  } else if (action === 'restore') {
    title = 'Restore account';
    state = <Restore restore={restore} />;
    prevAction = null;
  } else if (action === 'generate') {
    title = 'Create account';
    state = <Generate generate={generate} account={account} connectWallet={connectWallet} />;
    prevAction = null;
  } else if (action === 'password') {
    title = 'Create password';
    state = <Password confirmPassword={confirmPassword} />;
    prevAction = null;
  } else {
    title = 'zkAccount';
    state = (
      <>
        <OptionContainer>
          <Title>Create a new zkBob Account</Title>
          <Description>
            Create a new account with seed phrase or you can use wallet private key for creation
          </Description>
          <CreateButton onClick={() => setNextAction('create')}>
            Create from seed phrase
          </CreateButton>
          <GenerateButton onClick={() => setNextAction('generate')}>
            Create from wallet private key
          </GenerateButton>
        </OptionContainer>
        <OptionContainer>
          <Title>I already have a seed phrase</Title>
          <Description>
          Import your existing account using your 12 word seed phrase.
          </Description>
          <RestoreButton onClick={() => setNextAction('restore')}>
            Restore account
          </RestoreButton>
        </OptionContainer>
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
  align-items: stretch;
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
  text-align: center;
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Description = styled(Title)`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
`;

const CreateButton = styled(Button)`
  margin-bottom: 10px;
`;

const GenerateButton = styled(Button)`
  background: ${({ theme }) => theme.color.blueLight};
`;

const RestoreButton = styled(Button)`
background: ${({ theme }) => theme.color.purpleLight};
`;
