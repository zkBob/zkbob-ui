import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import md5 from 'js-md5';
import { useTranslation, Trans } from 'react-i18next';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';

import { WalletContext } from 'contexts';

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
  CREATE_PASSWORD_PROMPT: 11,
  CREATE_PASSWORD: 12,
};

const Start = ({ setStep }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Description>
        {t('accountSetupModal.start.description')}
      </Description>
      <Button onClick={() => setStep(STEP.CREATE_WITH_WALLET)} data-ga-id="signup-start">
        {t('accountSetupModal.start.button1')}
      </Button>
      <Button onClick={() => (setStep(STEP.CREATE_WITH_SECRET))} data-ga-id="signup-secret-phrase">
        {t('accountSetupModal.createOptions.button2')}
      </Button>
      <SecondButton onClick={() => setStep(STEP.RESTORE_OPTIONS)} data-ga-id="login-start">
        {t('accountSetupModal.start.button3')}
      </SecondButton>
    </Container>
  );
};

const RestoreOptions = ({ setStep }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Button onClick={() => setStep(STEP.RESTORE_WITH_WALLET)} data-ga-id="login-web3-wallet">
        {t('accountSetupModal.restoreOptions.button1')}
      </Button>
      <SecondButton onClick={() => setStep(STEP.RESTORE_WITH_SECRET)} data-ga-id="login-secret-phrase">
        {t('accountSetupModal.restoreOptions.button2')}
      </SecondButton>
    </Container>
  );
};

const PasswordPrompt = ({ setStep, close }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Description>
        {t('accountSetupModal.createPasswordPrompt.description')}
      </Description>
      <Button onClick={() => setStep(STEP.CREATE_PASSWORD)} data-ga-id="password-set">
        {t('buttonText.setPassword')}
      </Button>
      <SecondButton onClick={close} data-ga-id="password-skip">
        {t('buttonText.skip')}
      </SecondButton>
    </Container>
  );
};

