import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'containers/Header';
import Tabs from 'containers/Tabs';
import TransactionModal from 'containers/TransactionModal';
import WalletModal from 'containers/WalletModal';
import AccountModal from 'containers/AccountModal';
import AccountSetUpModal from 'containers/AccountSetUpModal';

import ToastContainer from 'components/ToastContainer';

import Deposit from 'pages/Deposit';
import Transfer from 'pages/Transfer';
import Withdraw from 'pages/Withdraw';
import History from 'pages/History';

const Routes = () => (
  <Switch>
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

export default () => (
  <BrowserRouter>
    <Gradient />
    <Layout>
      <Header />
      <PageContainer>
        <Tabs />
        <Routes />
      </PageContainer>
      <TransactionModal />
      <WalletModal />
      <AccountModal />
      <AccountSetUpModal />
      <ToastContainer />
    </Layout>
  </BrowserRouter>
);

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

const Gradient = styled.div`
  position: absolute;
  width: 544px;
  height: 585.08px;
  left: calc(50% - 270px);
  top: 100px;
  background: linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  filter: blur(500px);
  transform: rotate(27.74deg);
`;
