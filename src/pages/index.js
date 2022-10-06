import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import Header from 'containers/Header';
import Tabs from 'containers/Tabs';
import TransactionModal from 'containers/TransactionModal';
import WalletModal from 'containers/WalletModal';
import AccountModal from 'containers/AccountModal';
import AccountSetUpModal from 'containers/AccountSetUpModal';
import PasswordModal from 'containers/PasswordModal';
import TermsModal from 'containers/TermsModal';

import ToastContainer from 'components/ToastContainer';
import Footer from 'components/Footer';

import Welcome from 'pages/Welcome';
import Deposit from 'pages/Deposit';
import Transfer from 'pages/Transfer';
import Withdraw from 'pages/Withdraw';
import History from 'pages/History';

import aliceImage from 'assets/alice.webp';
import bobImage from 'assets/bob.webp';
import robot1Image from 'assets/robot-1.webp';
import robot2Image from 'assets/robot-2.webp';
import robot3Image from 'assets/robot-3.webp';

import { ZkAccountContext } from 'contexts';

import { useRestriction } from 'hooks';

const Routes = ({ showWelcome }) => (
  <Switch>
    {showWelcome && (
      <Route exact strict path="/">
        <Welcome />
      </Route>
    )}
    <Route exact strict path="/deposit">
      <Deposit />
    </Route>
    <Route exact strict path="/transfer">
      <Transfer />
    </Route>
    <Route exact strict path="/withdraw">
      <Withdraw />
    </Route>
    <Route exact strict path="/history">
      <History />
    </Route>
    <Redirect to="/deposit" />
  </Switch>
);

const Content = () => {
  const { zkAccount, isLoadingZkAccount } = useContext(ZkAccountContext);
  const location = useLocation();
  const showWelcome = !zkAccount && !isLoadingZkAccount && !window.localStorage.getItem('seed');
  const isRestricted = useRestriction();
  if (isRestricted) {
    return (
      <Layout>
        <Header empty />
        <ErrorText>451: We're sorry, but zkBob is unavailable in your country.</ErrorText>
      </Layout>
    );
  }
  if (isMobile) {
    return (
      <MobileLayout>
        <Header empty />
        <ErrorText>We're sorry, but the mobile version of zkBob is not yet ready.</ErrorText>
      </MobileLayout>
    );
  }
  return (
    <>
      <BackgroundImages $show={showWelcome && location.pathname === '/'}>
        <AliceImage src={aliceImage} />
        <BobImage src={bobImage} />
        <Robot1Image src={robot1Image} />
        <Robot2Image src={robot2Image} />
        <Robot3Image src={robot3Image} />
      </BackgroundImages>
      <Layout>
        <Gradient />
        <Header />
        <PageContainer>
          <Tabs />
          <Routes showWelcome={showWelcome} />
        </PageContainer>
        <Footer />
        <TransactionModal />
        <WalletModal />
        <AccountModal />
        <AccountSetUpModal />
        <PasswordModal />
        <TermsModal />
        <ToastContainer />
      </Layout>
    </>
  );
}

export default () => (
  <BrowserRouter>
    <Content />
  </BrowserRouter>
);

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 14px 40px 40px;
  background: linear-gradient(180deg, #FBEED0 0%, #FAFAF9 78.71%);
`;

const MobileLayout = styled(Layout)`
  padding-top: 30px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 80px 0;
  position: relative;
`;

const Gradient = styled.div`
  position: absolute;
  width: 544px;
  height: 585.08px;
  left: calc(50% - 270px);
  top: 100px;
  background: linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  filter: blur(250px);
  transform: rotate(27.74deg);
`;

const BackgroundImages = styled.div`
  position: absolute;
  width: 100vw;
  height: 800px;
  mix-blend-mode: darken;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
  transition: visibility 0.05s linear 0.05s, opacity 0.05s linear 0.05s;
`;

const AliceImage = styled.img`
  width: 798px;
  height: 649px;
  position: absolute;
  left: 0;
  top: 22%;
`;

const BobImage = styled.img`
  width: 459px;
  height: 439px;
  position: absolute;
  right: 0;
  top: 21%;
`;

const Robot1Image = styled.img`
  width: 207px;
  height: 168px;
  position: absolute;
  top: 60px;
  right: 25%;
  opacity: 0.4;
  filter: blur(4px);
`;

const Robot2Image = styled.img`
  width: 316px;
  height: 251px;
  position: absolute;
  top: 117px;
  left: 15%;
  opacity: 0.6;
  filter: blur(3px);
`;

const Robot3Image = styled.img`
  width: 320px;
  height: 246px;
  position: absolute;
  bottom: 77px;
  right: 23%;
  opacity: 0.2;
  filter: blur(2px);
`;

const ErrorText = styled.span`
  font-size: 16px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;
