import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers';

import ButtonDefault from 'components/Button';
import Modal from 'components/Modal';
import Spinner from 'components/Spinner';

import { formatNumber } from 'utils';

import { ReactComponent as BobTokenDefault } from 'assets/bob.svg';
import { ReactComponent as CheckIconDefault } from 'assets/check-circle.svg';
import { ReactComponent as CrossIconDefault } from 'assets/cross-circle.svg';

import config from 'config';
import { NETWORKS } from 'constants';

const CREATE_ACCOUNT = 1;
const SWITCH_NETWORK = 2;
const START = 3;
const IN_PROGRESS = 4;
const COMPLETED = 5;
const FAILED = 6;

const texts = [
  <>Transferring tokens<br/> to your account</>,
  <>Making magic</>,
  <>Just a few seconds more,<br /> almost done</>,
];

const gradient = 'linear-gradient(150deg, rgba(251, 237, 206, 0.8) 10%, rgba(250, 243, 230, 0.5) 50%, rgba(251, 237, 206, 0.8) 100%)';

const CreateAccountScreen = ({ openCreateAccount }) => (
  <>
    <StatusTitle>
      Before you can redeem<br /> a gift card
    </StatusTitle>
    <Description>
      To redeem a gift card you need a zkBob zkAccount! Create an account,{' '}
      or login into an existing account to claim your BOB tokens.
    </Description>
    <Button onClick={openCreateAccount}>Log in or create zkAccount</Button>
  </>
);

const SwitchNetworkScreen = ({ giftCard, redeem }) => (
  <>
    <StatusTitle>
      We need to switch the network
    </StatusTitle>
    <Description>
      Gift card available only on {NETWORKS[config.pools[giftCard.poolAlias].chainId].name}.{' '}
      To redeem it we need to change the network
    </Description>
    <Button onClick={redeem}>Got it</Button>
  </>
);

const StartScreen = ({ giftCard, redeem, isLoadingZkAccount }) => (
  <>
    <Title>You're Lucky!</Title>
    <Description>
      On this gift card you will find
    </Description>
    <BalanceContainer>
      <BobToken />
      <Amount>{formatNumber(giftCard?.balance || BigNumber.from('0'))}</Amount>
    </BalanceContainer>
    <Button onClick={redeem} disabled={isLoadingZkAccount}>
      Claim BOB
    </Button>
  </>
);

const InProgressScreen = () => {
  const [text, setText] = useState(texts[0]);

  useEffect(() => {
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      const index = counter % texts.length;
      setText(texts[index]);
    }, 5000); // 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <StatusTitle>{text}</StatusTitle>
      <Spinner />
    </>
  );
}

const CompletedScreen = () => (
  <>
    <StatusTitle>
      Your BOB tokens were claimed.<br />
      Check your account balance.
    </StatusTitle>
    <CheckIcon />
  </>
);

const FailedScreen = () => (
  <>
    <StatusTitle>
      The tokens have already<br /> been claimed
    </StatusTitle>
    <CrossIcon />
  </>
);

export default ({
  isOpen, onClose, giftCard, redeemGiftCard,
  zkAccount, isLoadingZkAccount,
  setUpAccount, isNewUser, currentPool,
}) => {
  const [step, setStep] = useState(START);

  const redeem = useCallback(async () => {
    setStep(IN_PROGRESS);
    try {
      await redeemGiftCard();
      setStep(COMPLETED);
    } catch (error) {
      setStep(FAILED);
    }
  }, [redeemGiftCard]);

  const checkNetworkAndRedeem = useCallback(() => {
    if (!isNewUser && currentPool !== giftCard?.poolAlias) {
      setStep(SWITCH_NETWORK);
    } else {
      redeem();
    }
  }, [isNewUser, currentPool, giftCard, redeem]);

  useEffect(() => {
    if (isOpen && !zkAccount && !isLoadingZkAccount) {
      setStep(CREATE_ACCOUNT);
    }
  }, [isOpen, zkAccount, isLoadingZkAccount]);

  const openCreateAccount = useCallback(() => {
    setUpAccount();
    setStep(START);
  }, [setUpAccount]);

  const clearStateAndClose = useCallback(() => {
    setStep(START);
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={step !== IN_PROGRESS ? clearStateAndClose : null}
      style={{ background: step === START ? gradient : '#FFF'}}
    >
      {(() => {
        switch(step) {
          case CREATE_ACCOUNT:
            return <CreateAccountScreen openCreateAccount={openCreateAccount} />;
          case SWITCH_NETWORK:
            return <SwitchNetworkScreen giftCard={giftCard} redeem={redeem} />;
          default:
          case START:
            return <StartScreen
              giftCard={giftCard}
              redeem={checkNetworkAndRedeem}
              isLoadingZkAccount={isLoadingZkAccount}
            />;
          case IN_PROGRESS:
            return <InProgressScreen />;
          case COMPLETED:
            return <CompletedScreen />;
          case FAILED:
            return <FailedScreen />;
        }
      })()}
    </Modal>
  );
};

const Title = styled.span`
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  margin-top: -20px;
`;

const Description = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.text.color.primary};
  text-align: center;
`;

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Amount = styled.span`
  font-size: 80px;
  line-height: 98px;
  font-weight: 800;
  background: linear-gradient(115.84deg, #6D5CFF 9.33%, #E86EFF 60.78%, #FFD66E 97.92%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const BobToken = styled(BobTokenDefault)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const StatusTitle = styled.span`
  font-size: 20px;
  line-height: 28px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 24px;
  margin-top: -24px;
  text-align: center;
`;

const CheckIcon = styled(CheckIconDefault)`
  margin-bottom: 16px;
`;

const CrossIcon = styled(CrossIconDefault)`
  margin-bottom: 16px;
`;

const Button = styled(ButtonDefault)`
  width: 100%;
  margin-top: 20px;
`;
