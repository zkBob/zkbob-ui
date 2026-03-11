import React, { useContext } from 'react';
import { HashRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { useIdleTimer } from 'react-idle-timer';

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

import Header from 'components/Header';
import ChangePasswordModal from 'components/ChangePasswordModal';
import DisablePasswordModal from 'components/DisablePasswordModal';
import ToastContainer from 'components/ToastContainer';
import Footer from 'components/Footer';
import DemoBanner from 'components/DemoBanner';
import RestrictionModal from 'components/RestrictionModal';
import Layout from 'components/Layout';
import PaymentLinkModal from 'components/PaymentLinkModal';

import Welcome from 'pages/Welcome';
import Deposit from 'pages/Deposit';
import Transfer from 'pages/Transfer';
import Withdraw from 'pages/Withdraw';
import History from 'pages/History';
import Payment from 'pages/Payment';

import ContextsProvider, { ZkAccountContext } from 'contexts';

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
  tunnel: process.env.REACT_APP_HOSTING === 'netlify' ? '/telemetry' : undefined,
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

const MainApp = () => {
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
      <Layout header={<Header empty />}>
        <RestrictionModal />
      </Layout>
    );
  }
  return (
    <>
      {isDemo && <DemoBanner />}
      <Layout header={<Header />} footer={<Footer />}>
        <Tabs />
        <Routes showWelcome={showWelcome} params={location.search} />
      </Layout>
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
      <PaymentLinkModal />
    </>
  );
}

export default () => (
  <HashRouter>
    <Switch>
      <SentryRoute exact strict path="/payment/:address">
        <Payment />
      </SentryRoute>
      <SentryRoute>
        <ContextsProvider>
          <MainApp />
        </ContextsProvider>
      </SentryRoute>
    </Switch>
  </HashRouter>
);
