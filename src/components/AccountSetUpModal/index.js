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

export default ({ isOpen, onClose, saveZkAccountMnemonic, openWalletModal, isSuspiciousAddress }) => {
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
    const message = 'Access zkBob account.\n\nOnly sign this message for a trusted client!';
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
  }, [confirmedMnemonic, saveZkAccountMnemonic, closeModal]);

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
    state = (
      <Generate
        generate={generate}
        account={account}
        connectWallet={connectWallet}
        isSuspiciousAddress={isSuspiciousAddress}
      />
    );
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
          <Title>Create a new zkBob Account with</Title>
          <CreateButton onClick={() => setNextAction('generate')}>
            MetaMask or WalletConnect
          </CreateButton>
          <Row>
            <Text>or</Text>
            <Button type="link" onClick={() => setNextAction('create')}>
              secret recovery phrase
            </Button>
          </Row>
        </OptionContainer>
        <OptionContainer>
          <Title>I already have a secret recovery phrase</Title>
          <Description>
          Import your existing account using your 12 word secret recovery phrase.
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
      onBack={action ? () => setAction(prevAction) : null}
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
  font-weight: ${({ theme }) => theme.text.weight.normal};
  line-height: 20px;
`;

const CreateButton = styled(Button)`
  margin-bottom: 10px;
  position: relative;
`;

const RestoreButton = styled(Button)`
  background: ${({ theme }) => theme.color.purpleLight};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
  margin-right: 5px;
`;
