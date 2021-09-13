import React from 'react';
import styled from 'styled-components';

import Header from 'containers/Header';

import Deposit from 'pages/Deposit';

export default () => (
  <Layout>
    <Header />
    <PageContainer>
      <Deposit />
    </PageContainer>
  </Layout>
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
