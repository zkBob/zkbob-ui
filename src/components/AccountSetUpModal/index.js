import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useSignMessage } from 'wagmi';
import md5 from 'js-md5';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';

import Create from './Create';
import Confirm from './Confirm';
import Restore from './Restore';
import Generate from './Generate';
import Password from './Password';
import Sign from './Sign';

const STEP = {
  START: 1,
  CREATE_OPTIONS: 2,
  RESTORE_OPTIONS: 3,
  CREATE_WITH_WALLET: 4,
  CREATE_WITH_SECRET: 5,
  RESTORE_WITH_WALLET: 6,
  RESTORE_WITH_SECRET: 7,
  CONFIRM_SECRET: 8,
  SING_MESSAGE_TO_CREATE: 9,
  SING_MESSAGE_TO_RESTORE: 10,
  CREATE_PASSWORD: 11,
};

const Start = ({ setStep }) => (
  <Container>
    <Description>
      To start working with zkBob you need a zkAccount
    </Description>
    <Button onClick={() => setStep(STEP.CREATE_OPTIONS)}>
      Create new zkAccount
    </Button>
    <SecondButton onClick={() => setStep(STEP.RESTORE_OPTIONS)}>
      I already have a zkAccount
    </SecondButton>
  </Container>
);

const CreateOptions = ({ setStep }) => (
  <Container>
    <Button onClick={() => setStep(STEP.CREATE_WITH_WALLET)}>
      Use my Web3 wallet
    </Button>
    <SecondButton onClick={() => setStep(STEP.CREATE_WITH_SECRET)}>
      Use zkBob secret phrase
    </SecondButton>
    <Description>
      By creating zkAccount, you hereby agree to and accept zkBob{' '}
      <Link href="https://docs.zkbob.com/zkbob-overview/compliance-and-security">
        Terms of Service
      </Link>
    </Description>
  </Container>
);

const RestoreOptions = ({ setStep }) => (
  <Container>
    <Button onClick={() => setStep(STEP.RESTORE_WITH_WALLET)}>
      I used a Web3 wallet
    </Button>
    <SecondButton onClick={() => setStep(STEP.RESTORE_WITH_SECRET)}>
      I used zkBob secret phrase
    </SecondButton>
  </Container>
);

export default ({ isOpen, onClose, saveZkAccountMnemonic, closePasswordModal }) => {
  const { signMessageAsync } = useSignMessage();
  const [step, setStep] = useState(STEP.START);
  const [newMnemonic, setNewMnemonic] = useState();
  const [confirmedMnemonic, setConfirmedMnemonic] = useState();

  const closeModal = useCallback(() => {
    setStep(STEP.START);
    setNewMnemonic(null);
    onClose();
  }, [onClose]);

  const setNextStep = useCallback(nextStep => {
    let newMnemonic = null;
    if (nextStep === STEP.CREATE_WITH_SECRET) {
      newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    }
    setNewMnemonic(newMnemonic);
    setStep(nextStep);
  }, []);

  const confirmMnemonic = useCallback(() => {
    setConfirmedMnemonic(newMnemonic);
    setStep(STEP.CREATE_PASSWORD);
  }, [newMnemonic]);

  const restore = useCallback(mnemonic => {
    setConfirmedMnemonic(mnemonic);
    setStep(STEP.CREATE_PASSWORD);
  }, []);

  const generate = useCallback(async () => {
    const nextStep = step === STEP.CREATE_WITH_WALLET
      ? STEP.SING_MESSAGE_TO_CREATE
      : STEP.SING_MESSAGE_TO_RESTORE;
    setStep(nextStep);
    try {
      const message = 'Access zkBob account.\n\nOnly sign this message for a trusted client!';
      const signedMessage = await signMessageAsync({ message });
      const newMnemonic = ethers.utils.entropyToMnemonic(md5.array(signedMessage));
      setConfirmedMnemonic(newMnemonic);
      setStep(STEP.CREATE_PASSWORD);
    } catch (error) {
      setStep(step);
    }
  }, [signMessageAsync, step]);

  const confirmPassword = useCallback(password => {
    const isNewAccount = !!newMnemonic;
    saveZkAccountMnemonic(confirmedMnemonic, password, isNewAccount);
    closePasswordModal();
    closeModal();
  }, [newMnemonic, confirmedMnemonic, saveZkAccountMnemonic, closeModal, closePasswordModal]);

  let title = null;
  let component = null;
  let prevStep = null;

  switch(step) {
    default:
    case STEP.START:
      title = 'zkAccount';
      component = <Start setStep={setStep} />;
      prevStep = null;
      break;
    case STEP.CREATE_OPTIONS:
      title = 'Choose how you would like to create your account';
      component = <CreateOptions setStep={setNextStep} />;
      prevStep = STEP.START;
      break;
    case STEP.RESTORE_OPTIONS:
      title = 'How did you create your account?';
      component = <RestoreOptions setStep={setStep} />;
      prevStep = STEP.START;
      break;
    case STEP.CREATE_WITH_WALLET:
      title = 'Create new zkAccount';
      component = <Generate generate={generate} />;
      prevStep = STEP.CREATE_OPTIONS;
      break;
    case STEP.CREATE_WITH_SECRET:
      title = 'Create new zkAccount';
      component = <Create mnemonic={newMnemonic} next={() => setStep(STEP.CONFIRM_SECRET)} />;
      prevStep = STEP.CREATE_OPTIONS;
      break;
    case STEP.RESTORE_WITH_WALLET:
      title = 'Login to your zkAccount';
      component = <Generate generate={generate} />;
      prevStep = STEP.RESTORE_OPTIONS;
      break;
    case STEP.RESTORE_WITH_SECRET:
      title = 'Restore zkAccount';
      component = <Restore restore={restore} />;
      prevStep = STEP.RESTORE_OPTIONS;
      break;
    case STEP.CONFIRM_SECRET:
      title = 'Confirm secret phrase';
      component = <Confirm mnemonic={newMnemonic} confirmMnemonic={confirmMnemonic} />;
      prevStep = STEP.CREATE_WITH_SECRET;
      break;
    case STEP.SING_MESSAGE_TO_CREATE:
      title = 'Sign the message to create your zkAccount';
      component = <Sign isCreation />;
      prevStep = null;
      break;
    case STEP.SING_MESSAGE_TO_RESTORE:
      title = 'Sign the message to login to your zkAccount';
      component = <Sign />;
      prevStep = null;
      break;
    case STEP.CREATE_PASSWORD:
      title = 'Create password';
      component = <Password confirmPassword={confirmPassword} />;
      prevStep = null;
      break;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      onBack={prevStep ? () => setStep(prevStep) : null}
      title={title}
    >
      {component}
    </Modal>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin: 0;
    }
  }
`;

const Description = styled.span`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
  line-height: 20px;
`;

const SecondButton = styled(Button)`
  background: transparent;
  border: 1px solid ${props => props.theme.button.primary.background.default};
  color: ${props => props.theme.button.primary.background.default};
`;
