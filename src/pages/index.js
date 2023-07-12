import React, { useContext } from 'react';
import { Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { createBrowserHistory } from 'history';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { useIdleTimer } from 'react-idle-timer';

import Header from 'containers/Header';
import Tabs from 'containers/Tabs';
import TransactionModal from 'containers/TransactionModal';
import WalletModal from 'containers/WalletModal';
import AccountSetUpModal from 'containers/AccountSetUpModal';
import PasswordModal from 'containers/PasswordModal';
import SwapModal from 'containers/SwapModal';
import ConfirmLogoutModal from 'containers/ConfirmLogoutModal';
import SeedPhraseModal from 'containers/SeedPhraseModal';
import IncreasedLimitsModal from 'containers/IncreasedLimitsModal';
import RedeemGiftCardModal from 'containers/RedeemGiftCardModal';

import ChangePasswordModal from 'components/ChangePasswordModal';
import DisablePasswordModal from 'components/DisablePasswordModal';
import ToastContainer from 'components/ToastContainer';
import Footer from 'components/Footer';
import DemoBanner from 'components/DemoBanner';
import RestrictionModal from 'components/RestrictionModal';

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

const SentryRoute = Sentry.withSentryRouting(Route);

const history = createBrowserHistory();

const PUBLIC_KEY = process.env.REACT_APP_SENTRY_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_SENTRY_PRIVATE_KEY;
const PROJECT_ID = process.env.REACT_APP_SENTRY_PROJECT_ID;

let sentryDsn;
if (PUBLIC_KEY && PRIVATE_KEY && PROJECT_ID) {
  sentryDsn = `https://${PUBLIC_KEY}@${PRIVATE_KEY}.ingest.sentry.io/${PROJECT_ID}`;
}

Sentry.init({
  dsn: sentryDsn,
  tunnel: '/telemetry',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
    new Sentry.Integrations.Breadcrumbs({
      dom: { serializeAttribute: 'aria-label' },
    }),
  ],
  tracesSampleRate: 1.0,
  beforeBreadcrumb: breadcrumb => {
    if (breadcrumb.category === 'navigation' && breadcrumb.data) {
      try {
        ['from', 'to'].forEach(param => {
          if (breadcrumb.data[param].includes('?gift-code')) {
            breadcrumb.data[param] = breadcrumb.data[param].split('?')[0] + '?gift-code=XXX';
          }
        });
      } catch (error) {}
    }
    return breadcrumb;
  }
});

const Routes = ({ showWelcome, params }) => (
  <Switch>
    {showWelcome && (
      <SentryRoute exact strict path="/">
        <Welcome />
      </SentryRoute>
    )}
    <SentryRoute exact strict path="/deposit">
      <Deposit />
    </SentryRoute>
    <SentryRoute exact strict path="/transfer">
      <Transfer />
    </SentryRoute>
    <SentryRoute exact strict path="/withdraw">
      <Withdraw />
    </SentryRoute>
    <SentryRoute exact strict path="/history">
      <History />
    </SentryRoute>
    <Redirect to={'/transfer' + params} />
  </Switch>
);

const Content = () => {
  const { zkAccount, isLoadingZkAccount, isDemo, lockAccount } = useContext(ZkAccountContext);
  const location = useLocation();
  const showWelcome = (!zkAccount && !isLoadingZkAccount && !window.localStorage.getItem('seed')) || isDemo;
  const isRestricted = useRestriction();
  useIdleTimer({
    timeout: Number(process.env.REACT_APP_LOCK_TIMEOUT) || (1000 * 60 * 15),
    onIdle: () => lockAccount(),
  });

  if (isRestricted) {
    return (
      <>
        <Gradient />
        <Layout>
          <Header empty />
          <PageContainer>
            <RestrictionModal />
          </PageContainer>
        </Layout>
      </>
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
      <Gradient />
      {isDemo && <DemoBanner />}
      <Layout>
        <Header />
        <PageContainer>
          <Tabs />
          <Routes showWelcome={showWelcome} params={location.search} />
        </PageContainer>
        <Footer />
        <TransactionModal />
        <WalletModal />
        <AccountSetUpModal />
        <RedeemGiftCardModal />
        <PasswordModal />
        <ChangePasswordModal />
        <ToastContainer />
        <SwapModal />
        <ConfirmLogoutModal />
        <SeedPhraseModal />
        <IncreasedLimitsModal />
        <DisablePasswordModal />
      </Layout>
    </>
  );
}

export default () => (
  <Router history={history}>
    <Content />
  </Router>
);

const Layout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 14px 40px 40px;
  background: linear-gradient(180deg, #FBEED0 0%, #FAFAF9 78.71%);
  @media only screen and (max-width: 560px) {
    padding: 21px 7px 28px;
  }
  @media only screen and (max-width: 800px) {
    padding-bottom: 80px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 80px 0;
  position: relative;
  @media only screen and (max-width: 560px) {
    margin: 30px 0;
  }
`;

const Gradient = styled.div`
  position: absolute;
  width: 544px;
  height: 585.08px;
  left: calc(50% - 270px);
  top: 100px;
  background: linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  background: -moz-linear-gradient(231.28deg, rgba(247, 194, 59, 0.2) 19.66%, rgba(232, 110, 255, 0.2) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  filter: blur(250px);
  transform: rotate(27.74deg) translate3d(0,0,0);
`;

const BackgroundImages = styled.div`
  position: absolute;
  width: 100vw;
  height: 800px;
  mix-blend-mode: darken;
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  opacity: ${props => props.$show ? 1 : 0};
  transition: visibility 0.05s linear 0.05s, opacity 0.05s linear 0.05s;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
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
