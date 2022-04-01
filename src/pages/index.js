import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'containers/Header';
import TransactionModal from 'containers/TransactionModal';

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
    <Layout>
      <Header />
      <PageContainer>
        <Routes />
      </PageContainer>
      <TransactionModal />
    </Layout>
  </BrowserRouter>
);

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;