export default ({ isOpen, onClose, saveZkAccountMnemonic, closePasswordModal }) => {
  const { t } = useTranslation();
  const { tronWallet, evmWallet, noWalletInstalled } = useContext(WalletContext);
  const [step, setStep] = useState(STEP.START);
  const [newMnemonic, setNewMnemonic] = useState();
  const [confirmedMnemonic, setConfirmedMnemonic] = useState();
  const [isTronWalletSelected, setIsTronWalletSelected] = useState(false);

  const closeModal = useCallback(() => {
    setStep(STEP.START);
    setNewMnemonic(null);
    onClose();
  }, [onClose]);

  const confirmMnemonic = useCallback(() => {
    setConfirmedMnemonic(newMnemonic);
    setStep(STEP.CREATE_PASSWORD_PROMPT);
  }, [newMnemonic]);

  const restore = useCallback(mnemonic => {
    setConfirmedMnemonic(mnemonic);
    setStep(STEP.CREATE_PASSWORD_PROMPT);
  }, []);

  const generate = useCallback(async () => {
    const { signMessage } = isTronWalletSelected ? tronWallet : evmWallet;
    const message = 'Access zkBob account.\n\nOnly sign this message for a trusted client!';
    let signedMessage = await signMessage(message);
    if (!window.location.host.includes(process.env.REACT_APP_LEGACY_SIGNATURE_DOMAIN)) {
      // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
      const MIN_VALID_V_VALUE = 27;
      let sigV = parseInt(signedMessage.slice(-2), 16);
      if (sigV < MIN_VALID_V_VALUE) {
        sigV += MIN_VALID_V_VALUE;
      }
      signedMessage = signedMessage.slice(0, -2) + sigV.toString(16);
    }
    const newMnemonic = ethers.utils.entropyToMnemonic(md5.array(signedMessage));
    setConfirmedMnemonic(newMnemonic);
    setStep(STEP.CREATE_PASSWORD_PROMPT);
  }, [isTronWalletSelected, tronWallet, evmWallet]);

  const confirmPassword = useCallback(password => {
    const isNewAccount = !!newMnemonic;
    saveZkAccountMnemonic(confirmedMnemonic, password, isNewAccount);
    closePasswordModal();
    closeModal();
  }, [newMnemonic, confirmedMnemonic, saveZkAccountMnemonic, closeModal, closePasswordModal]);

  const tryToClose = useCallback(() => {
    if ([STEP.CREATE_PASSWORD, STEP.CREATE_PASSWORD_PROMPT].includes(step)) {
      confirmPassword(null);
      return;
    }
    closeModal();
  }, [step, closeModal, confirmPassword]);

  let title = null;
  let component = null;
  let prevStep = null;

  switch(step) {
    default:
    case STEP.START:
      title = t('accountSetupModal.start.title');
      component = <Start setStep={setStep} />;
      prevStep = null;
      break;
    case STEP.RESTORE_OPTIONS:
      title = t('accountSetupModal.restoreOptions.title');
      component = <RestoreOptions setStep={setStep} />;
      prevStep = STEP.START;
      break;
    case STEP.CREATE_WITH_WALLET:
      title = noWalletInstalled
        ? t('connectWalletModal.noWalletTitle', { wallet: 'TronLink' })
        : t('accountSetupModal.createWithWallet.title');
      component = (
        <Generate
          isCreation
          noWalletInstalled={noWalletInstalled}
          next={connector => {
            setIsTronWalletSelected(connector.isTron);
            setStep(STEP.SING_MESSAGE_TO_CREATE);
          }}
        />
      );
      prevStep = STEP.START;
      break;
    case STEP.CREATE_WITH_SECRET:
      title = t('accountSetupModal.createWithSecret.title');
      let newMnemonic = null;
      newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      setNewMnemonic(newMnemonic);
      setConfirmedMnemonic(newMnemonic);
      setStep(STEP.CREATE_PASSWORD_PROMPT);
      prevStep = STEP.START;
      break;
    case STEP.RESTORE_WITH_WALLET:
      title = t('accountSetupModal.restoreWithWallet.title');
      component = (
        <Generate
          next={connector => {
            setIsTronWalletSelected(connector.isTron);
            setStep(STEP.SING_MESSAGE_TO_RESTORE);
          }}
        />
      );
      prevStep = STEP.RESTORE_OPTIONS;
      break;
    case STEP.RESTORE_WITH_SECRET:
      title = t('accountSetupModal.restoreWithSecret.title');
      component = <Restore restore={restore} />;
      prevStep = STEP.RESTORE_OPTIONS;
      break;
    case STEP.CONFIRM_SECRET:
      title = t('accountSetupModal.confirmSecret.title');
      component = <Confirm mnemonic={newMnemonic} confirmMnemonic={confirmMnemonic} />;
      prevStep = STEP.CREATE_WITH_SECRET;
      break;
    case STEP.SING_MESSAGE_TO_CREATE:
      title = t('accountSetupModal.signMessageToCreate.title');
      component = <Sign isCreation sign={generate} />;
      prevStep = STEP.CREATE_WITH_WALLET;
      break;
    case STEP.SING_MESSAGE_TO_RESTORE:
      title = t('accountSetupModal.signMessageToRestore.title');
      component = <Sign sign={generate} />;
      prevStep = STEP.RESTORE_WITH_WALLET;
      break;
    case STEP.CREATE_PASSWORD_PROMPT:
      title = t('accountSetupModal.createPasswordPrompt.title');
      component = <PasswordPrompt setStep={setStep} close={tryToClose} />;
      prevStep = null;
      break;
    case STEP.CREATE_PASSWORD:
      title = t('accountSetupModal.createPassword.title');
      component = <Password confirmPassword={confirmPassword} />;
      prevStep = null;
      break;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={tryToClose}
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
