import React from 'react';
import styled from 'styled-components';

import Header from 'containers/Header';

export default () => (
  <Layout>
    <Header />
  </Layout>
);

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;
