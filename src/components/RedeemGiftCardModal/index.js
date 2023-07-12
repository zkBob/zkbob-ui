import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ButtonDefault from 'components/Button';
import Modal from 'components/Modal';
import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';

import { formatNumber } from 'utils';

import { ReactComponent as BobTokenDefault } from 'assets/bob.svg';
import { ReactComponent as CheckCircleIconDefault } from 'assets/check-circle.svg';
import { ReactComponent as CrossIconDefault } from 'assets/cross-circle.svg';
import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIconDefault } from 'assets/check.svg';

import config from 'config';
import { NETWORKS } from 'constants';

const LOADING = 0;
const CREATE_ACCOUNT = 1;
const SWITCH_NETWORK = 2;
const START = 3;
const IN_PROGRESS = 4;
const COMPLETED = 5;
const FAILED = 6;

const gradient = 'linear-gradient(150deg, rgba(251, 237, 206, 0.8) 10%, rgba(250, 243, 230, 0.5) 50%, rgba(251, 237, 206, 0.8) 100%)';

const SupportId = ({ supportId }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return (
    <CopyToClipboard text={supportId} onCopy={onCopy}>
      <SupportIdContainer>
        <Description style={{ marginRight: 8 }}>
          Support ID: {supportId}
        </Description>
        <Tooltip content="Copied" placement="right" visible={isCopied}>
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Tooltip>
      </SupportIdContainer>
    </CopyToClipboard>
  );
};

const LoadingScreen = () => (
  <>
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
    <StatusTitle>Preparing your gift card</StatusTitle>
  </>
);

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
      <Amount>{formatNumber(giftCard?.parsedBalance || BigNumber.from('0'))}</Amount>
    </BalanceContainer>
    {isLoadingZkAccount ? (
      <Button loading contrast disabled>Loading...</Button>
    ) : (
      <Button onClick={redeem}>Claim BOB</Button>
    )}
  </>
);

const InProgressScreen = ({ supportId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress(progress => progress + 1);
    }, 600);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <SpinnerContainer>
        <Spinner />
        <ProgressText>{Math.min(progress, 99)}%</ProgressText>
      </SpinnerContainer>
      <StatusTitle style={{ marginBottom: 16, marginTop: 0 }}>
        Transferring tokens to your zkAccount
      </StatusTitle>
      {progress > 99 && (
        <>
          <Description style={{ marginBottom: 16 }}>
            The process takes longer than usual. If the process does not complete within a few seconds,{' '}
            contact our <Link size={16} href="https://zkbob.canny.io/report-issue/">support team</Link>
          </Description>
          <SupportId supportId={supportId} />
        </>
      )}
    </>
  );
}

const CompletedScreen = ({ close }) => (
  <>
    <CheckCircleIcon />
    <StatusTitle style={{ marginBottom: 16, marginTop: 0 }}>
     Your BOB is on the way
    </StatusTitle>
    <Description>
      Your tokens will be delivered during the next 1-2 minutes.{' '}
      Check the transaction status on the History tab
    </Description>
    <Button onClick={close}>Got it</Button>
  </>
);

const FailedScreen = ({ error, supportId }) => {
  const isClaimed = error?.message?.includes('Insufficient funds');
  return (
    <>
      <CrossIcon />
      <StatusTitle style={{ marginBottom: 16, marginTop: 0 }}>
        {isClaimed ? 'This gift card has already been used' : 'Something went wrong'}
      </StatusTitle>
      {!isClaimed &&
        <Description style={{ marginBottom: 16 }}>
          Please contact our support team to resolve this problem. Use Support ID in your request.
        </Description>
      }
      <SupportId supportId={supportId} />
      {!isClaimed &&
        <Button onClick={() => window.open('https://zkbob.canny.io/report-issue/', '_blank')}>
          Contact support
        </Button>
      }
    </>
  );
};

export default ({
  isOpen, onClose, giftCard, redeemGiftCard,
  zkAccount, isLoadingZkAccount, supportId,
  setUpAccount, isNewUser, currentPool,
}) => {
  const [step, setStep] = useState(START);
  const [error, setError] = useState(null);

  const redeem = useCallback(async () => {
    setStep(IN_PROGRESS);
    try {
      await redeemGiftCard();
      setStep(COMPLETED);
    } catch (error) {
      setError(error);
      setStep(FAILED);
    }
  }, [redeemGiftCard]);

  const checkNetworkAndRedeem = useCallback(() => {
    if (!isNewUser && currentPool.alias !== giftCard?.poolAlias) {
      setStep(SWITCH_NETWORK);
    } else {
      redeem();
    }
  }, [isNewUser, currentPool, giftCard, redeem]);

  useEffect(() => {
    if (isOpen && !zkAccount && !isLoadingZkAccount) {
      setStep(CREATE_ACCOUNT);
    } else if (isOpen && !giftCard && ![COMPLETED, FAILED].includes(step)) {
      setStep(LOADING);
    } else if (isOpen && giftCard && step === LOADING) {
      setStep(START);
    }
  }, [isOpen, zkAccount, isLoadingZkAccount, giftCard, step]);

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
      onClose={step === FAILED ? clearStateAndClose : null}
      style={{ background: step === START ? gradient : '#FFF'}}
    >
      {(() => {
        switch(step) {
          case LOADING:
            return <LoadingScreen />;
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
            return <InProgressScreen supportId={supportId} />;
          case COMPLETED:
            return <CompletedScreen close={clearStateAndClose} />;
          case FAILED:
            return <FailedScreen error={error} supportId={supportId} />;
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

const CheckCircleIcon = styled(CheckCircleIconDefault)`
  margin-bottom: 20px;
  margin-top: -24px;
`;

const CrossIcon = styled(CrossIconDefault)`
  margin-bottom: 20px;
  margin-top: -24px;
`;

const Button = styled(ButtonDefault)`
  width: 100%;
  margin-top: 20px;
`;

const SpinnerContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  margin-top: -24px;
`;

const ProgressText = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CopyIcon = styled(CopyIconDefault)`
  width: 16px;
  height: 16px;
`;

const CheckIcon = styled(CheckIconDefault)`
  width: 16px;
  height: 16px;
`;

const SupportIdContainer = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
